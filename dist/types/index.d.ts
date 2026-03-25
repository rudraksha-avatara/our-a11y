import { OurA11yEngine } from './core/engine';
import type { A11yConfig, EventMap, PreferenceKey, Preferences, ScanSummary } from './types';
export declare function init(config?: Partial<A11yConfig>): Promise<OurA11yEngine>;
export declare function destroy(): void;
export declare function openPanel(): void;
export declare function closePanel(): void;
export declare function togglePanel(): void;
export declare function setPreference<K extends PreferenceKey>(key: K, value: Preferences[K]): void;
export declare function getPreference<K extends PreferenceKey>(key: K): Preferences[K] | undefined;
export declare function getPreferences(): Preferences;
export declare function resetPreferences(): void;
export declare function scanPage(): ScanSummary;
export declare function getScanResults(): ScanSummary;
export declare function on<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void;
export declare function off<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void;
export declare const version = "0.1.0";
declare const api: {
    init: typeof init;
    destroy: typeof destroy;
    openPanel: typeof openPanel;
    closePanel: typeof closePanel;
    togglePanel: typeof togglePanel;
    setPreference: typeof setPreference;
    getPreference: typeof getPreference;
    getPreferences: typeof getPreferences;
    resetPreferences: typeof resetPreferences;
    scanPage: typeof scanPage;
    getScanResults: typeof getScanResults;
    on: typeof on;
    off: typeof off;
    version: string;
};
declare global {
    interface Window {
        OurA11y?: typeof api;
    }
}
export default api;
