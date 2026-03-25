export type Position = 'bottom-right' | 'bottom-left';

export type Severity = 'low' | 'medium' | 'high';

export interface FeatureFlags {
  launcher: boolean;
  diagnostics: boolean;
  remediation: boolean;
  skipLink: boolean;
  readingGuide: boolean;
  presets: boolean;
}

export interface RemoteConfigOptions {
  url?: string;
  timeoutMs?: number;
  cacheTtlMs?: number;
  credentials?: RequestCredentials;
}

export interface UiConfig {
  title: string;
  description: string;
  accentColor: string;
}

export interface AnalyticsEvent {
  type: string;
  timestamp: number;
  detail?: Record<string, unknown>;
}

export interface A11yConfig {
  autoInit: boolean;
  token?: string;
  siteId?: string;
  storageKey: string;
  position: Position;
  locale: string;
  debug: boolean;
  zIndex: number;
  allowedDomains?: string[];
  features: FeatureFlags;
  ui: UiConfig;
  analytics: {
    enabled: boolean;
    onEvent?: (event: AnalyticsEvent) => void;
  };
  remoteConfig?: RemoteConfigOptions;
  configProvider?: (config: A11yConfig) => Promise<Partial<A11yConfig> | null>;
}

export interface Preferences {
  version: number;
  textScale: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  readableFont: boolean;
  underlineLinks: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  focusHighlight: boolean;
  highContrast: boolean;
  invertColors: boolean;
  grayscale: boolean;
  reduceMotion: boolean;
  bigCursor: boolean;
  readingGuide: boolean;
}

export type PreferenceKey = keyof Preferences;

export interface ScanIssue {
  id: string;
  type: string;
  severity: Severity;
  message: string;
  selector: string;
  suggestion: string;
  autoFixAvailable: boolean;
}

export interface ScanSummary {
  scannedAt: number;
  issues: ScanIssue[];
}

export type EventMap = {
  ready: { config: A11yConfig };
  destroyed: undefined;
  panel: { open: boolean };
  preferenceChanged: { key: PreferenceKey; value: Preferences[PreferenceKey] };
  scanCompleted: ScanSummary;
};
