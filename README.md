# dsh-web-billing

**简体中文** · [English](README.en.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/bpc-oss/dsh-web-billing?style=flat&label=stars&color=2563eb)](https://github.com/bpc-oss/dsh-web-billing/stargazers)
[![GitHub release](https://img.shields.io/github/v/release/bpc-oss/dsh-web-billing?label=release&color=16a34a)](https://github.com/bpc-oss/dsh-web-billing/releases)
[![dsh-plugin](https://img.shields.io/badge/dsh-plugin-16a34a)](https://github.com/topics/dsh-plugin)

DeepSeek Harness（`dsh web` / 桌面版）的 **人民币 / 美元 token 计费插件**：按官方政策自动计价
（内置政策时间表，含 2026-08-17 起的**峰谷定价**），逐条消息记账，实时显示账号余额，浏览器端
展示费用（界面语言自动切换 ¥ / $）。

**一句话**：你的 AI 花销「看得见、算得清、省得下」——官方价自动跟随、本地/订阅/白嫖精细化分类、
历史一键重估、预算与余额可视。

> ⚠️ 这里的 token 与费用是 **DSH 本地统计**：只包含本插件安装后、当前 `$DSH_HOME`
> 捕获到的已完成 `assistant/message` 事件。它不是 DeepSeek 账号的官方用量账单；
> 官方余额来自 `/user/balance`，跨 API key / 应用的消费核对请以 DeepSeek 控制台
> Usage 导出为准。

---

## 📸 界面一览

| 会话头部角标（悬停查看本会话明细） | 设置 → 费用 汇总页 |
| --- | --- |
| ![本会话角标](docs/screenshots/badge-session.png) | ![费用页概览](docs/screenshots/settings-overview.png) |

| 费用页 · Provider 收费形式 | 费用页 · 来源分组（按来源着色 + 语义色条） |
| --- | --- |
| ![收费形式](docs/screenshots/settings-sources.png) | ![来源分组](docs/screenshots/settings-metering.png) |

---

## ✨ 核心特性

### 1. 官方政策自动计价（峰谷跟随）

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

### 2. Coding plan 计费（DSH 预设全覆盖）

除了 DeepSeek 官方 API，你还可以在 DSH 里接入各种 **coding plan**（订阅制编码套餐），
如 `opencode-go` / `opencode` / `kimi-coding`，以及 qwen / xiaomi / z.ai 的 token 订阅包。
本插件内置**这些平台的全部官方美元单价**（取自 DeepSeek Harness 官方内置 pi-ai
catalog，见 `lib/coding-plans.js`），并按 **provider 路由**计价：

- **平台官方价**（`opencode-go` / `opencode` / `kimi-coding`）：每个模型的美元单价
  （$/1M）来自平台官方发布。人民币展示价 = 美元官方价 × `codingUsdCnyRate`
  （默认参考汇率 7.2，仅用于展示换算；**不影响 DeepSeek 官方价**——那有官方人民币
  价，不使用此汇率）。
- **订阅 token 包**（`qwen-token-plan`（含 `-cn`）/ `xiaomi-token-plan`（含
  `-ams`/`-cn`/`-sgp`）/ `zai-coding-cn`）：平台不公布逐 token 单价，属订阅额度
  内含，调用按 **0 元**计。
- **归属规则**：消息按 `(provider, model)` 双双命中对应平台表才走该路由；未命中
  的模型仍按 DeepSeek 官方政策链（含峰谷）计费。这样同一个模型名（如
  `glm-5.2`）在 opencode-go 下按 opencode 官方价、在直接 API 下按各自平台价，
  互不串价。
- **自动跟随官方**：价格表可由 `node scripts/sync-coding-plans.mjs` 从本机 DSH
  内置 catalog 重新生成——升级 DSH 后跑一次即可跟进官方最新价；来源版本（pi-ai
  版本 + 生成时间）会进入计价规则指纹，表变化后重启自动重估历史记录。

> 与 DeepSeek 官方价不同，coding plan 只有官方美元价，没有官方人民币价；人民币
> 金额是按 `codingUsdCnyRate` 的**参考换算**（可配置），美元金额恒为官方真值。

### 3. Provider 收费形式（metering）

每个 provider 可单独设置收费形式（设置 → 费用 → Provider 收费形式，**即时生效，无需重启**）：

| 模式 | 说明 |
|---|---|
| `usage` | 按量：按官方/平台价实算花费 |
| `usage-free` | 按量 + 可白嫖：默认按量，但命中**免费模型清单**的模型按 0 计（白嫖） |
| `subscription` | 订阅：月付固定费（`monthly`），调用按 0 计，官方名义价折算为「回本」 |
| `free` | 活动免费：调用按 0 计（真正白嫖） |
| `local` | 本地部署：调用按 0 计，省的是 API 钱 |

- **白嫖推荐**：费用页一行提示哪些 provider 有免费模型可白嫖（`openrouter` 17 / `nvidia` 16 /
  `opencode` 7 / `google` 2 / `huggingface` 1 / `mistral` 1 / `vercel-ai-gateway` 3，见 `lib/promo-models.js`，
  由 `scripts/sync-promo-models.mjs` 生成）；升级 DSH 后重跑脚本即可同步活动情报。
- **历史重估**：切换收费形式后**立即重估全部历史记录**（free/subscription/local
  的历史花费归零、按名义价折算节省），无需重启。
- **回本视角**：订阅 provider 的调用折算为「回本」（来源分组与浮层可见回本金额与月费）。

### 4. 费用页（设置 → 费用）

浏览器端汇总页（只读 + 少量即时设置）：

- **时间段筛选**：今日 / 本周 / 本月 / 近 30 天 / 全部 / 自定义起止日期，所有模块
  （概览 / 来源 / 模型 / 会话 / 历史）跟随所选范围；默认本月。
- **概览与来源构成**：范围主卡（花费 + **金色**合计节省 + 来源构成条）、今日 / 累计 /
  Token / 余额卡。
- **Token 统计**：总 token + 输入（未命中）/ 缓存命中 / 输出 分列，缓存命中率一目了然。
- **来源分组**：按「本地部署省 / 订阅回本 / 白嫖 / 按量」分组，各带语义色条与明细
  （纯节省按来源着色，真实付费保持中性）。
- **月度预算**：设每月预算（¥），进度条绿→琥珀→红、超支红色高亮；预算锁定本月。
- **右上角余额开关**：控制会话头部角标是否显示余额；设置页始终显示。
- **数据自检**：账本各口径一致性检查（integrity）与历史裁剪缺口（`bdpGap` /
  `repriceGap`）显式标注——缺口可见、金额可对账，绝不静默缩水。
- **导出**：CSV（UTF-8 BOM）/ JSON 一键下载账单。
- **会话标题**：会话列表显示标题而非 UUID。
- **版本与更新**：页面底部检测 GitHub 是否有新版本并链接。

> 聚合口径：范围明细基于最近流水窗口（`maxRecent`，默认 100000 条），更早的数据
> 为聚合级（日维度全量）。

### 5. 会话头部角标（右上角）

- **本会话今日 / 累计** 花费 + 节省（节省合计**金色**，与单项来源色区分）。
- **分模型统计**：每模型累计金额 + Input / 缓存命中率 / Output，provider 标签按来源着色
  （本地绿 / 白嫖天蓝 / 回本紫 / 按量灰）。
- **分模型缺口提示**：历史迁移/裁剪导致分模型合计小于会话总账时，浮层显示琥珀色
  提示（`分模型缺（已裁剪历史未计入）¥X`）——金额未丢失（完整在总账），仅该笔无法
  再按模型拆分；新产生的数据不会出现此提示。
- **余额行**（可开关）：官方账户余额。
- **DeepSeek 峰谷提示**：使用 DeepSeek 系列模型时显示当前高峰期 / 峰谷期（即空闲时段）。
- **浮层体验**：React portal 渲染（不被侧边栏遮挡）、跟随角标定位、不透明主题背景、悬停自动开合。

### 6. 账号余额

复用 provider 的 API key 调用官方 `GET /user/balance`（默认 60s 刷新、5s 超时），
CNY/USD 双币种随 `/billing/state` 返回。**瞬时失败不抹掉已验证余额**：网络抖动/
超时期间保留最近一次成功值（设置页副标题显示「余额来自最近一次成功查询（当前查询
失败，稍后自动重试）」），周期刷新自动重试；只有从未成功查询过才显示「不可用」。
运行时开关控制右上角显示（`balance.enabled` 或设置页切换，关闭即停止轮询、不再
使用 API key）。

### 7. 计价情报（当前单价与下一切换时刻）

`/billing/state` 的 `pricing` 字段随响应提供计价情报，客户端与外部工具可直接使用：

- `currentUnitPrices`：当前生效的官方模型单价（双币种 + 高峰/空闲模式）；
- `nextTransitionAt`：下一次峰谷或政策切换时刻（epoch ms；72 小时内探测，超出
  返回 `null`——实际因峰谷每日切换不会发生），由 `lib/pricing.js` 的
  `nextPricingTransition` 计算（先小时探测后二分到秒，可跨越未来政策生效点）；
- `observedAt` / `refreshIntervalMs`：观测时间与建议刷新间隔（1 小时）；
- `source`：价格来源（官方定价页链接）。

---

## 📦 安装

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
| `maxRecent` | `100000` | 最近流水保留条数（范围明细窗口） |
| `maxMessagesPerSession` | `2000` | 每会话消息明细保留条数 |
| `loopbackOnly` | `true` | `/billing` 端点仅允许回环地址访问 |
| `balance.enabled` | `true` | 是否查询并展示账号余额 |
| `balance.endpoint` | `https://api.deepseek.com/user/balance` | 余额接口地址（`DEEPSEEK_BASE_URL` 环境变量存在时以其为前缀） |
| `balance.apiKeyEnv` | `DEEPSEEK_API_KEY` | 解析 API key 的凭证引用（经 `ctx.credentials` 或环境变量） |
| `balance.refreshMs` | `60000` | 余额刷新间隔 |
| `balance.timeoutMs` | `5000` | 余额请求超时 |
| `metering` | `{}` | 静态收费形式表：`{ provider: { mode, monthly?, freeModels? } }`（运行时可在设置页改，存 `web-billing-metering.json`） |

单价字段语义：`input`=缓存未命中输入，`cacheRead`=缓存命中输入，`output`=输出
（¥ / 百万 tokens）。

## 记账正确性

- **幂等**：以 `(sessionId, messageId)` 为主键，重复/重放事件以第一次为准整体跳过
  （全局计数、会话聚合、明细全部只认第一次）。重启**不会**重放历史事件（dsh-session
  构造种子不发射），幂等防御的是进程内重复投递，且在消息明细保留窗口内有效。
- **按本地时区**统计「今日 / 本月」。
- **落盘**：1s 防抖 + 临时文件原子替换；加载失败从空账本开始并告警；进程退出
  时补一次 flush；账本过大（>20MB）时告警，建议调小 `maxRecent` /
  `maxMessagesPerSession`。
- **审计字段**：每条消息明细记录应用的单价（`unitPrice`）与计价模式（`mode`：
  `flat` / `peak` / `offPeak`）。
- **重估缺口**：改价/切换收费形式触发历史重估时，以保留的逐条记录（会话明细 ∪
  最近流水）为上限；被两处都裁剪掉的历史消息无法按新价重算，其旧价贡献会在重估后
  丢失——缺口随 `/billing/state` 的 `repriceGap` 显式返回并在费用页标注，不会静默缩水。
- **分模型缺口**：分模型聚合（`bySessionModel`）对历史迁移/回填可能少于会话总账
  （被裁剪且不在保留窗口的消息无法回填），差额由 `/billing/session/<id>` 的
  `modelGap` 返回并在浮层标注——金额不丢失，仅无法再按模型拆分归属。
- **余额只读**：余额查询只调用官方只读接口，不写任何数据；key 只存在于服务端
  解析链路，不下发浏览器。

## 开发

```powershell
npm run check   # 语法检查
npm test        # 定价引擎 / 余额 / 账本单元测试（node:test，无依赖）
node scripts/sync-coding-plans.mjs   # 从本机 DSH pi-ai catalog 重新生成 coding plan 价表
```

结构：

```
lib/pricing.js    定价引擎（纯函数：政策时间表 / 峰谷判定 / 覆盖合并 / coding plan 路由 / metering / 费用计算）
lib/coding-plans.js  DSH 预设 coding plan 官方美元价（由 scripts/sync-coding-plans.mjs 生成，勿手改）
lib/promo-models.js  免费模型情报（由 scripts/sync-promo-models.mjs 生成，勿手改）
lib/balance.js    账号余额（响应解析纯函数 + 带缓存/容错的抓取器）
lib/index.js      host 端：记账、账本、余额轮询、metering/预算/余额开关、/billing 路由（cordis 插件）
lib/client.js     浏览器端：会话角标、消息角标、设置→费用汇总页（手写 __ModuleLoader__ bundle，无需构建）
test/             单元测试
scripts/          sync-coding-plans.mjs / sync-promo-models.mjs（同步官方价表与免费模型情报）、安装脚本
```

浏览器端 bundle 为手写模块（与 DSH 官方 client 插件同格式），修改后**刷新页面 +
重启 `dsh web`** 生效；host 端修改需重启。

## 安全

- `/billing` 端点默认仅回环地址可访问（`loopbackOnly: true`）；需要从局域网查看
  时改为 `false`（与 GUI 其它路由一致，未做鉴权）。
- **POST 变更端点**（metering / budget / balance）额外做同源校验：浏览器跨站简单
  请求（text/plain POST）会携带 `Origin`，校验其与 `Host` 一致才放行；无 `Origin`
  的本地工具（curl 等）放行（回环守卫已限制来源地址）。
- 插件只读取 `session/event` 与提供只读端点，不修改任何会话数据。
- 账本仅存本地（`$DSH_HOME/storages/`），不含消息内容，永不外传。

## 贡献 / Contributing

欢迎 PR 与 Issue（中英皆可）。本仓库**中英双语维护**：文档改动需同步更新
`README.md`（中文）与 `README.en.md`（英文），配置注释双语；完整规范见
[CONTRIBUTING.md](CONTRIBUTING.md)。

## License

MIT
