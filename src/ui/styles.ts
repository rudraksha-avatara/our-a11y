export const widgetStyles = `
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

.a11y-widget {
  position: fixed;
  right: max(16px, env(safe-area-inset-right));
  bottom: max(16px, env(safe-area-inset-bottom));
  z-index: var(--a11y-z-index, 2147483000);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--a11y-text);
}

.a11y-widget[data-position="bottom-left"] {
  left: 20px;
  right: auto;
  align-items: flex-start;
}

.a11y-widget--open {
  gap: 10px;
}

.a11y-launcher {
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
  transform-origin: bottom right;
  transition:
    opacity 160ms ease,
    visibility 160ms ease,
    transform 160ms ease,
    background-color 160ms ease,
    box-shadow 160ms ease;
}

.a11y-launcher:hover {
  transform: scale(1.02);
}

.a11y-launcher:active {
  transform: scale(0.98);
}

.a11y-launcher:focus-visible,
.a11y-panel button:focus-visible,
.a11y-panel input:focus-visible,
.a11y-panel select:focus-visible {
  outline: 3px solid var(--a11y-focus);
  outline-offset: 2px;
}

.a11y-launcher--hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: scale(0.96);
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
  transform-origin: bottom right;
}

.a11y-panel--open {
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
  .a11y-launcher,
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

  .a11y-launcher {
    height: 46px;
    min-width: 46px;
    padding: 0 15px;
  }
}

@media (max-width: 640px) {
  .a11y-widget,
  .a11y-widget[data-position="bottom-left"] {
    left: 0;
    right: 0;
    bottom: 0;
    align-items: stretch;
    gap: 10px;
    padding: 0 12px 12px;
  }

  .a11y-launcher {
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

  .a11y-panel,
  .a11y-panel--mobile {
    width: 100%;
    max-height: 90vh;
    border-radius: 20px 20px 0 0;
    transform-origin: bottom center;
  }

  .a11y-footer {
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }
}
`;
