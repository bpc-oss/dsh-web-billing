/**
 * Pricing engine unit tests.
 * Run: node --test test/
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_CODING_USD_CNY_RATE,
  OFFICIAL_PRICING_POLICIES,
  activePolicy,
  codingPlanPriceAt,
  costOf,
  isPeak,
  priceAt,
  priceFor,
  resolvePrice,
  sourceOf,
  subscriptionUnitFor,
  unitForProvider
} from "../lib/pricing.js";

/** 北京时间构造 helper：`2026-08-18T10:00:00+08:00`。 */
const at = (iso) => Date.parse(iso);

/** 简写：取 cny 单价。 */
const cny = (unit) => unit.cny;
/** 简写：取 usd 单价。 */
const usd = (unit) => unit.usd;

test("activePolicy selects the newest policy not later than the message time", () => {
  assert.equal(activePolicy(at("2025-06-01T00:00:00+08:00")).since, "2025-02-09T00:00:00+08:00");
  assert.equal(activePolicy(at("2026-08-10T00:00:00+08:00")).since, "2026-05-22T00:00:00+08:00");
  assert.equal(activePolicy(at("2026-08-17T00:00:00+08:00")).since, "2026-08-17T00:00:00+08:00");
  assert.equal(activePolicy(at("2026-12-01T00:00:00+08:00")).since, "2026-08-17T00:00:00+08:00");
  // 早于第一条政策：取第一条
  assert.equal(activePolicy(at("2024-01-01T00:00:00+08:00")).since, "2025-02-09T00:00:00+08:00");
});

test("flat era pricing (before 2026-08-17) in both currencies", () => {
  const t = at("2026-08-10T10:00:00+08:00");
  const p = priceAt("deepseek-v4-flash", t, {});
  assert.deepEqual(cny(p), { input: 1, cacheRead: 0.02, output: 2 });
  assert.deepEqual(usd(p), { input: 0.14, cacheRead: 0.0028, output: 0.28 });
  assert.equal(p.mode, "flat");
  const reasoner = priceAt("deepseek-reasoner", t, {});
  assert.deepEqual(cny(reasoner), { input: 4, cacheRead: 1, output: 16 });
  assert.deepEqual(usd(reasoner), { input: 0.55, cacheRead: 0.055, output: 1.68 });
});

test("policy chain continuity: retired models keep their last named price", () => {
  // V4 政策未点名 deepseek-reasoner → 沿用 2025-02-09 政策的 {4, 1, 16}
  const reasoner = priceAt("deepseek-reasoner", at("2026-08-18T10:00:00+08:00"), {});
  assert.deepEqual(cny(reasoner), { input: 4, cacheRead: 1, output: 16 });
  assert.deepEqual(usd(reasoner), { input: 0.55, cacheRead: 0.055, output: 1.68 });
  assert.equal(reasoner.mode, "flat");
  // v4-flash 被新政策点名 → 峰谷价
  const flash = priceAt("deepseek-v4-flash", at("2026-08-18T10:00:00+08:00"), {});
  assert.equal(flash.mode, "peak");
});

test("peak/off-peak pricing after 2026-08-17 (both currencies)", () => {
  // 高峰：09:00-12:00（含 09:00，不含 12:00）
  const peak = priceAt("deepseek-v4-flash", at("2026-08-18T10:00:00+08:00"), {});
  assert.deepEqual(cny(peak), { input: 3, cacheRead: 0.1, output: 9 });
  assert.deepEqual(usd(peak), { input: 0.44, cacheRead: 0.014, output: 1.32 });
  assert.equal(peak.mode, "peak");
  // 空闲：12:00 起
  const off = priceAt("deepseek-v4-flash", at("2026-08-18T20:00:00+08:00"), {});
  assert.deepEqual(cny(off), { input: 1.5, cacheRead: 0.05, output: 4.5 });
  assert.deepEqual(usd(off), { input: 0.22, cacheRead: 0.007, output: 0.66 });
  assert.equal(off.mode, "offPeak");
  // 第二个高峰窗口 14:00-18:00
  assert.equal(priceAt("deepseek-v4-flash", at("2026-08-18T15:00:00+08:00"), {}).mode, "peak");
  assert.equal(priceAt("deepseek-v4-flash", at("2026-08-18T18:00:00+08:00"), {}).mode, "offPeak");
  // v4-pro
  const proPeak = priceAt("deepseek-v4-pro", at("2026-08-18T10:00:00+08:00"), {});
  assert.deepEqual(cny(proPeak), { input: 9, cacheRead: 0.3, output: 27 });
  assert.deepEqual(usd(proPeak), { input: 1.32, cacheRead: 0.044, output: 3.96 });
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

test("user overrides: exact model wins; '*' only fills gaps (both currencies)", () => {
  const t = at("2026-08-18T10:00:00+08:00"); // 峰谷政策生效后
  const prices = {
    "deepseek-v4-flash": { cny: { input: 0.5, cacheRead: 0.01, output: 1 }, usd: { input: 0.05, cacheRead: 0.001, output: 0.1 } },
    "*": { cny: { input: 0.1, cacheRead: 0.001, output: 0.2 }, usd: { input: 0.01, cacheRead: 0.0001, output: 0.02 } }
  };
  // 用户精确条目覆盖官方峰价
  const flash = priceAt("deepseek-v4-flash", t, { prices });
  assert.deepEqual(cny(flash), { input: 0.5, cacheRead: 0.01, output: 1 });
  assert.deepEqual(usd(flash), { input: 0.05, cacheRead: 0.001, output: 0.1 });
  // 官方表未列出的模型 → 用户 '*' 填补
  const custom = priceAt("my-model", t, { prices });
  assert.deepEqual(cny(custom), { input: 0.1, cacheRead: 0.001, output: 0.2 });
  // 官方表已列出的模型（v4-pro）不受用户 '*' 影响
  const pro = priceAt("deepseek-v4-pro", t, { prices });
  assert.deepEqual(cny(pro), { input: 9, cacheRead: 0.3, output: 27 });
});

test("officialPricing off uses only the user table", () => {
  const prices = {
    "my-model": { cny: { input: 2, cacheRead: 1, output: 4 }, usd: { input: 0.3, cacheRead: 0.1, output: 0.6 } },
    "*": { cny: { input: 2, cacheRead: 1, output: 4 }, usd: { input: 0.3, cacheRead: 0.1, output: 0.6 } }
  };
  const p = priceAt("my-model", at("2026-08-18T10:00:00+08:00"), { official: false, prices });
  assert.deepEqual(cny(p), { input: 2, cacheRead: 1, output: 4 });
  assert.deepEqual(usd(p), { input: 0.3, cacheRead: 0.1, output: 0.6 });
  assert.equal(p.mode, "flat");
  assert.equal(p.policy, void 0);
});

test("policyOverrides extend the schedule", () => {
  const override = [{
    since: "2026-09-01T00:00:00+08:00",
    label: "测试政策",
    prices: {
      "deepseek-v4-flash": { cny: { input: 5, cacheRead: 1, output: 10 }, usd: { input: 0.7, cacheRead: 0.1, output: 1.4 } },
      "*": { cny: { input: 5, cacheRead: 1, output: 10 }, usd: { input: 0.7, cacheRead: 0.1, output: 1.4 } }
    }
  }];
  const t = at("2026-09-02T00:00:00+08:00");
  const p = priceAt("deepseek-v4-flash", t, { policies: [...OFFICIAL_PRICING_POLICIES, ...override] });
  assert.equal(cny(p).input, 5);
  assert.equal(usd(p).input, 0.7);
  assert.equal(p.policy.label, "测试政策");
});

test("costOf math in both currencies", () => {
  const unit = {
    cny: { input: 1, cacheRead: 0.02, output: 2 },
    usd: { input: 0.14, cacheRead: 0.0028, output: 0.28 }
  };
  const sample = costOf({ inputTokens: 1000, cacheReadTokens: 100000, outputTokens: 2000 }, unit);
  assert.equal(sample.inputTokens, 1000);
  assert.equal(sample.cacheReadTokens, 100000);
  assert.equal(sample.outputTokens, 2000);
  assert.equal(sample.cost, (1000 * 1 + 100000 * 0.02 + 2000 * 2) / 1e6);
  assert.equal(sample.costUsd, (1000 * 0.14 + 100000 * 0.0028 + 2000 * 0.28) / 1e6);
  // 缺省字段按 0 处理
  assert.equal(costOf({}, unit).cost, 0);
  assert.equal(costOf({}, unit).costUsd, 0);
});

test("priceFor fallback", () => {
  const table = {
    a: { cny: { input: 1, cacheRead: 2, output: 3 }, usd: { input: 0.1, cacheRead: 0.2, output: 0.3 } },
    "*": { cny: { input: 9, cacheRead: 9, output: 9 }, usd: { input: 1, cacheRead: 1, output: 1 } }
  };
  assert.deepEqual(priceFor("a", table), table.a);
  assert.deepEqual(priceFor("unknown", table), table["*"]);
  assert.deepEqual(priceFor("unknown", {}), { cny: { input: 0, cacheRead: 0, output: 0 }, usd: { input: 0, cacheRead: 0, output: 0 } });
});

test("resolvePrice merge", () => {
  const base = {
    m: { cny: { input: 1, cacheRead: 0.02, output: 2 }, usd: { input: 0.14, cacheRead: 0.0028, output: 0.28 } },
    "*": { cny: { input: 3, cacheRead: 0.1, output: 9 }, usd: { input: 0.44, cacheRead: 0.014, output: 1.32 } }
  };
  assert.deepEqual(resolvePrice("m", base, { m: { cny: { input: 5 } } }).cny, { input: 5, cacheRead: 0.02, output: 2 });
  assert.deepEqual(resolvePrice("m", base, {}), base.m);
  assert.deepEqual(resolvePrice("x", base, { "*": { cny: { input: 7, cacheRead: 7, output: 7 }, usd: { input: 1, cacheRead: 1, output: 1 } } }),
    { cny: { input: 7, cacheRead: 7, output: 7 }, usd: { input: 1, cacheRead: 1, output: 1 } });
});

test("unnamed model with empty user prices falls back to the policy wildcard", () => {
  // 用户表为空时，未点名模型不应崩溃（回归：mergeUnit 收到 undefined）。
  const p = priceAt("deepseek-v4-flash-0731-ablit", at("2026-08-10T10:00:00+08:00"), { prices: {} });
  assert.deepEqual(cny(p), { input: 1, cacheRead: 0.02, output: 2 });
  assert.deepEqual(usd(p), { input: 0.14, cacheRead: 0.0028, output: 0.28 });
  assert.equal(p.mode, "flat");
});

test("unitForProvider: cloud providers keep nominal pricing", () => {
  const nominal = priceAt("deepseek-v4-flash", at("2026-08-10T10:00:00+08:00"), {});
  const split = unitForProvider("deepseek-official", nominal, ["dgx-spark-vllm"], 0);
  assert.equal(split.isLocal, false);
  assert.equal(split.unit, nominal);
  // 未配置 localProviders 时一切照旧
  const none = unitForProvider("dgx-spark-vllm", nominal, [], 0);
  assert.equal(none.isLocal, false);
});

test("unitForProvider: local providers price actual at 0 and keep nominal", () => {
  const nominal = priceAt("deepseek-v4-flash", at("2026-08-10T10:00:00+08:00"), {});
  const split = unitForProvider("dgx-spark-vllm", nominal, ["dgx-spark-vllm"], 0);
  assert.equal(split.isLocal, true);
  assert.deepEqual(split.unit.cny, { input: 0, cacheRead: 0, output: 0 });
  assert.deepEqual(split.unit.usd, { input: 0, cacheRead: 0, output: 0 });
  assert.equal(split.nominal, nominal);
  // 实际成本可配置（如电费）
  const costed = unitForProvider("dgx-spark-vllm", nominal, ["dgx-spark-vllm"], 0.05);
  assert.deepEqual(costed.unit.cny, { input: 0.05, cacheRead: 0.05, output: 0.05 });
});

test("savings math: local call at official price yields full savings", () => {
  const nominal = priceAt("deepseek-v4-flash", at("2026-08-10T10:00:00+08:00"), {});
  const split = unitForProvider("dgx-spark-vllm", nominal, ["dgx-spark-vllm"], 0);
  const usage = { inputTokens: 1000, cacheReadTokens: 100000, outputTokens: 2000 };
  const actual = costOf(usage, split.unit);
  const nominalCost = costOf(usage, split.nominal);
  assert.equal(actual.cost, 0);
  assert.equal(nominalCost.cost, (1000 * 1 + 100000 * 0.02 + 2000 * 2) / 1e6);
  assert.equal(nominalCost.cost - actual.cost, nominalCost.cost);
  assert.equal(nominalCost.costUsd - actual.costUsd, nominalCost.costUsd);
});

//#region coding plan tests
test("coding plan route prices provider+model by official USD rate (default)", () => {
  const t = at("2026-08-18T10:00:00+08:00"); // DeepSeek peak window — must NOT affect coding plan
  // opencode-go glm-5.2: official USD 1.4/0.26/4.4 per 1M
  const p = priceAt("glm-5.2", t, { provider: "opencode-go" });
  assert.equal(p.pricingRoute, "coding");
  assert.equal(p.mode, "flat");
  assert.deepEqual(p.usd, { input: 1.4, cacheRead: 0.26, output: 4.4 });
  // CNY = USD × default rate, rounded to 6 decimals
  const rate = DEFAULT_CODING_USD_CNY_RATE;
  assert.equal(p.cny.input, Math.round(1.4 * rate * 1e6) / 1e6);
  assert.equal(p.cny.cacheRead, Math.round(0.26 * rate * 1e6) / 1e6);
  assert.equal(p.cny.output, Math.round(4.4 * rate * 1e6) / 1e6);
  assert.equal(p.policy.label, "OpenCode GO official");
});

test("coding plan route is independent of DeepSeek peak/off-peak policy", () => {
  const t = at("2026-08-18T10:00:00+08:00"); // DeepSeek peak hour
  // opencode-go deepseek-v4-flash has its own flat USD price; must NOT inherit peak
  const p = priceAt("deepseek-v4-flash", t, { provider: "opencode-go" });
  assert.equal(p.pricingRoute, "coding");
  assert.equal(p.mode, "flat");
  assert.deepEqual(p.usd, { input: 0.14, cacheRead: 0.0028, output: 0.28 });
  // qwen-token-plan subscription: flat 0 regardless of model
  const sub = priceAt("deepseek-v4-flash", t, { provider: "qwen-token-plan" });
  assert.equal(sub.pricingRoute, "subscription");
  assert.deepEqual(sub.cny, { input: 0, cacheRead: 0, output: 0 });
  assert.deepEqual(sub.usd, { input: 0, cacheRead: 0, output: 0 });
  assert.equal(sub.mode, "flat");
});

test("coding plan route: user's exact model override still wins", () => {
  const t = at("2026-08-18T10:00:00+08:00");
  const prices = {
    "glm-5.2": { cny: { input: 1, cacheRead: 0.1, output: 2 }, usd: { input: 0.1, cacheRead: 0.01, output: 0.2 } }
  };
  const p = priceAt("glm-5.2", t, { provider: "opencode-go", prices });
  assert.equal(p.pricingRoute, "user");
  assert.deepEqual(p.cny, { input: 1, cacheRead: 0.1, output: 2 });
  assert.deepEqual(p.usd, { input: 0.1, cacheRead: 0.01, output: 0.2 });
});

test("coding plan route: model not in a provider's table falls back to official policy", () => {
  const t = at("2026-08-18T10:00:00+08:00"); // DeepSeek peak
  // opencode-go does not list deepseek-reasoner → official chain governs
  const p = priceAt("deepseek-reasoner", t, { provider: "opencode-go" });
  assert.equal(p.pricingRoute, void 0);
  assert.deepEqual(cny(p), { input: 4, cacheRead: 1, output: 16 });
  // model in NO coding plan → official wildcard
  const unknown = priceAt("my-custom-model", t, { provider: "opencode-go" });
  assert.equal(unknown.pricingRoute, void 0);
  assert.deepEqual(cny(unknown), { input: 3, cacheRead: 0.1, output: 9 });
});

test("coding plan route: custom rate scales CNY only, USD untouched", () => {
  const t = at("2026-08-18T10:00:00+08:00");
  const rate = 7;
  const p = priceAt("minimax-m3", t, { provider: "opencode-go", codingUsdCnyRate: rate });
  assert.equal(p.pricingRoute, "coding");
  assert.equal(p.usd.input, 0.3);
  assert.equal(p.cny.input, 0.3 * rate);
});

test("codingPlanPriceAt: helper returns undefined for unknown provider/model and validates rate", () => {
  const t = at("2026-08-18T10:00:00+08:00");
  assert.equal(codingPlanPriceAt(void 0, "glm-5.2"), void 0);
  assert.equal(codingPlanPriceAt("opencode-go", "not-a-model"), void 0);
  const p = codingPlanPriceAt("opencode-go", "glm-5.2");
  assert.equal(p.pricingRoute, "coding");
});

test("sourceOf classifies by local/coding/subscription/official", () => {
  // local wins
  assert.equal(sourceOf("dgx-spark-vllm", "deepseek-v4-flash-0731-ablit", { localProviders: ["dgx-spark-vllm"] }), "local");
  // coding plan (kind coding)
  assert.equal(sourceOf("opencode-go", "glm-5.2", { localProviders: [] }), "coding");
  // subscription (kind subscription)
  assert.equal(sourceOf("qwen-token-plan", "deepseek-v4-flash", { localProviders: [] }), "subscription");
  // untracked provider → official
  assert.equal(sourceOf("deepseek-official", "deepseek-v4-flash", { localProviders: ["dgx-spark-vllm"] }), "official");
  // provider not in coding table → official even if name smells like model
  assert.equal(sourceOf("some-gateway", "glm-5.2", { localProviders: [] }), "official");
  // unknown / empty provider
  assert.equal(sourceOf(void 0, "m", { localProviders: [] }), "unknown");
  assert.equal(sourceOf("", "m", { localProviders: [] }), "unknown");
});

test("subscriptionUnitFor: subscription mode zeroes unit and keeps nominal", () => {
  const nominal = priceAt("deepseek-v4-flash", at("2026-08-10T10:00:00+08:00"), {});
  const metering = { "opencode-go": { mode: "subscription", monthly: 100 } };
  const split = subscriptionUnitFor("opencode-go", "glm-5.2", nominal, metering);
  assert.equal(split.metered, true);
  assert.equal(split.mode, "subscription");
  assert.equal(split.monthly, 100);
  assert.deepEqual(split.unit.cny, { input: 0, cacheRead: 0, output: 0 });
  assert.deepEqual(split.unit.usd, { input: 0, cacheRead: 0, output: 0 });
  assert.equal(split.nominal, nominal);
  // 未配置 / usage → 不接管
  const usage = subscriptionUnitFor("deepseek-official", "deepseek-v4-flash", nominal, metering);
  assert.equal(usage.metered, false);
  assert.equal(usage.unit, nominal);
  const none = subscriptionUnitFor("deepseek-official", "deepseek-v4-flash", nominal, {});
  assert.equal(none.metered, false);
  // free（活动免费）：同样 0 计费，mode=free
  const free = subscriptionUnitFor("bai", "deepseek-v4-flash", nominal, { bai: { mode: "free" } });
  assert.equal(free.metered, true);
  assert.equal(free.mode, "free");
  assert.deepEqual(free.unit.cny, { input: 0, cacheRead: 0, output: 0 });
  // local（本地部署）：0 计费，mode=local
  const local = subscriptionUnitFor("dgx-spark-vllm", "deepseek-v4-flash-0731-ablit", nominal, { "dgx-spark-vllm": { mode: "local" } });
  assert.equal(local.metered, true);
  assert.equal(local.mode, "local");
});

test("subscriptionUnitFor: usage-free zeroes only promo models, others stay usage", () => {
  const nominal = priceAt("deepseek-v4-flash", at("2026-08-10T10:00:00+08:00"), {});
  // 内置活动表：bai 的 deepseek-v4-flash 免费
  const metering = { bai: { mode: "usage-free" } };
  // 命中 promo → 白嫖
  const hit = subscriptionUnitFor("bai", "deepseek-v4-flash", nominal, metering);
  assert.equal(hit.metered, true);
  assert.equal(hit.mode, "usage-free");
  assert.equal(hit.freeHit, true);
  assert.deepEqual(hit.unit.cny, { input: 0, cacheRead: 0, output: 0 });
  // 未命中 promo → 按量
  const miss = subscriptionUnitFor("bai", "some-other-model", nominal, metering);
  assert.equal(miss.metered, false);
  assert.equal(miss.unit, nominal);
  // 用户 freeModels 覆盖内置
  const custom = subscriptionUnitFor("bai", "glm-5.2", nominal, { bai: { mode: "usage-free", freeModels: { "glm-5.2": true } } });
  assert.equal(custom.freeHit, true);
  const customMiss = subscriptionUnitFor("bai", "deepseek-v4-flash", nominal, { bai: { mode: "usage-free", freeModels: {} } });
  assert.equal(customMiss.freeHit, false);
});
//#endregion
