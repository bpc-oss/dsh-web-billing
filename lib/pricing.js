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
 * 独立发布，不是汇率换算。
 */

/** 峰谷判定的默认时区（北京时间）。 */
export const DEFAULT_TIMEZONE = "Asia/Shanghai";

/** 官方高峰时段（本地小时，[start, end) 闭开区间）。 */
export const DEFAULT_PEAK_WINDOWS = [[9, 12], [14, 18]];

/** 零单价。 */
const ZERO_UNIT = Object.freeze({ input: 0, cacheRead: 0, output: 0 });

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

/** 当前政策与峰谷阶段的稳定标识，用于寻找下一次价格切换。 */
function pricingPhaseKey(timeMs, policies, timezone, windows) {
  const policy = activePolicy(timeMs, policies);
  if (policy === void 0) return "none";
  const mode = policy.peak !== void 0 && policy.offPeak !== void 0
    ? (isPeak(timeMs, timezone, windows) ? "peak" : "offPeak")
    : "flat";
  return `${policy.since}\n${mode}`;
}

/**
 * 返回下一次政策或峰谷阶段切换时刻。先按小时探测，再二分到秒；因此既能跨越
 * 未来政策生效点，也不会假设时区固定为 UTC+8。找不到时返回 null。
 */
export function nextPricingTransition(
  timeMs,
  policies = OFFICIAL_PRICING_POLICIES,
  timezone = DEFAULT_TIMEZONE,
  windows = DEFAULT_PEAK_WINDOWS
) {
  const current = pricingPhaseKey(timeMs, policies, timezone, windows);
  let lower = timeMs;
  for (let hour = 1; hour <= 72; hour++) {
    const upper = timeMs + hour * 60 * 60 * 1000;
    if (pricingPhaseKey(upper, policies, timezone, windows) === current) {
      lower = upper;
      continue;
    }
    let left = lower;
    let right = upper;
    while (right - left > 1000) {
      const middle = Math.floor((left + right) / 2);
      if (pricingPhaseKey(middle, policies, timezone, windows) === current) left = middle;
      else right = middle;
    }
    // 内置政策和峰谷窗口均在整秒边界切换；归一化掉二分留下的亚秒误差。
    return Math.floor(right / 1000) * 1000;
  }
  return null;
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
 * 计算某模型在某一时刻的单价（双币种）。
 *
 * 解析顺序（政策链继承）：
 * 1. 从新到旧遍历「不晚于消息时刻」的政策，取第一个**点名该模型**的政策单价
 *    （被新政策下架的模型自动沿用旧政策价格，历史账单才与平台一致）；
 * 2. 没有任何政策点名 → 用最新适用政策的 `*` 兜底；
 * 3. 用户覆盖：用户表精确条目覆盖官方价；用户 `*` 只填补官方从未点名的模型。
 *
 * @param model - 模型名。
 * @param timeMs - 消息时间（epoch ms）。
 * @param opts - { official, prices(用户覆盖表，已规范化), timezone, peakWindows, policies }。
 * @returns { cny, usd, mode, policy } — mode: 'flat' | 'peak' | 'offPeak'。
 */
export function priceAt(model, timeMs, opts) {
  const {
    official = true,
    prices = {},
    timezone = DEFAULT_TIMEZONE,
    peakWindows = DEFAULT_PEAK_WINDOWS,
    policies = OFFICIAL_PRICING_POLICIES
  } = opts ?? {};
  if (!official || policies.length === 0) {
    const fallback = priceFor(model, prices);
    return { cny: fallback.cny, usd: fallback.usd, mode: "flat", policy: void 0 };
  }
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
