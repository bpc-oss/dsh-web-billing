/**
 * Minimal type declarations for dsh-web-billing (pure-JS plugin).
 * The plugin ships plain JavaScript; these declarations give TS consumers
 * the public surface (Cordis plugin shape + ledger helpers) without a build.
 */

/** Plugin stable name. */
export const name: "dsh-web-billing";

/** Required services. */
export const inject: ["webServer"];

/** Validated config schema (schemastery); pass raw user config through apply(). */
export const Config: unknown;

/**
 * Cordis plugin entry.
 * @param ctx - plugin context carrying `webServer` (and optional settings/credentials/loader).
 * @param config - validated {@link Config} value.
 */
export function apply(ctx: unknown, config: Record<string, unknown>): void;

/**
 * Persistent billing ledger: aggregates (totals / byModel / byProvider /
 * byDay / byDayProvider / bySessionModel / sessions) + recent ledger +
 * per-session message details. Writes are debounced (1s) and atomic.
 */
export class BillingLedger {
  constructor(path: string, maxRecent: number, maxMessagesPerSession: number);
  load(): void;
  reprice(pricing: unknown): void;
  record(entry: Record<string, unknown>): void;
  flush(): Promise<void>;
  sessionView(id: string): Record<string, unknown> | undefined;
}
