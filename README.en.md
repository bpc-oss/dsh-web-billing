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

> Token and cost figures are a **local DSH ledger**: only completed
> `assistant/message` events captured in this `$DSH_HOME` after the plugin was
> installed. They are not the official DeepSeek account invoice. The balance
> comes from `/user/balance`; reconcile usage across API keys and applications
> with the DeepSeek console Usage export.

| Mixed session (cloud + local) | Local-only session | Cloud-only session |
| --- | --- | --- |
| ![Mixed session panel](docs/screenshots/panel-mixed-en.png) | ![Local-only panel](docs/screenshots/panel-local-en.png) | ![Cloud-only panel](docs/screenshots/panel-cloud-en.png) |

- **Host side**: subscribes to `session/event` and prices each `assistant/message`
  that carries usage, using the message's own timestamp (policy + peak/off-peak
  phase at that moment). Ledger: `$DSH_HOME/storages/web-billing.json`.
  Also queries the official `GET /user/balance` with the provider's API key
  (60s refresh, silent degradation) and reports it with the billing state.
  **Self-hosted savings**: with `localProviders` configured, local model calls
  are valued at the official rate ("nominal value") while the actual cost is
  `localCostPerM` (default 0 = free); the difference is tracked as savings and
  shown in the UI (local messages show a "saved" chip).
- **Browser side**: the sidebar always shows the local DSH cost total, even when
  the current session has no ledger row, without competing with composer controls; each assistant
  message also gets a cost chip (hover shows token breakdown and model). The
  badge opens an expandable panel (session / today / month / total / **account balance** /
  **savings** / per-model, plus the active pricing mode).
- **Read-only endpoints** (loopback by default): `GET /billing/state`,
  `GET /billing/session/<id>`.

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
reference, ledger semantics, and development notes. Run only one `dsh web`
instance per `$DSH_HOME`.

## Develop

```powershell
npm run check   # syntax checks
npm test        # pricing engine unit tests (node:test, zero deps)
```

## Contributing / 贡献

PRs and issues are welcome (English or Chinese). This repository is maintained
**bilingually**: doc changes must update both `README.md` (Chinese) and
`README.en.md` (English), and config comments are bilingual. Full rules in
[CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
