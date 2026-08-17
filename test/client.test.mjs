import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'

const CLIENT_URL = new URL('../lib/client.js', import.meta.url)
const PACKAGE_URL = new URL('../package.json', import.meta.url)

test('declares the client owners required before billing registers conversation slots', async () => {
  const manifest = JSON.parse(await readFile(PACKAGE_URL, 'utf8'))
  assert.deepEqual(manifest.dsh.client.inject, [
    '@deepseek-ai/dsh-client-locale',
    '@deepseek-ai/dsh-client-ui-conversation',
    '@deepseek-ai/dsh-client-ui-sidebar',
  ])
})

function textOf(value) {
  if (value === null || value === undefined || typeof value === 'boolean') return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(textOf).join('')
  return textOf(value.props?.children)
}

async function loadBadge({ open = false } = {}) {
  const source = await readFile(CLIENT_URL, 'utf8')
  let exported
  let Badge
  let dictionaries
  const jsx = (type, props, key) => ({ type, props: props ?? {}, key })
  const react = {
    Fragment: Symbol('Fragment'),
    useEffect: () => {},
    useRef: value => ({ current: value }),
    useState: value => [typeof value === 'boolean' ? open : value, () => {}],
  }
  const context = {
    console,
    clearInterval: () => {},
    fetch: async () => ({ ok: false }),
    setInterval: () => 1,
    window: {
      __ModuleLoader__: {
        load: definition => {
          exported = definition.factory(id => {
            if (id === 'react') return react
            if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: react.Fragment }
            throw new Error(`unexpected client dependency ${id}`)
          })
        },
      },
    },
  }
  vm.runInNewContext(source, context, { filename: CLIENT_URL.pathname })

  const ctx = {
    effect: fn => fn(),
    locale: {
      getSnapshot: () => ({ active: 'zh' }),
      register: (_ns, value) => { dictionaries = value; return () => {} },
      subscribe: () => () => {},
    },
    slots: {
      inject: (_name, factory) => { factory(); return () => {} },
      register: (entry, component) => {
        if (entry.name === 'sidebar.footer.action') Badge = component
        return () => {}
      },
    },
  }
  exported.apply(ctx)
  assert.equal(typeof Badge, 'function')
  return { Badge, dictionaries }
}

const totals = {
  calls: 154,
  cost: 0.36832588,
  costUsd: 0.0515656232,
  costNominal: 0.36832588,
  costNominalUsd: 0.0515656232,
  savings: 0,
  savingsUsd: 0,
  inputTokens: 240229,
  cacheReadTokens: 2902144,
  outputTokens: 35027,
}

function renderBadge(Badge, dictionaries, { open = false, balance, pricing } = {}) {
  const value = {
    displayCurrency: 'CNY',
    symbol: '¥',
    symbolUsd: '$',
    totals,
    today: totals,
    month: totals,
    byModel: {},
    pricing: pricing ?? { mode: 'auto', activePolicy: null },
    balance: balance ?? { status: 'ready', balance: { cny: { total: 246.67, granted: 0, toppedUp: 246.67 }, usd: null } },
  }
  const t = key => dictionaries.zh[key] ?? key
  return Badge({
    sessionId: 'empty-session',
    wide: true,
    useBilling: selector => selector({ status: 'ready', value, sessions: {} }),
    useLocale: selector => selector({ active: 'zh' }),
    refreshSession: () => {},
    t,
  })
}

test('global DSH cost total remains visible in the expanded sidebar for an untracked session', async () => {
  const loaded = await loadBadge()
  const tree = renderBadge(loaded.Badge, loaded.dictionaries)
  assert.notEqual(tree, null)
  assert.match(textOf(tree), /费用.*¥0\.368/)
})

test('mounts the cumulative badge in the sidebar instead of the crowded composer surface', async () => {
  const source = await readFile(CLIENT_URL, 'utf8')
  assert.match(source, /ctx\.slots\.inject\("sidebar\.footer\.action"/)
  assert.doesNotMatch(source, /ctx\.slots\.inject\("conversation\.input\.right"/)
})

test('composites the active theme over an opaque light/dark billing underlay', async () => {
  const source = await readFile(CLIENT_URL, 'utf8')
  assert.match(source, /\.b8l_panel\{background:linear-gradient\(var\(--dsw-alias-bg-base,transparent\),var\(--dsw-alias-bg-base,transparent\)\),#fff\}/)
  assert.match(source, /body\[data-ds-dark-theme\] \.b8l_panel\{background:linear-gradient\(var\(--dsw-alias-bg-base,transparent\),var\(--dsw-alias-bg-base,transparent\)\),#151517\}/)
  assert.match(source, /tag\.textContent = `\$\{css\}\$\{sidebarCss\}\$\{opaquePanelCss\}`/)
})

test('expanded panel states that local DSH estimates are not the official account invoice', async () => {
  const loaded = await loadBadge({ open: true })
  const tree = renderBadge(loaded.Badge, loaded.dictionaries, { open: true })
  assert.match(textOf(tree), /DSH 本地统计/)
  assert.match(textOf(tree), /不是 DeepSeek 官方账单/)
  assert.match(textOf(tree), /输入 240229/)
  assert.match(textOf(tree), /缓存命中 2902144/)
  assert.match(textOf(tree), /输出 35027/)
  assert.match(textOf(tree), /DeepSeek 官方余额 ¥246\.67/)
})

test('loading is not falsely labelled unavailable', async () => {
  const loaded = await loadBadge({ open: true })
  const tree = renderBadge(loaded.Badge, loaded.dictionaries, {
    open: true,
    balance: { status: 'loading', balance: undefined, error: null },
  })
  assert.match(textOf(tree), /DeepSeek 官方余额 查询中…/)
  assert.doesNotMatch(textOf(tree), /DeepSeek 官方余额 不可用/)
})

test('a transient refresh failure keeps the exact cached official balance', async () => {
  const loaded = await loadBadge({ open: true })
  const tree = renderBadge(loaded.Badge, loaded.dictionaries, {
    open: true,
    balance: {
      status: 'error',
      balance: { cny: { total: 246.67, granted: 0, toppedUp: 246.67 }, usd: null },
      error: 'temporary-timeout',
    },
  })
  assert.match(textOf(tree), /DeepSeek 官方余额 ¥246\.67 \(缓存值\)/)
  assert.doesNotMatch(textOf(tree), /DeepSeek 官方余额 不可用/)
})

test('shows the current pricing phase, exact unit prices, next switch, and hourly refresh', async () => {
  const loaded = await loadBadge({ open: true })
  const tree = renderBadge(loaded.Badge, loaded.dictionaries, {
    open: true,
    pricing: {
      mode: 'auto',
      timezone: 'Asia/Shanghai',
      activePolicy: { kind: 'peak-offpeak', label: '峰谷定价' },
      effectiveNow: 'peak',
      nextTransitionAt: Date.parse('2026-08-18T12:00:00+08:00'),
      currentUnitPrices: [
        {
          model: 'deepseek-v4-flash',
          mode: 'peak',
          cny: { input: 3, cacheRead: 0.1, output: 9 },
          usd: { input: 0.44, cacheRead: 0.014, output: 1.32 },
        },
      ],
    },
  })
  const text = textOf(tree)
  assert.match(text, /当前计费时段 · 每百万 tokens/)
  assert.match(text, /deepseek-v4-flash · 高峰/)
  assert.match(text, /命中 ¥0\.10 · 未命中 ¥3\.00 · 输出 ¥9\.00/)
  assert.match(text, /下次切换（北京时间） 08\/18 12:00 · 每小时自动刷新/)
})
