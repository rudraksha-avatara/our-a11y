var z = Object.defineProperty;
var O = (a, e, t) => e in a ? z(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var l = (a, e, t) => O(a, typeof e != "symbol" ? e + "" : e, t);
function S() {
  return typeof window != "undefined" && typeof document != "undefined";
}
function D(a) {
  if (S()) {
    if (document.readyState === "interactive" || document.readyState === "complete") {
      a();
      return;
    }
    document.addEventListener("DOMContentLoaded", a, { once: !0 });
  }
}
function A(a, e, t) {
  return Math.min(t, Math.max(e, a));
}
function d(a, e = {}) {
  const t = document.createElement(a);
  return Object.entries(e).forEach(([i, n]) => {
    t.setAttribute(i, n);
  }), t;
}
function x(a) {
  var n;
  if (!a)
    return "";
  const e = a.getAttribute("aria-label");
  if (e)
    return e.trim();
  const t = a.getAttribute("aria-labelledby");
  if (t) {
    const o = t.split(/\s+/).map((s) => {
      var r, c, h;
      return (h = (c = (r = document.getElementById(s)) == null ? void 0 : r.textContent) == null ? void 0 : c.trim()) != null ? h : "";
    }).join(" ").trim();
    if (o)
      return o;
  }
  const i = a.getAttribute("title");
  return i ? i.trim() : ((n = a.textContent) != null ? n : "").trim();
}
function F(a) {
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
function N(a) {
  return !(a.getAttribute("role") === "presentation" || a.getAttribute("aria-hidden") === "true" || !a.alt && a.width <= 24 && a.height <= 24);
}
function m(a, e, t, i, n, o = !1) {
  return {
    id: `${a}-${Math.random().toString(36).slice(2, 10)}`,
    type: a,
    severity: e,
    message: t,
    selector: F(i),
    suggestion: n,
    autoFixAvailable: o
  };
}
class T {
  scan(e = document) {
    const t = [], i = e instanceof Document ? e : document;
    i.documentElement.hasAttribute("lang") || t.push(
      m(
        "missing-lang",
        "medium",
        "Document language is not declared.",
        i.documentElement,
        "Add a valid lang attribute to the html element.",
        !0
      )
    ), i.querySelector('main, [role="main"]') || t.push(
      m(
        "missing-main",
        "medium",
        "No main landmark was found.",
        i.body,
        'Add a main element or a role="main" landmark.',
        !1
      )
    ), i.querySelectorAll("img").forEach((s) => {
      const r = s;
      !r.hasAttribute("alt") && N(r) && t.push(
        m(
          "missing-alt",
          "medium",
          "Image appears to be missing alternative text.",
          r,
          "Add meaningful alt text or mark decorative images appropriately.",
          !1
        )
      );
    }), i.querySelectorAll("input, select, textarea").forEach((s) => {
      const r = s, c = r.getAttribute("id"), h = !!(c && i.querySelector(`label[for="${CSS.escape(c)}"]`)), u = !!x(r);
      !h && !u && t.push(
        m(
          "missing-form-label",
          "high",
          "Form control does not have a clear accessible name.",
          r,
          "Associate a visible label or provide aria-label/aria-labelledby.",
          !!r.getAttribute("placeholder")
        )
      );
    }), i.querySelectorAll('button, [role="button"], a[href]').forEach((s) => {
      const r = s;
      !x(r) && !r.querySelector("img[alt], svg title") && t.push(
        m(
          r.tagName.toLowerCase() === "a" ? "empty-link" : "unnamed-button",
          "high",
          "Interactive element does not have a discernible accessible name.",
          r,
          "Add visible text, aria-label, aria-labelledby, or meaningful image alt text.",
          !1
        )
      );
    }), i.querySelectorAll("iframe").forEach((s) => {
      s.getAttribute("title") || t.push(
        m(
          "iframe-missing-title",
          "medium",
          "Iframe is missing a title.",
          s,
          "Add a concise title describing the embedded content.",
          !1
        )
      );
    }), i.querySelectorAll("video[autoplay], audio[autoplay]").forEach((s) => {
      t.push(
        m(
          "autoplay-media",
          "medium",
          "Autoplaying media may create accessibility barriers.",
          s,
          "Provide controls and avoid autoplay when possible.",
          !1
        )
      );
    });
    const n = Array.from(i.querySelectorAll("h1, h2, h3, h4, h5, h6"));
    let o = 0;
    return n.forEach((s) => {
      const r = Number(s.tagName[1]);
      o && r > o + 1 && t.push(
        m(
          "heading-order",
          "low",
          "Heading level appears to skip levels.",
          s,
          "Review heading hierarchy for a logical outline.",
          !1
        )
      ), o = r;
    }), i.querySelectorAll("a[href]").forEach((s) => {
      const r = x(s);
      !r && s.childElementCount > 0 || r && /^(click here|read more|more)$/i.test(r) && t.push(
        m(
          "weak-link-text",
          "low",
          "Link text may not be descriptive out of context.",
          s,
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
class B {
  constructor() {
    l(this, "appliedMutations", []);
    l(this, "skipLink");
  }
  apply(e, t = document) {
    const i = t instanceof Document ? t : document;
    i.documentElement.getAttribute("lang") || (this.recordAttr(i.documentElement, "lang"), i.documentElement.setAttribute("lang", e.locale || navigator.language.split("-")[0] || "en")), e.features.skipLink && this.ensureSkipLink(i), i.querySelectorAll('button, [role="button"], a[href]').forEach((n) => {
      var u, y, v, b;
      const o = n;
      if (x(o))
        return;
      const s = (y = (u = o.querySelector("img[alt]")) == null ? void 0 : u.getAttribute("alt")) == null ? void 0 : y.trim(), r = (v = o.getAttribute("title")) == null ? void 0 : v.trim(), c = (b = o.getAttribute("data-label")) == null ? void 0 : b.trim(), h = s || r || c;
      h && (this.recordAttr(o, "aria-label"), o.setAttribute("aria-label", h));
    }), i.querySelectorAll("input, textarea").forEach((n) => {
      var h;
      const o = n, s = o.getAttribute("id");
      if (!!(s && i.querySelector(`label[for="${CSS.escape(s)}"]`)) || x(o))
        return;
      const c = (h = o.getAttribute("placeholder")) == null ? void 0 : h.trim();
      c && (this.recordAttr(o, "aria-label"), o.setAttribute("aria-label", c));
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
function $(a, e = 400) {
  return typeof window != "undefined" && typeof window.requestIdleCallback == "function" ? window.requestIdleCallback(() => a(), { timeout: e }) : window.setTimeout(a, Math.min(e, 120));
}
function P(a) {
  if (typeof window != "undefined" && typeof window.cancelIdleCallback == "function") {
    window.cancelIdleCallback(a);
    return;
  }
  window.clearTimeout(a);
}
class q {
  constructor(e) {
    l(this, "observer");
    l(this, "pendingHandle");
    l(this, "routeHandler", () => this.schedule());
    l(this, "originalPushState");
    l(this, "originalReplaceState");
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
    this.pendingHandle && P(this.pendingHandle), this.pendingHandle = $(() => {
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
    (e = this.observer) == null || e.disconnect(), this.observer = void 0, this.pendingHandle && (P(this.pendingHandle), this.pendingHandle = void 0), window.removeEventListener("hashchange", this.routeHandler), window.removeEventListener("popstate", this.routeHandler), this.originalPushState && (history.pushState = this.originalPushState), this.originalReplaceState && (history.replaceState = this.originalReplaceState);
  }
}
class _ {
  constructor() {
    l(this, "store", /* @__PURE__ */ new Map());
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
function j() {
  try {
    const a = "__our_a11y_test__";
    return window.localStorage.setItem(a, "1"), window.localStorage.removeItem(a), window.localStorage;
  } catch {
    return new _();
  }
}
const I = 1, p = {
  version: I,
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
function k(a) {
  var t, i, n, o;
  const e = a != null ? a : {};
  return {
    version: I,
    textScale: A(Number((t = e.textScale) != null ? t : p.textScale), 1, 1.6),
    lineHeight: A(Number((i = e.lineHeight) != null ? i : p.lineHeight), 1.4, 2.4),
    letterSpacing: A(Number((n = e.letterSpacing) != null ? n : p.letterSpacing), 0, 0.2),
    wordSpacing: A(Number((o = e.wordSpacing) != null ? o : p.wordSpacing), 0, 0.3),
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
class Y {
  constructor(e) {
    l(this, "storage", j());
    l(this, "current");
    this.storageKey = e, this.current = this.load();
  }
  load() {
    try {
      const e = this.storage.getItem(this.storageKey);
      return e ? k(JSON.parse(e)) : { ...p };
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
    const i = k({ ...this.current, [e]: t });
    return this.current = i, this.persist(), this.getAll();
  }
  reset() {
    return this.current = { ...p }, this.persist(), this.getAll();
  }
}
const L = "our-a11y-host-styles", K = `
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
class U {
  constructor() {
    l(this, "styleEl");
    l(this, "readingGuide");
    l(this, "root", document.documentElement);
    l(this, "body", document.body);
    l(this, "mouseMoveHandler");
  }
  init() {
    var e;
    this.styleEl = (e = document.getElementById(L)) != null ? e : document.createElement("style"), this.styleEl.id = L, this.styleEl.textContent = K, this.styleEl.parentNode || document.head.appendChild(this.styleEl), this.root.setAttribute("data-oa-enabled", "true"), this.ensureReadingGuide();
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
const M = {
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
}, E = "0.1.0", V = {
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
}, W = {
  autoInit: !0,
  storageKey: "our-a11y-preferences",
  position: "bottom-right",
  locale: "en",
  debug: !1,
  zIndex: 2147483e3,
  features: V,
  ui: J,
  analytics: {
    enabled: !1
  }
};
function Q(a, e) {
  return a && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(a.trim()) ? a.trim() : e;
}
function R(a, e) {
  return a && a.replace(/[<>]/g, "").trim() || e;
}
function C(a, e) {
  var t, i, n, o, s;
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
        (o = e.ui) != null && o.description ? e.ui.description : a.ui.description
      ),
      accentColor: Q((s = e.ui) == null ? void 0 : s.accentColor, a.ui.accentColor)
    },
    analytics: {
      ...a.analytics,
      ...e.analytics
    }
  } : a;
}
async function Z(a) {
  var o, s, r, c, h, u, y, v;
  if (a.configProvider)
    return a.configProvider(a);
  if (!((o = a.remoteConfig) != null && o.url) || !S())
    return null;
  const e = `${a.storageKey}:remote-config:${(r = (s = a.token) != null ? s : a.siteId) != null ? r : "default"}`, t = (c = a.remoteConfig.cacheTtlMs) != null ? c : 3e5;
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
        "x-site-token": (y = a.token) != null ? y : "",
        "x-site-id": (v = a.siteId) != null ? v : ""
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
function X(a) {
  if (!S() || !a.allowedDomains || a.allowedDomains.length === 0)
    return !0;
  const e = window.location.hostname;
  return a.allowedDomains.some((t) => e === t || e.endsWith(`.${t}`));
}
async function ee(a) {
  const e = S() ? window.OUR_A11Y_CONFIG : void 0;
  let t = C(W, e);
  t = C(t, a);
  const i = await Z(t);
  return t = C(t, i), t;
}
const te = `
:host {
  all: initial;
  color-scheme: light;
}
*, *::before, *::after {
  box-sizing: border-box;
}
.oa-shell {
  position: fixed;
  inset: auto 24px 24px auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #0f172a;
  z-index: var(--oa-z-index, 2147483000);
}
.oa-shell[data-position="bottom-left"] {
  left: 24px;
  right: auto;
}
.oa-launcher {
  border: 0;
  border-radius: 999px;
  background: var(--oa-accent, #0f5bd8);
  color: #ffffff;
  min-width: 56px;
  min-height: 56px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  font: 600 14px/1 system-ui, sans-serif;
}
.oa-launcher:focus-visible,
.oa-panel button:focus-visible,
.oa-panel input:focus-visible,
.oa-panel select:focus-visible {
  outline: 3px solid #ff9f0a;
  outline-offset: 2px;
}
.oa-panel {
  width: min(360px, calc(100vw - 24px));
  margin-top: 12px;
  border: 1px solid #d7dee8;
  border-radius: 18px;
  background: #ffffff;
  display: none;
  overflow: hidden;
}
.oa-panel[data-open="true"] {
  display: block;
}
.oa-header {
  padding: 16px 18px 12px;
  border-bottom: 1px solid #e2e8f0;
}
.oa-title {
  margin: 0;
  font: 700 16px/1.3 system-ui, sans-serif;
}
.oa-description {
  margin: 6px 0 0;
  color: #475569;
  font: 400 13px/1.5 system-ui, sans-serif;
}
.oa-body {
  padding: 10px 14px 14px;
  max-height: min(70vh, 540px);
  overflow: auto;
}
.oa-group {
  padding: 10px 4px;
  border-bottom: 1px solid #edf2f7;
}
.oa-group:last-child {
  border-bottom: 0;
}
.oa-group-title {
  margin: 0 0 10px;
  color: #334155;
  font: 700 12px/1.4 system-ui, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.oa-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  margin: 8px 0;
}
.oa-label {
  font: 500 14px/1.4 system-ui, sans-serif;
}
.oa-hint {
  color: #64748b;
  font: 400 12px/1.4 system-ui, sans-serif;
}
.oa-toggle {
  inline-size: 18px;
  block-size: 18px;
}
.oa-range {
  width: 132px;
}
.oa-actions {
  display: flex;
  gap: 8px;
  padding-top: 10px;
}
.oa-button {
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #0f172a;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font: 600 13px/1 system-ui, sans-serif;
}
.oa-live {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.oa-issues {
  list-style: none;
  padding: 0;
  margin: 0;
}
.oa-issue {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px;
  margin: 8px 0;
}
.oa-issue strong {
  display: block;
  margin-bottom: 4px;
}
@media (prefers-reduced-motion: no-preference) {
  .oa-panel {
    transform-origin: bottom right;
    animation: oa-fade-in 160ms ease-out;
  }
}
@keyframes oa-fade-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@media (max-width: 640px) {
  .oa-shell,
  .oa-shell[data-position="bottom-left"] {
    left: 12px;
    right: 12px;
    bottom: 12px;
  }
  .oa-panel {
    width: 100%;
  }
  .oa-launcher {
    width: 100%;
  }
}
`;
class ie {
  constructor(e, t) {
    l(this, "host");
    l(this, "shadow");
    l(this, "launcher");
    l(this, "panel");
    l(this, "liveRegion");
    l(this, "controls", {});
    l(this, "lastFocusedBeforeOpen");
    l(this, "handleDocumentClick", (e) => {
      if (!this.panel || this.panel.getAttribute("data-open") !== "true")
        return;
      e.composedPath().includes(this.host) || this.callbacks.onClosePanel();
    });
    this.config = e, this.callbacks = t;
  }
  mount(e) {
    this.host = d("div"), this.host.id = "our-a11y-widget-host", this.host.style.position = "fixed", this.host.style.zIndex = String(this.config.zIndex), document.body.appendChild(this.host), this.shadow = this.host.attachShadow({ mode: "open" });
    const t = document.createElement("style");
    t.textContent = te, this.shadow.appendChild(t);
    const i = d("div", { class: "oa-shell", "data-position": this.config.position });
    i.style.setProperty("--oa-accent", this.config.ui.accentColor), i.style.setProperty("--oa-z-index", String(this.config.zIndex)), this.launcher = d("button", {
      class: "oa-launcher",
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": "false",
      "aria-controls": "oa-panel"
    }), this.launcher.innerHTML = '<span aria-hidden="true">A11y</span><span>Accessibility</span>', this.launcher.addEventListener("click", () => this.callbacks.onTogglePanel()), this.panel = d("div", {
      class: "oa-panel",
      id: "oa-panel",
      role: "dialog",
      "aria-label": this.config.ui.title,
      "aria-modal": "false",
      "data-open": "false"
    }), this.panel.addEventListener("keydown", (c) => {
      c.key === "Escape" && (c.preventDefault(), this.callbacks.onClosePanel());
    });
    const n = d("div", { class: "oa-header" }), o = d("h2", { class: "oa-title" });
    o.textContent = this.config.ui.title;
    const s = d("p", { class: "oa-description" });
    s.textContent = this.config.ui.description, n.append(o, s);
    const r = d("div", { class: "oa-body" });
    r.append(
      this.buildRangeGroup(e),
      this.buildToggleGroup(e),
      this.buildPresetGroup(),
      this.buildDiagnosticsGroup()
    ), this.liveRegion = d("div", { class: "oa-live", "aria-live": "polite" }), this.liveRegion.textContent = "", this.panel.append(n, r, this.liveRegion), i.append(this.launcher, this.panel), this.shadow.appendChild(i), document.addEventListener("click", this.handleDocumentClick, !0), this.sync(e);
  }
  buildRangeGroup(e) {
    const t = d("section", { class: "oa-group" });
    return t.append(this.groupTitle("Readability")), t.append(
      this.rangeRow("Text size", "textScale", e.textScale, 1, 1.6, 0.1),
      this.rangeRow("Line height", "lineHeight", e.lineHeight, 1.4, 2.4, 0.1),
      this.rangeRow("Letter spacing", "letterSpacing", e.letterSpacing, 0, 0.2, 0.02),
      this.rangeRow("Word spacing", "wordSpacing", e.wordSpacing, 0, 0.3, 0.02)
    ), t;
  }
  buildToggleGroup(e) {
    const t = d("section", { class: "oa-group" });
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
    ].forEach(([n, o, s]) => {
      t.append(this.toggleRow(n, o, e[o], s));
    }), t;
  }
  buildPresetGroup() {
    const e = d("section", { class: "oa-group" });
    e.append(this.groupTitle("Presets"));
    const t = d("div", { class: "oa-row" }), i = d("div"), n = d("div", { class: "oa-label" });
    n.textContent = "Quick profile";
    const o = d("div", { class: "oa-hint" });
    o.textContent = "Applies a curated set of preference values.", i.append(n, o);
    const s = d("select");
    Object.keys(M).forEach((h) => {
      const u = document.createElement("option");
      u.value = h, u.textContent = h === "none" ? "None" : h, s.appendChild(u);
    }), s.addEventListener("change", () => this.callbacks.onApplyPreset(s.value)), this.controls.preset = s, t.append(i, s);
    const r = d("div", { class: "oa-actions" }), c = d("button", { class: "oa-button", type: "button" });
    return c.textContent = "Reset", c.addEventListener("click", () => this.callbacks.onReset()), r.append(c), e.append(t, r), e;
  }
  buildDiagnosticsGroup() {
    const e = d("section", { class: "oa-group" });
    e.append(this.groupTitle("Diagnostics"));
    const t = d("div", { class: "oa-actions" }), i = d("button", { class: "oa-button", type: "button" });
    i.textContent = "Scan page", i.addEventListener("click", () => this.callbacks.onScan()), t.append(i);
    const n = d("ul", { class: "oa-issues" });
    return e.append(t, n), e;
  }
  groupTitle(e) {
    const t = d("h3", { class: "oa-group-title" });
    return t.textContent = e, t;
  }
  rangeRow(e, t, i, n, o, s) {
    const r = d("div", { class: "oa-row" }), c = d("label"), h = d("div", { class: "oa-label" });
    h.textContent = e, c.appendChild(h);
    const u = d("input", {
      class: "oa-range",
      type: "range",
      min: String(n),
      max: String(o),
      step: String(s),
      value: String(i),
      "aria-label": e
    });
    return u.addEventListener("input", () => this.callbacks.onSetPreference(t, Number(u.value))), this.controls[t] = u, r.append(c, u), r;
  }
  toggleRow(e, t, i, n) {
    const o = d("div", { class: "oa-row" }), s = d("label"), r = d("div", { class: "oa-label" });
    r.textContent = e;
    const c = d("div", { class: "oa-hint" });
    c.textContent = n, s.append(r, c);
    const h = d("input", {
      class: "oa-toggle",
      type: "checkbox",
      "aria-label": e
    });
    return h.checked = i, h.addEventListener("change", () => this.callbacks.onSetPreference(t, h.checked)), this.controls[t] = h, o.append(s, h), o;
  }
  setOpen(e) {
    var t;
    !this.panel || !this.launcher || (e ? (this.lastFocusedBeforeOpen = document.activeElement, this.panel.setAttribute("data-open", "true"), this.launcher.setAttribute("aria-expanded", "true"), (t = this.panel.querySelector("input, button, select")) == null || t.focus()) : (this.panel.setAttribute("data-open", "false"), this.launcher.setAttribute("aria-expanded", "false"), this.launcher.focus(), this.lastFocusedBeforeOpen = null));
  }
  announce(e) {
    this.liveRegion && (this.liveRegion.textContent = e);
  }
  sync(e) {
    Object.entries(e).forEach(([t, i]) => {
      const n = this.controls[t];
      n && (n instanceof HTMLInputElement && n.type === "checkbox" ? n.checked = !!i : n.value = String(i));
    });
  }
  renderScanResults(e) {
    var i;
    const t = (i = this.shadow) == null ? void 0 : i.querySelector(".oa-issues");
    if (t) {
      if (t.innerHTML = "", e.issues.length === 0) {
        const n = d("li", { class: "oa-issue" });
        n.textContent = "No issues detected by the lightweight scanner.", t.appendChild(n);
        return;
      }
      e.issues.slice(0, 10).forEach((n) => {
        const o = d("li", { class: "oa-issue" }), s = d("strong");
        s.textContent = n.message;
        const r = d("div");
        r.textContent = n.selector;
        const c = d("div");
        c.textContent = n.suggestion, o.append(s, r, c), t.appendChild(o);
      });
    }
  }
  destroy() {
    var e;
    document.removeEventListener("click", this.handleDocumentClick, !0), (e = this.host) == null || e.remove(), this.controls = {}, this.host = void 0, this.shadow = void 0, this.panel = void 0, this.launcher = void 0, this.liveRegion = void 0;
  }
}
class ae {
  constructor() {
    l(this, "listeners", /* @__PURE__ */ new Map());
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
function H(a) {
  return {
    info: (...e) => {
      a && console.info("[OurA11y]", ...e);
    },
    warn: (...e) => {
      console.warn("[OurA11y]", ...e);
    }
  };
}
class ne {
  constructor() {
    l(this, "initialized", !1);
    l(this, "config");
    l(this, "store");
    l(this, "widget");
    l(this, "features");
    l(this, "remediation");
    l(this, "observer");
    l(this, "scanner");
    l(this, "scanResults", { scannedAt: 0, issues: [] });
    l(this, "emitter", new ae());
    l(this, "logger", H(!1));
    l(this, "panelOpen", !1);
    l(this, "on", this.emitter.on.bind(this.emitter));
    l(this, "off", this.emitter.off.bind(this.emitter));
  }
  async init(e) {
    return this.initialized ? this : (this.config = await ee(e), this.logger = H(this.config.debug), X(this.config) ? (this.store = new Y(this.config.storageKey), this.features = new U(), this.features.init(), this.features.apply(this.store.getAll()), this.remediation = new B(), this.config.features.remediation && this.remediation.apply(this.config), this.scanner = new T(), this.config.features.launcher && (this.widget = new ie(this.config, {
      onTogglePanel: () => this.togglePanel(),
      onClosePanel: () => this.closePanel(),
      onSetPreference: (t, i) => this.setPreference(t, i),
      onApplyPreset: (t) => this.applyPreset(t),
      onReset: () => this.resetPreferences(),
      onScan: () => this.scanPage()
    }), this.widget.mount(this.store.getAll())), this.observer = new q(() => this.handleDomChange()), this.observer.start(), this.config.features.diagnostics && this.scanPage(), this.initialized = !0, this.emitAnalytics("ready", { version: E }), this.emitter.emit("ready", { config: this.config }), this) : (this.logger.warn("Domain not allowed for widget initialization."), this));
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
    var n, o, s;
    if (!this.store)
      return;
    const i = this.store.set(e, t);
    (n = this.features) == null || n.apply(i), (o = this.widget) == null || o.sync(i), (s = this.widget) == null || s.announce(`${this.humanizeKey(e)} updated.`), this.emitter.emit("preferenceChanged", { key: e, value: t }), this.emitAnalytics("preference_changed", { key: e, value: t });
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
    var t, i, n, o, s;
    const e = (i = (t = this.store) == null ? void 0 : t.reset()) != null ? i : k();
    (n = this.features) == null || n.apply(e), (o = this.widget) == null || o.sync(e), (s = this.widget) == null || s.announce("Preferences reset."), this.emitAnalytics("preferences_reset", void 0);
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
    var n, o, s, r;
    if (!this.store)
      return;
    const t = (n = M[e]) != null ? n : {}, i = k({ ...this.store.getAll(), ...t });
    Object.keys(i).forEach((c) => {
      var h;
      (h = this.store) == null || h.set(c, i[c]);
    }), (o = this.features) == null || o.apply(i), (s = this.widget) == null || s.sync(i), (r = this.widget) == null || r.announce(`${e} preset applied.`);
  }
  humanizeKey(e) {
    return e.replace(/([A-Z])/g, " $1").toLowerCase();
  }
  emitAnalytics(e, t) {
    var i, n, o;
    (i = this.config) != null && i.analytics.enabled && ((o = (n = this.config.analytics).onEvent) == null || o.call(n, {
      type: e,
      timestamp: Date.now(),
      detail: t
    }));
  }
}
const g = new ne();
async function G(a) {
  return g.init(a);
}
function oe() {
  g.destroy();
}
function se() {
  g.openPanel();
}
function re() {
  g.closePanel();
}
function le() {
  g.togglePanel();
}
function de(a, e) {
  g.setPreference(a, e);
}
function ce(a) {
  return g.getPreference(a);
}
function he() {
  return g.getPreferences();
}
function ue() {
  g.resetPreferences();
}
function ge() {
  return g.scanPage();
}
function pe() {
  return g.getScanResults();
}
function fe(a, e) {
  g.on(a, e);
}
function me(a, e) {
  g.off(a, e);
}
const be = E, ye = {
  init: G,
  destroy: oe,
  openPanel: se,
  closePanel: re,
  togglePanel: le,
  setPreference: de,
  getPreference: ce,
  getPreferences: he,
  resetPreferences: ue,
  scanPage: ge,
  getScanResults: pe,
  on: fe,
  off: me,
  version: be
};
S() && (window.OurA11y = ye, D(() => {
  var a;
  ((a = window.OUR_A11Y_CONFIG) == null ? void 0 : a.autoInit) !== !1 && G(window.OUR_A11Y_CONFIG);
}));
export {
  re as closePanel,
  ye as default,
  oe as destroy,
  ce as getPreference,
  he as getPreferences,
  pe as getScanResults,
  G as init,
  me as off,
  fe as on,
  se as openPanel,
  ue as resetPreferences,
  ge as scanPage,
  de as setPreference,
  le as togglePanel,
  be as version
};
//# sourceMappingURL=our-a11y.es.js.map
