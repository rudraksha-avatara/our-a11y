# OurA11y

[![Build Status](https://img.shields.io/github/actions/workflow/status/rudraksha-avatara/our-a11y/ci.yml?branch=main&label=build)](https://github.com/rudraksha-avatara/our-a11y/actions)
[![npm version](https://img.shields.io/npm/v/%40rudraksha-avatara%2Four-a11y)](https://www.npmjs.com/package/@rudraksha-avatara/our-a11y)
[![License](https://img.shields.io/github/license/rudraksha-avatara/our-a11y)](https://github.com/rudraksha-avatara/our-a11y/blob/main/LICENSE)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/%40rudraksha-avatara%2Four-a11y)](https://bundlephobia.com/package/@rudraksha-avatara/our-a11y)
[![Downloads](https://img.shields.io/npm/dm/%40rudraksha-avatara%2Four-a11y)](https://www.npmjs.com/package/@rudraksha-avatara/our-a11y)
[![Accessibility support](https://img.shields.io/badge/accessibility-enhancement%20library-0f766e)](https://a11y.itisuniqueofficial.com)

OurA11y is a lightweight embeddable accessibility enhancement library that adds accessible user controls, usability improvements, and optional diagnostics to websites with a single script.

It is built for honest, production use on third-party websites. It helps users adapt interfaces and helps site owners surface common issues. It does not guarantee WCAG compliance, replace accessibility engineering, or act as a legal shortcut.

## Why it exists

Many sites need a low-friction way to offer user-facing accessibility controls and a conservative layer of client-side usability improvements without coupling to a framework or CMS. OurA11y provides that delivery model while staying clear about its limits.

## What it does

- Injects an accessible floating launcher and control panel
- Persists end-user preferences locally with safe fallback behavior
- Applies user-selected readability, motion, contrast, cursor, and focus enhancements
- Adds conservative client-side remediation where safe and reversible
- Optionally scans the page for common detectable accessibility issues
- Supports static sites, CMS pages, SPAs, dashboards, blogs, and e-commerce templates
- Exposes a clean programmatic API for host integrations and future SaaS delivery

## What it does not do

- It does not make arbitrary websites fully WCAG compliant automatically
- It does not replace semantic HTML, accessible design, QA, or assistive technology testing
- It does not aggressively rewrite host page semantics or business-critical flows
- It does not claim legal compliance or promise automated remediation for all defects

## Features

- Script-tag auto-init and programmatic initialization
- ESM and IIFE bundles for bundlers and direct embeds
- Shadow DOM isolation for widget UI
- Preference controls for text size, spacing, font readability, focus, contrast, motion, cursor, and reading guide
- Presets for common use cases such as low vision and keyboard-heavy navigation
- Conservative remediation for missing `lang`, image-only control naming, placeholder label fallback, and skip-link injection
- Optional lightweight diagnostics scanner for common detectable issues
- Mutation observer and route-change handling for dynamic pages
- Remote config hooks, per-site token support, and analytics callback hooks for SaaS evolution

## Installation

### npm

```bash
npm install @rudraksha-avatara/our-a11y
```

### Script tag

```html
<script src="https://a11y.itisuniqueofficial.com/a11y/v1/our-a11y.iife.js" defer></script>
```

## Quick start

### Basic script tag usage

```html
<script src="https://a11y.itisuniqueofficial.com/a11y/v1/our-a11y.iife.js" defer></script>
```

### Inline config usage

```html
<script>
  window.OUR_A11Y_CONFIG = {
    token: 'your-site-token',
    position: 'bottom-right',
    features: {
      diagnostics: true,
      readingGuide: true
    },
    ui: {
      title: 'Accessibility tools',
      accentColor: '#0f5bd8'
    }
  };
</script>
<script src="https://a11y.itisuniqueofficial.com/a11y/v1/our-a11y.iife.js" defer></script>
```

### Programmatic API usage

```ts
import OurA11y from '@rudraksha-avatara/our-a11y';

await OurA11y.init({
  autoInit: false,
  token: 'your-site-token',
  features: {
    diagnostics: true,
    remediation: true
  }
});

OurA11y.openPanel();
```

## Examples

- Basic embed: `examples/basic/index.html`
- Inline config: `examples/inline-config/index.html`
- SPA route changes: `examples/spa/index.html`
- Remote config simulation: `examples/remote-config/index.html`

## Configuration reference

```ts
type A11yConfig = {
  autoInit?: boolean;
  token?: string;
  siteId?: string;
  storageKey?: string;
  position?: 'bottom-right' | 'bottom-left';
  locale?: string;
  debug?: boolean;
  zIndex?: number;
  allowedDomains?: string[];
  remoteConfig?: {
    url?: string;
    timeoutMs?: number;
    cacheTtlMs?: number;
    credentials?: RequestCredentials;
  };
  features?: {
    launcher?: boolean;
    diagnostics?: boolean;
    remediation?: boolean;
    skipLink?: boolean;
    readingGuide?: boolean;
    presets?: boolean;
  };
  ui?: {
    title?: string;
    description?: string;
    accentColor?: string;
  };
  analytics?: {
    enabled?: boolean;
    onEvent?: (event) => void;
  };
  configProvider?: (config) => Promise<Partial<A11yConfig> | null>;
};
```

Detailed docs:

- Architecture: `docs/architecture.md`
- Configuration: `docs/configuration.md`
- API: `docs/api.md`
- Security model: `docs/security-model.md`
- Roadmap: `docs/roadmap.md`

## Public API

- `init(config?)`
- `destroy()`
- `openPanel()`
- `closePanel()`
- `togglePanel()`
- `setPreference(key, value)`
- `getPreference(key)`
- `getPreferences()`
- `resetPreferences()`
- `scanPage()`
- `getScanResults()`
- `on(event, handler)`
- `off(event, handler)`
- `version`

## Build and development

```bash
npm install
npm run typecheck
npm test
npm run build
```

For local development:

```bash
npm run dev
```

## Performance notes

- Starts after DOM readiness and avoids blocking first paint
- Uses CSS variables and root data attributes instead of repetitive host DOM mutation
- Uses a throttled `MutationObserver` plus route change hooks for dynamic pages
- Uses `requestIdleCallback` with fallback when reprocessing content
- Keeps diagnostics optional because scanning adds runtime cost
- Uses system fonts and avoids large icon or UI dependencies

## Accessibility statement

- The widget itself is keyboard navigable and screen-reader friendly
- It uses semantic controls instead of custom control reimplementations where possible
- Focus is visible and Escape closes the panel
- Preference changes are announced via a polite live region when useful
- The project is positioned as an enhancement layer, not a substitute for accessible product design and engineering

## Security notes

- No `eval`, dynamic code execution, or unsafe remote HTML injection
- Remote config is treated as untrusted input and sanitized before any UI rendering
- No secrets belong in the client bundle, repo history, examples, or GitHub Actions settings
- Domain allowlisting in the client is only a soft guard; enforce it again in backend config services
- Third-party embed scripts run with the trust boundaries of any other external script; review deployment controls carefully

## Browser support

- Current stable Chrome, Edge, Firefox, and Safari
- Modern evergreen browsers with native Shadow DOM support
- Best used on sites that already support ES2019-class browser features

## Documentation, demo, and distribution links

- Documentation: `https://a11y.itisuniqueofficial.com`
- Demo site: `https://a11y.itisuniqueofficial.com/demo.html`
- npm package: `https://www.npmjs.com/package/@rudraksha-avatara/our-a11y`
- CDN example: `https://a11y.itisuniqueofficial.com/a11y/v1/our-a11y.iife.js`
- Releases: `https://github.com/rudraksha-avatara/our-a11y/releases`
- Issues: `https://github.com/rudraksha-avatara/our-a11y/issues`

## Roadmap

- Signed remote config and staged rollout support
- Optional analytics transport adapters
- Owner-focused diagnostics export mode
- Additional presets and theming tokens
- Release automation and package provenance

## Contributing

Please read `CONTRIBUTING.md` before opening a pull request. For behavior expectations, see `CODE_OF_CONDUCT.md`. For vulnerability reporting, see `SECURITY.md`.

## License

Released under the MIT License. See `LICENSE`.
