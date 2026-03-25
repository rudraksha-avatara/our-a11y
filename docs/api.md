# API Reference

## `init(config?)`

Initializes the runtime. Safe to call once; repeated calls return the same engine instance.

## `destroy()`

Removes injected UI, observers, and reversible remediation changes.

## `openPanel()` / `closePanel()` / `togglePanel()`

Controls widget panel visibility.

## `setPreference(key, value)`

Updates a persisted preference and re-applies page enhancements.

## `getPreference(key)` / `getPreferences()`

Returns one preference or the full normalized preference set.

## `resetPreferences()`

Restores defaults and persists them.

## `scanPage()` / `getScanResults()`

Runs the optional lightweight diagnostics scan and returns issue data.

## `on(event, handler)` / `off(event, handler)`

Subscribes to runtime events such as:

- `ready`
- `destroyed`
- `panel`
- `preferenceChanged`
- `scanCompleted`

## `version`

Returns the runtime version string.
