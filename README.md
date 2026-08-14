# dsh-web-billing

DeepSeek Harness（`dsh web`）的人民币/美元 token 计费插件：**按官方政策自动计价**
（内置政策时间表，含 2026-08-17 起的峰谷定价），逐条消息记账，**实时显示账号余额**，
浏览器端展示费用（**界面语言自动切换 ¥/$**）。

- **记账（host 端）**：订阅 `session/event`，对每条带 usage 的 `assistant/message`
  按消息时刻取价计费（CNY 与 USD 双币种，官方美元价独立发布），账本持久化到
  `$DSH_HOME/storages/web-billing.json`。
- **账号余额（host 端）**：复用 provider 的 API key 调用官方 `GET /user/balance`
  （默认 60s 刷新、5s 超时、失败静默降级），CNY/USD 双币种随 `/billing/state` 返回。
- **展示（浏览器端）**：每条 assistant 消息动作条上的费用角标（悬停显示
  token 拆分与模型）；会话头部费用角标，点击展开 本会话 / 今日 / 本月 / 累计 /
  **账户余额** / 按模型 明细与当前计价方式。中文界面显示 ¥，英文界面显示 $，
  也可用 `displayCurrency` 强制指定。
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

### 1. 链接插件到 profile

```powershell
# 在仓库根目录执行
powershell -ExecutionPolicy Bypass -File scripts/install.ps1 -Profile web
```

该脚本把 `@dsh-local/dsh-web-billing` 以 junction 链接到
`$DSH_HOME/profiles/web/node_modules/` 下（不复制文件，改代码即生效）。

### 2. 启用插件

编辑 `$DSH_HOME/profiles/web/cordis.patch.yml`：

```yaml
- insert:
    - id: web-billing
      name: '@dsh-local/dsh-web-billing'
      config:
        currency: CNY
        symbol: '¥'
        # officialPricing: auto        # auto=官方政策自动计价（默认）；off=只用下方 prices
        # timezone: Asia/Shanghai      # 峰谷判定时区（默认）
        # peakWindows: [[9,12],[14,18]] # 高峰时段（默认）
        prices:                        # 可选：按模型覆盖官方价
          deepseek-v4-flash: { input: 1, cacheRead: 0.02, output: 2 }
        policyOverrides:               # 可选：追加官方政策时间表
          - since: '2026-09-01T00:00:00+08:00'
            label: 示例政策
            prices:
              deepseek-v4-flash: { input: 5, cacheRead: 0.1, output: 10 }
```

### 3. 重启 `dsh web`

```powershell
dsh web
```

> 同一 `$DSH_HOME` 下请只运行一个 `dsh web` 实例（多个实例会争写同一账本文件）。

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

## License

MIT
