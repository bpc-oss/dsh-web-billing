# Contributing / 贡献指南

Thanks for considering a contribution! This project is maintained **bilingually (Chinese + English)** — 本项目文档与配置注释一律中英双语维护。

## 双语规则 / Bilingual rules

- **用户可见文档一律双语**：`README.md`（中文）与 `README.en.md`（英文）必须**同步更新**——任何改动两个文件都要改，内容一一对应（条目翻译，不各自发挥）。
- **配置文件注释双语**：`cordis.patch.yml`、`scripts/install.ps1` 等用户会阅读/编辑的配置与脚本，注释同时给出中文与英文（可相邻分行，不必逐词对齐）。
- **代码注释**：`lib/` 源码注释以中文为主（面向本项目维护者），但模块级/导出级 docblock 保持双语要点（`/** ... */` 首段给出中英各一句）。
- **PR 描述**：中英皆可，标题建议双语或至少英文 + 中文摘要。
- **GitHub 仓库元数据**（description / topics / release notes）：中英双语或中英并列。

## 提交规范 / Commit guidelines

- 一个 PR 解决一件事；提交信息用英文（仓库历史统一），可附中文正文说明。
- 改动文档类文件时，先跑 `npm run check`（语法）与 `npm test`（单元测试）确认不破坏任何东西。
- 用户可见配置的默认值改动，需在 README（两版）与 `cordis.patch.yml` 注释中同步说明。

## 流程 / Process

1. Fork 本仓库，开 `docs/*` 或 `feat/*` 分支。
2. 改代码/文档（遵守上面的双语规则）。
3. `npm run check && npm test` 本地通过。
4. 提交并开 PR，描述中说明改动与验证结果。

## 提问 / Questions

欢迎在 [Issues](https://github.com/bpc-oss/dsh-web-billing/issues) 提问（中英皆可）。定价政策时间表（`lib/pricing.js` 的 `OFFICIAL_PRICING_POLICIES`）由官方公告策展，发现偏差请附官方链接提 PR 修正。
