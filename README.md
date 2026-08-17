# dsh-web-billing

**简体中文** · [English](README.en.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/bpc-oss/dsh-web-billing?style=flat&label=stars&color=2563eb)](https://github.com/bpc-oss/dsh-web-billing/stargazers)
[![GitHub release](https://img.shields.io/github/v/release/bpc-oss/dsh-web-billing?label=release&color=16a34a)](https://github.com/bpc-oss/dsh-web-billing/releases)
[![dsh-plugin](https://img.shields.io/badge/dsh-plugin-16a34a)](https://github.com/topics/dsh-plugin)

DeepSeek Harness（`dsh web`）的人民币/美元 token 计费插件：**按官方政策自动计价**
（内置政策时间表，含 2026-08-17 起的峰谷定价），逐条消息记账，**实时显示账号余额**，
浏览器端展示费用（**界面语言自动切换 ¥/$**）。

| 本会话角标（悬停查看明细） | 设置 → 费用汇总页 |
| --- | --- |
| ![本会话角标](docs/screenshots/badge-session.png) | ![设置汇总页](docs/screenshots/settings-summary.png) |

- **记账（host 端）**：订阅 `session/event`，对每条带 usage 的 `assistant/message`
  按消息时刻取价计费（CNY 与 USD 双币种，官方美元价独立发布），账本持久化到
  `$DSH_HOME/storages/web-billing.json`。
- **账号余额（host 端）**：复用 provider 的 API key 调用官方 `GET /user/balance`
  （默认 60s 刷新、5s 超时、失败静默降级），CNY/USD 双币种随 `/billing/state` 返回。
- **本地模型节省统计**：配置 `localProviders` 后，本地（自托管）模型的调用按官方
  价格计算「名义价值」，实际成本按 `localCostPerM`（默认 0 = 免费），差值即
  「已节省」——角标与设置页实时显示（本地消息角标显示 `省¥X`）。
- **Coding plan 计费**：内置 DSH 预设的全部 coding plan 官方美元价
  （`opencode-go` / `opencode` / `kimi-coding` 等，取自 DeepSeek Harness 官方内置
  catalog），按 **provider 路由定价**——用户无论用哪个 coding plan 的哪个模型，都能
  准确计费，不再错误套用 DeepSeek 峰谷价。
- **展示（浏览器端）**：每条 assistant 消息动作条上的费用角标；会话头部角标
  悬停浮层（**全部限定本会话**）显示 本会话今日 与 本会话累计 的花费/节省、本
  会话的分模型统计（每模型累计金额 + Input / 缓存命中率 / Output），以及使用
  DeepSeek 系列模型时当前的官方高峰期/峰谷期时段。完整全局汇总（今日 / 本月 / 累计 /
  账户余额 / 按模型 / 会话 / 按天历史）在 `设置 → 费用` 页。中文界面显示 ¥，英文
  界面显示 $，也可用
  `displayCurrency` 强制指定。
- **查询端点（只读，默认仅回环）**：`GET /billing/state`、`GET /billing/session/<id>`。

## 核心特性

### 官方政策自动计价

`lib/pricing.js` 内置官方价格时间表（`OFFICIAL_PRICING_POLICIES`），每条政策有
生效时刻（`since`）与单价表：

| 生效时刻（北京） | 政策 | 模型单价（¥/1M，缓存命中 / 未命中 / 输出） |
|---|---|---|
| 2025-02-09 | deepseek-chat / deepseek-reasoner 标准价 | 0.5/2/8 · 1/4/16 |
| 2026-05-22 | V4 系列 75% 降价转永久 | v4-flash 0.02/1/2 · v4-pro 0.025/3/6 |
| 2026-08-17 | **峰谷定价**（高峰 09:00-12:00 / 14:00-18:00 北京时间，空闲半价） | 见下表 |

峰谷价格（¥/1M）：

| 模型 | 空闲（缓存命中 / 未命中 / 输出） | 高峰（缓存命中 / 未命中 / 输出） |
|---|---|---|
| deepseek-v4-flash | 0.05 / 1.5 / 4.5 | 0.10 / 3.0 / 9.0 |
| deepseek-v4-pro | 0.15 / 4.5 / 13.5 | 0.30 / 9.0 / 27.0 |

计价语义：

- **按消息时刻取价**：每条消息按其完成时刻所属的政策与峰谷时段计费；新政策
  生效后自动切换，无需改配置。
- **政策链继承**：新政策未点名的模型沿用最近一次被点名的价格（下架模型的历史
  账单与平台一致）。
- **改价自愈**：政策表或配置变化后，重启时按当前规则重估全部存量记录（以每条
  消息记录的 token 数为准，不丢失历史）。
- **用户覆盖**：`prices` 中模型精确条目覆盖官方价；`*` 只填补官方从未点名的
  模型。`officialPricing: off` 则完全使用用户价格表。
- **可扩展时间表**：官方未来调价，通过 `policyOverrides` 在配置里追加政策即可，
  无需改代码（也欢迎向 `lib/pricing.js` 提交 PR）。

> ⚠️ 政策时间表策展自官方公告（[DeepSeek API Docs](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/)），
> 请以官方页面为准；发现偏差欢迎 PR 修正。

### Coding plan 计费（DSH 预设全覆盖）

除了 DeepSeek 官方 API，你还可以在 DSH 里接入各种 **coding plan**（订阅制编码套餐），
如 `opencode-go` / `opencode` / `kimi-coding`，以及 qwen / xiaomi / z.ai 的 token 订阅包。
本插件内置**这些平台的全部官方美元单价**（取自 DeepSeek Harness 官方内置 pi-ai
catalog，见 `lib/coding-plans.js`），并按 **provider 路由**计价：

- **平台官方价**（`opencode-go` / `opencode` / `kimi-coding`）：每个模型的美元单价
  （$/1M）来自平台官方发布。人民币展示价 = 美元官方价 × `codingUsdCnyRate`
  （默认参考汇率 7.2，仅用于展示换算；**不影响 DeepSeek 官方价**——那有官方人民币
  价，不使用此汇率）。
- **订阅 token 包**（`qwen-token-plan` / `xiaomi-token-plan` / `zai-coding`）：平台
  不公布逐 token 单价，属订阅额度内含，调用按 **0 元**计。
- **归属规则**：消息按 `(provider, model)` 双双命中对应平台表才走该路由；未命中
  的模型仍按 DeepSeek 官方政策链（含峰谷）计费。这样同一个模型名（如
  `glm-5.2`）在 opencode-go 下按 opencode 官方价、在直接 API 下按各自平台价，
  互不串价。
- **自动跟随官方**：价格表可由 `node scripts/sync-coding-plans.mjs` 从本机 DSH
  内置 catalog 重新生成——升级 DSH 后跑一次即可跟进官方最新价；来源版本（pi-ai
  版本 + 生成时间）会进入计价规则指纹，表变化后重启自动重估历史记录。

> 与 DeepSeek 官方价不同，coding plan 只有官方美元价，没有官方人民币价；人民币
> 金额是按 `codingUsdCnyRate` 的**参考换算**（可配置），美元金额恒为官方真值。

## 安装

插件是一个标准 **DSH 组合包（bundle）**（`dsh.bundle.patch` 指向包内
`cordis.patch.yml`），按官方[打包与安装指南](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.zh.md)
分发。三种安装方式：

```powershell
# 从 GitHub 安装（git 安装运行 prepare 构建；本包为纯 JS，无需构建，开箱即用）
dsh plugin --profile web add github:<owner>/dsh-web-billing

# 或从 npm 安装（发布后）
dsh plugin --profile web add dsh-web-billing

# 或本地开发：链接 checkout
powershell -ExecutionPolicy Bypass -File scripts/install.ps1 -Profile web
```

> git 安装时 pnpm ≥10 可能要求构建授权：把提示的包键加入 profile 的
> `pnpm-workspace.yaml` 的 `allowBuilds` 后重试（本包没有 `prepare` 构建，
> 通常无需授权）。

安装后**重启 `dsh web`** 生效。同一 `$DSH_HOME` 下请只运行一个实例（多个实例
会争写同一账本文件）。

需要覆盖默认配置时，在 `$DSH_HOME/profiles/web/cordis.patch.yml` 按 id 覆写整行
（覆盖会替换整份 config，需重述所有键）：

## 配置参考

| 键 | 默认 | 说明 |
|---|---|---|
| `currency` | `CNY` | 币种标识 |
| `symbol` | `¥` | 人民币展示符号 |
| `symbolUsd` | `$` | 美元展示符号 |
| `displayCurrency` | `auto` | `auto`=跟随界面语言（英文界面显示 USD）；`CNY`/`USD`=强制指定 |
| `timezone` | `Asia/Shanghai` | 峰谷时段判定时区（IANA） |
| `peakWindows` | `[[9,12],[14,18]]` | 高峰时段（本地小时，`[start,end)`） |
| `officialPricing` | `auto` | `auto`=官方政策自动计价；`off`=只用 `prices` |
| `prices` | `{}` | 用户价格表（覆盖/兜底，单位 ¥/1M，同时作用于美元价） |
| `usdPrices` | `{}` | 美元价覆盖（可选，单位 $/1M） |
| `localProviders` | `[]` | 本地（自托管）provider 名单：调用按官方价计「名义价值」，实际成本按 `localCostPerM`，差值计入「已节省」 |
| `localCostPerM` | `0` | 本地模型实际单价（¥/1M，所有 token 统一；默认 0 = 免费，可填电费/算力成本） |
| `codingUsdCnyRate` | `7.2` | coding plan 美元价的参考人民币汇率（$→¥，仅展示换算；DeepSeek 官方价不受影响） |
| `policyOverrides` | `[]` | 追加的官方政策条目（`since` 必填，`prices` 或 `peak`+`offPeak`） |
| `persistPath` | `~/.dsh/storages/web-billing.json` | 账本文件路径 |
| `maxRecent` | `20000` | 最近流水保留条数 |
| `maxMessagesPerSession` | `2000` | 每会话消息明细保留条数 |
| `loopbackOnly` | `true` | `/billing` 端点仅允许回环地址访问 |
| `balance.enabled` | `true` | 是否查询并展示账号余额 |
| `balance.endpoint` | `https://api.deepseek.com/user/balance` | 余额接口地址（`DEEPSEEK_BASE_URL` 环境变量存在时以其为前缀） |
| `balance.apiKeyEnv` | `DEEPSEEK_API_KEY` | 解析 API key 的凭证引用（经 `ctx.credentials` 或环境变量） |
| `balance.refreshMs` | `60000` | 余额刷新间隔 |
| `balance.timeoutMs` | `5000` | 余额请求超时 |

单价字段语义：`input`=缓存未命中输入，`cacheRead`=缓存命中输入，`output`=输出
（¥ / 百万 tokens）。

## 记账正确性

- **幂等**：以 `(sessionId, messageId)` 为主键，重复/重放事件只覆盖明细，绝不
  重复累计（多进程、多次重启实测验证）。
- **按本地时区**统计「今日 / 本月」。
- **落盘**：1s 防抖 + 临时文件原子替换；加载失败从空账本开始并告警；进程退出
  时补一次 flush。
- **审计字段**：每条消息明细记录应用的单价（`unitPrice`）与计价模式（`mode`：
  `flat` / `peak` / `offPeak`）。
- **余额只读**：余额查询只调用官方只读接口，不写任何数据；key 只存在于服务端
  解析链路，不下发浏览器。

## 开发

```powershell
npm run check   # 语法检查
npm test        # 定价引擎 + 余额解析单元测试（node:test，无依赖）
```

结构：

```
lib/pricing.js    定价引擎（纯函数：政策时间表 / 峰谷判定 / 覆盖合并 / coding plan 路由 / 费用计算）
lib/coding-plans.js  DSH 预设 coding plan 官方美元价（由 scripts/sync-coding-plans.mjs 生成，勿手改）
lib/balance.js    账号余额（响应解析纯函数 + 带缓存/容错的抓取器）
lib/index.js      host 端：记账、账本、余额轮询、/billing 路由（cordis 插件）
lib/client.js     浏览器端：会话角标、消息角标、设置→费用汇总页（手写 __ModuleLoader__ bundle，无需构建）
test/             单元测试
scripts/          sync-coding-plans.mjs（从 DSH pi-ai catalog 同步 coding plan 价表）、安装脚本
```

浏览器端 bundle 为手写模块（与 DSH 官方 client 插件同格式），修改后**刷新页面 +
重启 `dsh web`** 生效；host 端修改需重启。

## 安全

- `/billing` 端点默认仅回环地址可访问（`loopbackOnly: true`）；需要从局域网查看
  时改为 `false`（与 GUI 其它路由一致，未做鉴权）。
- 插件只读取 `session/event` 与提供只读端点，不修改任何会话数据。

## 贡献 / Contributing

欢迎 PR 与 Issue（中英皆可）。本仓库**中英双语维护**：文档改动需同步更新
`README.md`（中文）与 `README.en.md`（英文），配置注释双语；完整规范见
[CONTRIBUTING.md](CONTRIBUTING.md)。

## License

MIT
