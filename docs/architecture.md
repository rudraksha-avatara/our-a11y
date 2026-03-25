# Architecture

## Overview

The runtime is split into focused modules to keep the embed surface small and maintainable:

- `core`: initialization, lifecycle coordination, config resolution, and public API wiring
- `state`: preference normalization, persistence, and future migration support
- `ui`: isolated widget rendering inside Shadow DOM
- `features`: host-page enhancement application using CSS variables and root attributes
- `audit`: lightweight diagnostics scanning for common detectable issues
- `dom`: conservative remediation and dynamic content observation
- `utils`: DOM helpers, events, idle scheduling, and logging

## Runtime lifecycle

1. Resolve config from defaults, optional global inline config, programmatic config, and remote config
2. Validate domain eligibility if an allowlist is configured
3. Create the preference store and load normalized values
4. Inject host-page enhancement styles and mount the isolated widget UI
5. Apply current preferences to the page
6. Run conservative remediation if enabled
7. Run diagnostics if enabled
8. Start observers for DOM mutations and SPA navigation changes

## Design principles

- Be honest about limits: report more than you mutate
- Preserve host-site compatibility and avoid brittle assumptions
- Prefer reversible changes and CSS-driven enhancements over invasive DOM rewrites
- Keep the core library small, dependency-light, and suitable for third-party delivery

## SaaS readiness

- Config provider pattern supports local-only, edge-fetched, or managed remote config
- `token`, `siteId`, analytics hooks, UI branding, and feature flags are already modeled
- The runtime can be wrapped later by a hosted loader, release channel system, or per-site config service
