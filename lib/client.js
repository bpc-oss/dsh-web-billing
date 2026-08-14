window.__ModuleLoader__.load({
	id: "dsh-web-billing",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		//#region billing.module.css
		const css = ".b8l_chip{color:var(--dsw-alias-label-tertiary);border-radius:10px;padding:0 6px;font-size:12px;line-height:24px;white-space:nowrap;cursor:help}.b8l_chip:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}.b8l_wrap{position:relative;display:inline-flex}.b8l_badge{display:inline-flex;align-items:center;gap:4px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:var(--dsw-alias-interactive-bg-hover);border:none;border-radius:12px;padding:2px 10px;font-size:12px;line-height:20px;white-space:nowrap}.b8l_badge:hover{color:var(--dsw-alias-label-secondary)}.b8l_badge[data-open]{color:var(--dsw-alias-label-primary)}.b8l_backdrop{position:fixed;inset:0;z-index:29}.b8l_panel{position:absolute;top:calc(100% + 6px);right:0;z-index:30;box-sizing:border-box;background:var(--dsw-alias-bg-primary);border:1px solid var(--dsw-alias-border-secondary);border-radius:12px;box-shadow:var(--dsw-shadow-popover,0 8px 24px rgba(0,0,0,.12));width:280px;padding:10px 12px;font-size:13px;line-height:20px}.b8l_title{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;margin:8px 0 4px}.b8l_row{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.b8l_key{color:var(--dsw-alias-label-secondary)}.b8l_value{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;text-align:right}";
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
			"title": "b8l_title",
			"row": "b8l_row",
			"key": "b8l_key",
			"value": "b8l_value"
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
				? `${t("saved")}${formatCost(symbol, savedAmount)}`
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
			// 纯本地模型会话的实际成本为 0：只要有节省（名义价值>0）就应显示徽章，
			// 徽章文字展示节省金额而非 ¥0。
			if (session === void 0 || (session.cost <= 0 && session.savings <= 0)) return null;
			const currency = resolveCurrency(view.value?.displayCurrency ?? "auto", activeLocale);
			const symbol = currency === "USD" ? (view.value?.symbolUsd ?? "$") : (view.value?.symbol ?? "¥");
			const amountOf = (value) => currency === "USD" ? value.costUsd : value.cost;
			const savedOf = (value) => currency === "USD" ? value.savingsUsd : value.savings;
			const sessionSavings = savedOf(session);
			const isSavingsBadge = session.cost <= 0 && sessionSavings > 0;
			const badgeValue = isSavingsBadge
				? formatCost(symbol, sessionSavings)
				: formatCost(symbol, amountOf(session));
			const badgeText = isSavingsBadge ? `${t("saved")}${badgeValue}` : badgeValue;
			const totals = view.value?.totals;
			const today = view.value?.today;
			const month = view.value?.month;
			const rows = [];
			if (totals !== void 0) rows.push([t("total"), formatCost(symbol, amountOf(totals))]);
			if (today !== void 0) rows.push([`${t("today")} (${String(today.date).slice(5)})`, formatCost(symbol, amountOf(today))]);
			if (month !== void 0) rows.push([`${t("month")} (${month.key})`, formatCost(symbol, amountOf(month))]);
			const totalSavings = totals === void 0 ? 0 : savedOf(totals);
			const byModel = view.value?.byModel;
			const modelRows = byModel === void 0 ? [] : Object.entries(byModel)
				.sort((a, b) => b[1].cost - a[1].cost)
				.slice(0, 8)
				.map(([model, counts]) => [model, formatCost(symbol, amountOf(counts))]);
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
									title: `${isSavingsBadge ? t("sessionSaved") : t("sessionCost")} · ${t("calls")} ${formatNumber(session.calls)}`,
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
											className: css_default.row,
											children: [
												react_jsx_runtime.jsx("span", { className: css_default.key, children: isSavingsBadge ? t("sessionSaved") : t("sessionCost") }),
												react_jsx_runtime.jsx("span", { className: css_default.value, children: badgeValue })
											]
										}),
										sessionSavings > 0 && react_jsx_runtime.jsxs("div", {
											className: css_default.row,
											title: `${t("savedTotal")} ${formatCost(symbol, totalSavings)}`,
											children: [
												react_jsx_runtime.jsx("span", { className: css_default.key, children: t("saved") }),
												react_jsx_runtime.jsx("span", { className: css_default.value, children: formatCost(symbol, sessionSavings) })
											]
										}),
										balanceRow !== null && react_jsx_runtime.jsxs("div", {
											className: css_default.row,
											title: balanceRow[2],
											children: [
												react_jsx_runtime.jsx("span", { className: css_default.key, children: balanceRow[0] }),
												react_jsx_runtime.jsx("span", { className: css_default.value, children: balanceRow[1] })
											]
										}),
										rows.map(([key, value]) => react_jsx_runtime.jsxs("div", {
											className: css_default.row,
											children: [
												react_jsx_runtime.jsx("span", { className: css_default.key, children: key }),
												react_jsx_runtime.jsx("span", { className: css_default.value, children: value })
											]
										}, key)),
										modelRows.length > 0 && react_jsx_runtime.jsx("div", {
											className: css_default.title,
											children: t("byModel")
										}),
										modelRows.map(([model, value]) => react_jsx_runtime.jsxs("div", {
											className: css_default.row,
											children: [
												react_jsx_runtime.jsx("span", { className: css_default.key, children: model }),
												react_jsx_runtime.jsx("span", { className: css_default.value, children: value })
											]
										}, model)),
										pricingText !== null && react_jsx_runtime.jsx("div", {
											className: css_default.title,
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
			"balance": "账户余额",
			"balance.unavailable": "不可用",
			"balance.granted": "赠金",
			"balance.toppedUp": "充值",
			"local": "本地模型",
			"saved": "已节省",
			"sessionSaved": "本会话节省",
			"savedTotal": "累计节省",
			"nominal": "名义"
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
			"balance": "Account balance",
			"balance.unavailable": "Unavailable",
			"balance.granted": "Granted",
			"balance.toppedUp": "Topped up",
			"local": "Local model",
			"saved": "Saved",
			"sessionSaved": "Session savings",
			"savedTotal": "Total saved",
			"nominal": "Nominal"
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
