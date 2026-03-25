import { OurA11yEngine } from './core/engine';
import type { A11yConfig, EventMap, PreferenceKey, Preferences, ScanSummary } from './types';
import { isBrowser, onReady } from './utils/dom';
import { VERSION } from './version';

const engine = new OurA11yEngine();

export async function init(config?: Partial<A11yConfig>): Promise<OurA11yEngine> {
  return engine.init(config);
}

export function destroy(): void {
  engine.destroy();
}

export function openPanel(): void {
  engine.openPanel();
}

export function closePanel(): void {
  engine.closePanel();
}

export function togglePanel(): void {
  engine.togglePanel();
}

export function setPreference<K extends PreferenceKey>(key: K, value: Preferences[K]): void {
  engine.setPreference(key, value);
}

export function getPreference<K extends PreferenceKey>(key: K): Preferences[K] | undefined {
  return engine.getPreference(key);
}

export function getPreferences(): Preferences {
  return engine.getPreferences();
}

export function resetPreferences(): void {
  engine.resetPreferences();
}

export function scanPage(): ScanSummary {
  return engine.scanPage();
}

export function getScanResults(): ScanSummary {
  return engine.getScanResults();
}

export function on<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void {
  engine.on(event, handler);
}

export function off<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void {
  engine.off(event, handler);
}

export const version = VERSION;

const api = {
  init,
  destroy,
  openPanel,
  closePanel,
  togglePanel,
  setPreference,
  getPreference,
  getPreferences,
  resetPreferences,
  scanPage,
  getScanResults,
  on,
  off,
  version
};

declare global {
  interface Window {
    OurA11y?: typeof api;
  }
}

if (isBrowser()) {
  window.OurA11y = api;
  onReady(() => {
    if (window.OUR_A11Y_CONFIG?.autoInit === false) {
      return;
    }
    void init(window.OUR_A11Y_CONFIG);
  });
}

export default api;
