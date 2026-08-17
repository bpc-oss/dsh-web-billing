/**
 * sync-promo-models — 从本机 pi-ai catalog 提取「活动免费模型」清单，生成
 * `lib/promo-models.js`（PROMO_MODELS：provider → 免费模型集合）。
 *
 * 数据源：`@earendil-works/pi-ai/dist/providers/data/*.json`（随 DSH 内置）。
 * 判定：某 provider 下 cost.input==0 且 cost.output==0 的模型 → 免费（白嫖候选）。
 * 订阅制 provider（token-plan/coding 系）不列入——其白嫖语义由 metering 配置决定。
 *
 * 用法：node scripts/sync-promo-models.mjs
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

/** 跳过这些 provider（订阅制，catalog 价是参考价而非按量）。 */
const SUBSCRIPTION_LIKE = new Set([
  "github-copilot", "openai-codex", "kimi-coding", "opencode-go",
  "qwen-token-plan", "qwen-token-plan-cn",
  "xiaomi-token-plan-ams", "xiaomi-token-plan-cn", "xiaomi-token-plan-sgp",
  "zai", "zai-coding-cn"
]);

function locatePiAiData() {
  const env = process.env.DSH_PI_AI_PATH;
  if (env && env.length > 0) {
    for (const cand of [env, join(env, "dist", "providers", "data")]) {
      if (existsSync(cand)) return cand;
    }
    throw new Error(`DSH_PI_AI_PATH 不可用：${env}`);
  }
  const fallbacks = [
    "C:\\Program Files\\DeepSeek Harness\\resources\\host\\node_modules\\@earendil-works\\pi-ai\\dist\\providers\\data",
    join(__dirname, "..", "node_modules", "@earendil-works", "pi-ai", "dist", "providers", "data")
  ];
  for (const cand of fallbacks) if (existsSync(cand)) return cand;
  throw new Error("未找到 pi-ai catalog；请安装 DSH 或设置 DSH_PI_AI_PATH");
}

const dataDir = locatePiAiData();
const promo = {};
const kept = [];

for (const fileName of readdirSync(dataDir).filter((f) => f.endsWith(".json") && f !== ".manifest.json")) {
  const provider = fileName.replace(/\.json$/, "");
  if (SUBSCRIPTION_LIKE.has(provider)) continue;
  const raw = JSON.parse(readFileSync(join(dataDir, fileName), "utf8"));
  const free = [];
  for (const modelsByApi of Object.values(raw)) {
    for (const [id, m] of Object.entries(modelsByApi)) {
      const c = m?.cost ?? {};
      if ((Number(c.input) || 0) === 0 && (Number(c.output) || 0) === 0) free.push(id);
    }
  }
  if (free.length > 0) {
    promo[provider] = Object.fromEntries(free.sort().map((id) => [id, true]));
    kept.push(`${provider}: ${free.length} 个免费模型`);
  }
}

const header = `/**
 * PROMO_MODELS — 「按量+可白嫖」免费模型情报（provider → 免费模型集合）。
 *
 * 由 \`node scripts/sync-promo-models.mjs\` 从本机 pi-ai catalog 自动提取
 * （cost.input==0 且 cost.output==0 的模型），勿手改。活动会变化——升级 DSH 后
 * 重跑该脚本即可同步；用户可在 metering 配置中用 \`freeModels\` 覆盖/扩展。
 * 订阅制 provider（github-copilot / opencode-go / token-plan 系等）不在此列，
 * 其白嫖语义由 metering 的 subscription/free 模式决定。
 *
 * 来源：@earendil-works/pi-ai（生成于 ${new Date().toISOString()}）
 */
export const PROMO_MODELS = ${JSON.stringify(promo, null, 2)};
`;

writeFileSync(join(repoRoot, "lib", "promo-models.js"), header, "utf8");
console.log(`已生成 lib/promo-models.js（${Object.keys(promo).length} 个 provider 有免费模型）`);
for (const line of kept) console.log(`  ${line}`);
