/**
 * @dsh-local/dsh-web-billing — host face.
 *
 * 人民币 token 计费的记账端：订阅 `session/event`，对每一条带 usage 的
 * `assistant/message` 用定价引擎（官方政策时间表 + 峰谷时段 + 用户覆盖）计算
 * 人民币费用，累计到持久化账本（$DSH_HOME/storages/web-billing.json），并通过
 * webServer 暴露只读查询端点：
 *
 *   GET /billing/state         全局汇总（今日 / 本月 / 累计 / 按模型 / 最近流水 / 计价信息）
 *   GET /billing/session/<id>  单个会话的费用与逐条消息费用
 *
 * 特性：
 * - 官方政策自动计价：内置官方价格时间表（`lib/pricing.js` 的
 *   OFFICIAL_PRICING_POLICIES），含 2026-08-17 起的峰谷定价（高峰
 *   09:00-12:00 / 14:00-18:00 北京时间，空闲半价）；新政策生效时刻起自动切换，
 *   历史记录按各自消息时刻重新计价。
 * - 用户覆盖：config.prices 中模型精确条目覆盖官方价；`*` 只填补官方表未列出
 *   的模型。`officialPricing: off` 则完全使用用户价格表。
 * - 幂等记账：以 (sessionId, messageId) 为主键，重放/重启不重复累计。
 * - 改价自愈：配置或政策变化后，启动时按当前规则重估全部存量记录。
 * - 账号余额：用 provider 的 API key 查询官方 `/user/balance`（60s 缓存），
 *   随 /billing/state 返回，浏览器面板展示。
 */

import { rename, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import z from "@deepseek-ai/schemastery";
import { dshHomePath } from "@deepseek-ai/dsh-home-paths";
import { BalanceFetcher, DEFAULT_BALANCE_REFRESH_MS, DEFAULT_BALANCE_TIMEOUT_MS } from "./balance.js";
import {
  DEFAULT_PEAK_WINDOWS,
  DEFAULT_TIMEZONE,
  OFFICIAL_PRICING_POLICIES,
  activePolicy,
  addCounts,
  costOf,
  dayKey,
  isPeak,
  monthKey,
  nextPricingTransition,
  priceAt,
  unitForProvider,
  zeroCounts
} from "./pricing.js";

/** Stable Cordis plugin name. */
const name = "dsh-web-billing";

/** 单模型单价 schema。 */
const PRICE_SCHEMA = z.object({
  input: z.number().default(1),
  cacheRead: z.number().default(0.02),
  output: z.number().default(2)
});

/** 用户追加的官方政策条目（无需改代码即可扩展时间表；prices 与 peak+offPeak 至少给一组）。 */
const POLICY_OVERRIDE_SCHEMA = z.object({
  since: z.string().required(),
  label: z.string().default(""),
  prices: z.dict(PRICE_SCHEMA).default({}),
  peak: z.dict(PRICE_SCHEMA).default({}),
  offPeak: z.dict(PRICE_SCHEMA).default({})
});

const Config = z.object({
  currency: z.string().default("CNY"),
  symbol: z.string().default("¥"),
  /** 美元展示符号。 */
  symbolUsd: z.string().default("$"),
  /** auto=跟随界面语言（英文界面显示 USD）；CNY/USD=强制指定展示币种。 */
  displayCurrency: z.union([z.const("auto"), z.const("CNY"), z.const("USD")]).default("auto"),
  /** 峰谷时段判定的时区（IANA 名称）。 */
  timezone: z.string().default(DEFAULT_TIMEZONE),
  /** 高峰时段（本地小时，[start, end) 闭开区间）。 */
  peakWindows: z.array(z.tuple([z.number(), z.number()])).default(DEFAULT_PEAK_WINDOWS),
  /** auto=按内置官方政策时间表自动计价；off=只用 prices 表。 */
  officialPricing: z.union([z.const("auto"), z.const("off")]).default("auto"),
  /** 用户价格表：auto 模式下按模型覆盖官方价（`*` 只填补官方未列模型）；off 模式下为唯一价格表。 */
  prices: z.dict(PRICE_SCHEMA).default({}),
  /** 美元价覆盖（可选）：按模型覆盖官方美元价；未配置的模型美元价取 `prices` 同值。 */
  usdPrices: z.dict(PRICE_SCHEMA).default({}),
  /** 本地（自托管）provider 列表：这些 provider 的调用按官方价计算「名义价值」，
   *  实际成本按 `localCostPerM`（默认 0），差值即「节省」。 */
  localProviders: z.array(z.string()).default([]),
  /** 本地模型的实际单价（¥/1M，所有 token 统一；默认 0 即免费，可填电费/算力成本）。 */
  localCostPerM: z.number().min(0).default(0),
  /** 追加到官方时间表之后的政策（since 更晚者覆盖内置条目）。 */
  policyOverrides: z.array(POLICY_OVERRIDE_SCHEMA).default([]),
  /** 账本文件；默认落在 $DSH_HOME/storages 下。 */
  persistPath: z.string().default(dshHomePath("storages", "web-billing.json")),
  /** recent 流水保留条数。 */
  maxRecent: z.number().default(20000),
  /** 每个会话消息级明细保留条数。 */
  maxMessagesPerSession: z.number().default(2000),
  /** /billing 端点仅允许回环地址访问（默认开）。 */
  loopbackOnly: z.boolean().default(true),
  /** 账号余额展示（官方 /user/balance）。 */
  balance: z.object({
    enabled: z.boolean().default(true),
    /** 余额接口地址；默认官方地址（环境变量 DEEPSEEK_BASE_URL 存在时以其为前缀）。 */
    endpoint: z.string().default("https://api.deepseek.com/user/balance"),
    /** 解析 API key 用的凭证引用（环境变量名）。 */
    apiKeyEnv: z.string().default("DEEPSEEK_API_KEY"),
    refreshMs: z.number().min(1000).default(DEFAULT_BALANCE_REFRESH_MS),
    timeoutMs: z.number().min(100).default(DEFAULT_BALANCE_TIMEOUT_MS)
  }).default({})
});

/** 服务要求：webServer 提供查询端点。 */
const inject = ["webServer"];

/** 解析一条 policyOverride：空表跳过；峰谷政策要求 peak 与 offPeak 成对。 */
function normalizeOverride(policy) {
  const flat = Object.keys(policy.prices).length > 0
    ? { prices: normalizeUserPrices(policy.prices, {}) }
    : {};
  const peakPair = Object.keys(policy.peak).length > 0 && Object.keys(policy.offPeak).length > 0
    ? {
        peak: normalizeUserPrices(policy.peak, {}),
        offPeak: normalizeUserPrices(policy.offPeak, {})
      }
    : {};
  return {
    since: policy.since,
    ...policy.label !== "" ? { label: policy.label } : {},
    ...flat,
    ...peakPair
  };
}

/**
 * 把用户价格配置规范化为双币种覆盖表：`prices`（平铺）同时作用于两种币种，
 * `usdPrices` 只覆盖美元价。返回 { model: { cny: {...}, usd: {...} } }。
 */
function normalizeUserPrices(prices, usdPrices) {
  const normalized = {};
  for (const [model, flat] of Object.entries(prices)) {
    const usd = usdPrices[model] ?? flat;
    normalized[model] = { cny: flat, usd };
  }
  for (const [model, flat] of Object.entries(usdPrices)) {
    if (normalized[model] !== void 0) continue;
    normalized[model] = { cny: flat, usd: flat };
  }
  return normalized;
}

/** 组装完整的政策表（官方 + 用户追加，按 since 升序；无任何价格表的条目丢弃）。 */
function composePolicies(overrides) {
  return [...OFFICIAL_PRICING_POLICIES, ...overrides.map(normalizeOverride)]
    .filter((policy) => policy.prices !== void 0 || (policy.peak !== void 0 && policy.offPeak !== void 0))
    .sort((a, b) => Date.parse(a.since) - Date.parse(b.since));
}

/**
 * 持久化账本：聚合计数（累计 / 按模型 / 按日 / 按会话）+ 最近流水 + 每会话消息级明细。
 * 写盘做 1s 防抖 + 临时文件原子替换；加载失败时从空账本开始并告警。
 */
class BillingLedger {
  constructor(path, maxRecent, maxMessagesPerSession) {
    this.path = path;
    this.maxRecent = maxRecent;
    this.maxMessagesPerSession = maxMessagesPerSession;
    this.totals = zeroCounts();
    this.byModel = /* @__PURE__ */ new Map();
    this.byDay = /* @__PURE__ */ new Map();
    this.bySession = /* @__PURE__ */ new Map();
    this.recent = [];
    this.writeTimer = null;
    this.pendingWrite = null;
    this.pricingHash = "";
  }

  /** 从磁盘装载。 */
  load() {
    try {
      if (!existsSync(this.path)) return;
      const raw = JSON.parse(readFileSync(this.path, "utf8"));
      if (raw?.version !== 2 && raw?.version !== 1) return;
      this.totals = { ...zeroCounts(), ...raw.totals };
      this.byModel = new Map(Object.entries(raw.byModel ?? {}));
      this.byDay = new Map(Object.entries(raw.byDay ?? {}));
      this.bySession = new Map(Object.entries(raw.sessions ?? {}).map(([id, value]) => [id, {
        ...zeroCounts(),
        ...value,
        messages: new Map(Object.entries(value.messages ?? {}))
      }]));
      this.recent = Array.isArray(raw.recent) ? raw.recent : [];
      this.pricingHash = typeof raw.pricingHash === "string" ? raw.pricingHash : "";
    } catch (error) {
      // 账本损坏时从空账本开始，不阻断 web 启动。
      console.warn("[dsh-web-billing] ledger load failed, starting empty:", error?.message ?? error);
    }
  }

  /**
   * 计价规则变化后重估：以保留的逐条记录（会话消息明细 ∪ 最近流水）为唯一来源，
   * 按每条消息的时刻重新取价并重建全部聚合。规则未变时不做任何事。
   * @param pricing - { hash, at(model, timeMs) }。
   */
  reprice(pricing) {
    if (this.pricingHash === pricing.hash) return;
    const seen = /* @__PURE__ */ new Set();
    const entries = [];
    const push = (sessionId, messageId, record) => {
      const key = `${sessionId}\n${messageId}`;
      if (seen.has(key)) return;
      seen.add(key);
      entries.push(record);
    };
    for (const [sessionId, session] of this.bySession) {
      for (const [messageId, message] of session.messages) {
        push(sessionId, messageId, {
          sessionId,
          messageId,
          time: message.time,
          provider: message.provider,
          model: message.model,
          inputTokens: message.inputTokens,
          cacheReadTokens: message.cacheReadTokens,
          outputTokens: message.outputTokens
        });
      }
    }
    for (const entry of this.recent) push(entry.sessionId, entry.messageId, entry);
    this.totals = zeroCounts();
    this.byModel = /* @__PURE__ */ new Map();
    this.byDay = /* @__PURE__ */ new Map();
    this.bySession = /* @__PURE__ */ new Map();
    this.recent = [];
    for (const entry of entries) {
      this.record({ ...entry, ...this.price(entry.model, entry.provider, entry.time, entry, pricing) });
    }
    this.pricingHash = pricing.hash;
  }

  /** 按定价上下文计算一条消息的费用（实际 + 名义/节省，含应用的单价与模式）。 */
  price(model, provider, time, tokens, pricing) {
    const nominal = pricing.at(model, time);
    const split = unitForProvider(provider, nominal, pricing.localProviders, pricing.localCostPerM);
    const actual = costOf(tokens, split.unit);
    const nominalCost = costOf(tokens, split.nominal);
    return {
      ...actual,
      costNominal: nominalCost.cost,
      costNominalUsd: nominalCost.costUsd,
      savings: nominalCost.cost - actual.cost,
      savingsUsd: nominalCost.costUsd - actual.costUsd,
      isLocal: split.isLocal,
      unitPrice: { cny: split.unit.cny, usd: split.unit.usd },
      mode: nominal.mode
    };
  }

  /**
   * 记一笔。以 (sessionId, messageId) 为主键幂等：重复/重放事件只覆盖明细并撤销
   * 会话级旧计数，绝不重复累计全局计数（服务重启会重放历史事件，这是防重复累计的关键）。
   * @param entry - 含 sessionId/messageId/time/provider/model 与 cost 拆分。
   */
  record(entry) {
    let session = this.bySession.get(entry.sessionId);
    if (session === void 0) {
      session = { ...zeroCounts(), messages: /* @__PURE__ */ new Map() };
      this.bySession.set(entry.sessionId, session);
    }
    const previous = session.messages.get(entry.messageId);
    if (previous !== void 0) {
      // 重放/重复：撤销会话级旧计数（明细与全局计数都只认第一次）。
      session.calls -= 1;
      session.cost -= previous.cost;
      session.costUsd -= previous.costUsd;
      session.costNominal -= previous.costNominal;
      session.costNominalUsd -= previous.costNominalUsd;
      session.savings -= previous.savings;
      session.savingsUsd -= previous.savingsUsd;
      session.inputTokens -= previous.inputTokens;
      session.cacheReadTokens -= previous.cacheReadTokens;
      session.outputTokens -= previous.outputTokens;
    } else {
      addCounts(this.totals, entry);
      const model = entry.model || "unknown";
      let modelCounts = this.byModel.get(model);
      if (modelCounts === void 0) {
        modelCounts = zeroCounts();
        this.byModel.set(model, modelCounts);
      }
      addCounts(modelCounts, entry);
      const day = dayKey(entry.time);
      let dayCounts = this.byDay.get(day);
      if (dayCounts === void 0) {
        dayCounts = zeroCounts();
        this.byDay.set(day, dayCounts);
      }
      addCounts(dayCounts, entry);
      addCounts(session, entry);
      this.recent.push(entry);
      if (this.recent.length > this.maxRecent) this.recent.splice(0, this.recent.length - this.maxRecent);
    }
    session.messages.set(entry.messageId, {
      cost: entry.cost,
      costUsd: entry.costUsd,
      costNominal: entry.costNominal,
      costNominalUsd: entry.costNominalUsd,
      savings: entry.savings,
      savingsUsd: entry.savingsUsd,
      isLocal: entry.isLocal === true,
      model: entry.model,
      provider: entry.provider,
      time: entry.time,
      inputTokens: entry.inputTokens,
      cacheReadTokens: entry.cacheReadTokens,
      outputTokens: entry.outputTokens,
      unitPrice: entry.unitPrice,
      mode: entry.mode
    });
    if (session.messages.size > this.maxMessagesPerSession) {
      const oldest = [...session.messages.keys()].slice(0, session.messages.size - this.maxMessagesPerSession);
      for (const key of oldest) session.messages.delete(key);
    }
    this.scheduleWrite();
  }

  /** 防抖写盘（1s）。 */
  scheduleWrite() {
    if (this.writeTimer !== null) return;
    this.writeTimer = setTimeout(() => {
      this.writeTimer = null;
      this.pendingWrite ??= this.flush().finally(() => {
        this.pendingWrite = null;
      });
    }, 1000);
  }

  /** 立即落盘（进程退出前调用）。 */
  async flush() {
    if (this.pendingWrite !== null) return this.pendingWrite;
    const body = JSON.stringify({
      version: 2,
      pricingHash: this.pricingHash,
      totals: this.totals,
      byModel: Object.fromEntries(this.byModel),
      byDay: Object.fromEntries(this.byDay),
      sessions: Object.fromEntries([...this.bySession].map(([id, value]) => [id, {
        calls: value.calls,
        cost: value.cost,
        costUsd: value.costUsd,
        costNominal: value.costNominal,
        costNominalUsd: value.costNominalUsd,
        savings: value.savings,
        savingsUsd: value.savingsUsd,
        inputTokens: value.inputTokens,
        cacheReadTokens: value.cacheReadTokens,
        outputTokens: value.outputTokens,
        messages: Object.fromEntries(value.messages)
      }])),
      recent: this.recent
    });
    const tmp = `${this.path}.tmp`;
    await writeFile(tmp, body, "utf8");
    await rename(tmp, this.path);
  }

  /** 会话级公开视图。 */
  sessionView(id) {
    const session = this.bySession.get(id);
    if (session === void 0) return void 0;
    return {
      sessionId: id,
      calls: session.calls,
      cost: session.cost,
      costUsd: session.costUsd,
      costNominal: session.costNominal,
      costNominalUsd: session.costNominalUsd,
      savings: session.savings,
      savingsUsd: session.savingsUsd,
      inputTokens: session.inputTokens,
      cacheReadTokens: session.cacheReadTokens,
      outputTokens: session.outputTokens,
      messages: Object.fromEntries(session.messages)
    };
  }
}

/** 统一 JSON 响应。 */
function sendJson(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(body)
  });
  res.end(body);
}

/** 回环地址判定（IPv4 127/8、IPv6 ::1）。 */
function isLoopbackAddress(address) {
  if (address === "::1" || address === "::ffff:127.0.0.1" || address === "127.0.0.1") return true;
  if (typeof address === "string" && address.startsWith("127.")) {
    const octets = address.split(".");
    return octets.length === 4 && octets.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
  }
  return false;
}

/**
 * 应用插件：订阅会话事件记账，挂 /billing 查询路由。
 * @param ctx - plugin context carrying webServer。
 * @param config - validated {@link Config}。
 */
function apply(ctx, config) {
  const ledger = new BillingLedger(config.persistPath, config.maxRecent, config.maxMessagesPerSession);
  ledger.load();
  const policies = composePolicies(config.policyOverrides);
  const userPrices = normalizeUserPrices(config.prices, config.usdPrices);
  const pricing = {
    hash: JSON.stringify({
      officialPricing: config.officialPricing,
      timezone: config.timezone,
      peakWindows: config.peakWindows,
      prices: config.prices,
      usdPrices: config.usdPrices,
      policyOverrides: config.policyOverrides,
      localProviders: config.localProviders,
      localCostPerM: config.localCostPerM
    }),
    localProviders: config.localProviders,
    localCostPerM: config.localCostPerM,
    at: (model, time) => priceAt(model, time, {
      official: config.officialPricing === "auto",
      prices: userPrices,
      timezone: config.timezone,
      peakWindows: config.peakWindows,
      policies
    })
  };
  // 计价规则与账本记录不一致时，用当前规则重估全部存量记录（改价/政策切换后重启即修正历史）。
  ledger.reprice(pricing);
  const headersBySession = /* @__PURE__ */ new Map();

  // 账号余额：复用 provider 的凭证解析（credentials 服务 → 环境变量）。
  const balance = config.balance.enabled ? new BalanceFetcher({
    endpoint: process.env.DEEPSEEK_BASE_URL !== void 0 && process.env.DEEPSEEK_BASE_URL.trim() !== ""
      ? `${process.env.DEEPSEEK_BASE_URL.replace(/\/+$/, "")}/user/balance`
      : config.balance.endpoint,
    refreshMs: config.balance.refreshMs,
    timeoutMs: config.balance.timeoutMs,
    logger: ctx.logger,
    resolveKey: async () => {
      const ref = config.balance.apiKeyEnv;
      const credentials = ctx.get("credentials");
      if (credentials !== void 0) {
        try {
          const hit = await credentials.resolve(ref);
          if (hit?.value !== void 0 && hit.value.length > 0) return hit.value;
        } catch {
          // 凭证服务异常按未配置处理。
        }
      }
      const ambient = process.env[ref];
      return ambient !== void 0 && ambient.length > 0 ? ambient : void 0;
    }
  }) : null;
  balance?.start();

  ctx.on("session/event", (session, event) => {
    try {
      if (event?.type === "request/header" && event.data?.header?.config) {
        const header = event.data.header.config;
        if (typeof header.provider === "string" && typeof header.model === "string") {
          headersBySession.set(session.id, { provider: header.provider, model: header.model });
        }
        return;
      }
      if (event?.type !== "assistant/message") return;
      const data = event.data;
      if (data?.usage === void 0 || data.usage === null) return;
      const usage = data.usage;
      if (typeof usage.outputTokens !== "number" && typeof usage.inputTokens !== "number") return;
      const source = data.message?.source;
      const header = headersBySession.get(session.id);
      const provider = typeof source?.provider === "string" ? source.provider : header?.provider ?? "";
      const model = typeof source?.model === "string" ? source.model : header?.model ?? "unknown";
      ledger.record({
        sessionId: session.id,
        messageId: String(data.message?.id ?? `seq-${event.seq}`),
        seq: event.seq,
        time: event.time,
        provider,
        model,
        ...ledger.price(model, provider, event.time, usage, pricing)
      });
    } catch (error) {
      ctx.logger.warn(`[dsh-web-billing] record failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  const onSettle = () => {
    void ledger.flush().catch((error) => {
      ctx.logger.warn(`[dsh-web-billing] flush failed: ${error instanceof Error ? error.message : String(error)}`);
    });
  };
  const settled = ctx.get("loader")?.await();
  if (settled === void 0) onSettle();
  else settled.then(onSettle, () => {});

  ctx.effect(() => () => {
    // 卸载（进程退出）时把防抖中的账本落盘，并停止余额轮询。
    balance?.dispose();
    void ledger.flush().catch((error) => {
      ctx.logger.warn(`[dsh-web-billing] teardown flush failed: ${error instanceof Error ? error.message : String(error)}`);
    });
  }, "dsh-web-billing: teardown flush");

  ctx.effect(() => ctx.webServer.register({
    kind: "prefix",
    path: "/billing",
    handler: async (req, res) => {
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405);
        res.end();
        return;
      }
      if (config.loopbackOnly) {
        const address = req.socket.remoteAddress ?? "";
        if (!isLoopbackAddress(address)) {
          sendJson(res, 403, { ok: false, error: "loopback-only" });
          return;
        }
      }
      const pathname = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
      const tail = pathname.startsWith("/billing") ? pathname.slice("/billing".length) : "";
      if (tail === "/state" || tail === "") {
        const now = Date.now();
        const today = dayKey(now);
        const month = monthKey(now);
        const monthCounts = zeroCounts();
        for (const [key, counts] of ledger.byDay) if (key.startsWith(`${month}-`)) addCounts(monthCounts, counts);
        const topSessions = [...ledger.bySession.entries()]
          .map(([sessionId, value]) => ({
            sessionId,
            calls: value.calls,
            cost: value.cost,
            costUsd: value.costUsd,
            savings: value.savings,
            savingsUsd: value.savingsUsd
          }))
          .sort((a, b) => b.cost - a.cost)
          .slice(0, 50);
        const policy = activePolicy(now, policies);
        const peak = isPeak(now, config.timezone, config.peakWindows);
        const currentUnitPrices = ["deepseek-v4-flash", "deepseek-v4-pro"].map((model) => {
          const current = pricing.at(model, now);
          return { model, cny: current.cny, usd: current.usd, mode: current.mode };
        });
        sendJson(res, 200, {
          ok: true,
          currency: config.currency,
          symbol: config.symbol,
          symbolUsd: config.symbolUsd,
          displayCurrency: config.displayCurrency,
          pricing: {
            mode: config.officialPricing === "auto" ? "auto" : "custom",
            timezone: config.timezone,
            peakWindows: config.peakWindows,
            activePolicy: policy === void 0 ? null : {
              since: policy.since,
              label: policy.label,
              kind: policy.peak !== void 0 ? "peak-offpeak" : "flat"
            },
            effectiveNow: policy?.peak !== void 0 ? (peak ? "peak" : "offPeak") : "flat",
            observedAt: now,
            refreshIntervalMs: 60 * 60 * 1000,
            nextTransitionAt: nextPricingTransition(now, policies, config.timezone, config.peakWindows),
            source: "https://api-docs.deepseek.com/zh-cn/quick_start/pricing/",
            currentUnitPrices,
            userPriceModels: [...new Set([...Object.keys(config.prices), ...Object.keys(config.usdPrices)])]
          },
          totals: { ...ledger.totals },
          today: { date: today, ...(ledger.byDay.get(today) ?? zeroCounts()) },
          month: { key: month, ...monthCounts },
          byModel: Object.fromEntries([...ledger.byModel.entries()].sort((a, b) => b[1].cost - a[1].cost)),
          sessions: topSessions,
          recent: ledger.recent.slice(-20).reverse(),
          balance: balance === null ? { status: "disabled" } : balance.getSnapshot()
        });
        return;
      }
      const sessionMatch = /^\/session\/([^/]+)$/.exec(tail);
      if (sessionMatch !== null) {
        const view = ledger.sessionView(sessionMatch[1]);
        if (view === void 0) {
          sendJson(res, 404, { ok: false, error: "session-not-found" });
          return;
        }
        sendJson(res, 200, { ok: true, ...view });
        return;
      }
      sendJson(res, 404, { ok: false, error: "not-found" });
    }
  }), "dsh-web-billing: /billing routes");
}

//#endregion
export { Config, apply, inject, name };
