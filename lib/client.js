window.__ModuleLoader__.load({
	id: "dsh-web-billing",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let react_dom = require("react-dom");
		//#region billing.module.css
		const css = ".b8l_chip{color:var(--dsw-alias-label-tertiary);border-radius:10px;padding:0 6px;font-size:12px;line-height:24px;white-space:nowrap;cursor:help}.b8l_chip:hover{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover)}.b8l_wrap{position:relative;display:inline-flex}@media(min-width:1200px){.b8l_wrap{margin-right:64px}}.b8l_badge{display:inline-flex;align-items:center;gap:4px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:var(--dsw-alias-interactive-bg-hover);border:none;border-radius:12px;padding:2px 10px;font-size:12px;line-height:20px;white-space:nowrap}.b8l_badge:hover{color:var(--dsw-alias-label-secondary)}.b8l_badge[data-open]{color:var(--dsw-alias-label-primary)}.b8l_backdrop{position:fixed;inset:0;z-index:29}.b8l_panel{position:absolute;top:calc(100% + 6px);right:0;z-index:30;box-sizing:border-box;background:var(--dsw-alias-bg-primary);border:1px solid var(--dsw-alias-border-secondary);border-radius:12px;box-shadow:var(--dsw-shadow-popover,0 8px 24px rgba(0,0,0,.12));width:300px;padding:12px 14px}.b8l_head{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.b8l_headLabel{color:var(--dsw-alias-label-secondary);font-size:12px;white-space:nowrap}.b8l_headValues{display:flex;align-items:baseline;gap:10px}.b8l_headValue{color:var(--dsw-alias-label-primary);font-size:20px;font-weight:700;font-variant-numeric:tabular-nums;line-height:24px;white-space:nowrap}.b8l_headValue.b8l_save{color:#16a34a}.b8l_headValue.b8l_small{font-size:14px;font-weight:600}.b8l_sub{display:flex;flex-wrap:wrap;gap:4px 14px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;margin-top:2px}.b8l_sub .b8l_save{color:#16a34a}.b8l_sep{border-top:1px solid var(--dsw-alias-border-secondary);margin:9px 0}.b8l_gridHead{display:grid;grid-template-columns:1fr 1fr;gap:3px 18px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;margin-bottom:3px}.b8l_gridHead[data-kind=cost],.b8l_gridHead[data-kind=save]{grid-template-columns:1fr}.b8l_gridHead .b8l_save{color:#16a34a;text-align:right}.b8l_grid{display:grid;grid-template-columns:1fr 1fr;gap:3px 18px}.b8l_grid[data-kind=cost],.b8l_grid[data-kind=save]{grid-template-columns:1fr}.b8l_cell{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:12px;line-height:19px;white-space:nowrap}.b8l_k{color:var(--dsw-alias-label-secondary);min-width:0;overflow:hidden;text-overflow:ellipsis}.b8l_v{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;text-align:right}.b8l_cell.b8l_save .b8l_v{color:#16a34a}.b8l_section{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;margin-bottom:3px}.b8l_modelRow{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-size:12px;line-height:20px;white-space:nowrap}.b8l_name{color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis}.b8l_cost{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;text-align:right}.b8l_modelRow.b8l_save .b8l_cost{color:#16a34a}.b8l_footer{color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;margin-top:9px}";
		const tagId = "dsh-web-billing/billing.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-web-billing";
			tag.dataset.pluginCss = tagId;
			tag.textContent = ".b8l_badgeOpen{color:var(--dsw-alias-label-primary)}.b8l_badge{font-family:inherit}.b8l_panelOnHeader{position:absolute;top:calc(100% + 6px);right:0;width:min(340px,calc(100vw - 32px));max-height:70vh;overflow:auto}.b8l_modelRow{display:flex;flex-direction:column;gap:2px;padding:3px 0;font-size:12px;line-height:18px}.b8l_modelLine{display:flex;justify-content:space-between;align-items:baseline;gap:12px;min-width:0}.b8l_tokenLine{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px;padding-left:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.b8l_tokenLine.b8l_save{color:#16a34a}" + css + ".b8l_settingsRoot{display:flex;flex-direction:column;gap:18px;padding:2px 2px 24px;font-size:13px;color:var(--dsw-alias-label-primary)}.b8l_cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.b8l_card{border:1px solid var(--dsw-alias-border-l1);border-radius:12px;padding:14px 16px;background:var(--dsw-alias-bg-layer-1)}.b8l_cardTitle{font-size:12px;color:var(--dsw-alias-label-tertiary);margin:0 0 8px}.b8l_cardValue{font-size:20px;line-height:28px;font-weight:600}.b8l_cardValue.b8l_save{color:#16a34a}.b8l_cardSub{font-size:12px;color:var(--dsw-alias-label-tertiary);margin-top:4px}.b8l_hint{font-size:12px;color:var(--dsw-alias-label-tertiary);margin:0}.b8l_button{font:inherit;font-size:13px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-button-elevated-fill);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:6px 14px;cursor:pointer}.b8l_button:hover{background:var(--dsw-alias-interactive-bg-hover)}.b8l_table{width:100%;border-collapse:collapse;font-size:12px}.b8l_table th,.b8l_table td{text-align:left;padding:7px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);white-space:nowrap}.b8l_table th{color:var(--dsw-alias-label-tertiary);font-weight:500}.b8l_table td.b8l_num,.b8l_table th.b8l_num{text-align:right;font-variant-numeric:tabular-nums}.b8l_table tr:last-child td{border-bottom:none}.b8l_scroll{max-height:300px;overflow:auto;border:1px solid var(--dsw-alias-border-l1);border-radius:10px}.b8l_empty{font-size:12px;color:var(--dsw-alias-label-tertiary);padding:8px 0}.b8l_sectionTitle{font-size:13px;font-weight:600;margin:0}.b8l_route{display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--dsw-alias-label-tertiary);border:1px solid var(--dsw-alias-border-l1);border-radius:999px;padding:1px 8px}.b8l_route_muted{color:var(--dsw-alias-label-tertiary)}.b8l_modelRow{display:flex;flex-direction:column;gap:2px;padding:3px 0;font-size:12px;line-height:18px}.b8l_modelLine{display:flex;justify-content:space-between;align-items:baseline;gap:12px;min-width:0}.b8l_tokenLine{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px;padding-left:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.b8l_tokenLine.b8l_save{color:#16a34a}.b8l_providerBadge{display:inline-block;font-size:9px;line-height:13px;color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:999px;padding:0 5px;margin-left:5px;vertical-align:1px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media(max-width:640px){.b8l_cards{grid-template-columns:1fr}}";
			document.head.appendChild(tag);
		}
		// 浮层专属样式（第二份 <style>，注入时靠后 → 优先级高于主表；仅为悬停面板，不影响设置页）。
		// 设计目标：固定宽度、overflow hidden、所有长文本 min-width:0 + ellipsis，杜绝横向滚动。
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId + "/panel") + "]") === null) {
			const panelStyle = document.createElement("style");
			panelStyle.dataset.plugin = "dsh-web-billing";
			panelStyle.dataset.pluginCss = tagId + "/panel";
			panelStyle.textContent = ".b8l_panelOnHeader{position:fixed;top:44px;right:16px;width:min(312px,calc(100vw - 40px));box-sizing:border-box;padding:12px 14px;overflow:hidden;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.28);z-index:2147483001;color:var(--dsw-alias-label-primary)}.b8l_panelHead{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.b8l_panelTitle{font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.b8l_panelClose{background:none;border:none;color:var(--dsw-alias-label-tertiary);font-size:14px;line-height:1;cursor:pointer;padding:2px 4px;flex:none;border-radius:6px}.b8l_panelClose:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.b8l_summaryGrid{display:flex;flex-direction:column;gap:5px;width:100%}.b8l_sumRow{display:flex;align-items:baseline;justify-content:space-between;gap:10px;min-width:0;width:100%;box-sizing:border-box;font-size:12px;line-height:18px}.b8l_sumLabel{display:flex;align-items:center;gap:6px;min-width:0;flex:1 1 auto;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.b8l_sumLabelK{color:var(--dsw-alias-label-tertiary);font-size:11px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.b8l_sumValues{display:flex;align-items:baseline;gap:10px;flex:none;font-variant-numeric:tabular-nums;white-space:nowrap}.b8l_sumValue{color:var(--dsw-alias-label-primary);white-space:nowrap}.b8l_sumValue.save{color:#16a34a}.b8l_divider{border:0;border-top:1px solid var(--dsw-alias-border-secondary);margin:9px 0}.b8l_modelRow{display:flex;flex-direction:column;gap:3px;padding:5px 0;font-size:12px;line-height:17px;border-radius:8px;width:100%;box-sizing:border-box}.b8l_modelRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.b8l_modelLine{display:flex;align-items:baseline;justify-content:space-between;gap:10px;min-width:0;width:100%}.b8l_modelMeta{display:flex;align-items:baseline;gap:6px;min-width:0;flex:1 1 auto;overflow:hidden}.b8l_modelName{color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.b8l_modelCount{color:var(--dsw-alias-label-tertiary);font-size:10px;flex:none}.b8l_providerBadge{display:inline-block;flex:none;font-size:9px;line-height:13px;color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:999px;padding:0 5px;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.b8l_modelCost{color:var(--dsw-alias-label-primary);flex:none;white-space:nowrap;font-variant-numeric:tabular-nums}.b8l_modelCost.save{color:#16a34a}.b8l_tokenLine{display:flex;gap:8px;min-width:0;width:100%;color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:14px;white-space:nowrap;overflow:hidden}.b8l_tokItem{flex:none;white-space:nowrap}.b8l_tokItem:last-child{overflow:hidden;text-overflow:ellipsis;min-width:0}.b8l_tokenLine.b8l_save{color:rgba(22,163,74,.9)}.b8l_phaseRow{display:flex;align-items:center;gap:6px;font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);padding:2px 0;width:100%;min-width:0}.b8l_phaseDot{width:6px;height:6px;border-radius:50%;flex:none}.b8l_phaseDot.peak{background:var(--dsw-alias-state-warn-primary, #d97706)}.b8l_phaseDot.offPeak{background:var(--dsw-alias-state-success-primary, #16a34a)}.b8l_phaseText{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.b8l_hintRow{font-size:10px;line-height:14px;color:var(--dsw-alias-label-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%}";
			document.head.appendChild(panelStyle);
		}
		// 设置页「费用」专用样式：统一设计系统，颜色全部取自 DSH 真实主题变量
		// （在渲染元素上生效），避免硬编码色值造成「颜色没应用」。
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId + "/settings") + "]") === null) {
			const settingsStyle = document.createElement("style");
			settingsStyle.dataset.plugin = "dsh-web-billing";
			settingsStyle.dataset.pluginCss = tagId + "/settings";
			settingsStyle.textContent = [
				".b8l_setRoot{display:flex;flex-direction:column;gap:16px;padding:4px 2px 24px;font-size:13px;color:var(--dsw-alias-label-primary)}",
				".b8l_setSectionTitle{font-size:13px;font-weight:600;margin:0 0 10px;color:var(--dsw-alias-label-primary)}",
				// 概览卡片：本月主卡(2列) + 今日/累计/余额(各1列)，窄屏自动降列
				".b8l_setCards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}",
				"@media(max-width:1100px){.b8l_setCards{grid-template-columns:repeat(2,1fr)}.b8l_setCardWide{grid-column:span 2}}",
				"@media(max-width:640px){.b8l_setCards{grid-template-columns:1fr}}",
				".b8l_setCardWide{grid-column:span 2}",
				".b8l_setCard{display:flex;flex-direction:column;gap:2px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;padding:12px 14px;background:var(--dsw-alias-bg-layer-1)}",
				// 来源构成条（本月主卡内）
				".b8l_breakdown{display:flex;flex-wrap:wrap;gap:4px 10px;margin-top:6px;font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary)}",
				".b8l_breakItem{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}",
				".b8l_breakDot{width:6px;height:6px;border-radius:50%;flex:none}",
				".b8l_setCardLabel{font-size:12px;color:var(--dsw-alias-label-tertiary);letter-spacing:.02em}",
				".b8l_setCardValue{font-size:20px;line-height:28px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary)}",
				".b8l_setCardValue.b8l_save{color:var(--dsw-alias-state-success-primary)}",
				".b8l_setCardSub{font-size:12px;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums}",
				".b8l_setCardSub.b8l_save{color:var(--dsw-alias-state-success-primary)}",
				// 来源分组卡：左侧语义色条 + 标题 + 明细
				".b8l_srcGroup{display:flex;flex-direction:column;gap:6px;border:1px solid var(--dsw-alias-border-l1);border-left:3px solid var(--dsw-alias-border-l1);border-radius:12px;padding:10px 12px;background:var(--dsw-alias-bg-layer-1)}",
				".b8l_srcHead{display:flex;align-items:baseline;justify-content:space-between;gap:10px;min-width:0}",
				".b8l_srcTitle{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}",
				".b8l_srcDot{width:8px;height:8px;border-radius:2px;flex:none}",
				".b8l_srcCalls{flex:none;font-size:11px;color:var(--dsw-alias-label-tertiary)}",
				".b8l_srcNote{font-size:11px;color:var(--dsw-alias-label-tertiary)}",
				".b8l_srcRow{display:flex;justify-content:space-between;align-items:baseline;gap:10px;min-width:0;font-size:12px;line-height:18px}",
				".b8l_srcRowName{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary)}",
				".b8l_srcRowVal{flex:none;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary)}",
				".b8l_srcRowVal.b8l_save{color:var(--dsw-alias-state-success-primary)}",
				// metering 编辑行
				".b8l_metRow{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px;line-height:20px;padding:3px 0}",
				".b8l_metName{min-width:120px;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
				".b8l_metSelect{font:inherit;font-size:12px;padding:2px 6px;border-radius:6px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);outline:none}",
				".b8l_metSelect:focus{border-color:var(--dsw-alias-state-business-primary)}",
				".b8l_metInput{font:inherit;font-size:12px;width:64px;padding:2px 6px;border-radius:6px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);outline:none}",
				".b8l_metInput:focus{border-color:var(--dsw-alias-state-business-primary)}",
				".b8l_metUnit{font-size:11px;color:var(--dsw-alias-label-tertiary)}",
				".b8l_metActions{display:flex;align-items:center;gap:10px;margin-top:6px}",
				// 折叠按钮
				".b8l_foldBtn{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:12px;font-weight:500;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:5px 12px;cursor:pointer}",
				".b8l_foldBtn:hover{background:var(--dsw-alias-interactive-bg-hover)}",
				// 表格（会话/历史共用）
				".b8l_setTable{width:100%;border-collapse:collapse;font-size:12px;margin-top:8px}",
				".b8l_setTable th,.b8l_setTable td{text-align:left;padding:6px 10px;border-bottom:1px solid var(--dsw-alias-border-l1);white-space:nowrap}",
				".b8l_setTable th{color:var(--dsw-alias-label-tertiary);font-weight:500;font-size:11px}",
				".b8l_setTable td.num,.b8l_setTable th.num{text-align:right;font-variant-numeric:tabular-nums}",
				".b8l_setTable tr:last-child td{border-bottom:none}",
				".b8l_setScroll{max-height:280px;overflow:auto;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;margin-top:8px}",
				".b8l_setEmpty{font-size:12px;color:var(--dsw-alias-label-tertiary);padding:8px 0}",
				".b8l_setHint{font-size:11px;color:var(--dsw-alias-label-tertiary);margin:0}",
				"@media(max-width:720px){.b8l_setCards{grid-template-columns:repeat(2,1fr)}}"
			].join("\n");
			document.head.appendChild(settingsStyle);
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
			"routeMuted": "b8l_route_muted",
			"setRoot": "b8l_setRoot",
			"setSectionTitle": "b8l_setSectionTitle",
			"setCards": "b8l_setCards",
			"setCardWide": "b8l_setCardWide",
			"setCard": "b8l_setCard",
			"breakdown": "b8l_breakdown",
			"breakItem": "b8l_breakItem",
			"breakDot": "b8l_breakDot",
			"setCardLabel": "b8l_setCardLabel",
			"setCardValue": "b8l_setCardValue",
			"setCardSub": "b8l_setCardSub",
			"srcGroup": "b8l_srcGroup",
			"srcHead": "b8l_srcHead",
			"srcTitle": "b8l_srcTitle",
			"srcDot": "b8l_srcDot",
			"srcCalls": "b8l_srcCalls",
			"srcNote": "b8l_srcNote",
			"srcRow": "b8l_srcRow",
			"srcRowName": "b8l_srcRowName",
			"srcRowVal": "b8l_srcRowVal",
			"metRow": "b8l_metRow",
			"metName": "b8l_metName",
			"metSelect": "b8l_metSelect",
			"metInput": "b8l_metInput",
			"metUnit": "b8l_metUnit",
			"metActions": "b8l_metActions",
			"foldBtn": "b8l_foldBtn",
			"setTable": "b8l_setTable",
			"setScroll": "b8l_setScroll",
			"setEmpty": "b8l_setEmpty",
			"setHint": "b8l_setHint",
			"panelHead": "b8l_panelHead",
			"panelTitle": "b8l_panelTitle",
			"panelClose": "b8l_panelClose",
			"summaryGrid": "b8l_summaryGrid",
			"sumRow": "b8l_sumRow",
			"sumLabel": "b8l_sumLabel",
			"sumLabelK": "b8l_sumLabelK",
			"sumValues": "b8l_sumValues",
			"sumValue": "b8l_sumValue",
			"divider": "b8l_divider",
			"modelMeta": "b8l_modelMeta",
			"modelName": "b8l_modelName",
			"modelCount": "b8l_modelCount",
			"modelCost": "b8l_modelCost",
			"tokItem": "b8l_tokItem",
			"phaseRow": "b8l_phaseRow",
			"phaseDot": "b8l_phaseDot",
			"phaseText": "b8l_phaseText",
			"hintRow": "b8l_hintRow"
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
			currentRange = "month";
			constructor() {
				this.refresh(this.currentRange);
				const timer = setInterval(() => this.refresh(this.currentRange), 5000);
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
			async refresh(range) {
				try {
					const effectiveRange = typeof range === "string" && range.length > 0 ? range : this.currentRange;
					// 只有完整范围（含自定义 from/to 或已知档位）才更新 currentRange；
					// 裸 "custom"（缺 from/to）不覆盖，避免轮询退化。
					if (typeof range === "string" && range.length > 0 && !(range === "custom")) this.currentRange = range;
					// range 传 "custom&from=..&to=.." 这类完整参数串时直接拼 query；
					// 传简单值（today/week/month/30d/all）时作为 range 参数。
					let query = "";
					if (typeof effectiveRange === "string" && effectiveRange.length > 0) {
						query = effectiveRange.startsWith("custom")
							? `?range=${effectiveRange}`
							: `?range=${encodeURIComponent(effectiveRange)}`;
					}
					const response = await fetch(`/billing/state${query}`, { headers: { accept: "application/json" } });
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
		/** 「节省」语义色：内联应用（最高优先级，避开主题变量作用域与样式表覆盖问题）。 */
		const SAVED_COLOR = "#16a34a";
		/** 合计节省色（本地部署 + 白嫖 + 回本 加总）：金色，与单项来源色区分。 */
		const GOLD_COLOR = "#eab308";
		/** 来源语义色：本地部署=绿 / 白嫖=天蓝 / 回本=紫 / coding=蓝（与设置页来源分组一致）。 */
		const FREE_COLOR = "#0ea5e9";
		const SUB_COLOR = "#8b5cf6";
		/** 高峰/峰谷 阶段指示色（内联；避免主题变量作用域为空）。 */
		const PEAK_COLOR = "#d97706";
		const OFFPEAK_COLOR = "#16a34a";
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
			const clickLocked = react.useRef(false);
			const seeded = react.useRef(false);
			const panelRef = react.useRef(null);
			const wrapRef = react.useRef(null);
			// 浮层定位：跟随角标（wrap）位置。
			const [panelPos, setPanelPos] = react.useState(null);
			react.useEffect(() => {
				if (!seeded.current) {
					seeded.current = true;
					refreshSession(sessionId);
				}
			}, [refreshSession, sessionId]);
			react.useEffect(() => () => {
				if (closeTimer.current !== null) clearTimeout(closeTimer.current);
			}, []);
			// 浮层跟随角标（wrap 容器）定位：角标下方 + 右对齐角标右缘。
			// portal 到 body 解决层叠；open 期间每 500ms 重测——sidebar 开/关、滚动、
			// 缩放变化时位置自动跟随。无需检测 sidebar（角标位置天然反映内容区）。
			react.useLayoutEffect(() => {
				if (!open) return;
				const measure = () => {
					const wrap = wrapRef.current;
					if (wrap === null) return;
					const wr = wrap.getBoundingClientRect();
					const top = Math.max(8, Math.round(wr.bottom + 8));
					// 右对齐角标右缘；面板宽 312，clamp 保证不超出视口左侧。
					const maxRight = Math.max(16, window.innerWidth - 312 - 16);
					const right = Math.min(maxRight, Math.max(16, Math.round(window.innerWidth - wr.right)));
					setPanelPos((prev) => (prev !== null && prev.top === top && prev.right === right ? prev : { top, right }));
				};
				measure();
				const timer = setInterval(measure, 500);
				window.addEventListener("resize", measure);
				return () => {
					clearInterval(timer);
					window.removeEventListener("resize", measure);
				};
			}, [open]);
			const openSoon = () => {
				// 悬停进入：若之前是点开锁定状态则不重复操作；否则打开。
				clickLocked.current = false;
				if (closeTimer.current !== null) {
					clearTimeout(closeTimer.current);
					closeTimer.current = null;
				}
				setOpen(true);
			};
			const closeSoon = () => {
				if (open && !clickLocked.current) {
					if (closeTimer.current !== null) clearTimeout(closeTimer.current);
					closeTimer.current = setTimeout(() => {
						closeTimer.current = null;
						setOpen(false);
					}, 250);
				}
			};
			// 双触发：悬停打开（web 版正常）；点击显式切换（桌面版内嵌环境 mouseenter
			// 可能被吞时的兜底）。点击打开后会进入「点开锁定」——鼠标移出不自动关闭，
			// 需再点击关闭，避免桌面版点开后移开即消失。
			const toggleOpen = () => {
				if (closeTimer.current !== null) {
					clearTimeout(closeTimer.current);
					closeTimer.current = null;
				}
				const next = !open;
				setOpen(next);
				clickLocked.current = next;
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
			// 混合会话（既有花费又有节省）：徽章显示 花费 + 金色省 两个值；
			// 纯节省显示「省 ¥X」；纯花费显示金额。
			const badgeValue = isSavingsBadge
				? `${t("saved")} ${formatCost(symbol, sessionSavings)}`
				: sessionSavings > 0 && session.cost > 0
					? `${formatCost(symbol, amountOf(session))} ${t("saved")} ${formatCost(symbol, sessionSavings)}`
					: formatCost(symbol, amountOf(session));
			const badgeText = badgeValue;

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
					bucket = { provider: message.provider ?? "?", model, source: message.source ?? "official", cost: 0, costUsd: 0, savings: 0, savingsUsd: 0, input: 0, cacheRead: 0, output: 0, calls: 0 };
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
				.map((counts) => {
					// 按来源区分语义色与叫法：local=本地省(绿) / free=白嫖(天蓝) /
					// subscription=回本(紫) / coding(蓝) / official=花费(主色)。
					const source = counts.source ?? "official";
					const isFree = source === "free";
					const isSub = source === "subscription" || source === "coding";
					const isLocal = source === "local";
					const isSavingKind = isFree || isSub || isLocal;
					const color = isFree ? FREE_COLOR : isSub ? SUB_COLOR : isLocal ? SAVED_COLOR : void 0;
					const labelKey = isFree ? "source.free" : isSub ? "source.subscription" : isLocal ? "source.local" : null;
					const hasSavings = counts.savings > 0;
					const hasCost = counts.cost > 0;
					const value = labelKey !== null && isSavingKind && hasSavings && !hasCost
						? `${t(labelKey)} ${formatCost(symbol, currency === "USD" ? counts.savingsUsd : counts.savings)}`
						: labelKey !== null && isSavingKind && hasSavings && hasCost
							? `${t(labelKey)} ${formatCost(symbol, currency === "USD" ? counts.costUsd : counts.cost)} · ${t("saved")} ${formatCost(symbol, currency === "USD" ? counts.savingsUsd : counts.savings)}`
							: formatCost(symbol, currency === "USD" ? counts.costUsd : counts.cost);
					const hitRate = counts.input + counts.cacheRead > 0
						? Math.round(counts.cacheRead / (counts.input + counts.cacheRead) * 100)
						: 0;
					const hasTokens = counts.input + counts.cacheRead + counts.output > 0;
					const tokenParts = [
						hasTokens && react_jsx_runtime.jsx("span", { className: css_default.tokItem, children: `${t("input")} ${fmtTok(counts.input)}` }),
						hasTokens && react_jsx_runtime.jsx("span", { className: css_default.tokItem, children: `${t("hit")} ${hitRate}%` }),
						hasTokens && react_jsx_runtime.jsx("span", { className: css_default.tokItem, children: `${t("output")} ${fmtTok(counts.output)}` })
					].filter(Boolean);
					// provider 徽章放在 token 行末尾（与模型名分开，避免同行挤压）；
					// 按来源语义着色（浅彩底 + 同色系深字 + 同色系边框，质感而非纯白）。
					const badgeColor = (() => {
						switch (counts.source) {
							case "local": return { bg: "rgba(34,197,94,.12)", fg: "#15803d", bd: "rgba(34,197,94,.35)" };
							case "free": return { bg: "rgba(14,165,233,.12)", fg: "#0369a1", bd: "rgba(14,165,233,.35)" };
							case "subscription": return { bg: "rgba(139,92,246,.12)", fg: "#6d28d9", bd: "rgba(139,92,246,.35)" };
							case "coding": return { bg: "rgba(37,99,235,.12)", fg: "#1d4ed8", bd: "rgba(37,99,235,.35)" };
							default: return { bg: "var(--dsw-alias-bg-layer-2)", fg: "var(--dsw-alias-label-tertiary)", bd: "var(--dsw-alias-border-l1)" };
						}
					})();
					const providerBadge = counts.provider !== "?" && counts.provider.length > 0
						? react_jsx_runtime.jsx("span", {
							className: css_default.providerBadge,
							style: { color: badgeColor.fg, background: badgeColor.bg, borderColor: badgeColor.bd },
							children: counts.provider
						})
						: null;
					return react_jsx_runtime.jsx("div", {
						className: css_default.modelRow,
						children: [
							react_jsx_runtime.jsxs("div", {
								className: css_default.modelLine,
								children: [
									react_jsx_runtime.jsxs("div", {
										className: css_default.modelMeta,
										children: [
											react_jsx_runtime.jsx("span", {
												className: css_default.modelName,
												title: counts.model,
												children: counts.model
											}),
											counts.calls > 1 && react_jsx_runtime.jsx("span", {
												className: css_default.modelCount,
												children: `×${counts.calls}`
											})
										]
									}),
									react_jsx_runtime.jsx("span", {
										className: css_default.modelCost,
										style: color !== void 0 ? { color } : void 0,
										children: value
									})
								]
							}),
							hasTokens && react_jsx_runtime.jsx("div", {
								className: css_default.tokenLine,
								style: color !== void 0 ? { color } : void 0,
								children: react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
									children: [
										...tokenParts,
										providerBadge
									]
								})
							})
						]
					}, `${counts.provider}/${counts.model}`);
				});
			// DeepSeek 系列模型 → 显示当前官方时段（峰谷政策对 DeepSeek 模型生效）。
			const pricing = view.value?.pricing;
			const phaseHint = usesDeepSeek && pricing !== void 0 && pricing.effectiveNow !== "flat"
				? (pricing.effectiveNow === "peak" ? t("pricing.peakNow") : t("pricing.offPeakNow"))
				: null;
			// 单一来源判定：只有本会话既含实际花费又含节省（混合使用）才同时展示两值；
			// 单一来源只展示实际存在的那种（纯云端 → 花费；纯本地 → 节省）。
			// 用 host 的 session 完整值（record 累计，不被明细裁剪影响）——
			// 明细（messages）可能被 maxMessagesPerSession 裁剪，重聚合会少于真实。
			const hasCost = (session.cost ?? 0) > 0;
			const hasSaving = (session.savings ?? 0) > 0;
			const showCostValue = hasCost;
			const showSaveValue = hasSaving;
			// 摘要行：label + （可选）花费 + （可选）节省；数字右对齐、全部防溢出。
			const sumRow = (label, counts) => react_jsx_runtime.jsxs("div", {
				className: css_default.sumRow,
				children: [
					react_jsx_runtime.jsxs("span", {
						className: css_default.sumLabel,
						children: [
							react_jsx_runtime.jsx("span", { className: css_default.sumLabelK, children: label })
						]
					}),
					react_jsx_runtime.jsxs("span", {
						className: css_default.sumValues,
						children: [
							showCostValue && react_jsx_runtime.jsx("span", {
								className: css_default.sumValue,
								title: t("cost"),
								children: formatCost(symbol, amountOf(counts))
							}),
							showSaveValue && react_jsx_runtime.jsx("span", {
								className: css_default.sumValue,
								style: { color: GOLD_COLOR },
								title: t("saved"),
								children: formatCost(symbol, savedOf(counts))
							})
						]
					})
				]
			});
			return react_jsx_runtime.jsx("div", {
				ref: wrapRef,
				className: css_default.wrap,
				onMouseEnter: openSoon,
				onMouseLeave: closeSoon,
				children: react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
					children: [
						react_jsx_runtime.jsx("button", {
							type: "button",
							className: `${css_default.badge}${open ? ` ${css_default.badgeOpen}` : ""}`,
							"aria-expanded": open,
							onClick: toggleOpen,
							children: badgeText
						}),
						open && react_dom.createPortal(react_jsx_runtime.jsx("div", {
							ref: panelRef,
							className: `${css_default.panel} ${css_default.panelOnHeader}`,
							style: panelPos === null ? void 0 : { top: panelPos.top, right: panelPos.right },
							onMouseEnter: () => {
								if (closeTimer.current !== null) {
									clearTimeout(closeTimer.current);
									closeTimer.current = null;
								}
							},
							onMouseLeave: closeSoon,
							children: [
								react_jsx_runtime.jsxs("div", {
									className: css_default.panelHead,
									children: [
										react_jsx_runtime.jsx("span", {
											className: css_default.panelTitle,
											children: t("inThisSession")
										}),
										react_jsx_runtime.jsx("button", {
											type: "button",
											className: css_default.panelClose,
											"aria-label": t("close"),
											onClick: () => {
												setOpen(false);
												clickLocked.current = false;
											},
											children: "\u2715"
										})
									]
								}),
								react_jsx_runtime.jsx("div", {
									className: css_default.summaryGrid,
									children: [
										sumRow(t("today"), bucketToday),
										// 累计用 host 的 session 完整值（record 累计），与徽章一致。
										sumRow(t("total"), session)
									]
								}),
								modelRows.length > 0 && react_jsx_runtime.jsx("div", {
									className: css_default.divider
								}),
								modelRows.length > 0 && react_jsx_runtime.jsx("div", {
									className: css_default.sectionTitle,
									children: t("byModel")
								}),
								modelRows.length > 0 && modelRows,
								(phaseHint !== null || modelRows.length > 0) && react_jsx_runtime.jsx("div", {
									className: css_default.divider
								}),
								phaseHint !== null && react_jsx_runtime.jsxs("div", {
									className: css_default.phaseRow,
									children: [
										react_jsx_runtime.jsx("span", {
											className: css_default.phaseDot,
											style: { background: pricing?.effectiveNow === "peak" ? PEAK_COLOR : OFFPEAK_COLOR }
										}),
										react_jsx_runtime.jsx("span", {
											className: css_default.phaseText,
											children: phaseHint
										})
									]
								}),
								// 账户余额（受设置页「显示账户余额」开关控制；关闭则不显示）。
								(() => {
									const balEnabled = view.value?.budget?.balanceEnabled;
									const bal = view.value?.balance;
									if (balEnabled === false || bal === void 0 || bal.status !== "ready" || bal.balance === void 0) return null;
									const balInfo = currency === "USD" ? (bal.balance.usd ?? bal.balance.cny) : (bal.balance.cny ?? bal.balance.usd);
									if (balInfo === null || balInfo === void 0) return null;
									const balSymbol = balInfo === bal.balance.usd ? "$" : "¥";
									return react_jsx_runtime.jsxs("div", {
										className: css_default.phaseRow,
										children: [
											react_jsx_runtime.jsx("span", {
												className: css_default.phaseDot,
												style: { background: "var(--dsw-alias-state-success-primary, #22c55e)" }
											}),
											react_jsx_runtime.jsx("span", {
												className: css_default.phaseText,
												children: `${t("balance")} ${formatCost(balSymbol, balInfo.total)}`
											})
										]
									});
								})(),
								react_jsx_runtime.jsx("div", {
									className: css_default.hintRow,
									children: t("openSettings")
								})
							]
						}), document.body)
					]
				})
			});
		}
		//#endregion
		//#region lib/types/client/export.js
		/** 触发浏览器下载（Blob + a[download]）。 */
		function downloadFile(filename, content, mime) {
			const blob = new Blob([content], { type: mime });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			setTimeout(() => URL.revokeObjectURL(url), 1000);
		}

		/** CSV 转义（含逗号/引号/换行加引号）。 */
		function csvCell(value) {
			const s = String(value ?? "");
			return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
		}

		/**
		* 导出账单：csv=按天+按来源明细；json=完整快照。
		* @param kind - 'csv' | 'json'。
		* @param data - { totals, month, today, history, byProviderModel, sessionList, symbol, amountOf, savedOf }。
		*/
		function exportBilling(kind, data) {
			const stamp = new Date().toISOString().slice(0, 10);
			if (kind === "json") {
				downloadFile(`dsh-billing-${stamp}.json`, JSON.stringify({
					exportedAt: new Date().toISOString(),
					totals: data.totals,
					month: data.month,
					today: data.today,
					history: data.history,
					byProviderModel: data.byProviderModel,
					sessions: data.sessionList
				}, null, 2), "application/json");
				return;
			}
			const { symbol = "", amountOf, savedOf, currency: exportCurrency = "CNY" } = data;
			const costOf = (entry) => exportCurrency === "USD" ? (entry.costUsd ?? 0) : (entry.cost ?? 0);
			const savedOfEntry = (entry) => exportCurrency === "USD" ? (entry.savingsUsd ?? 0) : (entry.savings ?? 0);
			const rows = [];
			rows.push(["date", "calls", "cost", "saved"].join(","));
			for (const day of data.history) {
				rows.push([day.date, day.calls, (amountOf(day) || 0).toFixed(6), (savedOf(day) || 0).toFixed(6)].join(","));
			}
			rows.push(["source", "provider", "model", "calls", "cost", "saved"].join(","));
			for (const entry of Object.values(data.byProviderModel ?? {})) {
				rows.push([entry.source ?? "official", csvCell(entry.provider), csvCell(entry.model), entry.calls, costOf(entry).toFixed(6), savedOfEntry(entry).toFixed(6)].join(","));
			}
			// UTF-8 BOM：避免 Excel 打开中文乱码。
			downloadFile(`dsh-billing-${stamp}.csv`, "\ufeff" + rows.join("\n"), "text/csv;charset=utf-8");
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
		function SettingsBillingSection({ useBilling, useLocale, t, refresh, useSessions }) {
			const view = useBilling((snapshot) => snapshot);
			const activeLocale = useLocale((snapshot) => snapshot.active);
			const [openSessions, setOpenSessions] = react.useState(false);
			const [openHistory, setOpenHistory] = react.useState(false);
			// 订阅/免费收费形式编辑态：draft = provider → { mode, monthly }。
			const [meteringDraft, setMeteringDraft] = react.useState(null);
			const [meteringSaved, setMeteringSaved] = react.useState(false);
			const [meteringBusy, setMeteringBusy] = react.useState(false);
			// 添加 provider 收费形式：候选下拉选中值。
			const [meteringAdd, setMeteringAdd] = react.useState("");
			// 更新检查：idle / checking / done。
			const [updateState, setUpdateState] = react.useState("idle");
			const [updateInfo, setUpdateInfo] = react.useState(null);
			// 会话标题映射（useSessions：settings.section 框架注入的会话列表标准 hook）。
			let sessionTitles = /* @__PURE__ */ new Map();
			try {
				const sessionsState = typeof useSessions === "function" ? useSessions((s) => s) : void 0;
				const byId = sessionsState?.byId ?? {};
				for (const [id, summary] of Object.entries(byId)) {
					sessionTitles.set(id, summary?.displayTitle ?? summary?.title ?? id);
				}
			} catch {
				sessionTitles = /* @__PURE__ */ new Map();
			}
			// 预算编辑态。
			const [budgetDraft, setBudgetDraft] = react.useState(null);
			const [budgetSaved, setBudgetSaved] = react.useState(false);
			// 余额显示开关（即时生效）。
			const [balanceToggle, setBalanceToggle] = react.useState(null);
			// 时间范围（默认本月）。
			const [range, setRange] = react.useState("month");
			// 挂载时与 controller 当前范围同步（host state 的 range 反映 controller.currentRange），
			// 避免设置页重开后 UI 高亮与数据脱节（N2）。useEffect 首次执行一次。
			const hostRange = view.value?.range;
			const rangeSynced = react.useRef(false);
			react.useEffect(() => {
				if (rangeSynced.current) return;
				rangeSynced.current = true;
				if (typeof hostRange === "string" && hostRange.length > 0 && hostRange !== "month") {
					setRange(hostRange === "30d" ? "30d" : hostRange);
				}
			}, [hostRange]);
			const [customFrom, setCustomFrom] = react.useState("");
			const [customTo, setCustomTo] = react.useState("");
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
			const budget = value?.budget ?? { enabled: false, amount: 0 };
			// 余额显示开关：优先本地 toggle，其次 host 持久化的 balanceEnabled，默认开。
			const balanceOn = balanceToggle ?? budget.balanceEnabled ?? true;
			const history = Array.isArray(value?.history) ? value.history : [];
			const byModel = value?.byModel ?? {};
			const byProvider = value?.byProvider ?? {};
			const byProviderModel = value?.byProviderModel ?? {};
			const sessionList = Array.isArray(value?.sessions) ? value.sessions : [];
			const card = (title, counts, sub) => {
				const saved = savedOf(counts);
				return react_jsx_runtime.jsx("div", {
					className: css_default.setCard,
					children: [
						react_jsx_runtime.jsx("p", { className: css_default.setCardLabel, children: title }),
						react_jsx_runtime.jsx("div", {
							className: css_default.setCardValue,
							children: formatCost(symbol, amountOf(counts))
						}),
						saved > 0 && react_jsx_runtime.jsx("div", {
							className: `${css_default.setCardValue} ${css_default.save}`,
							style: { color: GOLD_COLOR },
							children: `${t("saved")} ${formatCost(symbol, saved)}`
						}),
						counts.calls > 0 && react_jsx_runtime.jsx("div", {
							className: css_default.setCardSub,
							children: `${t("calls")} ${formatNumber(counts.calls)}`
						}),
						sub !== void 0 && react_jsx_runtime.jsx("div", { className: css_default.setCardSub, children: sub })
					]
				});
			};
			const balance = value?.balance;
			const balanceNode = balance === void 0 || balance.status === "disabled" ? null
				: balance.status === "ready" && balance.balance !== void 0
					? (() => {
						// 优先展示币种；缺失时回退另一币种，并用该币种自己的符号，避免 USD 界面 + ¥ 金额错配。
						const preferred = currency === "USD" ? balance.balance.usd : balance.balance.cny;
						const info = preferred ?? (currency === "USD" ? balance.balance.cny : balance.balance.usd);
						const infoSymbol = info === balance.balance.usd ? "$" : "¥";
						return info === null ? react_jsx_runtime.jsx("p", { className: css_default.setHint, children: t("balance.unavailable") })
							: react_jsx_runtime.jsx("div", {
								className: css_default.setCard,
								children: [
									react_jsx_runtime.jsx("p", { className: css_default.setCardLabel, children: t("balance") }),
									react_jsx_runtime.jsx("div", { className: css_default.setCardValue, children: formatCost(infoSymbol, info.total) }),
									react_jsx_runtime.jsx("div", { className: css_default.setCardSub, children: `${t("balance.granted")} ${formatCost(infoSymbol, info.granted)} · ${t("balance.toppedUp")} ${formatCost(infoSymbol, info.toppedUp)}` })
								]
							});
					})()
					: react_jsx_runtime.jsx("p", { className: css_default.setHint, children: t("balance.unavailable") });
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
			// ── 来源分组：把 byProviderModel 按 source 归类（本地/订阅/免费/按量/coding），
			//    每组聚合合计，并给每组语义色与叫法。 ──
			const SOURCE_META = [
				{ key: "local", color: "#16a34a", labelKey: "source.local" },
				// 订阅与 coding plan 语义相同（订阅制 → 回本），合并为一个分类。
				{ key: "subscription", color: "#8b5cf6", labelKey: "source.subscription" },
				{ key: "free", color: "#0ea5e9", labelKey: "source.free" },
				{ key: "official", color: "#71717a", labelKey: "source.official" },
				{ key: "unknown", color: "#a1a1aa", labelKey: "source.unknown" }
			];
			const sourceBuckets = /* @__PURE__ */ new Map();
			for (const [key, entry] of Object.entries(byProviderModel)) {
				// coding 与 subscription 语义相同（订阅制 → 回本），归入同一分类。
				const source = (entry.source ?? "official") === "coding" ? "subscription" : (entry.source ?? "official");
				let bucket = sourceBuckets.get(source);
				if (bucket === void 0) {
					bucket = { entries: [], cost: 0, costUsd: 0, savings: 0, savingsUsd: 0, calls: 0, monthly: 0 };
					sourceBuckets.set(source, bucket);
				}
				bucket.entries.push(entry);
				bucket.cost += entry.cost ?? 0;
				bucket.costUsd += entry.costUsd ?? 0;
				bucket.savings += entry.savings ?? 0;
				bucket.savingsUsd += entry.savingsUsd ?? 0;
				bucket.calls += entry.calls ?? 0;
			}
			// 订阅组的月费合计（来自 metering 配置；按 provider 去重，避免同一 provider
			// 的多个模型条目重复累加月费）。
			const metering = value?.metering ?? {};
			const promos = value?.promos ?? {};
			for (const [source, bucket] of sourceBuckets) {
				let monthly = 0;
				const seenProviders = /* @__PURE__ */ new Set();
				for (const entry of bucket.entries) {
					if (seenProviders.has(entry.provider)) continue;
					seenProviders.add(entry.provider);
					const rule = metering[entry.provider];
					if (rule !== void 0 && rule.mode === "subscription") monthly += Number(rule.monthly) || 0;
				}
				bucket.monthly = monthly;
			}
			// 本月花费（预算进度用）。
			const monthCost = amountOf(month);
			const sessionRows = sessionList.slice(0, 30).map((session) => {
				const saved = savedOf(session);
				const cost = amountOf(session);
				const isSaveOnly = saved > 0 && cost <= 0;
				return react_jsx_runtime.jsxs("tr", {
					children: [
						react_jsx_runtime.jsx("td", {
							title: session.sessionId,
							children: sessionTitles.get(session.sessionId) || session.sessionId
						}),
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
				className: css_default.setRoot,
				children: [
					// ── 时间段选择器 ──
					react_jsx_runtime.jsxs("div", {
						style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
						children: [
							["today", "week", "month", "30d", "all"].map((r) => react_jsx_runtime.jsx("button", {
								type: "button",
								className: css_default.foldBtn,
								style: range === r ? { borderColor: "var(--dsw-alias-state-business-primary)", color: "var(--dsw-alias-state-business-primary)" } : void 0,
								onClick: () => { setRange(r); if (typeof refresh === "function") refresh(r); },
								children: t(`range.${r}`)
							}, r)),
							react_jsx_runtime.jsx("span", { className: css_default.metUnit, children: t("range.custom") }),
							react_jsx_runtime.jsx("input", {
								type: "date",
								className: css_default.metInput,
								style: { width: 130 },
								value: customFrom,
								onChange: (e) => setCustomFrom(e.target.value)
							}),
							react_jsx_runtime.jsx("span", { className: css_default.metUnit, children: "→" }),
							react_jsx_runtime.jsx("input", {
								type: "date",
								className: css_default.metInput,
								style: { width: 130 },
								value: customTo,
								onChange: (e) => setCustomTo(e.target.value)
							}),
							react_jsx_runtime.jsx("button", {
								type: "button",
								className: css_default.foldBtn,
								onClick: () => {
									if (!customFrom || !customTo) return;
									const from = new Date(customFrom + "T00:00:00").getTime();
									const to = new Date(customTo + "T23:59:59").getTime();
									if (to <= from) return;
									setRange("custom");
									if (typeof refresh === "function") refresh(`custom&from=${from}&to=${to}`);
								},
								children: t("range.apply")
							})
						]
					}),
					// 聚合口径提示：范围明细基于最近流水窗口，早于窗口的为聚合级。
					react_jsx_runtime.jsx("p", { className: css_default.setHint, children: t("range.windowHint") }),
					// 概览：本月主卡(宽, 含来源构成) + 今日 / 累计 / 余额
					react_jsx_runtime.jsx("div", {
						className: css_default.setCards,
						children: [
							// 范围主卡（跟随所选时间段）
							react_jsx_runtime.jsx("div", {
								className: `${css_default.setCard} ${css_default.setCardWide}`,
								children: [
									react_jsx_runtime.jsx("p", { className: css_default.setCardLabel, children: t(`range.${range}`) }),
									react_jsx_runtime.jsx("div", {
										className: css_default.setCardValue,
										children: formatCost(symbol, amountOf(totals))
									}),
									savedOf(totals) > 0 && react_jsx_runtime.jsx("div", {
										className: `${css_default.setCardValue} ${css_default.save}`,
										style: { color: GOLD_COLOR },
										children: `${t("saved")} ${formatCost(symbol, savedOf(totals))}`
									}),
									react_jsx_runtime.jsx("div", { className: css_default.setCardSub, children: `${t("calls")} ${formatNumber(totals.calls)}` }),
									// 来源构成（全局口径，标注累计；颜色与来源分组一致）
									react_jsx_runtime.jsx("div", {
										className: css_default.breakdown,
										children: SOURCE_META.map((meta) => {
											const bucket = sourceBuckets.get(meta.key);
											if (bucket === void 0 || bucket.entries.length === 0) return null;
											const cost = currency === "USD" ? bucket.costUsd : bucket.cost;
											const saved = currency === "USD" ? bucket.savingsUsd : bucket.savings;
											const isSavingGroup = meta.key === "local" || meta.key === "free" || meta.key === "subscription";
											const val = saved > 0 && cost <= 0 ? formatCost(symbol, saved) : formatCost(symbol, cost);
											const pureSave = saved > 0 && cost <= 0;
											return react_jsx_runtime.jsxs("span", {
												className: css_default.breakItem,
												style: isSavingGroup && pureSave ? { color: meta.color } : void 0,
												children: [
													react_jsx_runtime.jsx("span", { className: css_default.breakDot, style: { background: meta.color } }),
													`${t(meta.labelKey)} ${val}`
												]
											}, meta.key);
										})
									})
								]
							}),
							card(t("today"), today),
							card(t("total"), totals),
							// Token 卡（与概览框同网格）：总 token + 未命中/命中/输出明细。
							react_jsx_runtime.jsx("div", {
								className: css_default.setCard,
								children: [
									react_jsx_runtime.jsx("p", { className: css_default.setCardLabel, children: t("tokens") }),
									react_jsx_runtime.jsx("div", {
										className: css_default.setCardValue,
										children: fmtTok((totals.inputTokens ?? 0) + (totals.cacheReadTokens ?? 0) + (totals.outputTokens ?? 0))
									}),
									react_jsx_runtime.jsx("div", {
										className: css_default.setCardSub,
										children: `${t("inputMiss")} ${fmtTok(totals.inputTokens ?? 0)} · ${t("cache")} ${fmtTok(totals.cacheReadTokens ?? 0)} · ${t("output")} ${fmtTok(totals.outputTokens ?? 0)}`
									})
								]
							}),
							...(balanceNode !== null ? [balanceNode] : [])
						]
					}),
					// 计价状态
					pricingText !== null && react_jsx_runtime.jsx("p", { className: css_default.setHint, children: pricingText }),
					// 按来源分组
					react_jsx_runtime.jsx("p", { className: css_default.setSectionTitle, children: t("bySource") }),
					SOURCE_META.map((meta) => {
						const bucket = sourceBuckets.get(meta.key);
						if (bucket === void 0 || bucket.entries.length === 0) return null;
						const cost = currency === "USD" ? bucket.costUsd : bucket.cost;
						const saved = currency === "USD" ? bucket.savingsUsd : bucket.savings;
						const hasSavings = saved > 0;
						const hasCost = cost > 0;
						const isSavingGroup = meta.key === "local" || meta.key === "free" || meta.key === "subscription";
						const groupColor = isSavingGroup ? meta.color : void 0;
						const headline = hasSavings && !hasCost
							? `${t(meta.labelKey)} ${formatCost(symbol, saved)}`
							: hasSavings && hasCost
								? `${t(meta.labelKey)} ${formatCost(symbol, cost)} · ${t("saved")} ${formatCost(symbol, saved)}`
								: `${t(meta.labelKey)} ${formatCost(symbol, cost)}`;
						const rows = bucket.entries.slice(0, 10).map((entry) => {
							const eCost = currency === "USD" ? entry.costUsd : entry.cost;
							const eSaved = currency === "USD" ? entry.savingsUsd : entry.savings;
							const eSaveOnly = eSaved > 0 && eCost <= 0;
							return react_jsx_runtime.jsxs("div", {
								className: css_default.srcRow,
								children: [
									react_jsx_runtime.jsx("span", { className: css_default.srcRowName, children: `${entry.provider} · ${entry.model}` }),
									react_jsx_runtime.jsx("span", {
										className: css_default.srcRowVal,
										// 纯节省行用来源色；有真实花费的行用主色（coding 平台真实付费不误标回本）。
										style: isSavingGroup && eSaveOnly ? { color: meta.color } : void 0,
										children: eSaveOnly ? `${t("saved")} ${formatCost(symbol, eSaved)}` : formatCost(symbol, eCost)
									})
								]
							}, `${entry.provider}/${entry.model}`);
						});
						return react_jsx_runtime.jsxs("div", {
							className: css_default.srcGroup,
							style: { borderLeftColor: meta.color },
							children: [
								react_jsx_runtime.jsxs("div", {
									className: css_default.srcHead,
									children: [
										react_jsx_runtime.jsxs("span", {
											className: css_default.srcTitle,
											style: isSavingGroup && hasSavings && !hasCost ? { color: meta.color } : void 0,
											children: [
												react_jsx_runtime.jsx("span", { className: css_default.srcDot, style: { background: meta.color } }),
												headline
											]
										}),
										react_jsx_runtime.jsx("span", { className: css_default.srcCalls, children: `${t("calls")} ${formatNumber(bucket.calls)}` })
									]
								}),
								meta.key === "subscription" && bucket.monthly > 0 && react_jsx_runtime.jsx("div", {
									className: css_default.srcNote,
									children: `${t("source.monthly")} ${formatCost(symbol, currency === "USD" ? bucket.monthly / (coding?.rate ?? 7.2) : bucket.monthly)}`
								}),
								rows
							]
						}, meta.key);
					}),
					// ── 白嫖推荐：仅提示哪些 provider 有免费模型（可设为「按量+可白嫖」） ──
					Object.keys(promos).length > 0 && react_jsx_runtime.jsx("p", {
						className: css_default.setHint,
						children: [
							`${t("promo.title")}: `,
							Object.entries(promos)
								.map(([provider, freeModels]) => {
									const count = Object.keys(freeModels).filter((m) => freeModels[m] === true).length;
									return count > 0 ? `${provider}(${count})` : null;
								})
								.filter(Boolean)
								.join(" · ")
						]
					}),
					// Provider 收费形式编辑
					react_jsx_runtime.jsx("p", { className: css_default.setSectionTitle, children: t("metering.title") }),
					react_jsx_runtime.jsx("div", {
						children: [
							// 遍历已保存的 metering 配置（全局，与时间范围无关）。
							Object.keys(metering).map((provider) => {
								const rule = meteringDraft === null ? (metering[provider] ?? { mode: "usage", monthly: 0 }) : (meteringDraft[provider] ?? { mode: "usage", monthly: 0 });
								return react_jsx_runtime.jsxs("div", {
									className: css_default.metRow,
									children: [
										react_jsx_runtime.jsx("span", { className: css_default.metName, children: provider }),
										react_jsx_runtime.jsx("select", {
											className: css_default.metSelect,
											value: rule.mode,
											onChange: (event) => {
												const mode = event.target.value;
												setMeteringDraft((prev) => {
													const base = prev === null ? Object.fromEntries(Object.entries(metering).map(([p, r]) => [p, { mode: r.mode, monthly: r.monthly, ...(r.freeModels ? { freeModels: r.freeModels } : {}) }])) : { ...prev };
													// 切到 usage-free 时保留该 provider 已有的 freeModels（用户自定义不丢失）。
													const prevFree = base[provider]?.freeModels;
													base[provider] = { mode, monthly: mode === "subscription" ? (base[provider]?.monthly ?? 0) : 0, ...(mode === "usage-free" && prevFree ? { freeModels: prevFree } : {}) };
													return base;
												});
												setMeteringSaved(false);
											},
											children: [
												react_jsx_runtime.jsx("option", { value: "usage", children: t("metering.usage") }),
												react_jsx_runtime.jsx("option", { value: "usage-free", children: t("metering.usageFree") }),
												react_jsx_runtime.jsx("option", { value: "subscription", children: t("metering.subscription") }),
												react_jsx_runtime.jsx("option", { value: "free", children: t("metering.free") }),
												react_jsx_runtime.jsx("option", { value: "local", children: t("metering.local") })
											]
										}),
										rule.mode === "usage-free" && react_jsx_runtime.jsx("div", {
											style: { width: "100%", marginTop: 2, fontSize: 11, color: "var(--dsw-alias-label-tertiary)" },
											children: [
												react_jsx_runtime.jsx("span", { children: `${t("metering.freeModels")}: ` }),
												(() => {
													const builtin = promos[provider] ?? {};
													const userModels = rule.freeModels ?? {};
													const models = { ...builtin, ...userModels };
													const names = Object.keys(models).filter((m) => models[m] === true);
													if (names.length === 0) return react_jsx_runtime.jsx("span", { children: t("metering.noFree") });
													return names.map((m) => react_jsx_runtime.jsx("span", {
														style: { color: "#0ea5e9", marginRight: 6 },
														children: m
													}));
												})()
											]
										}),
										rule.mode === "subscription" && react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
											children: [
												react_jsx_runtime.jsx("input", {
													type: "number",
													min: 0,
													className: css_default.metInput,
													placeholder: t("metering.monthlyPlaceholder"),
													value: rule.monthly === 0 ? "" : rule.monthly,
													onChange: (event) => {
														const monthly = Number(event.target.value) || 0;
														setMeteringDraft((prev) => {
															const base = prev === null ? Object.fromEntries(Object.entries(metering).map(([p, r]) => [p, { mode: r.mode, monthly: r.monthly, ...(r.freeModels ? { freeModels: r.freeModels } : {}) }])) : { ...prev };
															base[provider] = { mode: "subscription", monthly };
															return base;
														});
														setMeteringSaved(false);
													}
												}),
												react_jsx_runtime.jsx("span", { className: css_default.metUnit, children: symbol + "/" + t("monthShort") })
											]
										})
									]
								}, provider);
							}),
							// 添加 provider 收费形式（从实际出现过的 provider 中选择，排除已配置的）。
							(() => {
								const candidates = Object.keys(byProvider).filter((p) => metering[p] === void 0);
								if (candidates.length === 0) return null;
								return react_jsx_runtime.jsxs("div", {
									style: { display: "flex", alignItems: "center", gap: 8, marginTop: 4 },
									children: [
										react_jsx_runtime.jsx("select", {
											className: css_default.metSelect,
											value: meteringAdd,
											onChange: (event) => setMeteringAdd(event.target.value),
											children: [
												react_jsx_runtime.jsx("option", { value: "", children: t("metering.addPlaceholder") }),
												candidates.map((p) => react_jsx_runtime.jsx("option", { value: p, children: p }, p))
											]
										}),
										react_jsx_runtime.jsx("button", {
											type: "button",
											className: css_default.foldBtn,
											disabled: meteringAdd === "",
											onClick: () => {
												setMeteringDraft((prev) => {
													const base = prev === null ? Object.fromEntries(Object.entries(metering).map(([p, r]) => [p, { mode: r.mode, monthly: r.monthly, ...(r.freeModels ? { freeModels: r.freeModels } : {}) }])) : { ...prev };
													base[meteringAdd] = { mode: "usage", monthly: 0 };
													return base;
												});
												setMeteringAdd("");
												setMeteringSaved(false);
											},
											children: t("metering.add")
										})
									]
								});
							})(),
							react_jsx_runtime.jsxs("div", {
								className: css_default.metActions,
								children: [
									react_jsx_runtime.jsx("button", {
										type: "button",
										className: css_default.foldBtn,
										disabled: meteringBusy,
										onClick: async () => {
											if (meteringBusy) return;
											const payload = meteringDraft === null ? metering : meteringDraft;
											setMeteringBusy(true);
											try {
												const response = await fetch("/billing/metering", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
												const result = await response.json();
												setMeteringSaved(result?.ok === true);
												if (result?.ok === true) {
													setMeteringDraft(null);
													// 立即拉新快照，避免最长 5s 显示旧值（reprice 已重估历史）。
													if (typeof refresh === "function") refresh();
												}
											} catch { setMeteringSaved(false); }
											setMeteringBusy(false);
										},
										children: t("metering.save")
									}),
									meteringSaved && react_jsx_runtime.jsx("span", { className: `${css_default.setCardSub} ${css_default.save}`, children: t("metering.saved") })
								]
							})
						]
					}),
					// ── 月度预算 ──
					react_jsx_runtime.jsx("div", {
						className: css_default.setCard,
						children: [
							react_jsx_runtime.jsxs("div", {
								style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
								children: [
									react_jsx_runtime.jsx("p", { className: css_default.setCardLabel, children: t("budget.title") }),
									react_jsx_runtime.jsx("label", {
										style: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--dsw-alias-label-secondary)", cursor: "pointer" },
										children: [
											react_jsx_runtime.jsx("input", {
												type: "checkbox",
												checked: budgetDraft === null ? budget.enabled : budgetDraft.enabled,
												onChange: (event) => setBudgetDraft({ enabled: event.target.checked, amount: budgetDraft === null ? budget.amount : budgetDraft.amount })
											}),
											t("budget.enable")
										]
									}),
									react_jsx_runtime.jsx("input", {
										type: "number",
										min: 0,
										disabled: budgetDraft === null ? !budget.enabled : !budgetDraft.enabled,
										className: css_default.metInput,
										placeholder: t("budget.placeholder"),
										value: budgetDraft === null ? (budget.amount === 0 ? "" : budget.amount) : budgetDraft.amount,
										onChange: (event) => setBudgetDraft({ enabled: budgetDraft === null ? budget.enabled : budgetDraft.enabled, amount: Number(event.target.value) || 0 })
									}),
									react_jsx_runtime.jsx("span", { className: css_default.metUnit, children: symbol + "/" + t("monthShort") }),
									react_jsx_runtime.jsx("button", {
										type: "button",
										className: css_default.foldBtn,
										onClick: async () => {
											const payload = budgetDraft === null ? budget : budgetDraft;
											try {
												const response = await fetch("/billing/budget", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
												const result = await response.json();
												setBudgetSaved(result?.ok === true);
												if (result?.ok === true) { setBudgetDraft(null); if (typeof refresh === "function") refresh(); }
											} catch { setBudgetSaved(false); }
										},
										children: t("metering.save")
									}),
									budgetSaved && react_jsx_runtime.jsx("span", { className: `${css_default.setCardSub} ${css_default.save}`, children: t("metering.saved") })
								]
							}),
							budget.enabled && budget.amount > 0 && (() => {
								const used = monthCost;
								const budgetAmountDisplay = currency === "USD" ? budget.amount / (coding?.rate ?? 7.2) : budget.amount;
								const rawPct = budgetAmountDisplay > 0 ? (used / budgetAmountDisplay) * 100 : 0;
								const pct = Math.min(100, rawPct);
								const over = used > budgetAmountDisplay;
								return react_jsx_runtime.jsxs(react_jsx_runtime.Fragment, {
									children: [
										react_jsx_runtime.jsx("div", {
											style: { height: 8, borderRadius: 999, background: "var(--dsw-alias-bg-layer-3)", overflow: "hidden", marginTop: 8 },
											children: react_jsx_runtime.jsx("div", {
												style: { height: "100%", width: `${pct}%`, borderRadius: 999, background: over ? "var(--dsw-alias-state-error-primary, #dc2626)" : pct >= 80 ? "var(--dsw-alias-state-warn-primary, #f59e0b)" : "var(--dsw-alias-state-success-primary, #22c55e)" }
											})
										}),
										react_jsx_runtime.jsx("div", { className: css_default.setCardSub, style: over ? { color: "var(--dsw-alias-state-error-primary, #dc2626)" } : void 0, children: `${t("budget.used")} ${formatCost(symbol, used)} / ${formatCost(symbol, budgetAmountDisplay)} (${Math.round(rawPct)}%)` })
									]
								});
							})()
						]
					}),
					// ── 余额显示开关（控制右上角余额；设置页始终显示） ──
					react_jsx_runtime.jsx("div", {
						className: css_default.setCard,
						children: [
							react_jsx_runtime.jsxs("div", {
								style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
								children: [
									react_jsx_runtime.jsx("p", { className: css_default.setCardLabel, children: t("balance.title") }),
									react_jsx_runtime.jsx("button", {
										type: "button",
										className: css_default.foldBtn,
										style: balanceOn ? { borderColor: "var(--dsw-alias-state-success-primary)", color: "var(--dsw-alias-state-success-primary)" } : void 0,
										onClick: async () => {
											const next = !balanceOn;
											try {
												const response = await fetch("/billing/balance", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ enabled: next }) });
												const result = await response.json();
												if (result?.ok === true) {
													setBalanceToggle(next);
													// 用 currentRange（保存后刷新，避免把自定义范围污染成裸 "custom"）。
													if (typeof refresh === "function") refresh();
												}
											} catch { /* 静默 */ }
										},
										children: balanceOn ? t("balance.on") : t("balance.off")
									}),
									react_jsx_runtime.jsx("span", { className: css_default.setCardSub, children: t("balance.hint") })
								]
							})
						]
					}),
					// 会话（折叠）
					react_jsx_runtime.jsx("button", {
						type: "button",
						className: css_default.foldBtn,
						onClick: () => setOpenSessions((v) => !v),
						children: `${t("sessions")} (${sessionList.length}) ${openSessions ? "▾" : "▸"}`
					}),
					openSessions && (sessionRows.length === 0
						? react_jsx_runtime.jsx("p", { className: css_default.setEmpty, children: t("empty") })
						: react_jsx_runtime.jsx("div", {
							className: css_default.setScroll,
							children: react_jsx_runtime.jsxs("table", {
								className: css_default.setTable,
								children: [
									react_jsx_runtime.jsx("thead", { children: react_jsx_runtime.jsxs("tr", { children: [react_jsx_runtime.jsx("th", { children: t("session") }), react_jsx_runtime.jsx("th", { className: css_default.num, children: t("calls") }), react_jsx_runtime.jsx("th", { className: css_default.num, children: t("cost") }), react_jsx_runtime.jsx("th", { className: css_default.num, children: t("saved") })] }) }),
									react_jsx_runtime.jsx("tbody", { children: sessionRows })
								]
							})
						})),
					// 历史（折叠）
					react_jsx_runtime.jsx("button", {
						type: "button",
						className: css_default.foldBtn,
						onClick: () => setOpenHistory((v) => !v),
						children: `${t("history")} (${history.length}) ${openHistory ? "▾" : "▸"}`
					}),
					// 导出
					react_jsx_runtime.jsxs("div", {
						style: { display: "flex", gap: 8, marginTop: 2 },
						children: [
							react_jsx_runtime.jsx("button", {
								type: "button",
								className: css_default.foldBtn,
								onClick: () => exportBilling("csv", { totals, month, today, history, byProviderModel, sessionList, symbol, amountOf, savedOf, currency }),
								children: t("export.csv")
							}),
							react_jsx_runtime.jsx("button", {
								type: "button",
								className: css_default.foldBtn,
								onClick: () => exportBilling("json", { totals, month, today, history, byProviderModel, sessionList }),
								children: t("export.json")
							})
						]
					}),
					openHistory && (historyRows.length === 0
						? react_jsx_runtime.jsx("p", { className: css_default.setEmpty, children: t("empty") })
						: react_jsx_runtime.jsx("div", {
							className: css_default.setScroll,
							children: react_jsx_runtime.jsxs("table", {
								className: css_default.setTable,
								children: [
									react_jsx_runtime.jsx("thead", { children: react_jsx_runtime.jsxs("tr", { children: [react_jsx_runtime.jsx("th", { children: t("date") }), react_jsx_runtime.jsx("th", { className: css_default.num, children: t("calls") }), react_jsx_runtime.jsx("th", { className: css_default.num, children: t("cost") }), react_jsx_runtime.jsx("th", { className: css_default.num, children: t("saved") })] }) }),
									react_jsx_runtime.jsx("tbody", { children: historyRows })
								]
							})
						})),
					// ── 版本与更新（检测 GitHub 最新版） ──
					react_jsx_runtime.jsx("div", {
						className: css_default.setCard,
						children: [
							react_jsx_runtime.jsxs("div", {
								style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
								children: [
									react_jsx_runtime.jsx("p", { className: css_default.setCardLabel, children: `${t("update.title")} v${value?.version ?? "?"}` }),
									react_jsx_runtime.jsx("button", {
										type: "button",
										className: css_default.foldBtn,
										disabled: updateState === "checking",
										onClick: async () => {
											setUpdateState("checking");
											setUpdateInfo(null);
											try {
												const response = await fetch("https://api.github.com/repos/bpc-oss/dsh-web-billing/releases/latest", { headers: { accept: "application/json" } });
												if (!response.ok) throw new Error(String(response.status));
												const release = await response.json();
												const latest = (release?.tag_name ?? "").replace(/^v/, "");
												const current = (value?.version ?? "0.0.0").replace(/^v/, "");
												// 分段数字比较（semver 序），避免字符串比较误报（如本机 2.2.0 > latest 2.2.0-beta）。
												const cmpVersion = (a, b) => {
													const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
													const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
													for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
														const x = pa[i] ?? 0;
														const y = pb[i] ?? 0;
														if (x !== y) return x < y ? -1 : 1;
													}
													return 0;
												};
												const hasNew = latest.length > 0 && cmpVersion(latest, current) > 0;
												setUpdateInfo({ latest, hasNew, url: release?.html_url ?? "https://github.com/bpc-oss/dsh-web-billing/releases" });
											} catch {
												setUpdateInfo({ latest: "", hasNew: false, error: true });
											}
											setUpdateState("done");
										},
										children: updateState === "checking" ? t("update.checking") : t("update.check")
									}),
									updateState === "done" && updateInfo !== null && (updateInfo.hasNew
										? react_jsx_runtime.jsx("a", {
											className: `${css_default.setCardSub} ${css_default.save}`,
											style: { color: "var(--dsw-alias-state-warn-primary, #f59e0b)" },
											href: updateInfo.url,
											target: "_blank",
											rel: "noreferrer",
											children: `${t("update.newVersion")} v${updateInfo.latest}`
										})
										: react_jsx_runtime.jsx("span", {
											className: `${css_default.setCardSub} ${css_default.save}`,
											children: updateInfo.error ? t("update.error") : t("update.latest")
										})),
									// 数据自检：账本各口径一致性（不一致时警示）。
									value?.integrity !== void 0 && react_jsx_runtime.jsx("div", {
										className: css_default.setCardSub,
										style: value.integrity.ok ? void 0 : { color: "var(--dsw-alias-state-warn-primary, #f59e0b)" },
										children: value.integrity.ok ? t("integrity.ok") : t("integrity.warn")
									}),
									// 按来源拆分缺口（历史裁剪遗留，显式标注）。
									value?.bdpGap !== void 0 && value.bdpGap.calls > 0 && react_jsx_runtime.jsx("div", {
										className: css_default.setCardSub,
										style: { color: "var(--dsw-alias-state-warn-primary, #f59e0b)" },
										children: `${t("integrity.gap")} ${formatNumber(value.bdpGap.calls)} 条 / ${formatCost(symbol, value.bdpGap.cost)}`
									})
								]
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
			"close": "关闭",
			"inThisSession": "本会话",
			"hit": "命中率",
			"calls": "调用次数",
			"input": "输入",
			"cache": "缓存命中",
			"output": "输出",
			"byModel": "按模型",
			"bySource": "按来源",
			"source.local": "本地部署省",
			"source.subscription": "订阅回本",
			"source.free": "白嫖",
			"source.official": "按量花费",
			"source.unknown": "其他",
			"source.monthly": "本月订阅费",
			"metering.title": "Provider 收费形式",
			"metering.usage": "按量",
			"metering.usageFree": "按量+可白嫖",
			"metering.freeModels": "免费模型",
			"metering.noFree": "无（按量计费）",
			"metering.subscription": "订阅",
			"metering.free": "活动免费",
			"metering.local": "本地部署",
			"metering.monthlyPlaceholder": "月费",
			"metering.save": "保存",
			"metering.saved": "已保存",
			"metering.addPlaceholder": "添加 provider…",
			"metering.add": "添加",
			"monthShort": "月",
			"tokens": "Token",
			"inputMiss": "输入(未命中)",
			"budget.title": "月度预算",
			"budget.enable": "启用",
			"budget.placeholder": "预算金额",
			"budget.used": "已用",
			"range.today": "今日",
			"range.week": "本周",
			"range.month": "本月",
			"range.30d": "近30天",
			"range.all": "全部",
			"range.custom": "自定义",
			"range.apply": "应用",
			"range.windowHint": "范围明细基于最近流水窗口，更早为聚合级（详见文档）",
			"export.csv": "导出 CSV",
			"export.json": "导出 JSON",
			"update.title": "版本与更新",
			"update.check": "检查更新",
			"update.checking": "检查中…",
			"update.newVersion": "发现新版本",
			"update.latest": "已是最新版本",
			"update.error": "检查失败（请检查网络）",
			"integrity.ok": "数据自检通过（各口径一致）",
			"integrity.warn": "数据自检：存在口径不一致（见文档）",
			"integrity.gap": "按来源拆分缺（历史裁剪遗留）",
			"promo.title": "白嫖推荐（内置活动情报）",
			"pricing.auto": "官方政策自动计价",
			"pricing.custom": "自定义价格",
			"pricing.peakNow": "当前为高峰期",
			"pricing.offPeakNow": "当前为峰谷期",
			"balance": "账户余额",
			"balance.title": "右上角显示余额",
			"balance.on": "已开启",
			"balance.off": "已关闭",
			"balance.hint": "控制会话右上角是否显示余额；设置页始终显示",
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
			"close": "Close",
			"inThisSession": "In this session",
			"hit": "Hit rate",
			"calls": "Calls",
			"input": "Input",
			"cache": "Cache hit",
			"output": "Output",
			"byModel": "By model",
			"bySource": "By source",
			"source.local": "Local saved",
			"source.subscription": "Sub recovered",
			"source.free": "Free ride",
			"source.official": "Usage cost",
			"source.unknown": "Other",
			"source.monthly": "Monthly fee",
			"metering.title": "Provider metering",
			"metering.usage": "Usage",
			"metering.usageFree": "Usage + free",
			"metering.freeModels": "Free models",
			"metering.noFree": "none (billed)",
			"metering.subscription": "Subscription",
			"metering.free": "Free",
			"metering.local": "Local",
			"metering.monthlyPlaceholder": "monthly",
			"metering.save": "Save",
			"metering.saved": "Saved",
			"metering.addPlaceholder": "Add provider…",
			"metering.add": "Add",
			"monthShort": "mo",
			"tokens": "Tokens",
			"inputMiss": "Input (miss)",
			"budget.title": "Monthly budget",
			"budget.enable": "Enable",
			"budget.placeholder": "amount",
			"budget.used": "Used",
			"range.today": "Today",
			"range.week": "This week",
			"range.month": "This month",
			"range.30d": "30 days",
			"range.all": "All",
			"range.custom": "Custom",
			"range.apply": "Apply",
			"range.windowHint": "Range details cover the recent-ledger window; earlier data is aggregate-level (see docs)",
			"export.csv": "Export CSV",
			"export.json": "Export JSON",
			"update.title": "Version & updates",
			"update.check": "Check for updates",
			"update.checking": "Checking…",
			"update.newVersion": "New version available",
			"update.latest": "You're up to date",
			"update.error": "Check failed (network?)",
			"integrity.ok": "Data integrity OK (all views agree)",
			"integrity.warn": "Data integrity: view mismatch (see docs)",
			"integrity.gap": "Source-split gap (historical trimming)",
			"promo.title": "Free-ride picks (built-in promo data)",
			"pricing.auto": "Official pricing policy",
			"pricing.custom": "Custom prices",
			"pricing.peakNow": "Peak hours now",
			"pricing.offPeakNow": "Off-peak now",
			"balance": "Account balance",
			"balance.title": "Show balance in header",
			"balance.on": "On",
			"balance.off": "Off",
			"balance.hint": "Controls whether the session header shows the balance; the settings page always shows it",
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
				hooks: { billing: controller, locale: localeStore },
				refresh: (range) => controller.refresh(range)
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
