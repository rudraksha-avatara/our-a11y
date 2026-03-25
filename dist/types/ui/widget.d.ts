import type { A11yConfig, PreferenceKey, Preferences, ScanSummary } from '../types';
type Callbacks = {
    onTogglePanel: () => void;
    onClosePanel: () => void;
    onSetPreference: <K extends PreferenceKey>(key: K, value: Preferences[K]) => void;
    onApplyPreset: (name: string) => void;
    onReset: () => void;
    onScan: () => void;
};
export declare class WidgetUI {
    private readonly config;
    private readonly callbacks;
    private host?;
    private shadow?;
    private launcher?;
    private panel?;
    private liveRegion?;
    private controls;
    private lastFocusedBeforeOpen?;
    constructor(config: A11yConfig, callbacks: Callbacks);
    mount(initialPreferences: Preferences): void;
    private buildRangeGroup;
    private buildToggleGroup;
    private buildPresetGroup;
    private buildDiagnosticsGroup;
    private groupTitle;
    private rangeRow;
    private toggleRow;
    setOpen(open: boolean): void;
    announce(message: string): void;
    sync(preferences: Preferences): void;
    renderScanResults(summary: ScanSummary): void;
    private handleDocumentClick;
    destroy(): void;
}
export {};
