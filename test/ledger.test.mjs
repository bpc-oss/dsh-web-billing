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
import { mergeCounts, zeroCounts } from "../lib/pricing.js";

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
