/**
 * @dsh-local/dsh-web-billing — account balance.
 *
 * DeepSeek 账号余额查询：调用官方 `GET /user/balance`（Bearer 鉴权），带缓存与
 * 容错。解析逻辑为纯函数（可单测），网络与定时器封装在 BalanceFetcher。
 *
 * 官方响应（金额均为字符串）：
 * {
 *   "is_available": true,
 *   "balance_infos": [{ "currency": "CNY", "total_balance": "110.00",
 *                       "granted_balance": "10.00", "topped_up_balance": "100.00" }]
 * }
 */

/** 抓取器默认刷新间隔（ms）。 */
export const DEFAULT_BALANCE_REFRESH_MS = 60_000;

/** 请求超时（ms）。 */
export const DEFAULT_BALANCE_TIMEOUT_MS = 5_000;

/** 数值化一个余额字符串；非法/缺失返回 0。 */
function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

/**
 * 解析余额接口响应（纯函数）：返回 CNY 与 USD 两份余额。
 * @param json - 反序列化后的响应体。
 * @returns { cny: 余额视图|null, usd: 余额视图|null }；两者皆缺时返回 null。
 */
export function parseBalanceResponse(json) {
  if (typeof json !== "object" || json === null || !Array.isArray(json.balance_infos)) return null;
  const infos = json.balance_infos.filter(
    (info) => typeof info === "object" && info !== null && typeof info.currency === "string"
  );
  if (infos.length === 0) return null;
  const pick = (currency) => {
    const info = infos.find((candidate) => candidate.currency === currency);
    if (info === void 0) return null;
    return {
      isAvailable: json.is_available === true,
      currency,
      total: toNumber(info.total_balance),
      granted: toNumber(info.granted_balance),
      toppedUp: toNumber(info.topped_up_balance)
    };
  };
  return { cny: pick("CNY"), usd: pick("USD") };
}

/** 初始视图。 */
const INITIAL_VIEW = Object.freeze({
  status: "idle",
  balance: void 0,
  error: null,
  updatedAt: void 0
});

/**
 * 余额抓取器：按固定间隔用 provider 的 API key 查询官方余额端点。
 * 任何失败（无 key、网络错误、响应不合法）都收敛为 error 视图，绝不抛出。
 */
export class BalanceFetcher {
  /**
   * @param deps - { resolveKey(): Promise<string|undefined>, endpoint, refreshMs, timeoutMs, logger }。
   */
  constructor(deps) {
    this.resolveKey = deps.resolveKey;
    this.endpoint = deps.endpoint;
    this.refreshMs = deps.refreshMs ?? DEFAULT_BALANCE_REFRESH_MS;
    this.timeoutMs = deps.timeoutMs ?? DEFAULT_BALANCE_TIMEOUT_MS;
    this.logger = deps.logger ?? console;
    this.view = INITIAL_VIEW;
    this.listeners = /* @__PURE__ */ new Set();
    this.timer = null;
    this.inFlight = null;
    this.disposed = false;
  }

  getSnapshot() {
    return this.view;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** 启动：立即刷新一次并开始周期刷新。 */
  start() {
    if (this.timer !== null) return;
    void this.refresh();
    this.timer = setInterval(() => {
      void this.refresh();
    }, this.refreshMs);
  }

  dispose() {
    this.disposed = true;
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
    this.listeners.clear();
  }

  publish(next) {
    if (this.disposed) return;
    this.view = next;
    for (const listener of [...this.listeners]) try {
      listener();
    } catch (error) {
      this.logger.warn?.("[dsh-web-billing] balance subscriber threw:", error);
    }
  }

  /** 立即刷新（并发去重）。 */
  async refresh() {
    if (this.inFlight !== null) return this.inFlight;
    this.publish({ ...this.view, status: this.view.status === "ready" ? this.view.status : "loading" });
    this.inFlight = this.fetchOnce()
      .then((balance) => {
        this.publish({ status: "ready", balance, error: null, updatedAt: Date.now() });
      })
      .catch((error) => {
        this.publish({
          status: "error",
          // A transient timeout or credentials-service hiccup must not erase
          // the last balance that was already proven by DeepSeek. Keep it as
          // a stale/cacheable value while the periodic refresh retries.
          balance: this.view.balance,
          error: error instanceof Error ? error.message : String(error),
          updatedAt: Date.now()
        });
      })
      .finally(() => {
        this.inFlight = null;
      });
    return this.inFlight;
  }

  async fetchOnce() {
    const key = await this.resolveKey();
    if (key === void 0 || key.length === 0) throw new Error("no-api-key");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(this.endpoint, {
        headers: {
          authorization: `Bearer ${key}`,
          accept: "application/json"
        },
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`HTTP ${String(response.status)}`);
      const balance = parseBalanceResponse(await response.json());
      if (balance === null) throw new Error("unexpected-balance-payload");
      return balance;
    } finally {
      clearTimeout(timer);
    }
  }
}
