window.__ModuleLoader__.load({
	id: "dsh-web-billing",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		//#region billing.module.css
		const css = ".b8l_chip{color:var(--dsw-alias-label-tertiary);border-radius:10px;padding:0 6px;font-size:12px;line-height:24px;white-space:nowrap;cursor:help}.b8l_chip:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}.b8l_wrap{position:relative;display:inline-flex}.b8l_badge{display:inline-flex;align-items:center;gap:4px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:var(--dsw-alias-interactive-bg-hover);border:none;border-radius:12px;padding:2px 10px;font-size:12px;line-height:20px;white-space:nowrap}.b8l_badge:hover{color:var(--dsw-alias-label-secondary)}.b8l_badge[data-open]{color:var(--dsw-alias-label-primary)}.b8l_backdrop{position:fixed;inset:0;z-index:29}.b8l_panel{position:absolute;top:calc(100% + 6px);right:0;z-index:30;box-sizing:border-box;background:var(--dsw-alias-bg-primary);border:1px solid var(--dsw-alias-border-secondary);border-radius:12px;box-shadow:var(--dsw-shadow-popover,0 8px 24px rgba(0,0,0,.12));width:300px;padding:12px 14px}.b8l_head{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.b8l_headLabel{color:var(--dsw-alias-label-secondary);font-size:12px;white-space:nowrap}.b8l_headValues{display:flex;align-items:baseline;gap:10px}.b8l_headValue{color:var(--dsw-alias-label-primary);font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;line-height:24px;white-space:nowrap}.b8l_headValue.b8l_save{color:#16a34a}.b8l_headValue.b8l_small{font-size:14px;font-weight:600}.b8l_sub{display:flex;flex-wrap:wrap;gap:4px 14px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;margin-top:2px}.b8l_sub .b8l_save{color:#16a34a}.b8l_sep{border-top:1px solid var(--dsw-alias-border-secondary);margin:9px 0}.b8l_gridHead{display:grid;grid-template-columns:1fr 1fr;gap:3px 18px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;margin-bottom:3px}.b8l_gridHead[data-kind=cost],.b8l_gridHead[data-kind=save]{grid-template-columns:1fr}.b8l_gridHead .b8l_save{color:#16a34a;text-align:right}.b8l_grid{display:grid;grid-template-columns:1fr 1fr;gap:3px 18px}.b8l_grid[data-kind=cost],.b8l_grid[data-kind=save]{grid-template-columns:1fr}.b8l_cell{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:12px;line-height:19px;white-space:nowrap}.b8l_k{color:var(--dsw-alias-label-secondary);min-width:0;overflow:hidden;text-overflow:ellipsis}.b8l_v{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;text-align:right}.b8l_cell.b8l_save .b8l_v{color:#16a34a}.b8l_section{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;margin-bottom:3px}.b8l_modelRow{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:12px;line-height:20px;white-space:nowrap}.b8l_name{color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis}.b8l_cost{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;text-align:right}.b8l_modelRow.b8l_save .b8l_cost{color:#16a34a}.b8l_footer{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;margin-top:9px}";
		const tagId = "dsh-web-billing/billing.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-web-billing";
			tag.dataset.pluginCss = tagId;
			tag.textContent = ".b8l_badgeOpen{color:var(--dsw-alias-label-primary)}.b8l_panelOnHeader{position:absolute;top:calc(100% + 6px);right:0;width:min(340px,calc(100vw - 32px));max-height:70vh;overflow:auto}.b8l_modelRow{display:flex;flex-direction:column;gap:2px;padding:3px 0;font-size:12px;line-height:18px}.b8l_modelLine{display:flex;justify-content:space-between;align-items:baseline;gap:12px;min-width:0}.b8l_tokenLine{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px;padding-left:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.b8l_tokenLine.b8l_save{color:#16a34a}" + css + ".b8l_settingsRoot{display:flex;flex-direction:column;gap:18px;padding:2px 2px 24px;font-size:13px;color:var(--dsw-alias-label-primary)}.b8l_cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.b8l_card{border:1px solid var(--dsw-alias-border-l1);border-radius:12px;padding:14px 16px;background:var(--dsw-alias-bg-layer-1)}.b8l_cardTitle{font-size:12px;color:var(--dsw-alias-label-tertiary);margin:0 0 8px}.b8l_cardValue{font-size:20px;line-height:28px;font-weight:600}.b8l_cardValue.b8l_save{color:#16a34a}.b8l_cardSub{font-size:12px;color:var(--dsw-alias-label-tertiary);margin-top:4px}.b8l_hint{font-size:12px;color:var(--dsw-alias-label-tertiary);margin:0}.b8l_button{font:inherit;font-size:13px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-button-elevated-fill);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:6px 14px;cursor:pointer}.b8l_button:hover{background:var(--dsw-alias-interactive-bg-hover)}.b8l_table{width:100%;border-collapse:collapse;font-size:12px}.b8l_table th,.b8l_table td{text-align:left;padding:7px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);white-space:nowrap}.b8l_table th{color:var(--dsw-alias-label-tertiary);font-weight:500}.b8l_table td.b8l_num,.b8l_table th.b8l_num{text-align:right;font-variant-numeric:tabular-nums}.b8l_table tr:last-child td{border-bottom:none}.b8l_scroll{max-height:300px;overflow:auto;border:1px solid var(--dsw-alias-border-l1);border-radius:10px}.b8l_empty{font-size:12px;color:var(--dsw-alias-label-tertiary);padding:8px 0}.b8l_sectionTitle{font-size:13px;font-weight:600;margin:0}.b8l_route{display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--dsw-alias-label-tertiary);border:1px solid var(--dsw-alias-border-l1);border-radius:999px;padding:1px 8px}.b8l_route_muted{color:var(--dsw-alias-label-tertiary)}.b8l_modelRow{display:flex;flex-direction:column;gap:2px;padding:3px 0;font-size:12px;line-height:18px}.b8l_modelLine{display:flex;justify-content:space-between;align-items:baseline;gap:12px;min-width:0}.b8l_tokenLine{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px;padding-left:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.b8l_tokenLine.b8l_save{color:#16a34a}.b8l_providerBadge{display:inline-block;font-size:9px;line-height:13px;color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:999px;padding:0 5px;margin-left:5px;vertical-align:1px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media(max-width:640px){.b8l_cards{grid-template-columns:1fr}}";
			document.head.appendChild(tag);
		}
		var css_default = {
			"chip": "b8l_chip",
			"wrap": "b8l_wrap",
			"badge": "b8l_badge",
			"backdrop": "b8l_backdrop",
			"panel": "b8l_panel",
			"head": "b8l_head",
			"headLabel": "b8l_headLabel",
			"headValues": "b8l_headValues",
			"headValue": "b8l_headValue",
			"small": "b8l_small",
			"sub": "b8l_sub",
			"sep": "b8l_sep",
			"gridHead": "b8l_gridHead",
			"grid": "b8l_grid",
			"cell": "b8l_cell",
			"k": "b8l_k",
			"v": "b8l_v",
			"section": "b8l_section",
			"modelRow": "b8l_modelRow",
			"modelLine": "b8l_modelLine",
			"tokenLine": "b8l_tokenLine",
			"providerBadge": "b8l_providerBadge",
			"name": "b8l_name",
			"cost": "b8l_cost",
			"footer": "b8l_footer",
			"save": "b8l_save",
			"badgeOpen": "b8l_badgeOpen",
			"panelOnHeader": "b8l_panelOnHeader",
			"settingsRoot": "b8l_settingsRoot",
			"cards": "b8l_cards",
			"card": "b8l_card",
			"cardTitle": "b8l_cardTitle",
			"cardValue": "b8l_cardValue",
			"cardSub": "b8l_cardSub",
			"hint": "b8l_hint",
			"button": "b8l_button",
			"table": "b8l_table",
			"num": "b8l_num",
			"scroll": "b8l_scroll",
			"empty": "b8l_empty",
			"sectionTitle": "b8l_sectionTitle",
			"route": "b8l_route",
			"routeMuted": "b8l_route_muted"
		};
		//#endregion
		//#region lib/types/client/controller.js
		/** 空会话表。 */
		const NO_SESSIONS = Object.freeze({});
		/** 初始视图。 */
		const INITIAL_VIEW = Object.freeze({
			status: "loading",
			value: void 0,
			error: null,
			sessions: NO_SESSIONS
		});
		/**
		* 计费控制器：轮询 /billing/state（全局汇总），按需拉取 /billing/session/<id>
		* （消息级明细，5s 缓存 + 并发去重）。失败时保持上次视图，静默降级。
		*/
		var BillingController = class {
			view = INITIAL_VIEW;
			listeners = /* @__PURE__ */ new Set();
			timers = [];
			sessionFetch = /* @__PURE__ */ new Map();
			knownSessions = /* @__PURE__ */ new Set();
			disposed = false;
			constructor() {
				this.refresh();
				const timer = setInterval(() => this.refresh(), 5000);
				this.timers.push(timer);
			}
			getSnapshot = () => this.view;
			subscribe = (listener) => {
				this.listeners.add(listener);
				return () => {
					this.listeners.delete(listener);
				};
			};
			publish(next) {
				if (this.disposed) return;
				this.view = next;
				for (const listener of [...this.listeners]) try {
					listener();
				} catch (error) {
					console.error("[dsh-web-billing] subscriber threw:", error);
				}
			}
			async refresh() {
				try {
					const response = await fetch("/billing/state", { headers: { accept: "application/json" } });
					if (!response.ok) throw new Error(`HTTP ${String(response.status)}`);
					const value = await response.json();
					if (value?.ok !== true) throw new Error("unexpected billing payload");
					this.publish({
						status: "ready",
						value,
						error: null,
						sessions: this.view.sessions
					});
					// 随全局轮询一起刷新已知会话：服务端记账与客户端渲染存在竞态，
					// 周期重拉保证新消息的费用角标在下一轮出现。
					for (const sessionId of [...this.knownSessions].slice(0, 10)) this.refreshSession(sessionId);
				} catch (error) {
					if (this.view.status !== "error") this.publish({
						status: "error",
						value: void 0,
						error: error instanceof Error ? error.message : String(error),
						sessions: this.view.sessions
					});
				}
			}
			refreshSession(sessionId) {
				if (sessionId === void 0 || this.disposed) return;
				this.knownSessions.add(sessionId);
				const cached = this.sessionFetch.get(sessionId);
				if (cached !== void 0 && Date.now() - cached.at < 5000) return;
				const started = Date.now();
				this.sessionFetch.set(sessionId, { at: started });
				fetch(`/billing/session/${encodeURIComponent(sessionId)}`, { headers: { accept: "application/json" } })
					.then((response) => {
						if (!response.ok) throw new Error(`HTTP ${String(response.status)}`);
						return response.json();
					})
					.then((value) => {
						if (this.disposed || value?.ok !== true) return;
						this.publish({
							...this.view,
							sessions: {
								...this.view.sessions,
								[sessionId]: value
							}
						});
					})
					.catch(() => {
						// 会话可能尚未记账或无数据；静默。
					})
					.finally(() => {
						if (this.sessionFetch.get(sessionId)?.at === started) this.sessionFetch.delete(sessionId);
					});
			}
			dispose() {
				this.disposed = true;
				for (const timer of this.timers) clearInterval(timer);
				this.timers = [];
				this.listeners.clear();
			}
		};
		//#endregion
		//#region lib/types/client/format.js
		/** 费用展示：按量级选择小数位，避免 ¥0.000000… 长尾。 */
		function formatCost(symbol, cost) {
			if (!Number.isFinite(cost) || cost <= 0) return `${symbol}0`;
			if (cost >= 100) return `${symbol}${cost.toFixed(0)}`;
			if (cost >= 1) return `${symbol}${cost.toFixed(2)}`;
			if (cost >= 0.01) return `${symbol}${cost.toFixed(3)}`;
			return `${symbol}${cost.toPrecision(2)}`;
		}
		/** 本地化数字。 */
		function formatNumber(value) {
			return Number.isFinite(value) ? String(Math.round(value)) : "0";
		}
		/** Token 紧凑展示：K / M 后缀；用于每模型行的输入/缓存/输出拆分。 */
		function fmtTok(value) {
			if (!Number.isFinite(value) || value <= 0) return "0";
			if (value >= 1e6) return `${(value / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
			if (value >= 1e3) return `${(value / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
			return String(Math.round(value));
		}
		/** 空计数兜底（避免 undefined 解构）。 */
		const EMPTY_COUNTS = Object.freeze({ calls: 0, cost: 0, costUsd: 0, savings: 0, savingsUsd: 0 });
		/** 本地日期键（浏览器时区）：`YYYY-MM-DD`；用于判定消息是否「今日」，与 host 端口径一致。 */
		function dayKeyClient(time) {
			const d = new Date(time);
			const pad = (n) => String(n).padStart(2, "0");
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
		}
		//#endregion
		//#region lib/types/client/MessageCostChip.js
		/**
		* 每条 assistant 消息动作条里的费用角标：有该消息的计费记录时显示
		* 一个「¥0.0032」小角标，悬停显示模型与 token 拆分。
		* @param props - messageId（插槽注入）+ useBilling / refreshSession（inject 面）+ t。
		* @returns 费用角标，无记录时返回 null。
		*/
		function MessageCostChip({ messageId, sessionId, useBilling, useLocale, refreshSession, t }) {
			const view = useBilling((snapshot) => snapshot);
			const message = view.sessions[sessionId]?.messages?.[messageId];
			const activeLocale = useLocale((snapshot) => snapshot.active);
			const seeded = react.useRef(false);
			react.useEffect(() => {
				if (!seeded.current) {
					seeded.current = true;
					refreshSession(sessionId);
				}
			}, [refreshSession, sessionId]);
			if (message === void 0) return null;
			const currency = resolveCurrency(view.value?.displayCurrency ?? "auto", activeLocale);
			const symbol = currency === "USD" ? (view.value?.symbolUsd ?? "$") : (view.value?.symbol ?? "¥");
			const amount = currency === "USD" ? message.costUsd : message.cost;
			const savedAmount = currency === "USD" ? message.savingsUsd : message.savings;
			const nominalAmount = currency === "USD" ? message.costNominalUsd : message.costNominal;
			const detail = [
				message.model,
				...(message.isLocal === true ? [t("local")] : []),
				`${t("input")} ${formatNumber(message.inputTokens)}`,
				`${t("cache")} ${formatNumber(message.cacheReadTokens)}`,
				`${t("output")} ${formatNumber(message.outputTokens)}`,
				...(message.isLocal === true && nominalAmount > 0 ? [`${t("nominal")} ${formatCost(symbol, nominalAmount)}`] : [])
			].join(" · ");
			const chipText = message.isLocal === true && savedAmount > 0
				? `${t("saved")} ${formatCost(symbol, savedAmount)}`
				: formatCost(symbol, amount);
			return react_jsx_runtime.jsx("span", {
				className: css_default.chip,
				title: detail,
				children: chipText
			});
		}
		//#endregion
		//#region lib/types/client/SessionCostBadge.js
		/**
		* 会话头部工具条里的费用角标：显示**本对话**的花费/节省，悬停展开浮层，
		* 内容**全部限定本对话**：①本对话总花费/节省 ②本对话今日花费/节省
		* ③本对话累计花费/节省，以及本对话的分模型统计（每模型累计花费/节省 +
		*  Input / 缓存命中率 / Output）。若本对话使用任意 DeepSeek 系列模型
		* （官方 / 本地 / coding plan），浮层额外显示当前官方计价时段（高峰期/峰谷期）。
		* 更完整的全局汇总（本月 / 按模型 / 会话 / 按天历史 / 余额）见 settings → 费用。
		* @param props - 会话标准 props + useBilling / refreshSession + t。
		* @returns 费用角标；本会话尚无计费记录时不渲染。
		*/
		function SessionCostBadge({ sessionId, useBilling, useLocale, refreshSession, t }) {
			const view = useBilling((snapshot) => snapshot);
			const session = view.sessions[sessionId];
			const activeLocale = useLocale((snapshot) => snapshot.active);
			const [open, setOpen] = react.useState(false);
			const closeTimer = react.useRef(null);
			const seeded = react.useRef(false);
			react.useEffect(() => {
				if (!seeded.current) {
					seeded.current = true;
					refreshSession(sessionId);
				}
			}, [refreshSession, sessionId]);
			react.useEffect(() => () => {
				if (closeTimer.current !== null) clearTimeout(closeTimer.current);
			}, []);
			const openSoon = () => {
				if (closeTimer.current !== null) {
					clearTimeout(closeTimer.current);
					closeTimer.current = null;
				}
				setOpen(true);
			};
			const closeSoon = () => {
				if (open) {
					if (closeTimer.current !== null) clearTimeout(closeTimer.current);
					closeTimer.current = setTimeout(() => {
						closeTimer.current = null;
						setOpen(false);
					}, 250);
				}
			};
			// 纯本地模型会话的实际成本为 0：只要有节省（名义价值>0）就应显示徽章，
			// 徽章文字展示节省金额而非 ¥0。
			if (session === void 0 || (session.cost <= 0 && session.savings <= 0)) return null;
			const currency = resolveCurrency(view.value?.displayCurrency ?? "auto", activeLocale);
			const symbol = currency === "USD" ? (view.value?.symbolUsd ?? "$") : (view.value?.symbol ?? "¥");
			const savedOf = (value) => currency === "USD" ? value.savingsUsd : value.savings;
			const amountOf = (value) => currency === "USD" ? value.costUsd : value.cost;
			const sessionSavings = savedOf(session);
			const isSavingsBadge = session.cost <= 0 && sessionSavings > 0;
			const badgeValue = isSavingsBadge
				? formatCost(symbol, sessionSavings)
				: formatCost(symbol, amountOf(session));
			const badgeText = isSavingsBadge ? `${t("saved")} ${badgeValue}` : badgeValue;

			// ── 本对话消息级聚合（全部数据限定本会话；无明细时用计数兜底）──
			const messages = session.messages === void 0 ? [] : Object.values(session.messages);
			const todayKeyNow = dayKeyClient(Date.now());
			const bucketTotal = { cost: 0, costUsd: 0, savings: 0, savingsUsd: 0, calls: 0 };
			const bucketToday = { cost: 0, costUsd: 0, savings: 0, savingsUsd: 0, calls: 0 };
			const byModel = /* @__PURE__ */ new Map();
			let usesDeepSeek = false;
			for (const message of messages) {
				const model = message.model ?? "unknown";
				bucketTotal.cost += message.cost ?? 0;
				bucketTotal.costUsd += message.costUsd ?? 0;
				bucketTotal.savings += message.savings ?? 0;
				bucketTotal.savingsUsd += message.savingsUsd ?? 0;
				bucketTotal.calls += 1;
				// 本对话今日：仅统计本地日期为今天的消息。
				if (dayKeyClient(message.time ?? 0) === todayKeyNow) {
					bucketToday.cost += message.cost ?? 0;
					bucketToday.costUsd += message.costUsd ?? 0;
					bucketToday.savings += message.savings ?? 0;
					bucketToday.savingsUsd += message.savingsUsd ?? 0;
					bucketToday.calls += 1;
				}
				// 本对话分模型：按 (provider, model) 聚合累计金额 + token（缓存命中率单算）。
				let bucket = byModel.get(`${message.provider ?? "?"}\u0009${model}`);
				if (bucket === void 0) {
					bucket = { provider: message.provider ?? "?", model, cost: 0, costUsd: 0, savings: 0, savingsUsd: 0, input: 0, cacheRead: 0, output: 0, calls: 0 };
					byModel.set(`${message.provider ?? "?"}\u0009${model}`, bucket);
				}
				bucket.cost += message.cost ?? 0;
				bucket.costUsd += message.costUsd ?? 0;
				bucket.savings += message.savings ?? 0;
				bucket.savingsUsd += message.savingsUsd ?? 0;
				bucket.input += message.inputTokens ?? 0;
				bucket.cacheRead += message.cacheReadTokens ?? 0;
				bucket.output += message.outputTokens ?? 0;
				bucket.calls += 1;
				if (/^deepseek/i.test(model)) usesDeepSeek = true;
			}
			const modelRows = [...byModel.values()]
				.sort((a, b) => (b.cost - b.savings) - (a.cost - a.savings))
				.slice(0, 6)
				.map((counts) => {
					const isSaveOnly = counts.savings > 0 && counts.cost <= 0;
					const value = isSaveOnly
						? `${t("saved")} ${formatCost(symbol, currency === "USD" ? counts.savingsUsd : counts.savings)}`
						: formatCost(symbol, currency === "USD" ? counts.costUsd : counts.cost);
					const hitRate = counts.input + counts.cacheRead > 0
						? Math.round(counts.cacheRead / (counts.input + counts.cacheRead) * 100)
						: 0;
					const tokenInfo = `${t("input")} ${fmtTok(counts.input)} · ${t("hit")} ${hitRate}% · ${t("output")} ${fmtTok(counts.output)}`;
					const providerBadge = counts.provider !== "?" && counts.provider.length > 0
						? react_jsx_runtime.jsx("span", {
							className: css_default.providerBadge,
							children: counts.provider
						})
						: null;
					return react_jsx_runtime.jsx("div", {
						className: `${css_default.modelRow}${isSaveOnly ? ` ${css_default.save}` : ""}`,
						children: [
							react_jsx_runtime.jsxs("div", {
								className: css_default.modelLine,
								children: [
									react_jsx_runtime.jsxs("span", {
										className: css_default.name,
										children: [
											react_jsx_runtime.jsx("span", {
												title: counts.model,
												children: counts.model
											}),
											providerBadge,
											counts.calls > 1 && react_jsx_runtime.jsx("span", {
												style: { color: "var(--dsw-alias-label-tertiary)", fontSize: 10 },
												children: ` ×${counts.calls}`
											})
										]
									}),
									react_jsx_runtime.jsx("span", {
										className: `${css_default.cost}${isSaveOnly ? ` ${css_default.save}` : ""}`,
										children: value
									})
								]
							}),
							react_jsx_runtime.jsx("div", {
								className: `${css_default.tokenLine}${isSaveOnly ? ` ${css_default.save}` : ""}`,
								children: tokenInfo
							})
						]
					}, `${counts.provider}/${counts.model}`);
				});
			// DeepSeek 系列模型 → 显示当前官方时段（峰谷政策对 DeepSeek 模型生效）。
			const pricing = view.value?.pricing;
			const phaseHint = usesDeepSeek && pricing !== void 0 && pricing.effectiveNow !== "flat"
				? (pricing.effectiveNow === "peak" ? t("pricing.peakNow") : t("pricing.offPeakNow"))
				: null;
			// 单一来源判定：只有本会话既含实际花费又含节省（混合使用）才同时展示两列；
			// 单一来源只展示实际存在的那种（纯云端 → 花费；纯本地 → 节省）。
			const hasCost = bucketTotal.cost > 0;
			const hasSaving = bucketTotal.savings > 0;
			const kind = hasCost && hasSaving ? "both" : hasSaving ? "save" : hasCost ? "cost" : "none";
			// 花费+节省两列网格（本对话 今日 / 累计；列数随单一来源判定收缩）。
			const showCostColumn = kind === "both" || kind === "cost";
			const showSaveColumn = kind === "both" || kind === "save";
			const gridCell = (label, counts, isSave) => react_jsx_runtime.jsxs("div", {
				className: `${css_default.cell}${isSave ? ` ${css_default.save}` : ""}`,
				children: [
					react_jsx_runtime.jsx("span", { className: css_default.k, children: label }),
					react_jsx_runtime.jsx("span", {
						className: css_default.v,
						children: formatCost(symbol, isSave ? savedOf(counts) : amountOf(counts))
					})
				]
			});
			return react_jsx_runtime.jsx("div", {
				className: css_default.wrap,
				onMouseEnter: openSoon,
				onMouseLeave: closeSoon,
				children: react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
					children: [
						react_jsx_runtime.jsx("span", {
							className: `${css_default.badge}${open ? ` ${css_default.badgeOpen}` : ""}`,
							"aria-expanded": open,
							children: badgeText
						}),
						open && react_jsx_runtime.jsxs("div", {
							className: `${css_default.panel} ${css_default.panelOnHeader}`,
							children: [
								react_jsx_runtime.jsx("div", {
									className: css_default.section,
									children: t("inThisSession")
								}),
								react_jsx_runtime.jsx("div", {
									className: `${css_default.gridHead}`,
									"data-kind": kind,
									children: [
										react_jsx_runtime.jsx("span", { children: t("dimension") }),
										showSaveColumn && react_jsx_runtime.jsx("span", { className: css_default.save, children: t("saved") })
									]
								}),
								react_jsx_runtime.jsx("div", {
									className: `${css_default.grid}`,
									"data-kind": kind,
									children: [
										gridCell(t("today"), bucketToday, false),
										showSaveColumn && gridCell(t("today"), bucketToday, true),
										gridCell(t("total"), bucketTotal, false),
										showSaveColumn && gridCell(t("total"), bucketTotal, true)
									]
								}),
								modelRows.length > 0 && react_jsx_runtime.jsx("div", {
									className: css_default.section,
									children: t("byModel")
								}),
								modelRows.length > 0 && modelRows,
								(phaseHint !== null || modelRows.length > 0 || showSaveColumn || showCostColumn) && react_jsx_runtime.jsx("div", {
									className: css_default.sep
								}),
								phaseHint !== null && react_jsx_runtime.jsx("div", {
									className: css_default.footer,
									children: phaseHint
								}),
								react_jsx_runtime.jsx("div", {
									className: css_default.footer,
									children: t("openSettings")
								})
							]
						})
					]
				})
			});
		}
		//#endregion
		//#region lib/types/client/SettingsBillingSection.js
		/**
		* settings → 费用 汇总页（查看型）：今日 / 本月 / 累计卡片、账户余额、
		* 会话列表、按模型、按天历史、计价与 coding plan 状态。
		* 只读：展示 host /billing/state 的数据，不做任何写操作。
		* @param props - settings.section 标准 props（close）+ useBilling + t。
		* @returns 汇总页内容。
		*/
		function SettingsBillingSection({ useBilling, useLocale, t }) {
			const view = useBilling((snapshot) => snapshot);
			const activeLocale = useLocale((snapshot) => snapshot.active);
			if (view.status !== "ready" || view.value === void 0) {
				return react_jsx_runtime.jsx("div", {
					className: css_default.settingsRoot,
					children: react_jsx_runtime.jsx("p", {
						className: css_default.empty,
						children: view.error !== null ? view.error : t("loading")
					})
				});
			}
			const { value, sessions } = view;
			const currency = resolveCurrency(value?.displayCurrency ?? "auto", activeLocale);
			const symbol = currency === "USD" ? (value?.symbolUsd ?? "$") : (value?.symbol ?? "¥");
			const amountOf = (counts) => currency === "USD" ? counts.costUsd : counts.cost;
			const savedOf = (counts) => currency === "USD" ? counts.savingsUsd : counts.savings;
			const format = (counts, field) => {
				const mode = field === "saved";
				if (field === "calls") return formatNumber(counts?.calls ?? 0);
				const value = mode ? savedOf(counts ?? EMPTY_COUNTS) : amountOf(counts ?? EMPTY_COUNTS);
				return mode ? `${t("saved")} ${formatCost(symbol, value)}` : formatCost(symbol, value);
			};
			const totals = value?.totals ?? EMPTY_COUNTS;
			const today = value?.today ?? EMPTY_COUNTS;
			const month = value?.month ?? EMPTY_COUNTS;
			const history = Array.isArray(value?.history) ? value.history : [];
			const byModel = value?.byModel ?? {};
			const sessionList = Array.isArray(value?.sessions) ? value.sessions : [];
			const card = (title, counts, sub) => react_jsx_runtime.jsx("div", {
				className: css_default.card,
				children: [
					react_jsx_runtime.jsx("p", { className: css_default.cardTitle, children: title }),
					react_jsx_runtime.jsx("div", {
						className: css_default.cardValue,
						children: formatCost(symbol, amountOf(counts))
					}),
					savedOf(counts) > 0 && react_jsx_runtime.jsx("div", {
						className: `${css_default.cardValue} ${css_default.save}`,
						children: `${t("saved")} ${formatCost(symbol, savedOf(counts))}`
					}),
					counts.calls > 0 && react_jsx_runtime.jsx("div", {
						className: css_default.cardSub,
						children: `${t("calls")} ${formatNumber(counts.calls)}`
					}),
					sub !== void 0 && react_jsx_runtime.jsx("div", { className: css_default.cardSub, children: sub })
				]
			});
			const balance = value?.balance;
			const balanceNode = balance === void 0 || balance.status === "disabled" ? null
				: balance.status === "ready" && balance.balance !== void 0
					? (() => {
						const preferred = currency === "USD" ? balance.balance.usd : balance.balance.cny;
						const info = preferred ?? (currency === "USD" ? balance.balance.cny : balance.balance.usd);
						return info === null ? react_jsx_runtime.jsx("p", { className: css_default.hint, children: t("balance.unavailable") })
							: card(t("balance"), { ...EMPTY_COUNTS, cost: info.total, costUsd: info.total, calls: 0 }, `${t("balance.granted")} ${formatCost(symbol, info.granted)} · ${t("balance.toppedUp")} ${formatCost(symbol, info.toppedUp)}`);
					})()
					: react_jsx_runtime.jsx("p", { className: css_default.hint, children: t("balance.unavailable") });
			const pricing = value?.pricing;
			const pricingText = pricing === void 0 ? null : (() => {
				const mode = pricing.mode === "auto" ? t("pricing.auto") : t("pricing.custom");
				if (pricing.activePolicy === null) return mode;
				if (pricing.activePolicy.kind === "peak-offpeak") {
					const phase = pricing.effectiveNow === "peak" ? t("pricing.peakNow") : t("pricing.offPeakNow");
					return `${mode} · ${phase}`;
				}
				return `${mode} · ${pricing.activePolicy.label ?? ""}`;
			})();
			const coding = value?.coding;
			const modelRows = Object.entries(byModel)
				.sort((a, b) => b[1].cost - a[1].cost)
				.slice(0, 20)
				.map(([model, counts]) => {
					const isSaveOnly = savedOf(counts) > 0 && amountOf(counts) <= 0;
					return react_jsx_runtime.jsxs("tr", {
						children: [
							react_jsx_runtime.jsx("td", { children: model }),
							react_jsx_runtime.jsx("td", {
								className: css_default.num,
								children: formatNumber(counts.calls)
							}),
							react_jsx_runtime.jsx("td", {
								className: css_default.num,
								children: isSaveOnly
									? `${t("saved")} ${formatCost(symbol, savedOf(counts))}`
									: formatCost(symbol, amountOf(counts))
							}),
							react_jsx_runtime.jsx("td", {
								className: css_default.num,
								children: savedOf(counts) > 0 ? `${t("saved")} ${formatCost(symbol, savedOf(counts))}` : "—"
							})
						]
					}, model);
				});
			const sessionRows = sessionList.slice(0, 30).map((session) => {
				const saved = savedOf(session);
				const cost = amountOf(session);
				const isSaveOnly = saved > 0 && cost <= 0;
				return react_jsx_runtime.jsxs("tr", {
					children: [
						react_jsx_runtime.jsx("td", { children: session.sessionId }),
						react_jsx_runtime.jsx("td", {
							className: css_default.num,
							children: formatNumber(session.calls)
						}),
						react_jsx_runtime.jsx("td", {
							className: css_default.num,
							children: isSaveOnly
								? `${t("saved")} ${formatCost(symbol, saved)}`
								: formatCost(symbol, cost)
						}),
						react_jsx_runtime.jsx("td", {
							className: css_default.num,
							children: saved > 0 ? `${t("saved")} ${formatCost(symbol, saved)}` : "—"
						})
					]
				}, session.sessionId);
			});
			const historyRows = history.map((day) => react_jsx_runtime.jsxs("tr", {
				children: [
					react_jsx_runtime.jsx("td", { children: day.date }),
					react_jsx_runtime.jsx("td", {
						className: css_default.num,
						children: formatNumber(day.calls)
					}),
					react_jsx_runtime.jsx("td", {
						className: css_default.num,
						children: formatCost(symbol, amountOf(day))
					}),
					react_jsx_runtime.jsx("td", {
						className: css_default.num,
						children: savedOf(day) > 0 ? `${t("saved")} ${formatCost(symbol, savedOf(day))}` : "—"
					})
				]
			}, day.date));
			const planChips = coding?.plans === void 0
				? null
				: Object.entries(coding.plans).map(([id, plan]) => react_jsx_runtime.jsx("span", {
					className: `${css_default.route}${plan.kind === "subscription" ? ` ${css_default.routeMuted}` : ""}`,
					title: plan.kind === "subscription" ? t("coding.subscription") : t("coding.official"),
					children: `${plan.label}`
				}, id));
			return react_jsx_runtime.jsxs("div", {
				className: css_default.settingsRoot,
				children: [
					react_jsx_runtime.jsx("div", {
						className: css_default.cards,
						children: [
							card(t("today"), today),
							card(t("month"), month),
							card(t("total"), totals),
							...(balanceNode !== null ? [balanceNode] : [])
						]
					}),
					react_jsx_runtime.jsx("div", { className: css_default.sep }),
					pricingText !== null && react_jsx_runtime.jsx("p", {
						className: css_default.hint,
						children: pricingText
					}),
					coding !== void 0 && react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
						children: [
							react_jsx_runtime.jsx("p", {
								className: css_default.hint,
								children: `${t("coding.plans")} ${t("coding.rate", { rate: coding.rate })}${
									coding.source?.version !== void 0 ? ` · ${t("coding.source", { version: coding.source.version })}` : ""
								}`
							}),
							planChips !== null && react_jsx_runtime.jsx("div", {
								style: { display: "flex", flexWrap: "wrap", gap: 6 },
								children: planChips
							})
						]
					}),
					react_jsx_runtime.jsx("div", { className: css_default.sep }),
					react_jsx_runtime.jsxs("div", {
						children: [
							react_jsx_runtime.jsx("p", { className: css_default.sectionTitle, children: t("byModel") }),
							modelRows.length === 0
								? react_jsx_runtime.jsx("p", { className: css_default.empty, children: t("empty") })
								: react_jsx_runtime.jsx("div", {
									className: css_default.scroll,
									children: react_jsx_runtime.jsxs("table", {
										className: css_default.table,
										children: [
											react_jsx_runtime.jsx("thead", {
												children: react_jsx_runtime.jsxs("tr", {
													children: [
														react_jsx_runtime.jsx("th", { children: t("model") }),
														react_jsx_runtime.jsx("th", { className: css_default.num, children: t("calls") }),
														react_jsx_runtime.jsx("th", { className: css_default.num, children: t("cost") }),
														react_jsx_runtime.jsx("th", { className: css_default.num, children: t("saved") })
													]
												})
											}),
											react_jsx_runtime.jsx("tbody", { children: modelRows })
										]
									})
								})
						]
					}),
					react_jsx_runtime.jsxs("div", {
						children: [
							react_jsx_runtime.jsx("p", { className: css_default.sectionTitle, children: t("sessions") }),
							sessionRows.length === 0
								? react_jsx_runtime.jsx("p", { className: css_default.empty, children: t("empty") })
								: react_jsx_runtime.jsx("div", {
									className: css_default.scroll,
									children: react_jsx_runtime.jsxs("table", {
										className: css_default.table,
										children: [
											react_jsx_runtime.jsx("thead", {
												children: react_jsx_runtime.jsxs("tr", {
													children: [
														react_jsx_runtime.jsx("th", { children: t("session") }),
														react_jsx_runtime.jsx("th", { className: css_default.num, children: t("calls") }),
														react_jsx_runtime.jsx("th", { className: css_default.num, children: t("cost") }),
														react_jsx_runtime.jsx("th", { className: css_default.num, children: t("saved") })
													]
												})
											}),
											react_jsx_runtime.jsx("tbody", { children: sessionRows })
										]
									})
								})
						]
					}),
					react_jsx_runtime.jsxs("div", {
						children: [
							react_jsx_runtime.jsx("p", { className: css_default.sectionTitle, children: t("history") }),
							historyRows.length === 0
								? react_jsx_runtime.jsx("p", { className: css_default.empty, children: t("empty") })
								: react_jsx_runtime.jsx("div", {
									className: css_default.scroll,
									children: react_jsx_runtime.jsxs("table", {
										className: css_default.table,
										children: [
											react_jsx_runtime.jsx("thead", {
												children: react_jsx_runtime.jsxs("tr", {
													children: [
														react_jsx_runtime.jsx("th", { children: t("date") }),
														react_jsx_runtime.jsx("th", { className: css_default.num, children: t("calls") }),
														react_jsx_runtime.jsx("th", { className: css_default.num, children: t("cost") }),
														react_jsx_runtime.jsx("th", { className: css_default.num, children: t("saved") })
													]
												})
											}),
											react_jsx_runtime.jsx("tbody", { children: historyRows })
										]
									})
								})
						]
					})
				]
			});
		}
		//#endregion
		//#region lib/types/client/locales.js
		/** `billing` 命名空间字典。 */
		const zh = {
			"sessionCost": "本会话费用",
			"today": "今日",
			"month": "本月",
			"total": "累计",
			"dimension": "维度",
			"inThisSession": "本会话",
			"hit": "命中率",
			"calls": "调用次数",
			"input": "输入",
			"cache": "缓存命中",
			"output": "输出",
			"byModel": "按模型",
			"pricing.auto": "官方政策自动计价",
			"pricing.custom": "自定义价格",
			"pricing.peakNow": "当前为高峰期",
			"pricing.offPeakNow": "当前为峰谷期",
			"balance": "账户余额",
			"balance.unavailable": "不可用",
			"balance.granted": "赠金",
			"balance.toppedUp": "充值",
			"local": "本地模型",
			"cost": "花费",
			"saved": "省",
			"sessionSaved": "本会话节省",
			"savedTotal": "累计节省",
			"nominal": "名义",
			"openSettings": "汇总请查看 设置 → 费用",
			"sectionLabel": "费用",
			"loading": "加载中…",
			"empty": "暂无数据",
			"model": "模型",
			"tokens": "输入/缓存/输出",
			"session": "会话",
			"date": "日期",
			"history": "按天历史",
			"sessions": "会话",
			"coding.plans": "内置 coding plan（DSH 预设）：",
			"coding.rate": "参考汇率 $1 = ¥{rate}",
			"coding.source": "价表来源 {version}",
			"coding.official": "平台官方美元价",
			"coding.subscription": "订阅 token 包（按 0 计）"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"sessionCost": "Session cost",
			"today": "Today",
			"month": "This month",
			"total": "Total",
			"dimension": "Dimension",
			"inThisSession": "In this session",
			"hit": "Hit rate",
			"calls": "Calls",
			"input": "Input",
			"cache": "Cache hit",
			"output": "Output",
			"byModel": "By model",
			"pricing.auto": "Official pricing policy",
			"pricing.custom": "Custom prices",
			"pricing.peakNow": "Peak hours now",
			"pricing.offPeakNow": "Off-peak now",
			"balance": "Account balance",
			"balance.unavailable": "Unavailable",
			"balance.granted": "Granted",
			"balance.toppedUp": "Topped up",
			"local": "Local model",
			"cost": "Cost",
			"saved": "Saved",
			"sessionSaved": "Session savings",
			"savedTotal": "Total saved",
			"nominal": "Nominal",
			"openSettings": "Summary: Settings → Cost",
			"sectionLabel": "Cost",
			"loading": "Loading…",
			"empty": "No data",
			"model": "Model",
			"tokens": "in/cache/out",
			"session": "Session",
			"date": "Date",
			"history": "Daily history",
			"sessions": "Sessions",
			"coding.plans": "Built-in coding plans (DSH preset):",
			"coding.rate": "Reference rate $1 = ¥{rate}",
			"coding.source": "Price source {version}",
			"coding.official": "Official platform USD price",
			"coding.subscription": "Subscription token plan (priced at 0)"
		};
		//#endregion
		//#region lib/types/client/currency.js
		/**
		* 展示币种解析：displayCurrency 显式指定时优先；auto 跟随界面语言
		* （英文界面显示美元，其余显示人民币）。
		*/
		function resolveCurrency(displayCurrency, activeLocale) {
			if (displayCurrency === "CNY" || displayCurrency === "USD") return displayCurrency;
			return activeLocale === "en" ? "USD" : "CNY";
		}
		/** 简单订阅源：locale 快照（仅 active 字段）。 */
		function createLocaleStore(initial) {
			const store = {
				active: initial,
				listeners: /* @__PURE__ */ new Set()
			};
			return {
				getSnapshot: () => store,
				subscribe: (listener) => {
					store.listeners.add(listener);
					return () => {
						store.listeners.delete(listener);
					};
				},
				set: (active) => {
					if (store.active === active) return;
					store.active = active;
					for (const listener of [...store.listeners]) try {
						listener();
					} catch (error) {
						console.error("[dsh-web-billing] locale subscriber threw:", error);
					}
				}
			};
		}
		//#endregion
		//#region lib/types/client/index.js
		/**
		* 计费插件浏览器端：在 assistant 消息动作条与会话头部工具条渲染费用
		* （人民币/美元随界面语言切换），数据来自 host 的 /billing 只读端点
		* （轮询 5s + 会话级按需拉取）。
		* @module dsh-web-billing/client
		*/
		/** 字典命名空间。 */
		const NS = "billing";
		/** 需要的服务：插槽注册与本地化。 */
		const inject = [
			"slots",
			"locale"
		];
		/**
		* 客户端插件主体。
		* @param ctx - client root context。
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "web-billing: dictionaries");
			const controller = new BillingController();
			const localeStore = createLocaleStore(ctx.locale.getSnapshot().active);
			ctx.effect(() => ctx.locale.subscribe(() => {
				// LocaleFace 的 subscribe 回调不携带快照，需自行读取。
				localeStore.set(ctx.locale.getSnapshot().active);
			}), "web-billing: locale sync");
			const tearDown = [];
			const injectFace = (sessionId) => ({
				hooks: { billing: controller, locale: localeStore },
				refreshSession: (id) => controller.refreshSession(id)
			});
			tearDown.push(ctx.slots.inject("conversation.chat.assistant-actions", () => {
				const dispose = ctx.slots.register({
					name: "conversation.chat.assistant-actions",
					id: "billing",
					order: 20,
					locale: NS,
					inject: injectFace
				}, MessageCostChip);
				return () => {
					dispose();
				};
			}));
			tearDown.push(ctx.slots.inject("conversation.session.header.utilities", () => {
				const dispose = ctx.slots.register({
					name: "conversation.session.header.utilities",
					id: "billing",
					order: 10,
					locale: NS,
					inject: injectFace
				}, SessionCostBadge);
				return () => {
					dispose();
				};
			}));
			// settings → 费用 汇总页（查看型）：数据来自 host /billing/state（只读）。
			// inject 必须是工厂函数（每次调用返回新 face），与 conversation 槽位一致。
			const settingsInject = () => ({
				hooks: { billing: controller, locale: localeStore }
			});
			tearDown.push(ctx.slots.inject("settings.section", () => {
				const dispose = ctx.slots.register({
					name: "settings.section",
					id: "web-billing",
					order: 40,
					label: () => ctx.locale.bind(NS)("sectionLabel"),
					locale: NS,
					inject: settingsInject
				}, SettingsBillingSection);
				return () => {
					dispose();
				};
			}));
			ctx.effect(() => () => {
				controller.dispose();
				for (const dispose of tearDown) dispose();
			}, "web-billing: teardown");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
