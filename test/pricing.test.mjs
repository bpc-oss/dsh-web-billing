/**
 * Pricing engine unit tests.
 * Run: node --test test/
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  OFFICIAL_PRICING_POLICIES,
  activePolicy,
  costOf,
  isPeak,
  priceAt,
  priceFor,
  resolvePrice
} from "../lib/pricing.js";

/** 北京时间构造 helper：`2026-08-18T10:00:00+08:00`。 */
const at = (iso) => Date.parse(iso);

test("activePolicy selects the newest policy not later than the message time", () => {
  assert.equal(activePolicy(at("2025-06-01T00:00:00+08:00")).since, "2025-02-09T00:00:00+08:00");
  assert.equal(activePolicy(at("2026-08-10T00:00:00+08:00")).since, "2026-05-22T00:00:00+08:00");
  assert.equal(activePolicy(at("2026-08-17T00:00:00+08:00")).since, "2026-08-17T00:00:00+08:00");
  assert.equal(activePolicy(at("2026-12-01T00:00:00+08:00")).since, "2026-08-17T00:00:00+08:00");
  // 早于第一条政策：取第一条
  assert.equal(activePolicy(at("2024-01-01T00:00:00+08:00")).since, "2025-02-09T00:00:00+08:00");
});

test("flat era pricing (before 2026-08-17)", () => {
  const t = at("2026-08-10T10:00:00+08:00");
  const p = priceAt("deepseek-v4-flash", t, {});
  assert.deepEqual({ input: p.input, cacheRead: p.cacheRead, output: p.output }, { input: 1, cacheRead: 0.02, output: 2 });
  assert.equal(p.mode, "flat");
  const reasoner = priceAt("deepseek-reasoner", t, {});
  assert.deepEqual(
    { input: reasoner.input, cacheRead: reasoner.cacheRead, output: reasoner.output },
    { input: 4, cacheRead: 1, output: 16 }
  );
});

test("policy chain continuity: retired models keep their last named price", () => {
  // V4 政策未点名 deepseek-reasoner → 沿用 2025-02-09 政策的 {4, 1, 16}
  const reasoner = priceAt("deepseek-reasoner", at("2026-08-18T10:00:00+08:00"), {});
  assert.deepEqual(
    { input: reasoner.input, cacheRead: reasoner.cacheRead, output: reasoner.output },
    { input: 4, cacheRead: 1, output: 16 }
  );
  assert.equal(reasoner.mode, "flat");
  // v4-flash 被新政策点名 → 峰谷价
  const flash = priceAt("deepseek-v4-flash", at("2026-08-18T10:00:00+08:00"), {});
  assert.equal(flash.mode, "peak");
});

test("peak/off-peak pricing after 2026-08-17", () => {
  // 高峰：09:00-12:00（含 09:00，不含 12:00）
  const peak = priceAt("deepseek-v4-flash", at("2026-08-18T10:00:00+08:00"), {});
  assert.deepEqual({ input: peak.input, cacheRead: peak.cacheRead, output: peak.output }, { input: 3, cacheRead: 0.1, output: 9 });
  assert.equal(peak.mode, "peak");
  // 空闲：12:00 起
  const off = priceAt("deepseek-v4-flash", at("2026-08-18T20:00:00+08:00"), {});
  assert.deepEqual({ input: off.input, cacheRead: off.cacheRead, output: off.output }, { input: 1.5, cacheRead: 0.05, output: 4.5 });
  assert.equal(off.mode, "offPeak");
  // 第二个高峰窗口 14:00-18:00
  assert.equal(priceAt("deepseek-v4-flash", at("2026-08-18T15:00:00+08:00"), {}).mode, "peak");
  assert.equal(priceAt("deepseek-v4-flash", at("2026-08-18T18:00:00+08:00"), {}).mode, "offPeak");
  // v4-pro
  const proPeak = priceAt("deepseek-v4-pro", at("2026-08-18T10:00:00+08:00"), {});
  assert.deepEqual({ input: proPeak.input, cacheRead: proPeak.cacheRead, output: proPeak.output }, { input: 9, cacheRead: 0.3, output: 27 });
});

test("isPeak boundaries and timezone handling", () => {
  assert.equal(isPeak(at("2026-08-18T09:00:00+08:00")), true); // 窗口起点含
  assert.equal(isPeak(at("2026-08-18T11:59:59+08:00")), true);
  assert.equal(isPeak(at("2026-08-18T12:00:00+08:00")), false); // 窗口终点不含
  assert.equal(isPeak(at("2026-08-18T14:00:00+08:00")), true);
  assert.equal(isPeak(at("2026-08-18T18:00:00+08:00")), false);
  // 同一时刻在 UTC 下落在不同小时 → 峰谷结果不同（验证时区生效）
  assert.equal(isPeak(at("2026-08-18T01:00:00+00:00"), "Asia/Shanghai"), true); // 09:00 北京
  assert.equal(isPeak(at("2026-08-18T01:00:00+00:00"), "UTC"), false); // 01:00 UTC
  // 自定义窗口
  assert.equal(isPeak(at("2026-08-18T23:00:00+08:00"), "Asia/Shanghai", [[23, 24]]), true);
  // 非法时区不抛错
  assert.equal(isPeak(at("2026-08-18T10:00:00+08:00"), "Not/AZone"), false);
});

test("user overrides: exact model wins; '*' only fills gaps", () => {
  const t = at("2026-08-18T10:00:00+08:00"); // 峰谷政策生效后
  const prices = {
    "deepseek-v4-flash": { input: 0.5, cacheRead: 0.01, output: 1 },
    "*": { input: 0.1, cacheRead: 0.001, output: 0.2 }
  };
  // 用户精确条目覆盖官方峰价
  const flash = priceAt("deepseek-v4-flash", t, { prices });
  assert.deepEqual({ input: flash.input, cacheRead: flash.cacheRead, output: flash.output }, { input: 0.5, cacheRead: 0.01, output: 1 });
  // 官方表未列出的模型 → 用户 '*' 填补
  const custom = priceAt("my-model", t, { prices });
  assert.deepEqual({ input: custom.input, cacheRead: custom.cacheRead, output: custom.output }, { input: 0.1, cacheRead: 0.001, output: 0.2 });
  // 官方表已列出的模型（v4-pro）不受用户 '*' 影响
  const pro = priceAt("deepseek-v4-pro", t, { prices });
  assert.deepEqual({ input: pro.input, cacheRead: pro.cacheRead, output: pro.output }, { input: 9, cacheRead: 0.3, output: 27 });
});

test("officialPricing off uses only the user table", () => {
  const prices = { "my-model": { input: 2, cacheRead: 1, output: 4 }, "*": { input: 2, cacheRead: 1, output: 4 } };
  const p = priceAt("my-model", at("2026-08-18T10:00:00+08:00"), { official: false, prices });
  assert.deepEqual({ input: p.input, cacheRead: p.cacheRead, output: p.output }, { input: 2, cacheRead: 1, output: 4 });
  assert.equal(p.mode, "flat");
  assert.equal(p.policy, void 0);
});

test("policyOverrides extend the schedule", () => {
  const override = [{
    since: "2026-09-01T00:00:00+08:00",
    label: "测试政策",
    prices: { "deepseek-v4-flash": { input: 5, cacheRead: 1, output: 10 }, "*": { input: 5, cacheRead: 1, output: 10 } }
  }];
  const t = at("2026-09-02T00:00:00+08:00");
  const p = priceAt("deepseek-v4-flash", t, { policies: [...OFFICIAL_PRICING_POLICIES, ...override] });
  assert.equal(p.input, 5);
  assert.equal(p.policy.label, "测试政策");
});

test("costOf math", () => {
  const price = { input: 1, cacheRead: 0.02, output: 2 };
  const sample = costOf({ inputTokens: 1000, cacheReadTokens: 100000, outputTokens: 2000 }, price);
  assert.equal(sample.inputTokens, 1000);
  assert.equal(sample.cacheReadTokens, 100000);
  assert.equal(sample.outputTokens, 2000);
  assert.equal(sample.cost, (1000 * 1 + 100000 * 0.02 + 2000 * 2) / 1e6);
  // 缺省字段按 0 处理
  assert.equal(costOf({}, price).cost, 0);
});

test("priceFor fallback", () => {
  const table = { a: { input: 1, cacheRead: 2, output: 3 }, "*": { input: 9, cacheRead: 9, output: 9 } };
  assert.deepEqual(priceFor("a", table), table.a);
  assert.deepEqual(priceFor("unknown", table), table["*"]);
  assert.deepEqual(priceFor("unknown", {}), { input: 0, cacheRead: 0, output: 0 });
});

test("resolvePrice merge", () => {
  const base = { m: { input: 1, cacheRead: 0.02, output: 2 }, "*": { input: 3, cacheRead: 0.1, output: 9 } };
  assert.deepEqual(resolvePrice("m", base, { m: { input: 5 } }), { input: 5, cacheRead: 0.02, output: 2 });
  assert.deepEqual(resolvePrice("m", base, {}), base.m);
  assert.deepEqual(resolvePrice("x", base, { "*": { input: 7, cacheRead: 7, output: 7 } }), { input: 7, cacheRead: 7, output: 7 });
});
