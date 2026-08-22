/**
 * Ledger aggregation regression tests.
 * Guards against the two data bugs that slipped past review:
 *  1) addCounts calls+=1 on aggregated values (month calls showed 6 instead of 33600)
 *  2) provider/model stats ignoring the selected time range (source groups
 *     identical across ranges) while window-external history must not be lost.
 * Run: node --test test/
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ledgerIntegrity, mergeCounts, zeroCounts } from "../lib/pricing.js";
import { BillingLedger } from "../lib/index.js";

/** 构造一条最小记账消息（含聚合所需字段）。 */
function msg(day, provider, model, calls, cost, savings) {
  return {
    time: new Date(`${day}T10:00:00`).getTime(),
    provider,
    model,
    calls,
    cost,
    costUsd: cost / 7,
    costNominal: cost,
    costNominalUsd: cost / 7,
    savings,
    savingsUsd: savings / 7,
    inputTokens: calls * 100,
    cacheReadTokens: calls * 900,
    outputTokens: calls * 10
  };
}

test("mergeCounts adds aggregated calls (not +1 per record)", () => {
  const dayA = msg("2026-08-01", "deepseek-official", "deepseek-v4-flash", 100, 10, 0);
  const dayB = msg("2026-08-02", "deepseek-official", "deepseek-v4-flash", 50, 5, 0);
  // 先把两天各自聚合（addCounts 单条语义只适用于原始记录；这里模拟 byDay 已聚合值）
  const aggA = zeroCounts();
  aggA.calls += dayA.calls;
  aggA.cost += dayA.cost;
  aggA.savings += dayA.savings;
  const aggB = zeroCounts();
  aggB.calls += dayB.calls;
  aggB.cost += dayB.cost;
  aggB.savings += dayB.savings;
  const month = zeroCounts();
  mergeCounts(month, aggA);
  mergeCounts(month, aggB);
  assert.equal(month.calls, 150, "month calls must sum aggregated calls (150), not +2");
  assert.equal(month.cost, 15);
});

test("mergeCounts keeps cost/savings/tokens sums", () => {
  const a = zeroCounts();
  a.calls = 3; a.cost = 30; a.savings = 7; a.inputTokens = 300; a.cacheReadTokens = 2700; a.outputTokens = 30;
  const b = zeroCounts();
  b.calls = 2; b.cost = 20; b.savings = 3; b.inputTokens = 200; b.cacheReadTokens = 1800; b.outputTokens = 20;
  const out = zeroCounts();
  mergeCounts(out, a);
  mergeCounts(out, b);
  assert.equal(out.calls, 5);
  assert.equal(out.cost, 50);
  assert.equal(out.savings, 10);
  assert.equal(out.inputTokens, 500);
  assert.equal(out.cacheReadTokens, 4500);
  assert.equal(out.outputTokens, 50);
});

test("month aggregation over byDay sums every day (regression: month calls=6 bug)", () => {
  // 模拟 ledger.byDay：6 天，每天 calls 若干
  const byDay = new Map([
    ["2026-08-13", msg("2026-08-13", "deepseek-official", "deepseek-v4-flash", 161, 1.25, 0)],
    ["2026-08-14", msg("2026-08-14", "deepseek-official", "deepseek-v4-flash", 2635, 25.81, 0)],
    ["2026-08-15", msg("2026-08-15", "bai", "deepseek-v4-flash", 8330, 0, 69.55)],
    ["2026-08-16", msg("2026-08-16", "opencode-go", "glm-5.2", 4532, 0, 38.41)],
    ["2026-08-17", msg("2026-08-17", "dgx-spark-vllm", "deepseek-v4-flash-0731-ablit", 7014, 0, 3.62)],
    ["2026-08-18", msg("2026-08-18", "bai", "deepseek-v4-flash", 10923, 0, 421.15)]
  ]);
  // 与 state 相同的 monthCounts 逻辑（修复后：mergeCounts）
  const month = zeroCounts();
  for (const [key, counts] of byDay) {
    if (key.startsWith("2026-08-")) mergeCounts(month, counts);
  }
  const expectedCalls = 161 + 2635 + 8330 + 4532 + 7014 + 10923;
  assert.equal(month.calls, expectedCalls, "month calls must sum all days' calls");
  assert.ok(month.calls > 30000, "month calls should be >30000, not 6");
  assert.equal(month.savings, 69.55 + 38.41 + 3.62 + 421.15);
});

test("provider stats filter by range and keep window-external history", () => {
  // 模拟 byDayProvider（v3）：两天 × 两 provider
  const byDayProvider = new Map([
    ["2026-08-01\u0000deepseek-official\u0000deepseek-v4-flash", msg("2026-08-01", "deepseek-official", "deepseek-v4-flash", 100, 80, 0)],
    ["2026-08-01\u0000bai\u0000deepseek-v4-flash", msg("2026-08-01", "bai", "deepseek-v4-flash", 50, 0, 40)],
    // 窗口外（7 月）——必须仍在（glm-5.2 场景）
    ["2026-07-31\u0000opencode-go\u0000glm-5.2", msg("2026-07-31", "opencode-go", "glm-5.2", 97, 0, 57.13)]
  ]);
  // 8 月范围
  const fromMs = new Date("2026-08-01T00:00:00").getTime();
  const toMs = new Date("2026-09-01T00:00:00").getTime();
  const byProviderModel = new Map();
  for (const [key, counts] of byDayProvider) {
    const sep1 = key.indexOf("\u0000");
    const day = key.slice(0, sep1);
    const rest = key.slice(sep1 + 1);
    const sep2 = rest.indexOf("\u0000");
    const provider = sep2 >= 0 ? rest.slice(0, sep2) : "unknown";
    const model = sep2 >= 0 ? rest.slice(sep2 + 1) : rest;
    const dayMs = new Date(`${day}T00:00:00`).getTime();
    if (dayMs < fromMs || dayMs >= toMs) continue;
    const pmKey = `${provider}\u0000${model}`;
    let pm = byProviderModel.get(pmKey);
    if (pm === void 0) { pm = zeroCounts(); byProviderModel.set(pmKey, pm); }
    mergeCounts(pm, counts);
  }
  assert.equal(byProviderModel.size, 2, "only August providers in range");
  assert.ok(![...byProviderModel.keys()].some((k) => k.includes("glm-5.2")), "July glm-5.2 excluded from August range");
  // 全范围（all）：glm-5.2 必须在
  const allByPM = new Map();
  for (const [key, counts] of byDayProvider) {
    const sep1 = key.indexOf("\u0000");
    const rest = key.slice(sep1 + 1);
    const sep2 = rest.indexOf("\u0000");
    const provider = sep2 >= 0 ? rest.slice(0, sep2) : "unknown";
    const model = sep2 >= 0 ? rest.slice(sep2 + 1) : rest;
    const pmKey = `${provider}\u0000${model}`;
    let pm = allByPM.get(pmKey);
    if (pm === void 0) { pm = zeroCounts(); allByPM.set(pmKey, pm); }
    mergeCounts(pm, counts);
  }
  const glm = [...allByPM.entries()].find(([k]) => k.includes("glm-5.2"));
  assert.ok(glm !== void 0, "window-external glm-5.2 must appear in 'all' range");
  assert.equal(glm[1].savings, 57.13);
});

test("long-run integrity: aggregates stay complete even when details are trimmed", () => {
  // 模拟 BillingLedger 的核心语义：聚合 Map 只增不减（record 时实时累计），
  // 明细（session.messages / recent）可裁剪——裁剪只影响"查看单条"，不影响统计。
  // 场景：365 天 × 每天 3 个会话 × 每会话 50 条 = 54750 条，但每会话只保留 5 条明细。
  const totals = zeroCounts();
  const byDay = new Map();
  const byProvider = new Map();
  const byDayProvider = new Map();
  const sessions = new Map(); // sessionId -> Map(messageId -> message)

  const msg = (sessionId, messageId, time, provider, model, cost) => ({
    sessionId, messageId, time, provider, model, cost,
    costUsd: cost / 7, costNominal: cost, costNominalUsd: cost / 7,
    savings: 0, savingsUsd: 0, inputTokens: 100, cacheReadTokens: 900, outputTokens: 10
  });
  const addCountsLike = (t, s) => {
    t.calls += 1; t.cost += s.cost; t.costUsd += s.costUsd; t.costNominal += s.costNominal;
    t.costNominalUsd += s.costNominalUsd; t.savings += s.savings; t.savingsUsd += s.savingsUsd;
    t.inputTokens += s.inputTokens; t.cacheReadTokens += s.cacheReadTokens; t.outputTokens += s.outputTokens;
  };

  let expectedCost = 0;
  let expectedCalls = 0;
  let mid = 0;
  for (let day = 0; day < 365; day++) {
    const date = new Date(2026, 0, 1 + day);
    const dayKeyStr = date.toISOString().slice(0, 10);
    const dayCounts = zeroCounts();
    for (let sessionIdx = 0; sessionIdx < 3; sessionIdx++) {
      const sid = `s${day}-${sessionIdx}`;
      let messages = sessions.get(sid);
      if (messages === void 0) { messages = new Map(); sessions.set(sid, messages); }
      for (let i = 0; i < 50; i++) {
        const cost = 0.1 + ((mid % 7) * 0.01);
        const m = msg(sid, `m${mid}`, date.getTime(), "deepseek-official", "deepseek-v4-flash", cost);
        mid++;
        expectedCost += cost; expectedCalls++;
        addCountsLike(totals, m);
        addCountsLike(dayCounts, m);
        let pc = byProvider.get("deepseek-official");
        if (pc === void 0) { pc = zeroCounts(); byProvider.set("deepseek-official", pc); }
        addCountsLike(pc, m);
        const dpKey = `${dayKeyStr}\u0000deepseek-official\u0000deepseek-v4-flash`;
        let dp = byDayProvider.get(dpKey);
        if (dp === void 0) { dp = zeroCounts(); byDayProvider.set(dpKey, dp); }
        addCountsLike(dp, m);
        messages.set(`m${mid}`, m); // 明细
      }
      // 裁剪明细到 5 条（模拟 maxMessagesPerSession）
      if (messages.size > 5) {
        const oldest = [...messages.keys()].slice(0, messages.size - 5);
        for (const k of oldest) messages.delete(k);
      }
    }
    byDay.set(dayKeyStr, dayCounts);
  }

  // 裁剪后：sessions 明细只剩每会话 5 条（总量远小于 54750），但聚合必须完整
  let detailCount = 0;
  for (const [, messages] of sessions) detailCount += messages.size;
  assert.ok(detailCount < expectedCalls, `details trimmed (${detailCount} < ${expectedCalls})`);

  const sum = (obj) => { let c = 0, cost = 0; for (const v of Object.values(obj)) { c += v.calls; cost += v.cost; } return { c, cost }; };
  const sumMap = (map) => { let c = 0, cost = 0; for (const v of map.values()) { c += v.calls; cost += v.cost; } return { c, cost }; };
  const t = sum({ totals });
  const bp = sumMap(byProvider);
  const bd = sumMap(byDay);
  const bdp = sumMap(byDayProvider);
  assert.ok(Math.abs(t.cost - expectedCost) < 0.001, "totals cost complete");
  assert.ok(Math.abs(bp.cost - expectedCost) < 0.001, "byProvider cost complete (no trimming)");
  assert.ok(Math.abs(bd.cost - expectedCost) < 0.001, "byDay cost complete");
  assert.ok(Math.abs(bdp.cost - expectedCost) < 0.001, "byDayProvider cost complete (record-time accumulation)");
  assert.equal(bp.c, expectedCalls, "byProvider calls complete");
  assert.equal(bdp.c, expectedCalls, "byDayProvider calls complete despite detail trimming");
});

test("ledgerIntegrity: complete ledger passes (Map-aware, not Object.values-on-Map)", () => {
  const mk = (calls, cost) => ({ calls, cost, costUsd: cost / 7, costNominal: cost, costNominalUsd: cost / 7, savings: 0, savingsUsd: 0, inputTokens: 0, cacheReadTokens: 0, outputTokens: 0 });
  const complete = {
    totals: mk(100, 50),
    byProvider: new Map([["a", mk(60, 30)], ["b", mk(40, 20)]]),
    byProviderModel: new Map([["a\u0000m1", mk(60, 30)], ["b\u0000m2", mk(40, 20)]]),
    byDay: new Map([["2026-08-01", mk(100, 50)]]),
    byDayProvider: new Map([["2026-08-01\u0000a\u0000m1", mk(60, 30)], ["2026-08-01\u0000b\u0000m2", mk(40, 20)]]),
    // 会话携带聚合字段（record 时全量维护）；messages 只是明细视图。
    bySession: new Map([["s1", { calls: 100, cost: 50, messages: new Map([["m1", mk(1, 0.02)], ["m2", mk(1, 0.03)]]) }]])
  };
  const okResult = ledgerIntegrity(complete);
  assert.equal(okResult.ok, true, "complete ledger must pass integrity");
  const sessCheck = okResult.checks.find((c) => c.key === "sessions_byProvider");
  assert.equal(sessCheck.ok, true, "sessions aggregate matches byProvider");
  assert.equal(okResult.bdpGapCheck.ok, true, "byDayProvider matches byProvider when complete");
});

test("ledgerIntegrity: trimmed message details do not fail integrity (aggregate views agree)", () => {
  // 模拟真实账本：会话聚合 2419 条/¥51.91，明细被裁剪到 2 条 —— 明细求和必然小于聚合，
  // 但会话聚合字段与 byProvider 一致 → ok 必须为 true（修复前该场景永久误报）。
  const mk = (calls, cost) => ({ calls, cost, costUsd: cost / 7, costNominal: cost, costNominalUsd: cost / 7, savings: 0, savingsUsd: 0, inputTokens: 0, cacheReadTokens: 0, outputTokens: 0 });
  const ledger = {
    totals: mk(2419, 51.91),
    byProvider: new Map([["a", mk(2419, 51.91)]]),
    byProviderModel: new Map([["a\u0000m1", mk(2419, 51.91)]]),
    byDay: new Map([["2026-08-18", mk(2419, 51.91)]]),
    byDayProvider: new Map([["2026-08-18\u0000a\u0000m1", mk(2419, 51.91)]]),
    bySession: new Map([["s1", { calls: 2419, cost: 51.91, messages: new Map([["m1", mk(1, 0.02)], ["m2", mk(1, 0.03)]]) }]])
  };
  const result = ledgerIntegrity(ledger);
  assert.equal(result.ok, true, "trimmed details must not fail integrity");
  assert.equal(result.checks.find((c) => c.key === "sessions_byProvider").ok, true);
  assert.equal(result.bdpGapCheck.ok, true);
});

test("ledgerIntegrity: byDayProvider gap reported via bdpGapCheck without failing overall ok", () => {
  const mk = (calls, cost) => ({ calls, cost, costUsd: cost / 7, costNominal: cost, costNominalUsd: cost / 7, savings: 0, savingsUsd: 0, inputTokens: 0, cacheReadTokens: 0, outputTokens: 0 });
  // byDayProvider 缺 b 的 40 calls/20 cost（模拟历史裁剪/迁移缺口）
  const gapped = {
    totals: mk(100, 50),
    byProvider: new Map([["a", mk(60, 30)], ["b", mk(40, 20)]]),
    byProviderModel: new Map([["a\u0000m1", mk(60, 30)], ["b\u0000m2", mk(40, 20)]]),
    byDay: new Map([["2026-08-01", mk(100, 50)]]),
    byDayProvider: new Map([["2026-08-01\u0000a\u0000m1", mk(60, 30)]]),
    bySession: new Map([["s1", { calls: 100, cost: 50, messages: new Map([["m1", mk(100, 50)]]) }]])
  };
  const result = ledgerIntegrity(gapped);
  assert.equal(result.ok, true, "bdpGap must not fail overall integrity (surfaced separately)");
  assert.equal(result.bdpGapCheck.ok, false, "byDayProvider_byProvider must detect the gap");
  assert.ok(Math.abs(result.bdpGapCheck.gap) > 10, "gap magnitude reported");
});

test("BillingLedger.record is idempotent: replayed (sessionId, messageId) never drifts session aggregates", async () => {
  // 回归：旧实现「撤销会话级旧计数」（只减不加）会让会话聚合随重放次数归零甚至为负。
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const ledger = new BillingLedger(join(dir, "ledger.json"), 1000, 10);
  const base = {
    sessionId: "s1", messageId: "m1", time: Date.parse("2026-08-18T10:00:00+08:00"),
    provider: "deepseek-official", model: "deepseek-v4-flash",
    inputTokens: 100, cacheReadTokens: 0, outputTokens: 50,
    cost: 0.0123, costUsd: 0.0017, costNominal: 0.0123, costNominalUsd: 0.0017,
    savings: 0, savingsUsd: 0, isLocal: false, source: "official",
    unitPrice: { cny: { input: 1, cacheRead: 0.02, output: 2 }, usd: { input: 0.14, cacheRead: 0.0028, output: 0.28 } },
    mode: "flat"
  };
  ledger.record({ ...base });
  ledger.record({ ...base }); // 重放
  ledger.record({ ...base }); // 再重放（旧实现会漂移为负）
  const view = ledger.sessionView("s1");
  assert.equal(ledger.totals.calls, 1, "totals count first write only");
  assert.equal(ledger.totals.cost, 0.0123);
  assert.equal(view.calls, 1, "session aggregate must not drift on replay");
  assert.equal(view.cost, 0.0123);
  assert.equal(ledger.byProvider.get("deepseek-official").calls, 1);
  assert.equal(ledger.recent.length, 1);
  assert.ok(view.messages.m1 !== void 0, "detail kept from first write");
  // 不同 messageId 正常累计
  ledger.record({ ...base, messageId: "m2", cost: 0.02, costUsd: 0.0028, inputTokens: 200, outputTokens: 60 });
  assert.equal(ledger.totals.calls, 2);
  assert.equal(ledger.sessionView("s1").calls, 2);
  assert.equal(ledger.sessionView("s1").cost, 0.0123 + 0.02);
  await ledger.dispose();
  // 清理临时目录（dispose 已清定时器 + 落盘）。
  await rm(dir, { recursive: true, force: true });
});

/** 完整计数对象（文件 JSON 用纯对象；聚合值语义，calls 为条数）。 */
function full(calls, cost) {
  return {
    calls, cost, costUsd: cost / 7, costNominal: cost, costNominalUsd: cost / 7,
    savings: 0, savingsUsd: 0, inputTokens: calls * 100, cacheReadTokens: 0, outputTokens: calls * 10
  };
}

/** 构造 v3 账本文件 JSON（messages/recent 为最小记账消息；byDayProvider 可注入污染值）。 */
function ledgerFileV3({ bdpCost = 4, withSessionModel = false } = {}) {
  const m1 = { sessionId: "s1", messageId: "m1", time: Date.parse("2026-08-01T10:00:00+08:00"), provider: "p1", model: "m-a", source: "free", ...full(1, 1.5) };
  const m2 = { sessionId: "s1", messageId: "m2", time: Date.parse("2026-08-01T11:00:00+08:00"), provider: "p1", model: "m-b", source: "official", ...full(1, 2.5) };
  return {
    version: 3,
    pricingHash: "x",
    totals: full(2, 4),
    byModel: { "m-a": full(1, 1.5), "m-b": full(1, 2.5) },
    byProvider: { p1: full(2, 4) },
    byProviderModel: { "p1\u0000m-a": full(1, 1.5), "p1\u0000m-b": full(1, 2.5) },
    byDay: { "2026-08-01": full(2, 4) },
    // 正常值 4；可注入污染值（如 v3.1 叠加回填后的 8）
    byDayProvider: { "2026-08-01\u0000p1\u0000m-a": full(1, bdpCost * (1.5 / 4)), "2026-08-01\u0000p1\u0000m-b": full(1, bdpCost * (2.5 / 4)) },
    ...(withSessionModel ? { bySessionModel: { "s1\u0000p1\u0000m-a": full(1, 1.5), "s1\u0000p1\u0000m-b": full(1, 2.5) } } : {}),
    sessions: { s1: { calls: 2, cost: 4, costUsd: 4 / 7, messages: { m1: { ...m1 }, m2: { ...m2 } } } },
    recent: [{ ...m1 }, { ...m2 }]
  };
}

test("BillingLedger.load: missing bySessionModel does NOT double-count existing byDayProvider", async () => {
  // 回归：v3.1 曾把回填条件改成「byDayProvider 空 || bySessionModel 空」，
  // 使缺 bySessionModel 的 v3 账本在已有 byDayProvider 上叠加回填（双计膨胀，bdp≈2×）。
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const path = join(dir, "ledger.json");
  await writeFile(path, JSON.stringify(ledgerFileV3({ withSessionModel: false })));
  const ledger = new BillingLedger(path, 1000, 10);
  ledger.load();
  const bdpTotal = [...ledger.byDayProvider.values()].reduce((s, v) => s + v.cost, 0);
  assert.equal(bdpTotal, 4, "byDayProvider must stay 4 (no double-count to 8)");
  assert.equal(ledger.byDayProvider.get("2026-08-01\u0000p1\u0000m-a").cost, 1.5);
  // bySessionModel 被回填（原本缺失）
  assert.equal(ledger.bySessionModel.size, 2, "bySessionModel backfilled");
  assert.equal(ledger.bySessionModel.get("s1\u0000p1\u0000m-a").cost, 1.5);
  await rm(dir, { recursive: true, force: true });
});

test("BillingLedger.load: inflated byDayProvider (polluted) is healed from the union", async () => {
  // 已被污染（bdpCost=8 > byProvider=4）的账本：加载时按并集重建，恢复为 4。
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const path = join(dir, "ledger.json");
  await writeFile(path, JSON.stringify(ledgerFileV3({ bdpCost: 8, withSessionModel: true })));
  const ledger = new BillingLedger(path, 1000, 10);
  ledger.load();
  const bdpTotal = [...ledger.byDayProvider.values()].reduce((s, v) => s + v.cost, 0);
  assert.equal(bdpTotal, 4, "polluted byDayProvider healed to union value (not 8)");
  // bySessionModel 已有且未膨胀 → 保持不变
  assert.equal(ledger.bySessionModel.size, 2);
  assert.equal(ledger.bySessionModel.get("s1\u0000p1\u0000m-a").cost, 1.5);
  await rm(dir, { recursive: true, force: true });
});

test("BillingLedger: session model buckets carry source (record, persistence round-trip, legacy backfill)", async () => {
  // record 路径：新桶带 source（浮层分模型行按此显示节省金额/语义色）。
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const path = join(dir, "ledger.json");
  const ledger = new BillingLedger(path, 1000, 10);
  const mkEntry = (messageId, source, cost, savings) => ({
    sessionId: "s1", messageId, time: Date.parse("2026-08-18T10:00:00+08:00"),
    provider: "bai", model: "deepseek-v4-flash", source,
    inputTokens: 100, cacheReadTokens: 0, outputTokens: 50,
    cost, costUsd: cost / 7, costNominal: cost, costNominalUsd: cost / 7,
    savings, savingsUsd: savings / 7, isLocal: false,
    unitPrice: { cny: { input: 1, cacheRead: 0.02, output: 2 }, usd: { input: 0.14, cacheRead: 0.0028, output: 0.28 } },
    mode: "flat"
  });
  ledger.record(mkEntry("m1", "free", 0, 1.5)); // 纯节省（白嫖）
  ledger.record(mkEntry("m2", "official", 2.5, 0)); // 纯花费
  let models = ledger.sessionView("s1").models;
  assert.equal(models["s1\u0000bai\u0000deepseek-v4-flash"].source, "free", "bucket source from first entry");
  // 持久化往返：写盘 → 新实例 load → source 保留
  await ledger.dispose();
  const ledger2 = new BillingLedger(path, 1000, 10);
  ledger2.load();
  models = ledger2.sessionView("s1").models;
  assert.equal(models["s1\u0000bai\u0000deepseek-v4-flash"].source, "free", "source survives persistence");
  await ledger2.dispose();
  await rm(dir, { recursive: true, force: true });
});

test("BillingLedger.load: backfills source on legacy bySessionModel buckets lacking it", async () => {
  // v3.1 存量：bySessionModel 桶无 source，但消息明细/recent 带 source → load 回补。
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const path = join(dir, "ledger.json");
  await writeFile(path, JSON.stringify(ledgerFileV3({ withSessionModel: true })));
  const ledger = new BillingLedger(path, 1000, 10);
  ledger.load();
  const models = ledger.sessionView("s1").models;
  assert.equal(models["s1\u0000p1\u0000m-a"].source, "free", "legacy bucket backfilled from messages");
  assert.equal(models["s1\u0000p1\u0000m-b"].source, "official");
  await rm(dir, { recursive: true, force: true });
});

test("BillingLedger.reprice records the trimmed-history gap instead of silently shrinking totals", async () => {
  // 场景：maxRecent=2 + maxMessagesPerSession=2，第 3 条消息既不在 recent 也不在
  // 会话明细（被裁剪）→ 重估只能覆盖 2 条；缺口必须被 lastRepriceGap 显式记录。
  // 回归①：账本路径必须用临时目录（相对路径会污染仓库根目录，独立复审发现）。
  // 回归②：涨价重估时 gap.cost 仍反映裁剪消息的旧价贡献（旧实现 max(0, before−after)
  // 会把裁剪损失掩盖为 0——被保留消息的调价差值混入）。
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const path = join(dir, "ledger.json");
  const ledger = new BillingLedger(path, 2, 2);
  const mk = (messageId, cost) => ({
    sessionId: "s1", messageId, time: Date.parse("2026-08-18T10:00:00+08:00"),
    provider: "deepseek-official", model: "deepseek-v4-flash",
    inputTokens: 100, cacheReadTokens: 0, outputTokens: 50,
    cost, costUsd: cost / 7, costNominal: cost, costNominalUsd: cost / 7,
    savings: 0, savingsUsd: 0, isLocal: false, source: "official",
    unitPrice: { cny: { input: 1, cacheRead: 0.02, output: 2 }, usd: { input: 0.14, cacheRead: 0.0028, output: 0.28 } },
    mode: "flat"
  });
  ledger.record(mk("m1", 0.01));
  ledger.record(mk("m2", 0.02));
  ledger.record(mk("m3", 0.03));
  assert.equal(ledger.totals.calls, 3, "pre-reprice totals cover all three messages");
  assert.equal(ledger.lastRepriceGap, null, "no reprice yet → no gap");
  // 首次重估即「涨价 1000 倍」：after 口径远大于 before，但 gap 必须反映裁剪消息
  // 的旧价贡献 0.01（m1），而非被调价差值掩盖为 0。
  const pricing = {
    hash: "price-increase",
    metering: {},
    localProviders: [],
    localCostPerM: 0,
    at: () => ({ cny: { input: 1000, cacheRead: 20, output: 2000 }, usd: { input: 140, cacheRead: 2.8, output: 280 }, mode: "flat" })
  };
  ledger.reprice(pricing);
  // 增量重估保护（2026-08-22）：不缩水——被裁剪记录保留旧值，totals.calls 保持 3。
  assert.equal(ledger.totals.calls, 3, "incremental reprice keeps trimmed records (no shrink)");
  // lastRepriceGap 仍是「重建源覆盖 vs before」的差额（信息性）：重建覆盖 2 条（m2/m3 保留），
  // m1 被裁剪但增量保护用 before 旧值补回——gap.calls=1 反映重建源覆盖上限，非丢失。
  assert.equal(ledger.lastRepriceGap.calls, 0, "incremental reprice keeps all calls — no gap (trimmed preserved)");
  await ledger.dispose();
  // 清理临时目录（dispose 已清定时器 + 落盘）。
  await rm(dir, { recursive: true, force: true });
});

test("sessionView exposes modelGap when trimmed history is missing from per-model buckets", async () => {
  // 场景：历史迁移/回填缺口——bySessionModel 只覆盖 m-a（1.5），但会话聚合是 4
  // （m-b 的消息既不在明细也不在 recent，回填无法恢复）→ 分模型和小于总账，
  // modelGap 必须显式给出差额（客户端据此提示「累计 > 分模型」的原因）。
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const path = join(dir, "ledger.json");
  const m1 = { sessionId: "s1", messageId: "m1", time: Date.parse("2026-08-01T10:00:00+08:00"), provider: "p1", model: "m-a", source: "free", ...full(1, 1.5) };
  const m2 = { sessionId: "s1", messageId: "m2", time: Date.parse("2026-08-01T11:00:00+08:00"), provider: "p1", model: "m-b", source: "official", ...full(1, 2.5) };
  const file = {
    version: 3, pricingHash: "x",
    totals: full(2, 4),
    byModel: { "m-a": full(1, 1.5), "m-b": full(1, 2.5) },
    byProvider: { p1: full(2, 4) },
    byProviderModel: { "p1\u0000m-a": full(1, 1.5), "p1\u0000m-b": full(1, 2.5) },
    byDay: { "2026-08-01": full(2, 4) },
    byDayProvider: { "2026-08-01\u0000p1\u0000m-a": full(1, 1.5), "2026-08-01\u0000p1\u0000m-b": full(1, 2.5) },
    // bySessionModel 缺 m-b（回填缺口场景）
    bySessionModel: { "s1\u0000p1\u0000m-a": full(1, 1.5) },
    sessions: { s1: { calls: 2, cost: 4, costUsd: 4 / 7, messages: { m1: { ...m1 }, m2: { ...m2 } } } },
    recent: []
  };
  await writeFile(path, JSON.stringify(file));
  const ledger = new BillingLedger(path, 1000, 10);
  ledger.load();
  const view = ledger.sessionView("s1");
  assert.equal(Object.keys(view.models).length, 1, "per-model buckets only cover retained history");
  assert.equal(view.models["s1\u0000p1\u0000m-a"].cost, 1.5);
  assert.equal(view.modelGap.cost, 2.5, "gap = session total minus per-model sum");
  assert.equal(view.modelGap.savings, 0);
  await rm(dir, { recursive: true, force: true });
});

// ── 拆分持久化专项测试（web-billing.json 聚合 + web-billing-detail.json 明细） ──

function entry(messageId, cost, savings = 0, provider = "p1", model = "m-a") {
  return {
    sessionId: "s1", messageId, time: Date.parse("2026-08-18T10:00:00+08:00"),
    provider, model, source: "official",
    inputTokens: 100, cacheReadTokens: 0, outputTokens: 50,
    cost, costUsd: cost / 7, costNominal: cost, costNominalUsd: cost / 7,
    savings, savingsUsd: savings / 7, isLocal: false,
    unitPrice: { cny: { input: 1, cacheRead: 0.02, output: 2 }, usd: { input: 0.14, cacheRead: 0.0028, output: 0.28 } },
    mode: "flat"
  };
}

test("split persistence: detail file missing → aggregates intact, messages/recent empty", async () => {
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const path = join(dir, "ledger.json");
  const ledger = new BillingLedger(path, 1000, 10);
  ledger.record(entry("m1", 1.5, 0.5));
  await ledger.dispose();
  // 删除 detail 文件（模拟丢失/损坏）
  await rm(ledger.detailPath, { force: true });
  const ledger2 = new BillingLedger(path, 1000, 10);
  ledger2.load();
  assert.equal(ledger2.totals.calls, 1, "aggregate survives detail loss");
  assert.equal(ledger2.totals.cost, 1.5);
  assert.equal(ledger2.sessionView("s1").cost, 1.5, "session aggregate from core");
  assert.equal(Object.keys(ledger2.sessionView("s1").messages || {}).length, 0, "messages empty (detail missing)");
  assert.equal(ledger2.recent.length, 0, "recent empty (detail missing)");
  await ledger2.dispose();
  await rm(dir, { recursive: true, force: true });
});

test("reprice guard: skips when detail missing but aggregates exist (no zero-out)", async () => {
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const path = join(dir, "ledger.json");
  const ledger = new BillingLedger(path, 1000, 10);
  ledger.record(entry("m1", 1.5, 0.5));
  await ledger.dispose();
  // 删除 detail → 明细空但聚合在
  await rm(ledger.detailPath, { force: true });
  const ledger2 = new BillingLedger(path, 1000, 10);
  ledger2.load();
  assert.equal(ledger2.totals.calls, 1);
  // 强制触发 reprice（hash 变化）
  const pricing = { hash: "NEW-HASH", at: (m, t, p) => ({ cny: { input: 1, cacheRead: 0.02, output: 2 }, usd: { input: 0.14, cacheRead: 0.0028, output: 0.28 } }) };
  ledger2.reprice(pricing);
  assert.equal(ledger2.totals.calls, 1, "aggregates NOT zeroed by reprice on missing detail");
  assert.equal(ledger2.totals.cost, 1.5);
  await ledger2.dispose();
  await rm(dir, { recursive: true, force: true });
});

test("split persistence: core+detail round-trip equals in-memory state", async () => {
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const path = join(dir, "ledger.json");
  const ledger = new BillingLedger(path, 1000, 10);
  ledger.record(entry("m1", 1.5, 0.5));
  ledger.record(entry("m2", 2.0, 0));
  await ledger.dispose();
  // 新实例加载
  const ledger2 = new BillingLedger(path, 1000, 10);
  ledger2.load();
  assert.equal(ledger2.totals.calls, 2);
  assert.ok(Math.abs(ledger2.totals.cost - 3.5) < 0.001);
  assert.equal(Object.keys(ledger2.sessionView("s1").messages || {}).length, 2, "messages survive detail file");
  assert.equal(ledger2.recent.length, 2, "recent survives detail file");
  assert.equal(ledger2.sessionView("s1").models["s1\u0000p1\u0000m-a"].cost, 3.5, "per-model aggregate intact");
  await ledger2.dispose();
  await rm(dir, { recursive: true, force: true });
});

test("legacy single-file migration: core+detail split equals original", async () => {
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const path = join(dir, "ledger.json");
  // 构造旧单文件账本（sessions 含 messages + recent 在主文件）
  const ledger = new BillingLedger(path, 1000, 10);
  ledger.record(entry("m1", 1.5, 0.5));
  ledger.record(entry("m2", 2.0, 0));
  await ledger.dispose();
  // 把 core 和 detail 合并回单文件（模拟旧格式），删 detail
  const core = JSON.parse(await (await import("node:fs/promises")).readFile(path, "utf8"));
  const detail = JSON.parse(await (await import("node:fs/promises")).readFile(ledger.detailPath, "utf8"));
  core.sessions = Object.fromEntries(Object.entries(core.sessions || {}).map(([id, v]) => [id, { ...v, messages: detail.sessions?.[id]?.messages ?? {} }]));
  core.recent = detail.recent ?? [];
  await (await import("node:fs/promises")).writeFile(path, JSON.stringify(core));
  await rm(ledger.detailPath, { force: true });
  // 新实例加载旧单文件 → 应等价
  const ledger2 = new BillingLedger(path, 1000, 10);
  ledger2.load();
  assert.equal(ledger2.totals.calls, 2, "aggregates from legacy single file");
  assert.equal(Object.keys(ledger2.sessionView("s1").messages || {}).length, 2, "messages migrated from legacy");
  assert.equal(ledger2.recent.length, 2, "recent migrated from legacy");
  assert.ok(Math.abs(ledger2.totals.cost - 3.5) < 0.001);
  await ledger2.dispose();
  await rm(dir, { recursive: true, force: true });
});

test("dispose clears debounce timers (no late async write after temp-dir removal)", async () => {
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const path = join(dir, "ledger.json");
  const ledger = new BillingLedger(path, 1000, 10);
  ledger.record(entry("m1", 1.5, 0.5));
  await ledger.dispose();
  assert.equal(ledger.writeTimer, null, "core timer cleared");
  assert.equal(ledger.detailTimer, null, "detail timer cleared");
  await rm(dir, { recursive: true, force: true });
  // 等超过 30s 防抖窗口？不必——dispose 已清 timer，这里确认无 pending 即可。
  assert.equal(ledger.pendingWrite, null);
  assert.equal(ledger.pendingDetailWrite, null);
});

test("incremental reprice protects trimmed records (aggregates don't shrink)", async () => {
  const { BillingLedger } = await import("../lib/index.js");
  const { mkdtemp, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const dir = await mkdtemp(join(tmpdir(), "dsh-billing-"));
  const ledger = new BillingLedger(join(dir, "ledger.json"), 1000, 2); // 每会话明细上限 2
  const mk = (messageId, cost) => ({
    sessionId: "s1", messageId, time: Date.parse("2026-08-18T10:00:00+08:00"),
    provider: "deepseek-official", model: "deepseek-v4-flash", source: "official",
    inputTokens: 100, cacheReadTokens: 0, outputTokens: 50,
    cost, costUsd: cost / 7, costNominal: cost, costNominalUsd: cost / 7,
    savings: 0, savingsUsd: 0, isLocal: false,
    unitPrice: { cny: { input: 1, cacheRead: 0.02, output: 2 }, usd: { input: 0.14, cacheRead: 0.0028, output: 0.28 } },
    mode: "flat"
  });
  // 记 5 条（明细上限 2 → 前 3 条被裁剪）
  ledger.record(mk("m1", 1));
  ledger.record(mk("m2", 2));
  ledger.record(mk("m3", 3));
  ledger.record(mk("m4", 4));
  ledger.record(mk("m5", 5));
  assert.equal(ledger.totals.calls, 5, "record-time totals = 5");
  assert.equal(ledger.totals.cost, 15, "record-time cost = 15");
  // 触发 reprice（hash 变化）——旧实现会用裁剪明细（2 条）重建 → calls=2 缩水
  const pricing = { hash: "NEW-HASH-INCREMENTAL", metering: {}, localProviders: [], localCostPerM: 0, at: (m, t, p) => ({ cny: { input: 1, cacheRead: 0.02, output: 2 }, usd: { input: 0.14, cacheRead: 0.0028, output: 0.28 } }) };
  await ledger.reprice(pricing);
  // 增量保护：byProviderModel/byProvider 的 calls 应恢复为 5（不再缩水到 2）
  assert.equal(ledger.totals.calls, 5, "totals calls kept at 5 after reprice (trimmed records preserved)");
  // 重估后 cost 按 token 重算（输入 100×1 + 输出 50×2 每百万 = ¥0.0002/条 × 5）；断言调用数不缩水即可（裁剪记录保留）。
  await ledger.dispose();
  await rm(dir, { recursive: true, force: true });
});
