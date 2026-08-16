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
			tag.textContent = css;
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
			"name": "b8l_name",
			"cost": "b8l_cost",
			"footer": "b8l_footer",
			"save": "b8l_save"
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
		/** Compact token totals for the persistent header badge. */
		function formatCompactTokens(value) {
			if (!Number.isFinite(value) || value <= 0) return "0";
			if (value >= 1e9) return `${(value / 1e9).toFixed(2).replace(/\.00$/, "")}B`;
			if (value >= 1e6) return `${(value / 1e6).toFixed(2).replace(/\.00$/, "")}M`;
			if (value >= 1e3) return `${(value / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
			return formatNumber(value);
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
		* 会话头部工具条里的费用角标：显示本会话费用；点击展开面板，
		* 展示本会话 / 今日 / 本月 / 累计与按模型拆分。
		* @param props - 会话标准 props + useBilling / refreshSession + t。
		* @returns 费用角标；本会话尚无计费记录时不渲染。
		*/
		function SessionCostBadge({ sessionId, useBilling, useLocale, refreshSession, t }) {
			const view = useBilling((snapshot) => snapshot);
			const session = view.sessions[sessionId];
			const activeLocale = useLocale((snapshot) => snapshot.active);
			const [open, setOpen] = react.useState(false);
			const seeded = react.useRef(false);
			react.useEffect(() => {
				if (!seeded.current) {
					seeded.current = true;
					refreshSession(sessionId);
				}
			}, [refreshSession, sessionId]);
			const totals = view.value?.totals;
			// An empty/new current session must not hide the plugin's account-local
			// ledger. Fall back to the DSH totals; only hide while neither scope has
			// any data yet.
			if ((session === void 0 || (session.cost <= 0 && session.savings <= 0)) && totals === void 0) return null;
			const currency = resolveCurrency(view.value?.displayCurrency ?? "auto", activeLocale);
			const symbol = currency === "USD" ? (view.value?.symbolUsd ?? "$") : (view.value?.symbol ?? "¥");
			const amountOf = (value) => currency === "USD" ? value.costUsd : value.cost;
			const savedOf = (value) => currency === "USD" ? value.savingsUsd : value.savings;
			const active = session ?? totals;
			const sessionSavings = savedOf(active);
			const isSavingsBadge = active.cost <= 0 && sessionSavings > 0;
			const badgeValue = isSavingsBadge
				? `${t("saved")} ${formatCost(symbol, sessionSavings)}`
				: formatCost(symbol, amountOf(active));
			const totalTokens = totals === void 0
				? 0
				: totals.inputTokens + totals.cacheReadTokens + totals.outputTokens;
			const totalsMoney = totals === void 0
				? badgeValue
				: amountOf(totals) > 0
					? formatCost(symbol, amountOf(totals))
					: `${t("saved")} ${formatCost(symbol, savedOf(totals))}`;
			const badgeText = totals === void 0
				? badgeValue
				: `${t("scope.short")} ${formatCompactTokens(totalTokens)} ${t("tokens.short")} · ${totalsMoney}`;
			const today = view.value?.today;
			const month = view.value?.month;
			const totalSavings = totals === void 0 ? 0 : savedOf(totals);
			const todaySavings = today === void 0 ? 0 : savedOf(today);
			const monthSavings = month === void 0 ? 0 : savedOf(month);
			const hasSavings = sessionSavings > 0 || todaySavings > 0 || monthSavings > 0 || totalSavings > 0;
			const costMode = totals !== void 0 && amountOf(totals) > 0;
			// 表格形态：both=花费+节省两列；save=纯本地只有节省；cost=只有花费。
			const gridKind = hasSavings && costMode ? "both" : hasSavings ? "save" : "cost";
			const byModel = view.value?.byModel;
			const modelRows = byModel === void 0 ? [] : Object.entries(byModel)
				.sort((a, b) => b[1].cost - a[1].cost)
				.slice(0, 8)
				.map(([model, counts]) => {
					// 本地模型实际成本为 0：模型行显示节省金额，悬停给出名义价值。
					const isLocalModel = counts.savings > 0 && counts.cost <= 0;
					const value = isLocalModel
						? `${t("saved")} ${formatCost(symbol, savedOf(counts))}`
						: formatCost(symbol, amountOf(counts));
					return [model, value, isLocalModel ? `${t("nominal")} ${formatCost(symbol, currency === "USD" ? counts.costNominalUsd : counts.costNominal)}` : void 0, isLocalModel];
				});
			const pricing = view.value?.pricing;
			const pricingText = pricing === void 0 ? null : (() => {
				const mode = pricing.mode === "auto" ? t("pricing.auto") : t("pricing.custom");
				if (pricing.activePolicy === null) return mode;
				if (pricing.activePolicy.kind === "peak-offpeak") {
					const phase = pricing.effectiveNow === "peak" ? t("pricing.peakNow") : t("pricing.offPeakNow");
					return `${mode} · ${phase}`;
				}
				return `${mode} · ${pricing.activePolicy.label ?? ""}`;
			})();
			const balance = view.value?.balance;
			const balanceRow = balance === void 0 || balance.status === "disabled" || balance.status === "idle" ? null
				: balance.status === "ready" && balance.balance !== void 0
					? (() => {
						const preferred = currency === "USD" ? balance.balance.usd : balance.balance.cny;
						const info = preferred ?? (currency === "USD" ? balance.balance.cny : balance.balance.usd);
						if (info === null) return [t("balance"), t("balance.unavailable")];
						return [
							t("balance"),
							formatCost(symbol, info.total),
							`${t("balance.granted")} ${formatCost(symbol, info.granted)} · ${t("balance.toppedUp")} ${formatCost(symbol, info.toppedUp)}`
						];
					})()
					: [t("balance"), t("balance.unavailable")];
			return react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
				children: [
					react_jsx_runtime.jsx("div", {
						className: css_default.wrap,
						children: react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
							children: [
								react_jsx_runtime.jsx("button", {
									type: "button",
									className: css_default.badge,
									"data-open": open || void 0,
									"aria-expanded": open,
									title: `${t("scope.note")} · ${t("calls")} ${formatNumber(active.calls)}`,
									onClick: () => {
										setOpen(!open);
									},
									children: badgeText
								}),
								open && react_jsx_runtime.jsx("div", {
									className: css_default.backdrop,
									onClick: () => {
										setOpen(false);
									}
								}),
								open && react_jsx_runtime.jsxs("div", {
									className: css_default.panel,
									children: [
										react_jsx_runtime.jsx("div", {
											className: css_default.head,
											children: [
												react_jsx_runtime.jsx("span", {
													className: css_default.headLabel,
													children: session === void 0 ? t("scope.local") : isSavingsBadge ? t("sessionSaved") : t("sessionCost")
												}),
												react_jsx_runtime.jsx("span", {
													className: css_default.headValues,
													children: [
														costMode && react_jsx_runtime.jsx("span", {
														className: css_default.headValue,
														children: amountOf(active) > 0 ? formatCost(symbol, amountOf(active)) : formatCost(symbol, 0)
														}),
														hasSavings && react_jsx_runtime.jsx("span", {
															className: `${css_default.headValue} ${css_default.save}${costMode ? ` ${css_default.small}` : ""}`,
															children: `${t("saved")} ${formatCost(symbol, sessionSavings)}`
														})
													]
												})
											]
										}),
										react_jsx_runtime.jsx("div", {
											className: css_default.sub,
											children: [
												balanceRow !== null && react_jsx_runtime.jsx("span", {
													title: balanceRow[2],
													children: `${t("balance")} ${balanceRow[1]}`
												}),
												react_jsx_runtime.jsx("span", {
													children: `${t("calls")} ${formatNumber(active.calls)}`
												})
											]
										}),
										react_jsx_runtime.jsx("div", { className: css_default.sep }),
										react_jsx_runtime.jsx("div", {
											className: css_default.gridHead,
											"data-kind": gridKind,
											children: [
												gridKind !== "save" && react_jsx_runtime.jsx("span", { children: t("cost") }),
												gridKind !== "cost" && react_jsx_runtime.jsx("span", { className: css_default.save, children: t("saved") })
											]
										}),
										react_jsx_runtime.jsx("div", {
											className: css_default.grid,
											"data-kind": gridKind,
											children: [
												gridKind !== "save" && react_jsx_runtime.jsxs("div", {
													className: css_default.cell,
													children: [
														react_jsx_runtime.jsx("span", { className: css_default.k, children: t("today") }),
														react_jsx_runtime.jsx("span", { className: css_default.v, children: today === void 0 ? formatCost(symbol, 0) : formatCost(symbol, amountOf(today)) })
													]
												}),
												gridKind !== "cost" && react_jsx_runtime.jsxs("div", {
													className: `${css_default.cell} ${css_default.save}`,
													children: [
														react_jsx_runtime.jsx("span", { className: css_default.k, children: t("today") }),
														react_jsx_runtime.jsx("span", { className: css_default.v, children: formatCost(symbol, todaySavings) })
													]
												}),
												gridKind !== "save" && react_jsx_runtime.jsxs("div", {
													className: css_default.cell,
													children: [
														react_jsx_runtime.jsx("span", { className: css_default.k, children: t("month") }),
														react_jsx_runtime.jsx("span", { className: css_default.v, children: month === void 0 ? formatCost(symbol, 0) : formatCost(symbol, amountOf(month)) })
													]
												}),
												gridKind !== "cost" && react_jsx_runtime.jsxs("div", {
													className: `${css_default.cell} ${css_default.save}`,
													children: [
														react_jsx_runtime.jsx("span", { className: css_default.k, children: t("month") }),
														react_jsx_runtime.jsx("span", { className: css_default.v, children: formatCost(symbol, monthSavings) })
													]
												}),
												gridKind !== "save" && react_jsx_runtime.jsxs("div", {
													className: css_default.cell,
													children: [
														react_jsx_runtime.jsx("span", { className: css_default.k, children: t("total") }),
														react_jsx_runtime.jsx("span", { className: css_default.v, children: totals === void 0 ? formatCost(symbol, 0) : formatCost(symbol, amountOf(totals)) })
													]
												}),
												gridKind !== "cost" && react_jsx_runtime.jsxs("div", {
													className: `${css_default.cell} ${css_default.save}`,
													title: `${t("savedTotal")} ${formatCost(symbol, totalSavings)}`,
													children: [
														react_jsx_runtime.jsx("span", { className: css_default.k, children: t("total") }),
														react_jsx_runtime.jsx("span", { className: css_default.v, children: formatCost(symbol, totalSavings) })
													]
												})
											]
										}),
										modelRows.length > 0 && react_jsx_runtime.jsx("div", {
											className: css_default.sep
										}),
										modelRows.length > 0 && react_jsx_runtime.jsx("div", {
											className: css_default.section,
											children: t("byModel")
										}),
										modelRows.map(([model, value, detail, isSave]) => react_jsx_runtime.jsxs("div", {
											className: `${css_default.modelRow}${isSave ? ` ${css_default.save}` : ""}`,
											title: detail,
											children: [
												react_jsx_runtime.jsx("span", { className: css_default.name, children: model }),
												react_jsx_runtime.jsx("span", { className: css_default.cost, children: value })
											]
										}, model)),
										totals !== void 0 && react_jsx_runtime.jsx("div", {
											className: css_default.footer,
											children: `${t("input")} ${formatNumber(totals.inputTokens)} · ${t("cache")} ${formatNumber(totals.cacheReadTokens)} · ${t("output")} ${formatNumber(totals.outputTokens)}`
										}),
										react_jsx_runtime.jsx("div", {
											className: css_default.footer,
											children: t("scope.note")
										}),
										pricingText !== null && react_jsx_runtime.jsx("div", {
											className: css_default.footer,
											children: pricingText
										})
									]
								})
							]
						})
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
			"calls": "调用次数",
			"input": "输入",
			"cache": "缓存命中",
			"output": "输出",
			"byModel": "按模型",
			"pricing.auto": "官方政策自动计价",
			"pricing.custom": "自定义价格",
			"pricing.peakNow": "当前为高峰时段",
			"pricing.offPeakNow": "当前为空闲时段",
			"balance": "DeepSeek 官方余额",
			"balance.unavailable": "不可用",
			"balance.granted": "赠金",
			"balance.toppedUp": "充值",
			"local": "本地模型",
			"cost": "花费",
			"saved": "省",
			"sessionSaved": "本会话节省",
			"savedTotal": "累计节省",
			"nominal": "名义",
			"scope.short": "DSH",
			"scope.local": "DSH 本地统计",
			"scope.note": "DSH 本地统计（仅本插件捕获的已完成调用），不是 DeepSeek 官方账单",
			"tokens.short": "tok"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"sessionCost": "Session cost",
			"today": "Today",
			"month": "This month",
			"total": "Total",
			"calls": "Calls",
			"input": "Input",
			"cache": "Cache hit",
			"output": "Output",
			"byModel": "By model",
			"pricing.auto": "Official pricing policy",
			"pricing.custom": "Custom prices",
			"pricing.peakNow": "Peak hours now",
			"pricing.offPeakNow": "Off-peak now",
			"balance": "Official DeepSeek balance",
			"balance.unavailable": "Unavailable",
			"balance.granted": "Granted",
			"balance.toppedUp": "Topped up",
			"local": "Local model",
			"cost": "Cost",
			"saved": "Saved",
			"sessionSaved": "Session savings",
			"savedTotal": "Total saved",
			"nominal": "Nominal",
			"scope.short": "DSH",
			"scope.local": "Local DSH ledger",
			"scope.note": "Local DSH estimate (completed calls captured by this plugin), not the official DeepSeek invoice",
			"tokens.short": "tok"
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
