// 隔离验证：metering 变化后重估是否把 bai 历史归零（模拟 POST 后的 reprice）。
// 只读加载真实账本，用与 host 相同的 price()/reprice 逻辑验证。
import { readFileSync } from "node:fs";
import { priceAt, subscriptionUnitFor, unitForProvider, costOf, sourceOf, zeroCounts, addCounts } from "../lib/pricing.js";

const ledger = JSON.parse(readFileSync("C:/Users/Administrator/.dsh/storages/web-billing.json", "utf8"));
const metering = JSON.parse(readFileSync("C:/Users/Administrator/.dsh/storages/web-billing-metering.json", "utf8"));
console.log("metering:", JSON.stringify(metering));

const localProviders = [];
const pricing = {
  localProviders,
  metering,
  at: (model, time, provider) => priceAt(model, time, { provider, codingUsdCnyRate: 7.2 })
};

function priceOne(model, provider, time, tokens) {
  const nominal = pricing.at(model, time, provider);
  const sub = subscriptionUnitFor(provider, nominal, pricing.metering);
  const split = sub.metered
    ? { unit: sub.unit, nominal: sub.nominal, isLocal: false }
    : unitForProvider(provider, nominal, pricing.localProviders, 0);
  const actual = costOf(tokens, split.unit);
  const nominalCost = costOf(tokens, split.nominal);
  const rule = pricing.metering[provider];
  const source = rule?.mode === "free" ? "free" : rule?.mode === "subscription" ? "subscription" : rule?.mode === "local" ? "local" : sourceOf(provider, model, { localProviders });
  return { ...actual, savings: nominalCost.cost - actual.cost, source, metered: sub.metered };
}

// 对账本中 bai 消息重估
let baiCount = 0, baiCost = 0, baiSavings = 0, baiFree = 0;
for (const [sid, sess] of Object.entries(ledger.sessions ?? {})) {
  for (const [mid, msg] of Object.entries(sess.messages ?? {})) {
    if (msg.provider !== "bai") continue;
    baiCount++;
    const r = priceOne(msg.model, msg.provider, msg.time, msg);
    baiCost += r.cost;
    baiSavings += r.savings;
    if (r.source === "free") baiFree++;
  }
}
console.log(`bai: ${baiCount} 条 → 重估后 cost=${baiCost.toFixed(4)} savings=${baiSavings.toFixed(4)} freeSource=${baiFree}/${baiCount}`);
console.log(baiCost < 0.0001 ? "✅ bai 已归零（白赚）—— 修复生效" : "❌ bai 仍有花费");
