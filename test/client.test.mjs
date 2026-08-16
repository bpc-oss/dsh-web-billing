import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import vm from 'node:vm'

const CLIENT_URL = new URL('../lib/client.js', import.meta.url)

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
        if (entry.name === 'conversation.session.header.utilities') Badge = component
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

function renderBadge(Badge, dictionaries, { open = false } = {}) {
  const value = {
    displayCurrency: 'CNY',
    symbol: '¥',
    symbolUsd: '$',
    totals,
    today: totals,
    month: totals,
    byModel: {},
    pricing: { mode: 'auto', activePolicy: null },
    balance: { status: 'ready', balance: { cny: { total: 246.67, granted: 0, toppedUp: 246.67 }, usd: null } },
  }
  const t = key => dictionaries.zh[key] ?? key
  return Badge({
    sessionId: 'empty-session',
    useBilling: selector => selector({ status: 'ready', value, sessions: {} }),
    useLocale: selector => selector({ active: 'zh' }),
    refreshSession: () => {},
    t,
  })
}

test('global DSH token and cost totals remain visible for an untracked current session', async () => {
  const loaded = await loadBadge()
  const tree = renderBadge(loaded.Badge, loaded.dictionaries)
  assert.notEqual(tree, null)
  assert.match(textOf(tree), /DSH.*3\.18M.*¥0\.368/)
})

test('expanded panel states that local DSH estimates are not the official account invoice', async () => {
  const loaded = await loadBadge({ open: true })
  const tree = renderBadge(loaded.Badge, loaded.dictionaries, { open: true })
  assert.match(textOf(tree), /DSH 本地统计/)
  assert.match(textOf(tree), /不是 DeepSeek 官方账单/)
  assert.match(textOf(tree), /输入 240229/)
  assert.match(textOf(tree), /缓存命中 2902144/)
  assert.match(textOf(tree), /输出 35027/)
})
