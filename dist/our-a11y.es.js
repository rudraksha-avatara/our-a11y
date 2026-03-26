var O = Object.defineProperty;
var D = (a, e, t) => e in a ? O(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var d = (a, e, t) => D(a, typeof e != "symbol" ? e + "" : e, t);
function k() {
  return typeof window != "undefined" && typeof document != "undefined";
}
function T(a) {
  if (k()) {
    if (document.readyState === "interactive" || document.readyState === "complete") {
      a();
      return;
    }
    document.addEventListener("DOMContentLoaded", a, { once: !0 });
  }
}
function S(a, e, t) {
  return Math.min(t, Math.max(e, a));
}
function l(a, e = {}) {
  const t = document.createElement(a);
  return Object.entries(e).forEach(([i, n]) => {
    t.setAttribute(i, n);
  }), t;
}
function v(a) {
  var n;
  if (!a)
    return "";
  const e = a.getAttribute("aria-label");
  if (e)
    return e.trim();
  const t = a.getAttribute("aria-labelledby");
  if (t) {
    const r = t.split(/\s+/).map((o) => {
      var s, c, h;
      return (h = (c = (s = document.getElementById(o)) == null ? void 0 : s.textContent) == null ? void 0 : c.trim()) != null ? h : "";
    }).join(" ").trim();
    if (r)
      return r;
  }
  const i = a.getAttribute("title");
  return i ? i.trim() : ((n = a.textContent) != null ? n : "").trim();
}
function N(a) {
  const e = [];
  let t = a;
  for (; t && t !== document.body && e.length < 4; ) {
    let i = t.tagName.toLowerCase();
    if (t.id) {
      i += `#${t.id}`, e.unshift(i);
      break;
    }
    t.classList.length > 0 && (i += `.${Array.from(t.classList).slice(0, 2).join(".")}`), e.unshift(i), t = t.parentElement;
  }
  return e.join(" > ") || a.tagName.toLowerCase();
}
function F(a) {
  return !(a.getAttribute("role") === "presentation" || a.getAttribute("aria-hidden") === "true" || !a.alt && a.width <= 24 && a.height <= 24);
}
function y(a, e, t, i, n, r = !1) {
  return {
    id: `${a}-${Math.random().toString(36).slice(2, 10)}`,
    type: a,
    severity: e,
    message: t,
    selector: N(i),
    suggestion: n,
    autoFixAvailable: r
  };
}
class B {
  scan(e = document) {
    const t = [], i = e instanceof Document ? e : document;
    i.documentElement.hasAttribute("lang") || t.push(
      y(
        "missing-lang",
        "medium",
        "Document language is not declared.",
        i.documentElement,
        "Add a valid lang attribute to the html element.",
        !0
      )
    ), i.querySelector('main, [role="main"]') || t.push(
      y(
        "missing-main",
        "medium",
        "No main landmark was found.",
        i.body,
        'Add a main element or a role="main" landmark.',
        !1
      )
    ), i.querySelectorAll("img").forEach((o) => {
      const s = o;
      !s.hasAttribute("alt") && F(s) && t.push(
        y(
          "missing-alt",
          "medium",
          "Image appears to be missing alternative text.",
          s,
          "Add meaningful alt text or mark decorative images appropriately.",
          !1
        )
      );
    }), i.querySelectorAll("input, select, textarea").forEach((o) => {
      const s = o, c = s.getAttribute("id"), h = !!(c && i.querySelector(`label[for="${CSS.escape(c)}"]`)), u = !!v(s);
      !h && !u && t.push(
        y(
          "missing-form-label",
          "high",
          "Form control does not have a clear accessible name.",
          s,
          "Associate a visible label or provide aria-label/aria-labelledby.",
          !!s.getAttribute("placeholder")
        )
      );
    }), i.querySelectorAll('button, [role="button"], a[href]').forEach((o) => {
      const s = o;
      !v(s) && !s.querySelector("img[alt], svg title") && t.push(
        y(
          s.tagName.toLowerCase() === "a" ? "empty-link" : "unnamed-button",
          "high",
          "Interactive element does not have a discernible accessible name.",
          s,
          "Add visible text, aria-label, aria-labelledby, or meaningful image alt text.",
          !1
        )
      );
    }), i.querySelectorAll("iframe").forEach((o) => {
      o.getAttribute("title") || t.push(
        y(
          "iframe-missing-title",
          "medium",
          "Iframe is missing a title.",
          o,
          "Add a concise title describing the embedded content.",
          !1
        )
      );
    }), i.querySelectorAll("video[autoplay], audio[autoplay]").forEach((o) => {
      t.push(
        y(
          "autoplay-media",
          "medium",
          "Autoplaying media may create accessibility barriers.",
          o,
          "Provide controls and avoid autoplay when possible.",
          !1
        )
      );
    });
    const n = Array.from(i.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    let r = 0;
    return n.forEach((o) => {
      const s = Number(o.tagName[1]);
      r && s > r + 1 && t.push(
        y(
          "heading-order",
          "low",
          "Heading level appears to skip levels.",
          o,
          "Review heading hierarchy for a logical outline.",
          !1
        )
      ), r = s;
    }), i.querySelectorAll("a[href]").forEach((o) => {
      const s = v(o);
      !s && o.childElementCount > 0 || s && /^(click here|read more|more)$/i.test(s) && t.push(
        y(
          "weak-link-text",
          "low",
          "Link text may not be descriptive out of context.",
          o,
          "Use more descriptive link text.",
          !1
        )
      );
    }), {
      scannedAt: Date.now(),
      issues: t
    };
  }
}
class $ {
  constructor() {
    d(this, "appliedMutations", []);
    d(this, "skipLink");
  }
  apply(e, t = document) {
    const i = t instanceof Document ? t : document;
    i.documentElement.getAttribute("lang") || (this.recordAttr(i.documentElement, "lang"), i.documentElement.setAttribute("lang", e.locale || navigator.language.split("-")[0] || "en")), e.features.skipLink && this.ensureSkipLink(i), i.querySelectorAll('button, [role="button"], a[href]').forEach((n) => {
      var u, m, x, b;
      const r = n;
      if (v(r))
        return;
      const o = (m = (u = r.querySelector("img[alt]")) == null ? void 0 : u.getAttribute("alt")) == null ? void 0 : m.trim(), s = (x = r.getAttribute("title")) == null ? void 0 : x.trim(), c = (b = r.getAttribute("data-label")) == null ? void 0 : b.trim(), h = o || s || c;
      h && (this.recordAttr(r, "aria-label"), r.setAttribute("aria-label", h));
    }), i.querySelectorAll("input, textarea").forEach((n) => {
      var h;
      const r = n, o = r.getAttribute("id");
      if (!!(o && i.querySelector(`label[for="${CSS.escape(o)}"]`)) || v(r))
        return;
      const c = (h = r.getAttribute("placeholder")) == null ? void 0 : h.trim();
      c && (this.recordAttr(r, "aria-label"), r.setAttribute("aria-label", c));
    });
  }
  ensureSkipLink(e) {
    var i;
    if (e.getElementById("our-a11y-skip-link"))
      return;
    const t = (i = e.querySelector('main, [role="main"], #main, #content, article')) != null ? i : e.body.firstElementChild;
    t && (t.id || (this.recordAttr(t, "id"), t.id = "our-a11y-main-target"), this.skipLink = document.createElement("a"), this.skipLink.id = "our-a11y-skip-link", this.skipLink.href = `#${t.id}`, this.skipLink.textContent = "Skip to main content", e.body.prepend(this.skipLink));
  }
  recordAttr(e, t) {
    e.hasAttribute(`data-oa-managed-${t}`) || (this.appliedMutations.push({
      element: e,
      attribute: t,
      previous: e.getAttribute(t)
    }), e.setAttribute(`data-oa-managed-${t}`, "true"));
  }
  destroy() {
    var e;
    this.appliedMutations.forEach(({ element: t, attribute: i, previous: n }) => {
      t.removeAttribute(`data-oa-managed-${i}`), n === null ? t.removeAttribute(i) : t.setAttribute(i, n);
    }), this.appliedMutations = [], (e = this.skipLink) == null || e.remove(), this.skipLink = void 0;
  }
}
function q(a, e = 400) {
  return typeof window != "undefined" && typeof window.requestIdleCallback == "function" ? window.requestIdleCallback(() => a(), { timeout: e }) : window.setTimeout(a, Math.min(e, 120));
}
function L(a) {
  if (typeof window != "undefined" && typeof window.cancelIdleCallback == "function") {
    window.cancelIdleCallback(a);
    return;
  }
  window.clearTimeout(a);
}
class _ {
  constructor(e) {
    d(this, "observer");
    d(this, "pendingHandle");
    d(this, "routeHandler", () => this.schedule());
    d(this, "originalPushState");
    d(this, "originalReplaceState");
    this.onChange = e;
  }
  start() {
    this.observer = new MutationObserver((e) => {
      e.some(
        (i) => i.type === "childList" || i.type === "attributes"
      ) && this.schedule();
    }), this.observer.observe(document.body, {
      subtree: !0,
      childList: !0,
      attributes: !0,
      attributeFilter: ["class", "style", "aria-label", "id"]
    }), window.addEventListener("hashchange", this.routeHandler), window.addEventListener("popstate", this.routeHandler), this.patchHistory();
  }
  schedule() {
    this.pendingHandle && L(this.pendingHandle), this.pendingHandle = q(() => {
      this.pendingHandle = void 0, this.onChange();
    }, 700);
  }
  patchHistory() {
    this.originalPushState = history.pushState, this.originalReplaceState = history.replaceState, history.pushState = (...e) => {
      var i;
      const t = (i = this.originalPushState) == null ? void 0 : i.apply(history, e);
      return this.schedule(), t;
    }, history.replaceState = (...e) => {
      var i;
      const t = (i = this.originalReplaceState) == null ? void 0 : i.apply(history, e);
      return this.schedule(), t;
    };
  }
  stop() {
    var e;
    (e = this.observer) == null || e.disconnect(), this.observer = void 0, this.pendingHandle && (L(this.pendingHandle), this.pendingHandle = void 0), window.removeEventListener("hashchange", this.routeHandler), window.removeEventListener("popstate", this.routeHandler), this.originalPushState && (history.pushState = this.originalPushState), this.originalReplaceState && (history.replaceState = this.originalReplaceState);
  }
}
class j {
  constructor() {
    d(this, "store", /* @__PURE__ */ new Map());
  }
  getItem(e) {
    var t;
    return (t = this.store.get(e)) != null ? t : null;
  }
  setItem(e, t) {
    this.store.set(e, t);
  }
  removeItem(e) {
    this.store.delete(e);
  }
}
function K() {
  try {
    const a = "__our_a11y_test__";
    return window.localStorage.setItem(a, "1"), window.localStorage.removeItem(a), window.localStorage;
  } catch {
    return new j();
  }
}
const M = 1, p = {
  version: M,
  textScale: 1,
  lineHeight: 1.6,
  letterSpacing: 0,
  wordSpacing: 0,
  readableFont: !1,
  underlineLinks: !1,
  highlightLinks: !1,
  highlightHeadings: !1,
  focusHighlight: !1,
  highContrast: !1,
  invertColors: !1,
  grayscale: !1,
  reduceMotion: !1,
  bigCursor: !1,
  readingGuide: !1
};
function f(a) {
  return !!a;
}
function A(a) {
  var t, i, n, r;
  const e = a != null ? a : {};
  return {
    version: M,
    textScale: S(Number((t = e.textScale) != null ? t : p.textScale), 1, 1.6),
    lineHeight: S(Number((i = e.lineHeight) != null ? i : p.lineHeight), 1.4, 2.4),
    letterSpacing: S(Number((n = e.letterSpacing) != null ? n : p.letterSpacing), 0, 0.2),
    wordSpacing: S(Number((r = e.wordSpacing) != null ? r : p.wordSpacing), 0, 0.3),
    readableFont: f(e.readableFont),
    underlineLinks: f(e.underlineLinks),
    highlightLinks: f(e.highlightLinks),
    highlightHeadings: f(e.highlightHeadings),
    focusHighlight: f(e.focusHighlight),
    highContrast: f(e.highContrast),
    invertColors: f(e.invertColors),
    grayscale: f(e.grayscale),
    reduceMotion: f(e.reduceMotion),
    bigCursor: f(e.bigCursor),
    readingGuide: f(e.readingGuide)
  };
}
class U {
  constructor(e) {
    d(this, "storage", K());
    d(this, "current");
    this.storageKey = e, this.current = this.load();
  }
  load() {
    try {
      const e = this.storage.getItem(this.storageKey);
      return e ? A(JSON.parse(e)) : { ...p };
    } catch {
      return { ...p };
    }
  }
  persist() {
    this.storage.setItem(this.storageKey, JSON.stringify(this.current));
  }
  getAll() {
    return { ...this.current };
  }
  get(e) {
    return this.current[e];
  }
  set(e, t) {
    const i = A({ ...this.current, [e]: t });
    return this.current = i, this.persist(), this.getAll();
  }
  reset() {
    return this.current = { ...p }, this.persist(), this.getAll();
  }
}
const P = "our-a11y-host-styles", V = `
html[data-oa-enabled="true"] {
  --oa-text-scale: 1;
  --oa-line-height: 1.6;
  --oa-letter-spacing: 0em;
  --oa-word-spacing: 0em;
  --oa-focus-color: #ff9f0a;
  --oa-document-filter: none;
}
html[data-oa-enabled="true"][data-oa-text-resize="true"] {
  font-size: calc(100% * var(--oa-text-scale));
}
html[data-oa-enabled="true"][data-oa-read-font="true"] body,
html[data-oa-enabled="true"][data-oa-read-font="true"] button,
html[data-oa-enabled="true"][data-oa-read-font="true"] input,
html[data-oa-enabled="true"][data-oa-read-font="true"] textarea,
html[data-oa-enabled="true"][data-oa-read-font="true"] select {
  font-family: Verdana, Tahoma, Arial, sans-serif !important;
}
html[data-oa-enabled="true"][data-oa-line-height="true"] body,
html[data-oa-enabled="true"][data-oa-line-height="true"] p,
html[data-oa-enabled="true"][data-oa-line-height="true"] li,
html[data-oa-enabled="true"][data-oa-line-height="true"] blockquote,
html[data-oa-enabled="true"][data-oa-line-height="true"] dd,
html[data-oa-enabled="true"][data-oa-line-height="true"] dt {
  line-height: var(--oa-line-height) !important;
}
html[data-oa-enabled="true"][data-oa-spacing="true"] p,
html[data-oa-enabled="true"][data-oa-spacing="true"] li,
html[data-oa-enabled="true"][data-oa-spacing="true"] a,
html[data-oa-enabled="true"][data-oa-spacing="true"] button,
html[data-oa-enabled="true"][data-oa-spacing="true"] label,
html[data-oa-enabled="true"][data-oa-spacing="true"] input,
html[data-oa-enabled="true"][data-oa-spacing="true"] textarea {
  letter-spacing: var(--oa-letter-spacing) !important;
  word-spacing: var(--oa-word-spacing) !important;
}
html[data-oa-enabled="true"][data-oa-underline-links="true"] a {
  text-decoration: underline !important;
  text-underline-offset: 0.18em;
}
html[data-oa-enabled="true"][data-oa-highlight-links="true"] a {
  background: #fff3bf !important;
  color: #111827 !important;
}
html[data-oa-enabled="true"][data-oa-highlight-headings="true"] h1,
html[data-oa-enabled="true"][data-oa-highlight-headings="true"] h2,
html[data-oa-enabled="true"][data-oa-highlight-headings="true"] h3,
html[data-oa-enabled="true"][data-oa-highlight-headings="true"] h4,
html[data-oa-enabled="true"][data-oa-highlight-headings="true"] h5,
html[data-oa-enabled="true"][data-oa-highlight-headings="true"] h6 {
  background: #e0f2fe !important;
  color: #0f172a !important;
}
html[data-oa-enabled="true"][data-oa-focus-highlight="true"] :focus-visible {
  outline: 3px solid var(--oa-focus-color) !important;
  outline-offset: 2px !important;
}
html[data-oa-enabled="true"] {
  filter: var(--oa-document-filter);
}
html[data-oa-enabled="true"][data-oa-big-cursor="true"],
html[data-oa-enabled="true"][data-oa-big-cursor="true"] * {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='42' height='42' viewBox='0 0 42 42'%3E%3Cpath fill='%23000' stroke='%23fff' stroke-width='2' d='M4 3l11 28 5-10 10 5L39 21 11 10 4 3z'/%3E%3C/svg%3E") 4 4, auto !important;
}
html[data-oa-enabled="true"][data-oa-reduce-motion="true"] *,
html[data-oa-enabled="true"][data-oa-reduce-motion="true"] *::before,
html[data-oa-enabled="true"][data-oa-reduce-motion="true"] *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
#our-a11y-reading-guide {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 42px;
  background: rgba(15, 23, 42, 0.12);
  pointer-events: none;
  z-index: 2147482999;
  display: none;
}
html[data-oa-reading-guide="true"] #our-a11y-reading-guide {
  display: block;
}
#our-a11y-skip-link {
  position: fixed;
  left: 12px;
  top: 12px;
  transform: translateY(-200%);
  background: #0f172a;
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 10px;
  z-index: 2147483001;
  text-decoration: none;
}
#our-a11y-skip-link:focus {
  transform: translateY(0);
}
`;
class Y {
  constructor() {
    d(this, "styleEl");
    d(this, "readingGuide");
    d(this, "root", document.documentElement);
    d(this, "body", document.body);
    d(this, "mouseMoveHandler");
  }
  init() {
    var e;
    this.styleEl = (e = document.getElementById(P)) != null ? e : document.createElement("style"), this.styleEl.id = P, this.styleEl.textContent = V, this.styleEl.parentNode || document.head.appendChild(this.styleEl), this.root.setAttribute("data-oa-enabled", "true"), this.ensureReadingGuide();
  }
  apply(e) {
    this.root.style.setProperty("--oa-text-scale", String(e.textScale)), this.root.style.setProperty("--oa-line-height", String(e.lineHeight)), this.root.style.setProperty("--oa-letter-spacing", `${e.letterSpacing}em`), this.root.style.setProperty("--oa-word-spacing", `${e.wordSpacing}em`), this.root.style.setProperty("--oa-document-filter", this.getFilterValue(e)), this.toggleAttr("data-oa-text-resize", e.textScale !== p.textScale), this.toggleAttr("data-oa-line-height", e.lineHeight !== p.lineHeight), this.toggleAttr(
      "data-oa-spacing",
      e.letterSpacing !== p.letterSpacing || e.wordSpacing !== p.wordSpacing
    ), this.toggleAttr("data-oa-read-font", e.readableFont), this.toggleAttr("data-oa-underline-links", e.underlineLinks), this.toggleAttr("data-oa-highlight-links", e.highlightLinks), this.toggleAttr("data-oa-highlight-headings", e.highlightHeadings), this.toggleAttr("data-oa-focus-highlight", e.focusHighlight), this.toggleAttr("data-oa-high-contrast", e.highContrast), this.toggleAttr("data-oa-invert", e.invertColors), this.toggleAttr("data-oa-grayscale", e.grayscale), this.toggleAttr("data-oa-reduce-motion", e.reduceMotion), this.toggleAttr("data-oa-big-cursor", e.bigCursor), this.toggleAttr("data-oa-reading-guide", e.readingGuide), e.readingGuide ? this.enableReadingGuide() : this.disableReadingGuide();
  }
  getFilterValue(e) {
    const t = [];
    return e.highContrast && t.push("contrast(1.15)"), e.invertColors && t.push("invert(1)", "hue-rotate(180deg)"), e.grayscale && t.push("grayscale(1)"), t.join(" ") || "none";
  }
  toggleAttr(e, t) {
    if (t) {
      this.root.setAttribute(e, "true");
      return;
    }
    this.root.removeAttribute(e);
  }
  ensureReadingGuide() {
    var e;
    this.readingGuide || (this.readingGuide = (e = document.getElementById("our-a11y-reading-guide")) != null ? e : document.createElement("div"), this.readingGuide.id = "our-a11y-reading-guide", this.body.appendChild(this.readingGuide));
  }
  enableReadingGuide() {
    this.ensureReadingGuide(), !this.mouseMoveHandler && (this.mouseMoveHandler = (e) => {
      this.readingGuide && (this.readingGuide.style.transform = `translateY(${Math.max(0, e.clientY - 20)}px)`);
    }, document.addEventListener("mousemove", this.mouseMoveHandler, { passive: !0 }));
  }
  disableReadingGuide() {
    this.mouseMoveHandler && (document.removeEventListener("mousemove", this.mouseMoveHandler), this.mouseMoveHandler = void 0);
  }
  destroy() {
    var e, t;
    this.disableReadingGuide(), this.root.removeAttribute("data-oa-enabled"), [
      "data-oa-text-resize",
      "data-oa-line-height",
      "data-oa-spacing",
      "data-oa-read-font",
      "data-oa-underline-links",
      "data-oa-highlight-links",
      "data-oa-highlight-headings",
      "data-oa-focus-highlight",
      "data-oa-high-contrast",
      "data-oa-invert",
      "data-oa-grayscale",
      "data-oa-reduce-motion",
      "data-oa-big-cursor",
      "data-oa-reading-guide"
    ].forEach((i) => this.root.removeAttribute(i)), this.root.style.removeProperty("--oa-text-scale"), this.root.style.removeProperty("--oa-line-height"), this.root.style.removeProperty("--oa-letter-spacing"), this.root.style.removeProperty("--oa-word-spacing"), this.root.style.removeProperty("--oa-document-filter"), (e = this.readingGuide) == null || e.remove(), this.readingGuide = void 0, (t = this.styleEl) == null || t.remove(), this.styleEl = void 0;
  }
}
const z = {
  none: {},
  lowVision: {
    textScale: 1.2,
    lineHeight: 1.9,
    underlineLinks: !0,
    focusHighlight: !0,
    highContrast: !0
  },
  dyslexiaFriendly: {
    textScale: 1.1,
    lineHeight: 1.9,
    letterSpacing: 0.06,
    wordSpacing: 0.08,
    readableFont: !0
  },
  keyboardFriendly: {
    focusHighlight: !0,
    underlineLinks: !0,
    highlightLinks: !0
  },
  seizureSafe: {
    reduceMotion: !0,
    highContrast: !1,
    invertColors: !1
  }
}, E = "0.1.0", W = {
  launcher: !0,
  diagnostics: !1,
  remediation: !0,
  skipLink: !0,
  readingGuide: !0,
  presets: !0
}, J = {
  title: "Accessibility tools",
  description: "Adjust readability, motion, focus visibility, and page assistance.",
  accentColor: "#0f5bd8"
}, Q = {
  autoInit: !0,
  storageKey: "our-a11y-preferences",
  position: "bottom-right",
  locale: "en",
  debug: !1,
  zIndex: 2147483e3,
  features: W,
  ui: J,
  analytics: {
    enabled: !1
  }
};
function X(a, e) {
  return a && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(a.trim()) ? a.trim() : e;
}
function R(a, e) {
  return a && a.replace(/[<>]/g, "").trim() || e;
}
function C(a, e) {
  var t, i, n, r, o;
  return e ? {
    ...a,
    ...e,
    features: {
      ...a.features,
      ...e.features
    },
    ui: {
      ...a.ui,
      ...e.ui,
      title: R((t = e.ui) == null ? void 0 : t.title, (i = e.ui) != null && i.title ? e.ui.title : a.ui.title),
      description: R(
        (n = e.ui) == null ? void 0 : n.description,
        (r = e.ui) != null && r.description ? e.ui.description : a.ui.description
      ),
      accentColor: X((o = e.ui) == null ? void 0 : o.accentColor, a.ui.accentColor)
    },
    analytics: {
      ...a.analytics,
      ...e.analytics
    }
  } : a;
}
async function Z(a) {
  var r, o, s, c, h, u, m, x;
  if (a.configProvider)
    return a.configProvider(a);
  if (!((r = a.remoteConfig) != null && r.url) || !k())
    return null;
  const e = `${a.storageKey}:remote-config:${(s = (o = a.token) != null ? o : a.siteId) != null ? s : "default"}`, t = (c = a.remoteConfig.cacheTtlMs) != null ? c : 3e5;
  try {
    const b = window.sessionStorage.getItem(e);
    if (b) {
      const w = JSON.parse(b);
      if (Date.now() < w.expiresAt)
        return w.value;
    }
  } catch {
  }
  const i = new AbortController(), n = window.setTimeout(() => i.abort(), (h = a.remoteConfig.timeoutMs) != null ? h : 3e3);
  try {
    const b = await fetch(a.remoteConfig.url, {
      signal: i.signal,
      credentials: (u = a.remoteConfig.credentials) != null ? u : "same-origin",
      headers: {
        "content-type": "application/json",
        "x-site-token": (m = a.token) != null ? m : "",
        "x-site-id": (x = a.siteId) != null ? x : ""
      }
    });
    if (!b.ok)
      return null;
    const w = await b.json();
    try {
      window.sessionStorage.setItem(
        e,
        JSON.stringify({ expiresAt: Date.now() + t, value: w })
      );
    } catch {
    }
    return w;
  } catch {
    return null;
  } finally {
    window.clearTimeout(n);
  }
}
function ee(a) {
  if (!k() || !a.allowedDomains || a.allowedDomains.length === 0)
    return !0;
  const e = window.location.hostname;
  return a.allowedDomains.some((t) => e === t || e.endsWith(`.${t}`));
}
async function te(a) {
  const e = k() ? window.OUR_A11Y_CONFIG : void 0;
  let t = C(Q, e);
  t = C(t, a);
  const i = await Z(t);
  return t = C(t, i), t;
}
const ie = `
:host {
  all: initial;
  color-scheme: light;
  --a11y-primary: #1f4fd6;
  --a11y-bg: #ffffff;
  --a11y-bg-soft: #f8fafc;
  --a11y-text: #0f172a;
  --a11y-text-muted: #64748b;
  --a11y-border: #dbe3ee;
  --a11y-focus: #f59e0b;
  --a11y-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
}

*, *::before, *::after {
  box-sizing: border-box;
}

.a11y-shell {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: var(--a11y-z-index, 2147483000);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--a11y-text);
}

.a11y-shell[data-position="bottom-left"] {
  left: 20px;
  right: auto;
  align-items: flex-start;
}

.a11y-fab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 48px;
  height: 48px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: var(--a11y-primary);
  color: #ffffff;
  box-shadow: 0 8px 22px rgba(31, 41, 55, 0.18);
  cursor: pointer;
  font: 600 14px/1 system-ui, sans-serif;
  transition: transform 160ms ease, background-color 160ms ease, box-shadow 160ms ease;
}

.a11y-fab:hover {
  transform: scale(1.02);
}

.a11y-fab:active {
  transform: scale(0.98);
}

.a11y-fab:focus-visible,
.a11y-panel button:focus-visible,
.a11y-panel input:focus-visible,
.a11y-panel select:focus-visible {
  outline: 3px solid var(--a11y-focus);
  outline-offset: 2px;
}

.a11y-fab-icon,
.a11y-close-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.a11y-panel {
  width: min(368px, calc(100vw - 32px));
  max-height: min(78vh, 640px);
  border: 1px solid var(--a11y-border);
  border-radius: 20px;
  background: var(--a11y-bg);
  box-shadow: var(--a11y-shadow);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
  visibility: hidden;
  transition: opacity 180ms ease, transform 180ms ease, visibility 180ms ease;
}

.a11y-panel[data-open="true"] {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
  visibility: visible;
}

.a11y-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px 14px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--a11y-border);
}

.a11y-header-copy {
  min-width: 0;
}

.a11y-title {
  margin: 0;
  font: 700 16px/1.2 system-ui, sans-serif;
}

.a11y-description {
  margin: 6px 0 0;
  color: var(--a11y-text-muted);
  font: 400 13px/1.45 system-ui, sans-serif;
}

.a11y-close {
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border: 1px solid var(--a11y-border);
  border-radius: 10px;
  background: var(--a11y-bg-soft);
  color: var(--a11y-text);
  cursor: pointer;
  transition: background-color 160ms ease, transform 160ms ease;
}

.a11y-close:hover {
  background: #eef2f7;
}

.a11y-close:active {
  transform: scale(0.97);
}

.a11y-body {
  min-height: 0;
  overflow: auto;
  padding: 12px 16px 18px;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.a11y-body::-webkit-scrollbar {
  display: none;
}

.a11y-group {
  padding: 12px 0 14px;
  border-bottom: 1px solid #eef2f7;
}

.a11y-group:last-child {
  border-bottom: 0;
  padding-bottom: 4px;
}

.a11y-group-title {
  margin: 0 0 12px;
  color: #475569;
  font: 700 11px/1.4 system-ui, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.a11y-row {
  display: grid;
  gap: 10px;
  margin: 12px 0;
}

.a11y-row-inline {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.a11y-copy {
  min-width: 0;
}

.a11y-label {
  font: 600 14px/1.35 system-ui, sans-serif;
}

.a11y-hint {
  margin-top: 4px;
  color: var(--a11y-text-muted);
  font: 400 12px/1.45 system-ui, sans-serif;
}

.a11y-range-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.a11y-range {
  width: 100%;
  height: 6px;
  appearance: none;
  background: linear-gradient(90deg, rgba(31, 79, 214, 0.18), rgba(31, 79, 214, 0.5));
  border-radius: 999px;
  outline: none;
}

.a11y-range::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--a11y-primary);
  border: 2px solid #ffffff;
  box-shadow: 0 1px 6px rgba(15, 23, 42, 0.18);
}

.a11y-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--a11y-primary);
  border: 2px solid #ffffff;
  box-shadow: 0 1px 6px rgba(15, 23, 42, 0.18);
}

.a11y-range-value {
  min-width: 48px;
  padding: 6px 8px;
  border-radius: 10px;
  background: var(--a11y-bg-soft);
  color: #334155;
  text-align: center;
  font: 600 12px/1 system-ui, sans-serif;
}

.a11y-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 28px;
}

.a11y-switch-input {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}

.a11y-switch-ui {
  position: relative;
  width: 46px;
  height: 28px;
  border-radius: 999px;
  background: #d5dbe5;
  transition: background-color 160ms ease;
}

.a11y-switch-ui::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.18);
  transition: transform 160ms ease;
}

.a11y-switch-input:checked + .a11y-switch-ui {
  background: var(--a11y-primary);
}

.a11y-switch-input:checked + .a11y-switch-ui::after {
  transform: translateX(18px);
}

.a11y-select,
.a11y-button {
  min-height: 42px;
  border: 1px solid var(--a11y-border);
  border-radius: 12px;
  background: var(--a11y-bg-soft);
  color: var(--a11y-text);
  font: 600 13px/1 system-ui, sans-serif;
}

.a11y-select {
  min-width: 142px;
  padding: 0 12px;
}

.a11y-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  cursor: pointer;
  transition: background-color 160ms ease, transform 160ms ease;
}

.a11y-button:hover {
  background: #eef2f7;
}

.a11y-button:active {
  transform: scale(0.98);
}

.a11y-button-primary {
  background: var(--a11y-primary);
  border-color: var(--a11y-primary);
  color: #ffffff;
}

.a11y-button-primary:hover {
  background: #1946c0;
}

.a11y-footer {
  position: sticky;
  bottom: 0;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 16px 16px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--a11y-border);
}

.a11y-live {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

.a11y-issues {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  display: grid;
  gap: 8px;
}

.a11y-issue {
  padding: 10px 12px;
  border: 1px solid #e5ebf3;
  border-radius: 14px;
  background: #fbfdff;
}

.a11y-issue strong {
  display: block;
  margin-bottom: 4px;
  font: 600 13px/1.4 system-ui, sans-serif;
}

.a11y-issue div {
  color: var(--a11y-text-muted);
  font: 400 12px/1.45 system-ui, sans-serif;
}

@media (prefers-reduced-motion: reduce) {
  .a11y-fab,
  .a11y-close,
  .a11y-button,
  .a11y-panel,
  .a11y-switch-ui,
  .a11y-switch-ui::after {
    transition: none;
  }

  .a11y-body {
    scroll-behavior: auto;
  }
}

@media (max-width: 1024px) {
  .a11y-panel {
    width: min(360px, calc(100vw - 28px));
  }
}

@media (max-width: 640px) {
  .a11y-shell,
  .a11y-shell[data-position="bottom-left"] {
    left: 0;
    right: 0;
    bottom: 0;
    align-items: stretch;
    gap: 10px;
    padding: 0 12px 12px;
  }

  .a11y-fab {
    align-self: flex-end;
    width: 44px;
    height: 44px;
    min-width: 44px;
    padding: 0;
    border-radius: 50%;
  }

  .a11y-fab-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  .a11y-panel {
    width: 100%;
    max-height: 90vh;
    border-radius: 20px 20px 0 0;
  }

  .a11y-footer {
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }
}
`, H = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
class ae {
  constructor(e, t) {
    d(this, "host");
    d(this, "shadow");
    d(this, "launcher");
    d(this, "panel");
    d(this, "liveRegion");
    d(this, "controls", {});
    d(this, "handlePanelKeydown", (e) => {
      var o, s;
      if (!this.panel || this.panel.getAttribute("data-open") !== "true")
        return;
      if (e.key === "Escape") {
        e.preventDefault(), this.callbacks.onClosePanel();
        return;
      }
      if (e.key !== "Tab")
        return;
      const t = this.getFocusableElements();
      if (t.length === 0)
        return;
      const i = t[0], n = t[t.length - 1];
      if (!i || !n)
        return;
      const r = (s = (o = this.shadow) == null ? void 0 : o.activeElement) != null ? s : document.activeElement;
      if (e.shiftKey && r === i) {
        e.preventDefault(), n.focus();
        return;
      }
      !e.shiftKey && r === n && (e.preventDefault(), i.focus());
    });
    d(this, "handleDocumentClick", (e) => {
      if (!this.panel || this.panel.getAttribute("data-open") !== "true")
        return;
      e.composedPath().includes(this.host) || this.callbacks.onClosePanel();
    });
    this.config = e, this.callbacks = t;
  }
  mount(e) {
    this.host = l("div"), this.host.id = "our-a11y-widget-host", this.host.style.position = "fixed", this.host.style.zIndex = String(this.config.zIndex), document.body.appendChild(this.host), this.shadow = this.host.attachShadow({ mode: "open" });
    const t = document.createElement("style");
    t.textContent = ie, this.shadow.appendChild(t);
    const i = l("div", { class: "a11y-shell", "data-position": this.config.position });
    i.style.setProperty("--a11y-primary", this.config.ui.accentColor), i.style.setProperty("--a11y-z-index", String(this.config.zIndex)), this.launcher = l("button", {
      class: "a11y-fab",
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": "false",
      "aria-controls": "a11y-panel",
      "aria-label": "Open accessibility panel"
    }), this.launcher.append(this.createLauncherIcon(), this.createLauncherLabel()), this.launcher.addEventListener("click", () => this.callbacks.onTogglePanel()), this.panel = l("div", {
      class: "a11y-panel",
      id: "a11y-panel",
      role: "dialog",
      "aria-label": "Accessibility",
      "aria-modal": "true",
      "data-open": "false"
    }), this.panel.addEventListener("keydown", this.handlePanelKeydown);
    const n = l("div", { class: "a11y-header" }), r = l("div", { class: "a11y-header-copy" }), o = l("h2", { class: "a11y-title" });
    o.textContent = "Accessibility";
    const s = l("p", { class: "a11y-description" });
    s.textContent = this.config.ui.description, r.append(o, s);
    const c = l("button", {
      class: "a11y-close",
      type: "button",
      "aria-label": "Close accessibility panel"
    });
    c.append(this.createCloseIcon()), c.addEventListener("click", () => this.callbacks.onClosePanel()), n.append(r, c);
    const h = l("div", { class: "a11y-body" });
    h.append(
      this.buildRangeGroup(e),
      this.buildToggleGroup(e),
      this.buildPresetGroup(),
      this.buildDiagnosticsGroup()
    );
    const u = l("div", { class: "a11y-footer" }), m = l("button", {
      class: "a11y-button",
      type: "button",
      "aria-label": "Reset accessibility preferences"
    });
    m.textContent = "Reset", m.addEventListener("click", () => this.callbacks.onReset()), u.append(m), this.liveRegion = l("div", { class: "a11y-live", "aria-live": "polite" }), this.panel.append(n, h, u, this.liveRegion), i.append(this.launcher, this.panel), this.shadow.appendChild(i), document.addEventListener("click", this.handleDocumentClick, !0), this.sync(e);
  }
  buildRangeGroup(e) {
    const t = l("section", { class: "a11y-group" });
    return t.append(this.groupTitle("Readability")), t.append(
      this.rangeRow("Text size", "textScale", e.textScale, 1, 1.6, 0.1),
      this.rangeRow("Line height", "lineHeight", e.lineHeight, 1.4, 2.4, 0.1),
      this.rangeRow("Letter spacing", "letterSpacing", e.letterSpacing, 0, 0.2, 0.02),
      this.rangeRow("Word spacing", "wordSpacing", e.wordSpacing, 0, 0.3, 0.02)
    ), t;
  }
  buildToggleGroup(e) {
    const t = l("section", { class: "a11y-group" });
    return t.append(this.groupTitle("Enhancements")), [
      ["Readable font", "readableFont", "Switch to a highly legible system font stack."],
      ["Underline links", "underlineLinks", "Increase link differentiation."],
      ["Highlight links", "highlightLinks", "Apply a clear link background."],
      ["Highlight headings", "highlightHeadings", "Make headings easier to scan."],
      ["Focus highlight", "focusHighlight", "Strengthen keyboard focus visibility."],
      ["High contrast", "highContrast", "Increase contrast with a mild document filter."],
      ["Invert colors", "invertColors", "Invert page colors for user preference."],
      ["Grayscale", "grayscale", "Reduce color intensity."],
      ["Reduce motion", "reduceMotion", "Minimize animations and transitions."],
      ["Bigger cursor", "bigCursor", "Use a more visible pointer."],
      ["Reading guide", "readingGuide", "Show a movable reading highlight."]
    ].forEach(([n, r, o]) => {
      t.append(this.toggleRow(n, r, e[r], o));
    }), t;
  }
  buildPresetGroup() {
    const e = l("section", { class: "a11y-group" });
    e.append(this.groupTitle("Presets"));
    const t = l("div", { class: "a11y-row a11y-row-inline" }), i = this.rowCopy("Quick profile", "Apply a curated set of preference values."), n = l("select", {
      class: "a11y-select",
      "aria-label": "Select accessibility preset"
    });
    return Object.keys(z).forEach((r) => {
      const o = document.createElement("option");
      o.value = r, o.textContent = r === "none" ? "None" : r, n.appendChild(o);
    }), n.addEventListener("change", () => this.callbacks.onApplyPreset(n.value)), this.controls.preset = n, t.append(i, n), e.append(t), e;
  }
  buildDiagnosticsGroup() {
    const e = l("section", { class: "a11y-group" });
    e.append(this.groupTitle("Diagnostics"));
    const t = l("div", { class: "a11y-row a11y-row-inline" });
    t.append(
      this.rowCopy("Scan page", "Run a lightweight scan for common detectable issues."),
      this.createActionButton("Scan", "Scan page for accessibility issues", () => this.callbacks.onScan(), !0)
    );
    const i = l("ul", { class: "a11y-issues" });
    return e.append(t, i), e;
  }
  groupTitle(e) {
    const t = l("h3", { class: "a11y-group-title" });
    return t.textContent = e, t;
  }
  rangeRow(e, t, i, n, r, o) {
    const s = l("div", { class: "a11y-row" });
    s.append(this.rowCopy(e, this.getRangeHint(t)));
    const c = l("div", { class: "a11y-range-wrap" }), h = l("input", {
      class: "a11y-range",
      type: "range",
      min: String(n),
      max: String(r),
      step: String(o),
      value: String(i),
      "aria-label": e
    }), u = l("span", { class: "a11y-range-value", "aria-hidden": "true" });
    return h.addEventListener("input", () => {
      u.textContent = this.formatRangeValue(t, Number(h.value)), this.callbacks.onSetPreference(t, Number(h.value));
    }), this.controls[t] = h, this.controls[`${t}Display`] = u, u.textContent = this.formatRangeValue(t, i), c.append(h, u), s.append(c), s;
  }
  toggleRow(e, t, i, n) {
    const r = l("div", { class: "a11y-row a11y-row-inline" });
    r.append(this.rowCopy(e, n));
    const o = l("label", { class: "a11y-switch" }), s = l("input", {
      class: "a11y-switch-input",
      type: "checkbox",
      "aria-label": e,
      role: "switch"
    });
    s.checked = i, s.addEventListener("change", () => this.callbacks.onSetPreference(t, s.checked));
    const c = l("span", { class: "a11y-switch-ui", "aria-hidden": "true" });
    return o.append(s, c), this.controls[t] = s, r.append(o), r;
  }
  setOpen(e) {
    var t;
    if (!(!this.panel || !this.launcher)) {
      if (this.panel.setAttribute("data-open", e ? "true" : "false"), this.launcher.setAttribute("aria-expanded", e ? "true" : "false"), e) {
        (t = this.panel.querySelector(H)) == null || t.focus();
        return;
      }
      this.launcher.focus();
    }
  }
  announce(e) {
    this.liveRegion && (this.liveRegion.textContent = e);
  }
  sync(e) {
    Object.entries(e).forEach(([t, i]) => {
      const n = this.controls[t];
      if (n)
        if (n instanceof HTMLInputElement && n.type === "checkbox")
          n.checked = !!i;
        else if (n instanceof HTMLInputElement && n.type === "range") {
          n.value = String(i);
          const r = this.controls[`${t}Display`];
          r instanceof HTMLSpanElement && (r.textContent = this.formatRangeValue(t, Number(i)));
        } else n instanceof HTMLSelectElement && (n.value = String(i));
    });
  }
  renderScanResults(e) {
    var i;
    const t = (i = this.shadow) == null ? void 0 : i.querySelector(".a11y-issues");
    if (t) {
      if (t.innerHTML = "", e.issues.length === 0) {
        const n = l("li", { class: "a11y-issue" });
        n.textContent = "No issues detected by the lightweight scanner.", t.appendChild(n);
        return;
      }
      e.issues.slice(0, 10).forEach((n) => {
        const r = l("li", { class: "a11y-issue" }), o = l("strong");
        o.textContent = n.message;
        const s = l("div");
        s.textContent = n.selector;
        const c = l("div");
        c.textContent = n.suggestion, r.append(o, s, c), t.appendChild(r);
      });
    }
  }
  rowCopy(e, t) {
    const i = l("div", { class: "a11y-copy" }), n = l("div", { class: "a11y-label" });
    n.textContent = e;
    const r = l("div", { class: "a11y-hint" });
    return r.textContent = t, i.append(n, r), i;
  }
  createActionButton(e, t, i, n = !1) {
    const r = l("button", {
      class: n ? "a11y-button a11y-button-primary" : "a11y-button",
      type: "button",
      "aria-label": t
    });
    return r.textContent = e, r.addEventListener("click", i), r;
  }
  createLauncherIcon() {
    const e = l("span", { class: "a11y-fab-icon", "aria-hidden": "true" });
    return e.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3a9 9 0 1 0 9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 7.2v4.8l3.6 2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/></svg>', e;
  }
  createLauncherLabel() {
    const e = l("span", { class: "a11y-fab-label" });
    return e.textContent = "Accessibility", e;
  }
  createCloseIcon() {
    const e = l("span", { class: "a11y-close-icon", "aria-hidden": "true" });
    return e.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>', e;
  }
  getRangeHint(e) {
    var i;
    return (i = {
      textScale: "Increase overall text size without changing page zoom.",
      lineHeight: "Add more vertical breathing room between lines.",
      letterSpacing: "Increase spacing between individual characters.",
      wordSpacing: "Increase spacing between words for easier scanning."
    }[e]) != null ? i : "";
  }
  formatRangeValue(e, t) {
    return e === "textScale" ? `${Math.round(t * 100)}%` : t.toFixed(2).replace(/\.00$/, "");
  }
  getFocusableElements() {
    var e, t;
    return Array.from((t = (e = this.panel) == null ? void 0 : e.querySelectorAll(H)) != null ? t : []).filter(
      (i) => !i.hasAttribute("disabled")
    );
  }
  destroy() {
    var e;
    document.removeEventListener("click", this.handleDocumentClick, !0), (e = this.host) == null || e.remove(), this.controls = {}, this.host = void 0, this.shadow = void 0, this.panel = void 0, this.launcher = void 0, this.liveRegion = void 0;
  }
}
class ne {
  constructor() {
    d(this, "listeners", /* @__PURE__ */ new Map());
  }
  on(e, t) {
    var i;
    this.listeners.has(e) || this.listeners.set(e, /* @__PURE__ */ new Set()), (i = this.listeners.get(e)) == null || i.add(t);
  }
  off(e, t) {
    var i;
    (i = this.listeners.get(e)) == null || i.delete(t);
  }
  emit(e, t) {
    var i;
    (i = this.listeners.get(e)) == null || i.forEach((n) => n(t));
  }
  clear() {
    this.listeners.clear();
  }
}
function I(a) {
  return {
    info: (...e) => {
      a && console.info("[OurA11y]", ...e);
    },
    warn: (...e) => {
      console.warn("[OurA11y]", ...e);
    }
  };
}
class re {
  constructor() {
    d(this, "initialized", !1);
    d(this, "config");
    d(this, "store");
    d(this, "widget");
    d(this, "features");
    d(this, "remediation");
    d(this, "observer");
    d(this, "scanner");
    d(this, "scanResults", { scannedAt: 0, issues: [] });
    d(this, "emitter", new ne());
    d(this, "logger", I(!1));
    d(this, "panelOpen", !1);
    d(this, "on", this.emitter.on.bind(this.emitter));
    d(this, "off", this.emitter.off.bind(this.emitter));
  }
  async init(e) {
    return this.initialized ? this : (this.config = await te(e), this.logger = I(this.config.debug), ee(this.config) ? (this.store = new U(this.config.storageKey), this.features = new Y(), this.features.init(), this.features.apply(this.store.getAll()), this.remediation = new $(), this.config.features.remediation && this.remediation.apply(this.config), this.scanner = new B(), this.config.features.launcher && (this.widget = new ae(this.config, {
      onTogglePanel: () => this.togglePanel(),
      onClosePanel: () => this.closePanel(),
      onSetPreference: (t, i) => this.setPreference(t, i),
      onApplyPreset: (t) => this.applyPreset(t),
      onReset: () => this.resetPreferences(),
      onScan: () => this.scanPage()
    }), this.widget.mount(this.store.getAll())), this.observer = new _(() => this.handleDomChange()), this.observer.start(), this.config.features.diagnostics && this.scanPage(), this.initialized = !0, this.emitAnalytics("ready", { version: E }), this.emitter.emit("ready", { config: this.config }), this) : (this.logger.warn("Domain not allowed for widget initialization."), this));
  }
  destroy() {
    var e, t, i, n;
    this.initialized && ((e = this.observer) == null || e.stop(), (t = this.widget) == null || t.destroy(), (i = this.remediation) == null || i.destroy(), (n = this.features) == null || n.destroy(), this.emitter.emit("destroyed", void 0), this.emitter.clear(), this.initialized = !1, this.panelOpen = !1);
  }
  openPanel() {
    var e;
    this.panelOpen = !0, (e = this.widget) == null || e.setOpen(!0), this.emitter.emit("panel", { open: !0 });
  }
  closePanel() {
    var e;
    this.panelOpen = !1, (e = this.widget) == null || e.setOpen(!1), this.emitter.emit("panel", { open: !1 });
  }
  togglePanel() {
    if (this.panelOpen) {
      this.closePanel();
      return;
    }
    this.openPanel();
  }
  setPreference(e, t) {
    var n, r, o;
    if (!this.store)
      return;
    const i = this.store.set(e, t);
    (n = this.features) == null || n.apply(i), (r = this.widget) == null || r.sync(i), (o = this.widget) == null || o.announce(`${this.humanizeKey(e)} updated.`), this.emitter.emit("preferenceChanged", { key: e, value: t }), this.emitAnalytics("preference_changed", { key: e, value: t });
  }
  getPreference(e) {
    var t;
    return (t = this.store) == null ? void 0 : t.get(e);
  }
  getPreferences() {
    var e, t;
    return (t = (e = this.store) == null ? void 0 : e.getAll()) != null ? t : { ...p };
  }
  resetPreferences() {
    var t, i, n, r, o;
    const e = (i = (t = this.store) == null ? void 0 : t.reset()) != null ? i : A();
    (n = this.features) == null || n.apply(e), (r = this.widget) == null || r.sync(e), (o = this.widget) == null || o.announce("Preferences reset."), this.emitAnalytics("preferences_reset", void 0);
  }
  scanPage() {
    var t, i, n;
    const e = (i = (t = this.scanner) == null ? void 0 : t.scan()) != null ? i : { scannedAt: Date.now(), issues: [] };
    return this.scanResults = e, (n = this.widget) == null || n.renderScanResults(e), this.emitter.emit("scanCompleted", e), this.emitAnalytics("scan_completed", { issues: e.issues.length }), e;
  }
  getScanResults() {
    return this.scanResults;
  }
  get version() {
    return E;
  }
  handleDomChange() {
    var e, t;
    !this.initialized || !this.config || (this.config.features.remediation && ((e = this.remediation) == null || e.apply(this.config)), (t = this.features) == null || t.apply(this.getPreferences()), this.config.features.diagnostics && this.scanPage());
  }
  applyPreset(e) {
    var n, r, o, s;
    if (!this.store)
      return;
    const t = (n = z[e]) != null ? n : {}, i = A({ ...this.store.getAll(), ...t });
    Object.keys(i).forEach((c) => {
      var h;
      (h = this.store) == null || h.set(c, i[c]);
    }), (r = this.features) == null || r.apply(i), (o = this.widget) == null || o.sync(i), (s = this.widget) == null || s.announce(`${e} preset applied.`);
  }
  humanizeKey(e) {
    return e.replace(/([A-Z])/g, " $1").toLowerCase();
  }
  emitAnalytics(e, t) {
    var i, n, r;
    (i = this.config) != null && i.analytics.enabled && ((r = (n = this.config.analytics).onEvent) == null || r.call(n, {
      type: e,
      timestamp: Date.now(),
      detail: t
    }));
  }
}
const g = new re();
async function G(a) {
  return g.init(a);
}
function oe() {
  g.destroy();
}
function se() {
  g.openPanel();
}
function le() {
  g.closePanel();
}
function de() {
  g.togglePanel();
}
function ce(a, e) {
  g.setPreference(a, e);
}
function he(a) {
  return g.getPreference(a);
}
function ue() {
  return g.getPreferences();
}
function ge() {
  g.resetPreferences();
}
function pe() {
  return g.scanPage();
}
function fe() {
  return g.getScanResults();
}
function me(a, e) {
  g.on(a, e);
}
function ye(a, e) {
  g.off(a, e);
}
const be = E, xe = {
  init: G,
  destroy: oe,
  openPanel: se,
  closePanel: le,
  togglePanel: de,
  setPreference: ce,
  getPreference: he,
  getPreferences: ue,
  resetPreferences: ge,
  scanPage: pe,
  getScanResults: fe,
  on: me,
  off: ye,
  version: be
};
k() && (window.OurA11y = xe, T(() => {
  var a;
  ((a = window.OUR_A11Y_CONFIG) == null ? void 0 : a.autoInit) !== !1 && G(window.OUR_A11Y_CONFIG);
}));
export {
  le as closePanel,
  xe as default,
  oe as destroy,
  he as getPreference,
  ue as getPreferences,
  fe as getScanResults,
  G as init,
  ye as off,
  me as on,
  se as openPanel,
  ge as resetPreferences,
  pe as scanPage,
  ce as setPreference,
  de as togglePanel,
  be as version
};
//# sourceMappingURL=our-a11y.es.js.map
