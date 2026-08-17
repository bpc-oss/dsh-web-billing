/**
 * sync-coding-plans — 从本机 DeepSeek Harness 内置 pi-ai catalog 生成
 * `lib/coding-plans.js`（DSH 预设的全部 coding plan / token-plan provider 的
 * 官方美元单价，$ / 1M tokens）。
 *
 * 数据源：`@earendil-works/pi-ai/dist/providers/data/*.json`（随 DSH 发行版内置，
 * 是各 coding 平台的官方量价数据）。订阅 token 包（qwen-token-plan /
 * xiaomi-token-plan / zai-coding）官方不公布单价，视为 0（订阅额度内含）。
 *
 * 用法：node scripts/sync-coding-plans.mjs
 *   - 读取 pi-ai catalog（默认从 host node_modules 定位，可用 DSH_PI_AI_PATH 覆盖）
 *   - 重新生成 lib/coding-plans.js（含来源与生成时间）
 *   - 生成后需重新跑 `npm test` 验证，并提交 lib/coding-plans.js
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

// 需要内置的 coding/token-plan provider 数据文件（均在 pi-ai catalog 内）。
const PROVIDERS = [
  { file: "opencode-go.json", label: "OpenCode GO", kind: "coding" },
  { file: "opencode.json", label: "OpenCode Zen", kind: "coding" },
  { file: "kimi-coding.json", label: "Kimi Coding", kind: "coding" },
  { file: "qwen-token-plan.json", label: "Qwen Token Plan", kind: "subscription" },
  { file: "qwen-token-plan-cn.json", label: "Qwen Token Plan (CN)", kind: "subscription" },
  { file: "xiaomi-token-plan-ams.json", label: "Xiaomi MiMo Token Plan (AMS)", kind: "subscription" },
  { file: "xiaomi-token-plan-cn.json", label: "Xiaomi MiMo Token Plan (CN)", kind: "subscription" },
  { file: "xiaomi-token-plan-sgp.json", label: "Xiaomi MiMo Token Plan (SGP)", kind: "subscription" },
  { file: "zai-coding-cn.json", label: "Z.ai Coding (CN)", kind: "subscription" }
];

/** 定位 pi-ai data 目录。 */
function locatePiAiData() {
  const env = process.env.DSH_PI_AI_PATH;
  if (env !== void 0 && env.length > 0) {
    const candidates = [env, join(env, "dist", "providers", "data")];
    for (const cand of candidates) if (existsSync(cand)) return cand;
    throw new Error(`DSH_PI_AI_PATH 指向的目录不存在可用的 catalog 数据：${env}`);
  }
  const fallbacks = [
    "C:\\Program Files\\DeepSeek Harness\\resources\\host\\node_modules\\@earendil-works\\pi-ai\\dist\\providers\\data",
    join(__dirname, "..", "node_modules", "@earendil-works", "pi-ai", "dist", "providers", "data")
  ];
  for (const cand of fallbacks) if (existsSync(cand)) return cand;
  throw new Error("未找到 pi-ai catalog 数据目录；请安装 DSH 或设置 DSH_PI_AI_PATH");
}

/** 读取 pi-ai package.json 版本（用于来源标注）。 */
function piAiVersion(dataDir) {
  const pkgPath = join(dataDir, "..", "..", "..", "package.json");
  try {
    return JSON.parse(readFileSync(pkgPath, "utf8")).version ?? "unknown";
  } catch {
    return "unknown";
  }
}

const dataDir = locatePiAiData();
const version = piAiVersion(dataDir);

/** 规范化一条 catalog model → { usd: { input, cacheRead, output } }。 */
function normalizeModel(id, model) {
  const cost = model?.cost ?? {};
  const input = Number(cost.input ?? 0);
  const cacheRead = Number(cost.cacheRead ?? 0);
  const output = Number(cost.output ?? 0);
  return { usd: { input, cacheRead, output } };
}

function buildProvider(fileName, meta) {
  const path = join(dataDir, fileName);
  if (!existsSync(path)) throw new Error(`catalog 缺少数据文件：${fileName}`);
  const raw = JSON.parse(readFileSync(path, "utf8"));
  const models = {};
  for (const modelsByApi of Object.values(raw)) {
    for (const [id, model] of Object.entries(modelsByApi)) {
      models[id] = normalizeModel(id, model);
    }
  }
  const ids = Object.keys(models).sort();
  return {
    label: meta.label,
    kind: meta.kind,
    models
  };
}

const output = {};
for (const meta of PROVIDERS) {
  const providerId = meta.file.replace(/\.json$/, "").replace(/-cn$/, "-cn");
  output[providerId] = buildProvider(meta.file, meta);
}

const header = `/**
 * CODING_PLAN_PRICING — DSH 预设全部 coding plan / token-plan provider 的官方美元单价。
 *
 * 由 \`node scripts/sync-coding-plans.mjs\` 从本机 DeepSeek Harness 内置的
 * \`@earendil-works/pi-ai\` catalog 生成，勿手改——价格随 DSH 发行版更新，升级后
 * 重跑该脚本即可同步。单位为美元 / 1M tokens。
 *
 * 语义：
 * - kind "coding"：opencode 等平台公开的官方量价（$ / 1M tokens）。
 * - kind "subscription"：基于订阅 token 包的 provider，官方不公布逐 token 单价，
 *   一律视为 0（订阅额度内含，调用不额外产生费用）。
 * - 人民币展示价 = usd × 插件配置 \`codingUsdCnyRate\`（默认参考汇率）。
 * - 用户 \`prices\` 中对该模型名的精确条目仍可整体覆盖（优先级最高）。
 *
 * 来源：@earendil-works/pi-ai v${version}
 * 生成时间：${new Date().toISOString()}
 */
export const CODING_PLAN_SOURCE = Object.freeze({
  package: "@earendil-works/pi-ai",
  version: ${JSON.stringify(version)},
  generatedAt: ${JSON.stringify(new Date().toISOString())}
});

export const CODING_PLAN_PRICING = ${JSON.stringify(output, null, 2)};
`;

const target = join(repoRoot, "lib", "coding-plans.js");
writeFileSync(target, header, "utf8");
console.log(`已生成 ${target}`);
console.log(`provider 数：${Object.keys(output).length}`);
for (const [id, provider] of Object.entries(output)) {
  console.log(`  ${id} (${provider.kind})：${Object.keys(provider.models).length} 个模型`);
}
