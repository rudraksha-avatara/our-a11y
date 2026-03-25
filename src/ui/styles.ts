export const widgetStyles = `
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
