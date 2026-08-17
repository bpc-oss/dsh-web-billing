/**
 * @dsh-local/dsh-web-billing — pricing engine.
 *
 * 纯函数定价模块：把「官方政策时间表 + 峰谷时段 + 用户覆盖」解析成某条消息
 * 在某一时刻应使用的单价（**双币种：CNY 与 USD**）。独立于账本与 HTTP，便于单元测试。
 *
 * 语义约定（与 DeepSeek 官方与 provider 适配器一致）：
 * - input      缓存未命中输入
 * - cacheRead  缓存命中输入
 * - output     输出
 * 单价单位：每 1M tokens，人民币（cny）与美元（usd）各一份；官方美元价由 DeepSeek
 * 独立发布，不是汇率换算。coding plan（opencode 等）只有官方美元价，人民币展示价
 * 由参考汇率 `codingUsdCnyRate` 换算（见 `priceAt` 的 `provider` 路由）。
 */

import { CODING_PLAN_PRICING as BUILTIN_CODING_PLANS } from "./coding-plans.js";
import { PROMO_MODELS as CATALOG_PROMO_MODELS } from "./promo-models.js";

/** 峰谷判定的默认时区（北京时间）。 */
export const DEFAULT_TIMEZONE = "Asia/Shanghai";

/** 官方高峰时段（本地小时，[start, end) 闭开区间）。 */
export const DEFAULT_PEAK_WINDOWS = [[9, 12], [14, 18]];

/** 零单价。 */
const ZERO_UNIT = Object.freeze({ input: 0, cacheRead: 0, output: 0 });

/** coding plan 美元单价的默认人民币参考汇率（$1 → ¥7.2）。无官方人民币价，仅作展示换算。 */
export const DEFAULT_CODING_USD_CNY_RATE = 7.2;

/**
 * 官方政策时间表（策展自 DeepSeek 官方公告；`since` 为生效时刻，含时区偏移）。
 * 每条政策要么是固定单价表（`prices`），要么是峰谷单价表（`peak`/`offPeak`）。
 * 每个模型条目的值为 `{ cny: {...}, usd: {...} }` 双币种单价。
 * 新政策通过追加条目生效——`since` 最晚且不晚于消息时间的政策胜出。
 * 官方未来调价后，请按公告补充条目（或通过插件配置的 `policyOverrides` 追加，
 * 无需改代码）。
 */
export const OFFICIAL_PRICING_POLICIES = [
  {
    since: "2025-02-09T00:00:00+08:00",
    label: "deepseek-chat / deepseek-reasoner 标准价（2025-02-09 优惠期结束）",
    prices: {
      "deepseek-chat": {
        cny: { input: 2, cacheRead: 0.5, output: 8 },
        usd: { input: 0.28, cacheRead: 0.028, output: 0.42 }
      },
      "deepseek-reasoner": {
        cny: { input: 4, cacheRead: 1, output: 16 },
        usd: { input: 0.55, cacheRead: 0.055, output: 1.68 }
      },
      "*": {
        cny: { input: 2, cacheRead: 0.5, output: 8 },
        usd: { input: 0.28, cacheRead: 0.028, output: 0.42 }
      }
    }
  },
  {
    since: "2026-05-22T00:00:00+08:00",
    label: "V4 系列 75% 降价转永久（deepseek-v4-flash / deepseek-v4-pro 上线）",
    prices: {
      "deepseek-v4-flash": {
        cny: { input: 1, cacheRead: 0.02, output: 2 },
        usd: { input: 0.14, cacheRead: 0.0028, output: 0.28 }
      },
      "deepseek-v4-pro": {
        cny: { input: 3, cacheRead: 0.025, output: 6 },
        usd: { input: 0.435, cacheRead: 0.003625, output: 0.87 }
      },
      "*": {
        cny: { input: 1, cacheRead: 0.02, output: 2 },
        usd: { input: 0.14, cacheRead: 0.0028, output: 0.28 }
      }
    }
  },
  {
    since: "2026-08-17T00:00:00+08:00",
    label: "峰谷定价：高峰 09:00-12:00 / 14:00-18:00（北京时间），空闲时段半价",
    peak: {
      "deepseek-v4-flash": {
        cny: { input: 3, cacheRead: 0.1, output: 9 },
        usd: { input: 0.44, cacheRead: 0.014, output: 1.32 }
      },
      "deepseek-v4-pro": {
        cny: { input: 9, cacheRead: 0.3, output: 27 },
        usd: { input: 1.32, cacheRead: 0.044, output: 3.96 }
      },
      "*": {
        cny: { input: 3, cacheRead: 0.1, output: 9 },
        usd: { input: 0.44, cacheRead: 0.014, output: 1.32 }
      }
    },
    offPeak: {
      "deepseek-v4-flash": {
        cny: { input: 1.5, cacheRead: 0.05, output: 4.5 },
        usd: { input: 0.22, cacheRead: 0.007, output: 0.66 }
      },
      "deepseek-v4-pro": {
        cny: { input: 4.5, cacheRead: 0.15, output: 13.5 },
        usd: { input: 0.66, cacheRead: 0.022, output: 1.98 }
      },
      "*": {
        cny: { input: 1.5, cacheRead: 0.05, output: 4.5 },
        usd: { input: 0.22, cacheRead: 0.007, output: 0.66 }
      }
    }
  }
];

/** 某时刻生效的官方政策（第一个 `since` 之前取第一条）。 */
export function activePolicy(timeMs, policies = OFFICIAL_PRICING_POLICIES) {
  let active = policies[0];
  for (const policy of policies) {
    const since = Date.parse(policy.since);
    if (Number.isFinite(since) && timeMs >= since) active = policy;
  }
  return active;
}

/** 该时刻是否处于高峰时段（按指定时区与窗口判定；窗口为 [start, end) 小时）。 */
export function isPeak(timeMs, timezone = DEFAULT_TIMEZONE, windows = DEFAULT_PEAK_WINDOWS) {
  let hour;
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour12: false,
      hour: "numeric",
      minute: "numeric"
    }).formatToParts(new Date(timeMs));
    hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0") % 24;
  } catch {
    // 非法时区等异常按非高峰处理，不阻断记账。
    hour = -1;
  }
  return windows.some(([start, end]) => hour >= start && hour < end);
}

/** 在单张价格表内取模型单价（含 `*` 兜底）。 */
export function priceFor(model, table) {
  return table[model] ?? table["*"] ?? { cny: ZERO_UNIT, usd: ZERO_UNIT };
}

/** 把两个币种的单价合并（后者的存在键覆盖前者）。 */
function mergeUnit(base, over) {
  return {
    cny: { ...base.cny, ...(over.cny ?? {}) },
    usd: { ...base.usd, ...(over.usd ?? {}) }
  };
}

/**
 * 用户覆盖合并：用户表里模型精确条目覆盖官方价；用户 `*` 只填补官方表未列出的
 * 模型（避免用户旧 `*` 意外压掉官方峰谷价）。覆盖条目已规范化为 {cny, usd}。
 */
export function resolvePrice(model, baseTable, overrideTable) {
  const override = overrideTable ?? {};
  const base = priceFor(model, baseTable);
  if (override[model] !== void 0) return mergeUnit(base, override[model]);
  if (baseTable[model] !== void 0) return base;
  const wildcard = override["*"];
  return wildcard === void 0 ? base : mergeUnit(base, wildcard);
}

/**
 * 按 provider 路由 coding plan 定价：provider + model 双命中时返回内置官方
 * （`kind === "coding"`：官方美元价 + 参考汇率换算人民币；`kind === "subscription"`：
 * 订阅 token 包，均为 0）。未命中返回 undefined（调用方继续走官方政策链）。
 * @param provider - provider 名。
 * @param model - 模型名。
 * @param codingPlans - coding plan 表（默认内置）。
 * @param codingUsdCnyRate - 美元→人民币参考汇率。
 * @returns { cny, usd, mode, policy, pricingRoute } | undefined。
 */
export function codingPlanPriceAt(provider, model, codingPlans = BUILTIN_CODING_PLANS, codingUsdCnyRate = DEFAULT_CODING_USD_CNY_RATE) {
  if (typeof provider !== "string" || provider.length === 0 || model === void 0) return void 0;
  const plan = codingPlans[provider];
  if (plan === void 0 || plan.models[model] === void 0) return void 0;
  const usdUnit = plan.models[model].usd;
  const rate = Number.isFinite(codingUsdCnyRate) && codingUsdCnyRate > 0 ? codingUsdCnyRate : DEFAULT_CODING_USD_CNY_RATE;
  const cnyUnit = plan.kind === "subscription"
    ? ZERO_UNIT
    : {
        input: round6(usdUnit.input * rate),
        cacheRead: round6(usdUnit.cacheRead * rate),
        output: round6(usdUnit.output * rate)
      };
  return {
    cny: cnyUnit,
    usd: usdUnit,
    mode: "flat",
    pricingRoute: plan.kind === "coding" ? "coding" : "subscription",
    policy: {
      since: "catalog",
      label: `${plan.label} official`,
      kind: plan.kind,
      provider,
      model
    }
  };
}

/** 保留 6 位小数（展示层级会进一步圆整；避免浮点长尾污染 hash 与账本）。 */
function round6(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 1e6) / 1e6;
}

/**
 * 计算某模型在某一时刻的单价（双币种）。
 *
 * 解析顺序（优先级从高到低）：
 * 0. 用户覆盖：用户表精确条目整体覆盖（对任一 route）；用户 `*` 只在无任何
 *    provider/model 命中后填补官方从未点名的模型。
 * 1. **coding plan 路由**：`provider` + `model` 双命中内置 coding plan 表 →
 *    用该平台的官方美元价（`kind: "coding"`，人民币按参考汇率换算）或
 *    `kind: "subscription"`（订阅 token 包，单价为 0）。该路由是平台特定的，
 *    与 DeepSeek 官方政策链互斥。
 * 2. 官方政策链：从新到旧遍历「不晚于消息时刻」的政策，取第一个**点名该模型**
 *    的政策单价（被新政策下架的模型自动沿用旧政策价格，历史账单才与平台一致）；
 *    没有任何政策点名 → 用最新适用政策的 `*` 兜底。
 * 3. 用户 `*`（仅当 model 从未被任何层点名时填补）。
 *
 * @param model - 模型名。
 * @param timeMs - 消息时间（epoch ms）。
 * @param opts - {
 *   official, prices(用户覆盖表，已规范化), timezone, peakWindows, policies,
 *   provider, codingPlans, codingUsdCnyRate
 * }。
 * @returns { cny, usd, mode, policy, pricingRoute? } — mode: 'flat' | 'peak' | 'offPeak'；
 *   pricingRoute: 'user' | 'coding' | 'subscription' | 'official'（仅在新路由时给出）。
 */
export function priceAt(model, timeMs, opts) {
  const {
    official = true,
    prices = {},
    timezone = DEFAULT_TIMEZONE,
    peakWindows = DEFAULT_PEAK_WINDOWS,
    policies = OFFICIAL_PRICING_POLICIES,
    provider,
    codingPlans = BUILTIN_CODING_PLANS,
    codingUsdCnyRate = DEFAULT_CODING_USD_CNY_RATE
  } = opts ?? {};
  // 优先级 0：用户精确条目永远最高（与 provider 无关）。
  if (prices[model] !== void 0) {
    const user = prices[model];
    return { cny: user.cny, usd: user.usd ?? user.cny, mode: "flat", pricingRoute: "user", policy: void 0 };
  }
  if (!official || policies.length === 0) {
    const fallback = priceFor(model, prices);
    return { cny: fallback.cny, usd: fallback.usd, mode: "flat", policy: void 0 };
  }
  // 优先级 1：coding plan 路由（平台特定价；不走 DeepSeek 峰谷链）。
  const coding = codingPlanPriceAt(provider, model, codingPlans, codingUsdCnyRate);
  if (coding !== void 0) return coding;
  const peak = isPeak(timeMs, timezone, peakWindows);
  const applicable = policies.filter((policy) => timeMs >= Date.parse(policy.since));
  const scope = applicable.length > 0 ? applicable : [policies[0]];
  let winner;
  let named = false;
  let baseTable;
  for (let index = scope.length - 1; index >= 0; index--) {
    const policy = scope[index];
    const table = policy.peak !== void 0 && policy.offPeak !== void 0
      ? (peak ? policy.peak : policy.offPeak)
      : policy.prices;
    if (table[model] !== void 0) {
      winner = policy;
      named = true;
      baseTable = table;
      break;
    }
  }
  if (winner === void 0) {
    winner = scope[scope.length - 1];
    baseTable = winner.peak !== void 0 && winner.offPeak !== void 0
      ? (peak ? winner.peak : winner.offPeak)
      : winner.prices;
  }
  const wildcard = prices["*"];
  const unit = named
    ? resolvePrice(model, baseTable, prices)
    : wildcard === void 0
      ? priceFor(model, baseTable)
      : mergeUnit(priceFor(model, baseTable), wildcard);
  return {
    cny: unit.cny,
    usd: unit.usd,
    mode: winner.peak !== void 0 && winner.offPeak !== void 0 ? (peak ? "peak" : "offPeak") : "flat",
    policy: { since: winner.since, label: winner.label }
  };
}

/** 按 TokenUsage 与单价计算费用（双币种）与 token 拆分。 */
export function costOf(usage, unit) {
  const inputTokens = usage.inputTokens ?? 0;
  const cacheReadTokens = usage.cacheReadTokens ?? 0;
  const outputTokens = usage.outputTokens ?? 0;
  const cost = (inputTokens * unit.cny.input + cacheReadTokens * unit.cny.cacheRead + outputTokens * unit.cny.output) / 1e6;
  const costUsd = (inputTokens * unit.usd.input + cacheReadTokens * unit.usd.cacheRead + outputTokens * unit.usd.output) / 1e6;
  return { inputTokens, cacheReadTokens, outputTokens, cost, costUsd };
}

/**
 * 把一条调用归入「来源类型」：local（自托管）/ coding（coding plan 平台官方价）/
 * subscription（订阅 token 包）/ official（直接官方 API，深色主类）/ unknown。
 * 该分类用于费用页的分组展示，与计价路由无关（计价仍走 pricingRoute）。
 * 优先级：local > coding > subscription > official。未知来源归 official（不把
 * 辅助调用丢入黑洞）。
 * @param provider - provider 名。
 * @param model - 模型名。
 * @param opts - { localProviders, codingPlans }。
 * @returns { source: 'local' | 'coding' | 'subscription' | 'official' | 'unknown' }。
 */
export function sourceOf(provider, model, opts) {
  const { localProviders = [], codingPlans = BUILTIN_CODING_PLANS } = opts ?? {};
  if (typeof provider !== "string" || provider.length === 0) return "unknown";
  if (Array.isArray(localProviders) && localProviders.includes(provider)) return "local";
  const plan = codingPlans[provider];
  if (plan !== void 0 && plan.models[model] !== void 0) {
    return plan.kind === "coding" ? "coding" : "subscription";
  }
  return "official";
}

/** 本地日期键（服务器时区）。 */
export function dayKey(time) {
  const d = new Date(time);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 本地月份键。 */
export function monthKey(time) {
  return dayKey(time).slice(0, 7);
}

/** 空计数（双币种 + 名义/节省）。 */
export function zeroCounts() {
  return {
    calls: 0,
    cost: 0,
    costUsd: 0,
    costNominal: 0,
    costNominalUsd: 0,
    savings: 0,
    savingsUsd: 0,
    inputTokens: 0,
    cacheReadTokens: 0,
    outputTokens: 0
  };
}

/** 把一次计费并入一个计数对象（双币种 + 名义/节省）。 */
export function addCounts(target, sample) {
  target.calls += 1;
  target.cost += sample.cost;
  target.costUsd += sample.costUsd;
  target.costNominal += sample.costNominal;
  target.costNominalUsd += sample.costNominalUsd;
  target.savings += sample.savings;
  target.savingsUsd += sample.savingsUsd;
  target.inputTokens += sample.inputTokens;
  target.cacheReadTokens += sample.cacheReadTokens;
  target.outputTokens += sample.outputTokens;
  return target;
}

/**
 * 本地/云端计价拆分：本地 provider 的调用「名义价值」按官方价计算（省了多少钱的
 * 参照），实际单价为 `localCostPerM`（默认 0 = 免费）。
 * @param provider - provider 名。
 * @param nominal - 官方/名义单价 { cny, usd }。
 * @param localProviders - 本地 provider 名单（数组）。
 * @param localCostPerM - 本地实际单价（¥/1M，统一作用于三类 token；美元价视为 0）。
 * @returns { unit, nominal, isLocal } — unit 为实际计价单价。
 */
export function unitForProvider(provider, nominal, localProviders, localCostPerM) {
  if (!Array.isArray(localProviders) || localProviders.length === 0 || !localProviders.includes(provider)) {
    return { unit: nominal, nominal, isLocal: false };
  }
  const rate = Number.isFinite(localCostPerM) && localCostPerM > 0 ? localCostPerM : 0;
  const local = {
    cny: { input: rate, cacheRead: rate, output: rate },
    usd: { input: 0, cacheRead: 0, output: 0 }
  };
  return { unit: local, nominal, isLocal: true };
}

/**
 * 内置「活动免费」情报：provider → 免费模型集合。这些模型本身有市场/官方价，
 * 但平台活动期间免费（如 B.AI 的 deepseek-v4-flash）。计费时命中 → 白嫖
 * （按官方价折算成节省）；未命中 → 按量。
 * 基础表由 `node scripts/sync-promo-models.mjs` 从 pi-ai catalog 自动提取
 * （lib/promo-models.js，覆盖 openrouter/nvidia/google/opencode 等按量 provider
 * 的免费模型）；B.AI 等非 catalog provider 在此手动补充。活动会变化——用户可在
 * metering 配置中用 freeModels 覆盖/扩展。
 */
export const PROMO_MODELS = Object.freeze({
  // B.AI（api.b.ai）：deepseek-v4-flash 活动免费（用户提供的信息）。
  bai: Object.freeze({
    "deepseek-v4-flash": true
  }),
  ...CATALOG_PROMO_MODELS
});

/** 0 单价（白嫖/回本/本地统一用）。 */
const ZERO_METER = Object.freeze({
  cny: { input: 0, cacheRead: 0, output: 0 },
  usd: { input: 0, cacheRead: 0, output: 0 }
});

/**
 * 按「provider 收费形式」（metering）拆分单价：
 * - mode "subscription"：月订阅 —— 调用一律按 0 计（订阅费已付，调用折算为「回本」）。
 * - mode "free"：活动免费 —— 调用一律按 0 计（白嫖，如 b.ai 全免费额度）。
 * - mode "local"：本地部署 —— 调用按 0 计（省的是 API 钱）。
 * - mode "usage-free"：按量 + 可白嫖 —— provider 默认按量；但命中
 *   `PROMO_MODELS`（或 metering 的 freeModels 覆盖）的模型按 0 计（白嫖）。
 * - mode "usage"（或未配置）：按名义价实算花费。
 * @param provider - provider 名。
 * @param model - 模型名（usage-free 判断白嫖时需要）。
 * @param nominal - 官方/名义单价。
 * @param metering - provider → { mode, monthly?, freeModels? }。
 * @param promos - 内置活动表（默认 PROMO_MODELS）。
 * @returns { unit, nominal, metered, mode, monthly, freeHit }。
 */
export function subscriptionUnitFor(provider, model, nominal, metering = {}, promos = PROMO_MODELS) {
  const rule = metering[provider];
  if (rule === void 0 || rule.mode === "usage") {
    return { unit: nominal, nominal, metered: false, mode: "usage", freeHit: false };
  }
  // usage-free：仅命中免费清单的模型按 0 计。
  if (rule.mode === "usage-free") {
    const freeModels = rule.freeModels ?? promos[provider];
    const freeHit = freeModels !== void 0 && freeModels[model] === true;
    if (freeHit) {
      return { unit: ZERO_METER, nominal, metered: true, mode: "usage-free", monthly: 0, freeHit: true };
    }
    return { unit: nominal, nominal, metered: false, mode: "usage-free", freeHit: false };
  }
  // subscription / free / local：一律 0。
  return {
    unit: ZERO_METER,
    nominal,
    metered: true,
    mode: rule.mode,
    monthly: Number.isFinite(rule.monthly) ? rule.monthly : 0,
    freeHit: rule.mode === "free"
  };
}
