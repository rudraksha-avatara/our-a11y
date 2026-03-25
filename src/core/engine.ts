import { AuditScanner } from '../audit/scanner';
import { RemediationEngine } from '../dom/remediation';
import { DomObserver } from '../dom/observer';
import { FeatureEngine } from '../features/feature-engine';
import { presetMap } from '../features/presets';
import { PreferenceStore, defaultPreferences, normalizePreferences } from '../state/preferences';
import type { A11yConfig, EventMap, PreferenceKey, Preferences, ScanSummary } from '../types';
import { VERSION } from '../version';
import { resolveConfig, isDomainAllowed } from './config';
import { WidgetUI } from '../ui/widget';
import { TypedEventEmitter } from '../utils/events';
import { createLogger } from '../utils/logger';

export class OurA11yEngine {
  private initialized = false;
  private config?: A11yConfig;
  private store?: PreferenceStore;
  private widget?: WidgetUI;
  private features?: FeatureEngine;
  private remediation?: RemediationEngine;
  private observer?: DomObserver;
  private scanner?: AuditScanner;
  private scanResults: ScanSummary = { scannedAt: 0, issues: [] };
  private readonly emitter = new TypedEventEmitter<EventMap>();
  private logger = createLogger(false);
  private panelOpen = false;

  async init(programmatic?: Partial<A11yConfig>): Promise<OurA11yEngine> {
    if (this.initialized) {
      return this;
    }

    this.config = await resolveConfig(programmatic);
    this.logger = createLogger(this.config.debug);

    if (!isDomainAllowed(this.config)) {
      this.logger.warn('Domain not allowed for widget initialization.');
      return this;
    }

    this.store = new PreferenceStore(this.config.storageKey);
    this.features = new FeatureEngine();
    this.features.init();
    this.features.apply(this.store.getAll());

    this.remediation = new RemediationEngine();
    if (this.config.features.remediation) {
      this.remediation.apply(this.config);
    }

    this.scanner = new AuditScanner();
    if (this.config.features.launcher) {
      this.widget = new WidgetUI(this.config, {
        onTogglePanel: () => this.togglePanel(),
        onClosePanel: () => this.closePanel(),
        onSetPreference: (key, value) => this.setPreference(key, value),
        onApplyPreset: (name) => this.applyPreset(name),
        onReset: () => this.resetPreferences(),
        onScan: () => this.scanPage()
      });
      this.widget.mount(this.store.getAll());
    }

    this.observer = new DomObserver(() => this.handleDomChange());
    this.observer.start();

    if (this.config.features.diagnostics) {
      this.scanPage();
    }

    this.initialized = true;
    this.emitAnalytics('ready', { version: VERSION });
    this.emitter.emit('ready', { config: this.config });
    return this;
  }

  destroy(): void {
    if (!this.initialized) {
      return;
    }
    this.observer?.stop();
    this.widget?.destroy();
    this.remediation?.destroy();
    this.features?.destroy();
    this.emitter.emit('destroyed', undefined);
    this.emitter.clear();
    this.initialized = false;
    this.panelOpen = false;
  }

  openPanel(): void {
    this.panelOpen = true;
    this.widget?.setOpen(true);
    this.emitter.emit('panel', { open: true });
  }

  closePanel(): void {
    this.panelOpen = false;
    this.widget?.setOpen(false);
    this.emitter.emit('panel', { open: false });
  }

  togglePanel(): void {
    if (this.panelOpen) {
      this.closePanel();
      return;
    }
    this.openPanel();
  }

  setPreference<K extends PreferenceKey>(key: K, value: Preferences[K]): void {
    if (!this.store) {
      return;
    }
    const next = this.store.set(key, value);
    this.features?.apply(next);
    this.widget?.sync(next);
    this.widget?.announce(`${this.humanizeKey(key)} updated.`);
    this.emitter.emit('preferenceChanged', { key, value });
    this.emitAnalytics('preference_changed', { key, value });
  }

  getPreference<K extends PreferenceKey>(key: K): Preferences[K] | undefined {
    return this.store?.get(key);
  }

  getPreferences(): Preferences {
    return this.store?.getAll() ?? { ...defaultPreferences };
  }

  resetPreferences(): void {
    const next = this.store?.reset() ?? normalizePreferences();
    this.features?.apply(next);
    this.widget?.sync(next);
    this.widget?.announce('Preferences reset.');
    this.emitAnalytics('preferences_reset', undefined);
  }

  scanPage(): ScanSummary {
    const summary = this.scanner?.scan() ?? { scannedAt: Date.now(), issues: [] };
    this.scanResults = summary;
    this.widget?.renderScanResults(summary);
    this.emitter.emit('scanCompleted', summary);
    this.emitAnalytics('scan_completed', { issues: summary.issues.length });
    return summary;
  }

  getScanResults(): ScanSummary {
    return this.scanResults;
  }

  on = this.emitter.on.bind(this.emitter);

  off = this.emitter.off.bind(this.emitter);

  get version(): string {
    return VERSION;
  }

  private handleDomChange(): void {
    if (!this.initialized || !this.config) {
      return;
    }
    if (this.config.features.remediation) {
      this.remediation?.apply(this.config);
    }
    this.features?.apply(this.getPreferences());
    if (this.config.features.diagnostics) {
      this.scanPage();
    }
  }

  private applyPreset(name: string): void {
    if (!this.store) {
      return;
    }
    const preset = presetMap[name] ?? {};
    const next = normalizePreferences({ ...this.store.getAll(), ...preset });
    (Object.keys(next) as PreferenceKey[]).forEach((key) => {
      this.store?.set(key, next[key]);
    });
    this.features?.apply(next);
    this.widget?.sync(next);
    this.widget?.announce(`${name} preset applied.`);
  }

  private humanizeKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').toLowerCase();
  }

  private emitAnalytics(type: string, detail?: Record<string, unknown> | undefined): void {
    if (!this.config?.analytics.enabled) {
      return;
    }
    this.config.analytics.onEvent?.({
      type,
      timestamp: Date.now(),
      detail
    });
  }
}
