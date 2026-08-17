# dsh-web-billing

[简体中文](README.md) · **English**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/bpc-oss/dsh-web-billing?style=flat&label=stars&color=2563eb)](https://github.com/bpc-oss/dsh-web-billing/stargazers)
[![GitHub release](https://img.shields.io/github/v/release/bpc-oss/dsh-web-billing?label=release&color=16a34a)](https://github.com/bpc-oss/dsh-web-billing/releases)
[![dsh-plugin](https://img.shields.io/badge/dsh-plugin-16a34a)](https://github.com/topics/dsh-plugin)

A RMB/USD token-billing plugin for the DeepSeek Harness web UI (`dsh web`).
Bills every LLM call automatically against the **official DeepSeek pricing
policy schedule** (including the peak/off-peak pricing effective 2026-08-17),
persists a ledger, shows the **account balance**, and renders live cost badges
in the browser — **displaying USD when the UI language is English**.

| Session badge (this session; hover for details) | Settings → Cost summary page |
| --- | --- |
| ![Session badge](docs/screenshots/badge-session-en.png) | ![Settings summary](docs/screenshots/settings-summary-en.png) |

- **Host side**: subscribes to `session/event` and prices each `assistant/message`
  that carries usage, using the message's own timestamp (policy + peak/off-peak
  phase at that moment). Ledger: `$DSH_HOME/storages/web-billing.json`.
  Also queries the official `GET /user/balance` with the provider's API key
  (60s refresh, silent degradation) and reports it with the billing state.
  **Self-hosted savings**: with `localProviders` configured, local model calls
  are valued at the official rate ("nominal value") while the actual cost is
  `localCostPerM` (default 0 = free); the difference is tracked as savings and
  shown in the UI (local messages show a "saved" chip).
- **Coding-plan billing**: ships the official USD prices for **every coding plan
  preset in DSH** (`opencode-go` / `opencode` / `kimi-coding` etc., sourced from
  the DeepSeek Harness official pi-ai catalog) and prices by **provider routing**
  — whichever coding plan and model you use, it is billed accurately instead of
  wrongly falling back to DeepSeek peak/off-peak prices.
- **Browser side**: a per-message cost chip in the assistant action strip and a
  session-header badge whose hover panel is **fully scoped to this session**:
  this session's today and cumulative cost/savings, per-model stats (cumulative
  amount per model + Input / cache-hit-rate / Output), and — when the session
  uses any DeepSeek-family model (official / local / coding-plan) — the current
  official peak/off-peak phase. Full aggregates — today / month / total /
  **account balance** / per-model / sessions / daily history — live on the
  **`Settings → Cost`** summary page.
- **Read-only endpoints** (loopback by default): `GET /billing/state`
  (supports `?range=...` time ranges), `GET /billing/session/<id>`;
  runtime settings: `POST /billing/metering`, `POST /billing/budget`,
  `POST /billing/balance` (loopback only).

## Pricing engine

`lib/pricing.js` ships a curated official policy schedule
(`OFFICIAL_PRICING_POLICIES`):

| Effective (Beijing) | Policy | Model prices (¥/1M; cache-hit / cache-miss / output) |
|---|---|---|
| 2025-02-09 | deepseek-chat / deepseek-reasoner standard | 0.5/2/8 · 1/4/16 |
| 2026-05-22 | V4 series 75% cut made permanent | v4-flash 0.02/1/2 · v4-pro 0.025/3/6 |
| 2026-08-17 | **Peak/off-peak** (peak 09:00-12:00 / 14:00-18:00 Beijing; off-peak = half) | see below |

Peak/off-peak prices (¥/1M):

| Model | Off-peak (cache-hit / miss / output) | Peak (cache-hit / miss / output) |
|---|---|---|
| deepseek-v4-flash | 0.05 / 1.5 / 4.5 | 0.10 / 3.0 / 9.0 |
| deepseek-v4-pro | 0.15 / 4.5 / 13.5 | 0.30 / 9.0 / 27.0 |

Semantics:

- **Priced by message time**: each message is billed with the policy and phase
  active at its completion time; new policies apply automatically.
- **Policy-chain inheritance**: a model not named by a newer policy keeps its
  last named price (historical bills stay consistent with the platform).
- **Self-healing**: when the schedule or config changes, the ledger is re-priced
  on restart using each record's stored token counts.
- **User overrides**: exact model entries in `prices` override the official
  table; `*` only fills models the official table never named.
  `officialPricing: off` uses only the user table.
- **Extensible**: append future official price changes via `policyOverrides`
  config — no code change needed (PRs to `lib/pricing.js` welcome).

> The schedule is curated from official announcements
> ([DeepSeek API Docs](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/));
> verify against the official page and send a PR if you spot drift.

## Coding-plan billing (full DSH preset coverage)

Besides the DeepSeek official API, you can connect various **coding plans**
(subscription coding bundles) in DSH, such as `opencode-go` / `opencode` /
`kimi-coding`, plus qwen / xiaomi / z.ai token subscription packs. This plugin
ships **the official USD prices for every model on these platforms** (sourced
from the DeepSeek Harness official pi-ai catalog, see `lib/coding-plans.js`),
and prices by **provider routing**:

- **Official platform prices** (`opencode-go` / `opencode` / `kimi-coding`): each
  model's USD price ($/1M) is published by the platform. The RMB display value =
  official USD price × `codingUsdCnyRate` (default reference rate 7.2; display
  conversion only — **DeepSeek's own prices have official CNY and never use this
  rate**).
- **Subscription token packs** (`qwen-token-plan` / `xiaomi-token-plan` /
  `zai-coding`): no per-token price is published; calls are within the
  subscription allowance and are billed at **0**.
- **Routing rule**: a message takes the coding-plan route only when both
  `(provider, model)` match that platform's table; anything else keeps the
  DeepSeek official policy chain (including peak/off-peak). The same model name
  (e.g. `glm-5.2`) is billed at opencode's official price under `opencode-go`
  and at each platform's own price under a direct API — never cross-priced.
- **Follows official automatically**: regenerate the price table any time from
  your local DSH catalog with `node scripts/sync-coding-plans.mjs`; the source
  version (pi-ai version + generated time) is part of the pricing fingerprint,
  so a table change re-prices history on restart.

> Unlike the DeepSeek official prices, coding plans have only official USD
> prices — the RMB figures are a **reference conversion** at
> `codingUsdCnyRate` (configurable); the USD figures are always the official
> truth.

### Provider metering (billing model)

Each provider can have its own billing model (Settings → Billing → Provider
metering, **takes effect immediately — no restart**):

| Mode | Meaning |
|---|---|
| `usage` | Pay-per-use: billed at the official/platform price |
| `usage-free` | Usage + free ride: pay-per-use, but models on the **free-model list** are billed at 0 |
| `subscription` | Subscription: fixed monthly fee (`monthly`), calls billed at 0, nominal value shown as "recovered" |
| `free` | Promo-free: calls billed at 0 (genuinely free) |
| `local` | Self-hosted: calls billed at 0 (you save the API cost) |

- **Free-ride picks**: the settings page lists every free model from the
  pi-ai catalog (`openrouter` / `nvidia` / `opencode` / `google` … cost=0 models,
  see `lib/promo-models.js`, generated by `scripts/sync-promo-models.mjs`) with
  one-click "enable usage+free"; re-run the script after upgrading DSH to sync
  promo data.
- **History re-pricing**: switching a billing model **immediately re-prices all
  history** (free/subscription/local records drop to 0 cost and become nominal
  savings) — no restart.
- **Recovery multiple**: subscription monthly fee vs cumulative recovered
  amount, shown as "cumulative recovery" on the settings page.

### Billing page (Settings → Billing)

The browser-side summary page (read-only plus a few immediate settings):

- **Time-range filter**: today / this week / this month / last 30 days / all /
  custom start-end; every module (overview / source / model / trend / sessions)
  follows the range; defaults to this month.
- **Overview & insights**: range card (cost + saved + source breakdown strip),
  today / total / balance cards, month-over-month change, cumulative recovery
  multiple, peak-hour share, range token totals, daily trend line chart.
- **Source groups**: local-saved / recovered / free-ride / usage / coding, each
  with a semantic color dot and detail rows.
- **Monthly budget**: set a ¥ monthly budget; progress bar green→amber→red with
  red over-budget highlight; budget stays locked to the current month.
- **Balance toggle**: turn balance querying/display on or off at runtime
  (immediate, no restart).
- **Export**: CSV (with UTF-8 BOM) / JSON one-click download.
- **Session titles**: session list shows titles instead of UUIDs.

> Aggregation note: range details come from the recent-ledger window
> (`maxRecent`, default 20000 records); older data is aggregate-level only
> (day totals are always full).

## Install

The plugin is a standard DSH **bundle** (`dsh.bundle.patch` → its own
`cordis.patch.yml`), following the official
[packaging guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md):

```powershell
# From GitHub
dsh plugin --profile web add github:<owner>/dsh-web-billing
# Or from npm (once published)
dsh plugin --profile web add dsh-web-billing
# Or link a local checkout (no copy; edits take effect on restart)
powershell -ExecutionPolicy Bypass -File scripts/install.ps1 -Profile web
```

Restart `dsh web` afterwards. See `README.md` (Chinese) for the full config
reference, ledger semantics, and development notes. To override the default
`codingUsdCnyRate: 7.2`, set it in your profile `cordis.patch.yml` alongside the
other keys (e.g. `codingUsdCnyRate: 7.05`). Run only one `dsh web` instance per
`$DSH_HOME`.

## Develop

```powershell
npm run check   # syntax checks
npm test        # pricing engine unit tests (node:test, zero deps)
node scripts/sync-coding-plans.mjs   # regenerate coding-plan prices from your DSH pi-ai catalog
```

Layout: `lib/pricing.js` (pricing engine incl. coding-plan route + metering),
`lib/coding-plans.js` (generated coding-plan prices),
`lib/promo-models.js` (generated free-model catalog), `lib/balance.js`,
`lib/index.js` (host: ledger, balance, metering/budget/balance toggle,
`/billing` routes), `lib/client.js`
(browser: session badge, message chip, Settings→Cost page; handwritten
bundle, no build step), `test/`, `scripts/`.

## Contributing / 贡献

PRs and issues are welcome (English or Chinese). This repository is maintained
**bilingually**: doc changes must update both `README.md` (Chinese) and
`README.en.md` (English), and config comments are bilingual. Full rules in
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
