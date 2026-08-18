/**
 * prepack-check — 纯 JS 包无构建，打包前校验 files 声明的内容齐全。
 * 满足 plugin_check 的 build/prepack 门禁，并防止「tarball 缺文件」类发布事故。
 * 用法：npm pack 时自动执行（scripts.prepack）。
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** files 声明的目录/文件必须存在（相对仓库根）。 */
const REQUIRED = [
  "lib/index.js",
  "lib/index.d.ts",
  "lib/pricing.js",
  "lib/balance.js",
  "lib/client.js",
  "lib/coding-plans.js",
  "lib/promo-models.js",
  "scripts/install.ps1",
  "scripts/sync-coding-plans.mjs",
  "scripts/sync-promo-models.mjs",
  "scripts/prepack-check.mjs",
  "docs/screenshots/badge-session.png",
  "docs/screenshots/settings-overview.png",
  "cordis.patch.yml",
  "README.md",
  "README.en.md",
  "CONTRIBUTING.md",
  "LICENSE"
];

const missing = REQUIRED.filter((rel) => !existsSync(join(root, rel)));
if (missing.length > 0) {
  console.error("[dsh-web-billing] prepack check failed — missing files:");
  for (const rel of missing) console.error(`  ${rel}`);
  process.exit(1);
}
console.log(`[dsh-web-billing] prepack check ok (${REQUIRED.length} files present)`);