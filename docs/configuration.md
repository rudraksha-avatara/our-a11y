# Configuration Reference

OurA11y merges configuration in this order:

1. Internal defaults
2. `window.OUR_A11Y_CONFIG`
3. Programmatic `init()` config
4. Remote config returned by the configured provider or URL

## Core options

- `autoInit`: enable or disable automatic browser initialization
- `token`: optional site token for hosted configuration systems
- `siteId`: optional alternate site identifier
- `storageKey`: local preference storage key
- `position`: widget position, `bottom-right` or `bottom-left`
- `locale`: locale fallback used by safe remediation helpers
- `debug`: enable console logging for development
- `zIndex`: widget stacking context value
- `allowedDomains`: optional client-side allowlist

## Feature flags

- `launcher`
- `diagnostics`
- `remediation`
- `skipLink`
- `readingGuide`
- `presets`

## UI options

- `title`
- `description`
- `accentColor`

Only plain strings and validated color values should be supplied. Do not pass HTML.

## Remote config

Use `remoteConfig.url` for a simple JSON endpoint or `configProvider` for custom fetch logic.

Recommended backend practices:

- Validate tokens server-side
- Restrict site/domain access server-side
- Return only sanitized JSON config values
- Cache per-site configuration aggressively at the edge
