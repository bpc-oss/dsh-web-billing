# dsh-web-billing

**简体中文** · [English](README.en.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/bpc-oss/dsh-web-billing?style=flat&label=stars&color=2563eb)](https://github.com/bpc-oss/dsh-web-billing/stargazers)
[![GitHub release](https://img.shields.io/github/v/release/bpc-oss/dsh-web-billing?label=release&color=16a34a)](https://github.com/bpc-oss/dsh-web-billing/releases)
[![dsh-plugin](https://img.shields.io/badge/dsh-plugin-16a34a)](https://github.com/topics/dsh-plugin)

DeepSeek Harness（`dsh web`）的人民币/美元 token 计费插件：**按官方政策自动计价**
（内置政策时间表，含 2026-08-17 起的峰谷定价），逐条消息记账，**实时显示账号余额**，
浏览器端展示费用（**界面语言自动切换 ¥/$**）。

> 这里的 token 与费用是 **DSH 本地统计**：只包含本插件安装后、当前
> `$DSH_HOME` 捕获到的已完成 `assistant/message`。它不是 DeepSeek 账号的官方
> 用量账单；官方余额来自 `/user/balance`，而跨 API key / 应用的消费核对应以
> DeepSeek 控制台 Usage 导出为准。

| 混合会话（云端+本地） | 纯本地会话 | 纯云端会话 |
| --- | --- | --- |
| ![混合会话面板](docs/screenshots/panel-mixed.png) | ![纯本地面板](docs/screenshots/panel-local.png) | ![纯云端面板](docs/screenshots/panel-cloud.png) |

- **记账（host 端）**：订阅 `session/event`，对每条带 usage 的 `assistant/message`
  按消息时刻取价计费（CNY 与 USD 双币种，官方美元价独立发布），账本持久化到
  `$DSH_HOME/storages/web-billing.json`。
- **账号余额（host 端）**：复用 provider 的 API key 调用官方 `GET /user/balance`
  （默认 60s 刷新、5s 超时、瞬时失败保留最近一次已验证余额），CNY/USD 双币种随
  `/billing/state` 返回。
- **本地模型节省统计**：配置 `localProviders` 后，本地（自托管）模型的调用按官方
  价格计算「名义价值」，实际成本按 `localCostPerM`（默认 0 = 免费），差值即
  「已节省」——面板与消息角标实时显示（本地消息角标显示 `省¥X`）。
- **展示（浏览器端）**：左侧栏始终显示 DSH 本地累计费用，即使当前会话尚未产生
  记账记录，避免与输入区的权限、模型和发送控件争抢空间；每条 assistant 消息动作条也有费用角标（悬停显示
  token 拆分与模型）。点击费用角标展开 本会话 / 今日 / 本月 / 累计 /
  **账户余额** / **已节省** / 按模型 明细与当前计价方式。中文界面显示 ¥，英文
  界面显示 $，也可用 `displayCurrency` 强制指定。
- **当前峰谷提示**：面板列出 V4 Flash/Pro 当前“固定价 / 高峰 / 空闲”状态、缓存
  命中/未命中/输出单价与下一切换时间；状态至少每小时自动刷新，账本轮询期间也会
  及时更新。
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

- **统计范围**：只统计当前 DSH host 实际收到且带 usage 的完成消息；安装前调用、
  其他 `$DSH_HOME`、其他程序或 API key 的调用不会进入本地账本，因此不能拿本地
  合计直接替代 DeepSeek 官网账单。

- **幂等**：以 `(sessionId, messageId)` 为主键，重复/重放事件只覆盖明细，绝不
  重复累计（多进程、多次重启实测验证）。
- **按本地时区**统计「今日 / 本月」。
- **落盘**：1s 防抖 + 临时文件原子替换；加载失败从空账本开始并告警；进程退出
  时补一次 flush。
- **审计字段**：每条消息明细记录应用的单价（`unitPrice`）与计价模式（`mode`：
  `flat` / `peak` / `offPeak`）。
- **余额只读**：余额查询只调用官方只读接口，不写任何数据；key 只存在于服务端
  解析链路，不下发浏览器。初次查询显示“查询中”，瞬时失败显示缓存值，不再把这
  两种状态误报成“官方余额不可用”。

## 开发

```powershell
npm run check   # 语法检查
npm test        # 定价引擎 + 余额解析单元测试（node:test，无依赖）
```

结构：

```
lib/pricing.js   定价引擎（纯函数：政策时间表 / 峰谷判定 / 覆盖合并 / 费用计算）
lib/balance.js   账号余额（响应解析纯函数 + 带缓存/容错的抓取器）
lib/index.js     host 端：记账、账本、余额轮询、/billing 路由（cordis 插件）
lib/client.js    浏览器端：费用角标与面板（手写 __ModuleLoader__ bundle，无需构建）
test/            单元测试
scripts/         安装脚本
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
