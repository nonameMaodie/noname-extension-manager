import { ref as A, defineComponent as l, useCssVars as $, openBlock as c, createElementBlock as h, renderSlot as v, h as x, createBlock as f, unref as k, withCtx as T, createTextVNode as V, toDisplayString as H, resolveDynamicComponent as C, createVNode as N, createCommentVNode as z, computed as Y, normalizeStyle as R, nextTick as Q, watchEffect as J, onMounted as q, watch as X, Fragment as G, renderList as K, normalizeClass as Z } from "../external/vue.js";
function j(e) {
	if (!e || typeof document > "u") return;
	let t = document.head || document.getElementsByTagName("head")[0], a = document.createElement("style");
	a.type = "text/css", t.appendChild(a), a.styleSheet ? a.styleSheet.cssText = e : a.appendChild(document.createTextNode(e));
}
j(".toast-bar{--enterFactor:var(--0f09fc80);--exitFactor:var(--9e76da98)}@keyframes fadeInAnimation{0%{opacity:0}100%{opacity:1}}@keyframes fadeOutAnimation{0%{opacity:1}100%{opacity:0}}@keyframes enterAnimation{0%{transform:translate3d(0,var(--enterFactor),0) scale(.6);opacity:.5}100%{transform:translate3d(0,0,0) scale(1);opacity:1}}@keyframes exitAnimation{0%{transform:translate3d(0,0,-1px) scale(1);opacity:1}100%{transform:translate3d(0,var(--exitFactor),-1px) scale(.6);opacity:0}}.active-class[data-v-5bbc3f47]{z-index:9999}.active-class[data-v-5bbc3f47]>*{pointer-events:auto}@keyframes circleAnimation-2cfa63ad{from{transform:scale(0) rotate(45deg);opacity:0}to{transform:scale(1) rotate(45deg);opacity:1}}@keyframes checkmarkAnimation-2cfa63ad{0%{height:0;width:0;opacity:0}40%{height:0;width:6px;opacity:1}100%{opacity:1;height:10px}}.checkmark[data-v-2cfa63ad]{width:20px;opacity:0;height:20px;border-radius:10px;background:var(--53612540);position:relative;transform:rotate(45deg);animation:circleAnimation-2cfa63ad .3s cubic-bezier(.175,.885,.32,1.275) forwards;animation-delay:.1s}.checkmark[data-v-2cfa63ad]::after{content:'';box-sizing:border-box;animation:checkmarkAnimation-2cfa63ad .2s ease-out forwards;opacity:0;animation-delay:.2s;position:absolute;border-right:2px solid;border-bottom:2px solid;border-color:var(--3cbfb132);bottom:6px;left:6px;height:10px;width:6px}.error[data-v-1eb01016]{width:20px;opacity:0;height:20px;border-radius:10px;background:var(--4d95dba6);position:relative;transform:rotate(45deg);animation:circleAnimation-1eb01016 .3s cubic-bezier(.175,.885,.32,1.275) forwards;animation-delay:.1s}.error[data-v-1eb01016]::after{content:'';animation:firstLineAnimation-1eb01016 .15s ease-out forwards;animation-delay:150ms;position:absolute;border-radius:3px;opacity:0;background:var(--7ca06618);bottom:9px;left:4px;height:2px;width:12px}.error[data-v-1eb01016]::before{content:'';animation:firstLineAnimation-1eb01016 .15s ease-out forwards;position:absolute;border-radius:3px;opacity:0;background:var(--7ca06618);bottom:9px;left:4px;height:2px;width:12px;animation:secondLineAnimation-1eb01016 .15s ease-out forwards;animation-delay:180ms;transform:rotate(90deg)}@keyframes circleAnimation-1eb01016{from{transform:scale(0) rotate(45deg);opacity:0}to{transform:scale(1) rotate(45deg);opacity:1}}@keyframes firstLineAnimation-1eb01016{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}@keyframes secondLineAnimation-1eb01016{from{transform:scale(0) rotate(90deg);opacity:0}to{transform:scale(1) rotate(90deg);opacity:1}}@keyframes rotate-a2b30498{from{transform:rotate(0)}to{transform:rotate(360deg)}}.loader[data-v-a2b30498]{width:12px;height:12px;box-sizing:border-box;border:2px solid;border-radius:100%;border-color:var(--120036f9);border-right-color:var(--26731e72);animation:rotate-a2b30498 1s linear infinite}.animated-icon-wrapper[data-v-0ff2f7a7]{position:relative;transform:scale(.6);opacity:.4;min-width:20px;animation:animated-icon-enter-0ff2f7a7 .3s .12s cubic-bezier(.175,.885,.32,1.275) forwards}.indicator-wrapper[data-v-0ff2f7a7]{position:'relative';display:flex;justify-content:center;align-items:center;min-width:20px;min-height:20px}@keyframes animated-icon-enter-0ff2f7a7{from{transform:scale(.6);opacity:.4}to{transform:scale(1);opacity:1}}");
const ee = /* @__PURE__ */ (() => {
	let e = 0;
	return () => (++e).toString();
})(), W = /* @__PURE__ */ (() => {
	let e;
	return () => {
		if (e === void 0 && typeof window < "u") {
			const t = matchMedia("(prefers-reduced-motion: reduce)");
			e = !t || t.matches;
		}
		return e;
	};
})(), te = 20;
var b = /* @__PURE__ */ ((e) => (e[e.ADD_TOAST = 0] = "ADD_TOAST", e[e.UPDATE_TOAST = 1] = "UPDATE_TOAST", e[e.UPSERT_TOAST = 2] = "UPSERT_TOAST", e[e.DISMISS_TOAST = 3] = "DISMISS_TOAST", e[e.REMOVE_TOAST = 4] = "REMOVE_TOAST", e[e.START_PAUSE = 5] = "START_PAUSE", e[e.END_PAUSE = 6] = "END_PAUSE", e))(b || {});
const O = /* @__PURE__ */ new Map(), ae = 1e3;
function L(e) {
	if (O.has(e))
		return;
	const t = setTimeout(() => {
		O.delete(e), g({
			type: 4,
			toastId: e
		});
	}, ae);
	O.set(e, t);
}
function re(e) {
	const t = O.get(e);
	t && clearTimeout(t);
}
function U(e, t) {
	switch (t.type) {
		case 0:
			return {
				...e,
				toasts: [t.toast, ...e.toasts].slice(0, te)
			};
		case 1:
			return t.toast.id && re(t.toast.id), {
				...e,
				toasts: e.toasts.map(
					(a) => a.id === t.toast.id ? { ...a, ...t.toast } : a
				)
			};
		case 2: {
			const { toast: a } = t;
			return e.toasts.some((o) => o.id === a.id) ? U(e, { type: 1, toast: a }) : U(e, { type: 0, toast: a });
		}
		case 3: {
			const { toastId: a } = t;
			return a ? L(a) : e.toasts.forEach((o) => {
				L(o.id);
			}), {
				...e,
				toasts: e.toasts.map(
					(o) => o.id === a || a === void 0 ? {
						...o,
						visible: !1
					} : o
				)
			};
		}
		case 4:
			return t.toastId === void 0 ? {
				...e,
				toasts: []
			} : {
				...e,
				toasts: e.toasts.filter((a) => a.id !== t.toastId)
			};
		case 5:
			return {
				...e,
				pausedAt: t.time
			};
		case 6: {
			const a = t.time - (e.pausedAt || 0);
			return {
				...e,
				pausedAt: void 0,
				toasts: e.toasts.map((o) => ({
					...o,
					pauseDuration: o.pauseDuration + a
				}))
			};
		}
	}
}
const oe = {
	blank: 4e3,
	error: 4e3,
	success: 2e3,
	loading: Number.POSITIVE_INFINITY,
	custom: 4e3
};
let S = { toasts: [], pausedAt: void 0 };
const D = A([]);
function g(e) {
	const t = U(S, e);
	se(t, S) || (S = t, S.toasts.length === 0 ? D.value.splice(0, D.value.length) : D.value.push(0));
}
function se(e, t) {
	return JSON.stringify(e) === JSON.stringify(t);
}
function ne(e = {}) {
	const t = S.toasts.map((a) => {
		var o, s;
		return {
			...e,
			...e[a.type],
			...a,
			duration: a.duration || ((o = e[a.type]) == null ? void 0 : o.duration) || (e == null ? void 0 : e.duration) || oe[a.type],
			style: {
				...e.style,
				...(s = e[a.type]) == null ? void 0 : s.style,
				...a.style
			}
		};
	});
	return {
		...S,
		toasts: t
	};
}
function ie(e) {
	return typeof e == "function";
}
function B(e, t) {
	return ie(e) ? e(t) : e;
}
function ce(e, t = "blank", a) {
	return {
		createdAt: Date.now(),
		visible: !0,
		type: t,
		ariaProps: {
			role: "status",
			"aria-live": "polite"
		},
		message: e,
		pauseDuration: 0,
		...a,
		id: (a == null ? void 0 : a.id) || ee()
	};
}
function I(e) {
	return (t, a) => {
		const o = ce(t, e, a);
		return g({ type: b.UPSERT_TOAST, toast: o }), o.id;
	};
}
function p(e, t) {
	return I("blank")(e, t);
}
p.error = I("error");
p.success = I("success");
p.loading = I("loading");
p.custom = I("custom");
p.dismiss = (e) => {
	g({
		type: b.DISMISS_TOAST,
		toastId: e
	});
};
p.remove = (e) => g({ type: b.REMOVE_TOAST, toastId: e });
p.promise = (e, t, a) => {
	const o = p.loading(t.loading, { ...a, ...a == null ? void 0 : a.loading });
	return e.then((s) => (p.success(B(t.success, s), {
		id: o,
		...a,
		...a == null ? void 0 : a.success
	}), s)).catch((s) => {
		p.error(B(t.error, s), {
			id: o,
			...a,
			...a == null ? void 0 : a.error
		});
	}), e;
};
const de = { class: "loader" }, ue = /* @__PURE__ */ l({
	__name: "Loader",
	props: {
		primary: { default: "#616161" },
		secondary: { default: "#e0e0e0" }
	},
	setup(e) {
		return $((t) => ({
			"120036f9": t.secondary,
			"26731e72": t.primary
		})), (t, a) => (c(), h("div", de, [
			v(t.$slots, "default", {}, void 0, !0)
		]));
	}
}), w = (e, t) => {
	const a = e.__vccOpts || e;
	for (const [o, s] of t)
		a[o] = s;
	return a;
}, le = /* @__PURE__ */ w(ue, [["__scopeId", "data-v-a2b30498"]]), pe = { class: "checkmark" }, fe = /* @__PURE__ */ l({
	__name: "Checkmark",
	props: {
		primary: { default: "#61d345" },
		secondary: { default: "#fff" }
	},
	setup(e) {
		return $((t) => ({
			53612540: t.primary,
			"3cbfb132": t.secondary
		})), (t, a) => (c(), h("div", pe, [
			v(t.$slots, "default", {}, void 0, !0)
		]));
	}
}), me = /* @__PURE__ */ w(fe, [["__scopeId", "data-v-2cfa63ad"]]), ye = { class: "error" }, he = /* @__PURE__ */ l({
	__name: "Error",
	props: {
		primary: { default: "#ff4b4b" },
		secondary: { default: "#fff" }
	},
	setup(e) {
		return $((t) => ({
			"4d95dba6": t.primary,
			"7ca06618": t.secondary
		})), (t, a) => (c(), h("div", ye, [
			v(t.$slots, "default", {}, void 0, !0)
		]));
	}
}), ve = /* @__PURE__ */ w(he, [["__scopeId", "data-v-1eb01016"]]), be = { key: 2 }, ge = /* @__PURE__ */ l({
	__name: "ToastIcon",
	props: {
		toast: {}
	},
	setup(e) {
		const t = e, a = l((n, { slots: r }) => () => {
			var d;
			return x(
				"div",
				{
					style: {
						position: "absolute"
					}
				},
				(d = r.default) == null ? void 0 : d.call(r)
			);
		}), o = l((n, { slots: r }) => () => {
			var d;
			return x(
				"div",
				{
					class: "indicator-wrapper "
				},
				(d = r.default) == null ? void 0 : d.call(r)
			);
		}), s = l((n, { slots: r }) => () => {
			var d;
			return x(
				"div",
				{
					class: "animated-icon-wrapper"
				},
				(d = r.default) == null ? void 0 : d.call(r)
			);
		});
		return (n, r) => t.toast.icon !== void 0 && typeof t.toast.icon == "string" ? (c(), f(k(s), { key: 0 }, {
			default: T(() => [
				V(H(t.toast.icon), 1)
			]),
			_: 1
		})) : t.toast.icon !== void 0 && typeof t.toast.icon != "string" ? (c(), f(C(t.toast.icon), {
			key: 1,
			t: t.toast
		}, null, 8, ["t"])) : t.toast.type === "blank" ? (c(), h("div", be)) : t.toast.icon ? z("", !0) : (c(), f(k(o), { key: 3 }, {
			default: T(() => [
				N(le, {
					props: t.toast.iconTheme
				}, null, 8, ["props"]),
				t.toast.type !== "loading" ? (c(), f(k(a), { key: 0 }, {
					default: T(() => [
						t.toast.type === "error" ? (c(), f(ve, {
							key: 0,
							props: t.toast.iconTheme
						}, null, 8, ["props"])) : (c(), f(me, {
							key: 1,
							props: t.toast.iconTheme
						}, null, 8, ["props"]))
					]),
					_: 1
				})) : z("", !0)
			]),
			_: 1
		}));
	}
}), _e = /* @__PURE__ */ w(ge, [["__scopeId", "data-v-0ff2f7a7"]]), Se = /* @__PURE__ */ l({
	__name: "ToastBar",
	props: {
		toast: {},
		position: {},
		style: {}
	},
	setup(e) {
		$((i) => ({
			"0f09fc80": o.value,
			"9e76da98": s.value
		}));
		const t = e, a = Y(() => t.toast.height ? n(
			t.toast.position || t.position || "top-center",
			t.toast.visible
		) : { opacity: 0 }), o = A("0%"), s = A("0%");
		function n(i, u) {
			const E = i.includes("top") ? 1 : -1, _ = W();
			return _ || (o.value = `${E * -200}%`, s.value = `${E * -150}%`), {
				animation: u ? _ ? "fadeInAnimation" : "enterAnimation 0.35s cubic-bezier(.21,1.02,.73,1) forwards" : _ ? "fadeOutAnimation" : "exitAnimation 0.4s forwards cubic-bezier(.06,.71,.55,1)"
			};
		}
		const r = l((i, { slots: u }) => () => {
			var m;
			return x(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "center",
						background: "#fff",
						color: "#363636",
						lineHeight: 1.3,
						willChange: "transform",
						boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
						maxWidth: "350px",
						pointerEvents: "auto",
						padding: "8px 10px",
						borderRadius: "8px"
					}
				},
				(m = u.default) == null ? void 0 : m.call(u)
			);
		}), d = l(
			(i, { slots: u }) => () => {
				var m;
				return x(
					"div",
					{
						style: {
							display: "flex",
							justifyContent: "center",
							margin: "4px 10px",
							color: "inherit",
							flex: "1 1 auto",
							whiteSpace: "pre-line"
						},
						...i.ariaProps
					},
					(m = u.default) == null ? void 0 : m.call(u)
				);
			},
			// 其他选项，例如声明 props 和 emits。
			{
				props: ["ariaProps"]
			}
		);
		return (i, u) => (c(), f(k(r), {
			class: "toast-bar",
			style: R({
				...a.value,
				...i.style,
				...i.toast.style
			})
		}, {
			default: T(() => [
				N(_e, { toast: i.toast }, null, 8, ["toast"]),
				i.toast.message !== void 0 && typeof i.toast.message != "string" ? (c(), f(C(i.toast.message), {
					key: 0,
					t: i.toast
				}, null, 8, ["t"])) : (c(), f(k(d), {
					key: 1,
					ariaProps: i.toast.ariaProps
				}, {
					default: T(() => [
						V(H(i.toast.message), 1)
					]),
					_: 1
				}, 8, ["ariaProps"])),
				v(i.$slots, "default", { toast: i.toast })
			]),
			_: 3
		}, 8, ["style"]));
	}
});
function Te(e, t) {
	g({
		type: b.UPDATE_TOAST,
		toast: { id: e, height: t }
	});
}
function xe() {
	g({
		type: b.START_PAUSE,
		time: Date.now()
	});
}
function F(e) {
	const { toasts: t, pausedAt: a } = ne(e);
	Q(() => {
		if (a)
			return;
		const n = Date.now();
		t.map((r) => {
			if (r.duration === Number.POSITIVE_INFINITY)
				return;
			const d = (r.duration || 0) + r.pauseDuration - (n - r.createdAt);
			if (d < 0)
				r.visible && p.dismiss(r.id);
			else
				return setTimeout(() => p.dismiss(r.id), d);
		});
	});
	const o = J(() => {
		a && g({ type: b.END_PAUSE, time: Date.now() });
	});
	return {
		toasts: t,
		handlers: {
			updateHeight: Te,
			startPause: xe,
			endPause: o,
			calculateOffset: (n, r) => {
				const { reverseOrder: d = !1, gutter: i = 8, defaultPosition: u } = r || {}, m = t.filter(
					(y) => (y.position || u) === (n.position || u) && y.height
				), E = m.findIndex((y) => y.id === n.id), _ = m.filter(
					(y, M) => M < E && y.visible
				).length;
				return m.filter((y) => y.visible).slice(...d ? [_ + 1] : [0, _]).reduce((y, M) => y + (M.height || 0) + i, 0);
			}
		}
	};
}
const ke = /* @__PURE__ */ l({
	__name: "ToastWrapper",
	props: {
		id: {}
	},
	emits: ["onHeightUpdate"],
	setup(e, { emit: t }) {
		const a = e, o = t, s = A(null);
		return q(() => {
			s.value && (n(), new MutationObserver(n).observe(
				s.value,
				{
					subtree: !0,
					childList: !0,
					characterData: !0
				}
			));
			function n() {
				if (s.value) {
					const r = s.value.getBoundingClientRect().height;
					o("onHeightUpdate", a.id, r);
				}
			}
		}), (n, r) => (c(), h("div", {
			ref_key: "toastWrapper",
			ref: s
		}, [
			v(n.$slots, "default")
		], 512));
	}
}), P = 16, Ae = /* @__PURE__ */ l({
	__name: "Toaster",
	props: {
		position: { default: "top-center" },
		toastOptions: {},
		reverseOrder: { type: Boolean },
		gutter: {}
	},
	setup(e) {
		const t = e, a = A(F(t.toastOptions));
		X(
			D,
			() => {
				a.value = F(t.toastOptions);
			},
			{
				deep: !0
			}
		);
		function o(s, n) {
			const r = s.includes("top"), d = r ? { top: 0 } : { bottom: 0 }, i = s.includes("center") ? {
				justifyContent: "center"
			} : s.includes("right") ? {
				justifyContent: "flex-end"
			} : {};
			return {
				left: 0,
				right: 0,
				display: "flex",
				position: "absolute",
				transition: W() ? void 0 : "all 230ms cubic-bezier(.21,1.02,.73,1)",
				transform: `translateY(${n * (r ? 1 : -1)}px)`,
				...d,
				...i
			};
		}
		return (s, n) => (c(), h("div", {
			style: R({
				position: "fixed",
				zIndex: 9999,
				top: `${P}px`,
				left: `${P}px`,
				right: `${P}px`,
				bottom: `${P}px`,
				pointerEvents: "none"
			}),
			onMouseenter: n[0] || (n[0] = //@ts-ignore
				(...r) => a.value.handlers.startPause && a.value.handlers.startPause(...r)),
			onMouseleave: n[1] || (n[1] = //@ts-ignore
				(...r) => a.value.handlers.endPause && a.value.handlers.endPause(...r))
		}, [
			(c(!0), h(G, null, K(a.value.toasts, (r) => (c(), f(ke, {
				id: r.id,
				key: r.id,
				style: R(
					o(
						r.position || t.position,
						a.value.handlers.calculateOffset(r, {
							reverseOrder: s.reverseOrder,
							gutter: s.gutter,
							defaultPosition: t.position
						})
					)
				),
				class: Z(r.visible ? "active-class" : ""),
				onOnHeightUpdate: a.value.handlers.updateHeight
			}, {
				default: T(() => [
					r.type === "custom" ? (c(), f(C(r.message), {
						key: 0,
						t: r
					}, null, 8, ["t"])) : s.$slots.default ? v(s.$slots, "default", {
						key: 1,
						toast: r,
						position: r.position || t.position
					}, void 0, !0) : v(s.$slots, "toastBar", {
						key: 2,
						toast: r,
						position: r.position || t.position
					}, () => [
						N(Se, {
							toast: r,
							position: r.position || t.position
						}, null, 8, ["toast", "position"])
					], !0)
				]),
				_: 2
			}, 1032, ["id", "style", "class", "onOnHeightUpdate"]))), 128))
		], 36));
	}
}), Ee = /* @__PURE__ */ w(Ae, [["__scopeId", "data-v-5bbc3f47"]]);
export {
	me as CheckmarkIcon,
	ve as ErrorIcon,
	le as LoaderIcon,
	Se as ToastBar,
	_e as ToastIcon,
	Ee as Toaster,
	p as default,
	p as toast
};
