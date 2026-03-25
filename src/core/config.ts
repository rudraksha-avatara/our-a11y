import type { A11yConfig, FeatureFlags, UiConfig } from '../types';
import { isBrowser } from '../utils/dom';

const defaultFeatures: FeatureFlags = {
  launcher: true,
  diagnostics: false,
  remediation: true,
  skipLink: true,
  readingGuide: true,
  presets: true
};

const defaultUi: UiConfig = {
  title: 'Accessibility tools',
  description: 'Adjust readability, motion, focus visibility, and page assistance.',
  accentColor: '#0f5bd8'
};

export const defaultConfig: A11yConfig = {
  autoInit: true,
  storageKey: 'our-a11y-preferences',
  position: 'bottom-right',
  locale: 'en',
  debug: false,
  zIndex: 2147483000,
  features: defaultFeatures,
  ui: defaultUi,
  analytics: {
    enabled: false
  }
};

declare global {
  interface Window {
    OUR_A11Y_CONFIG?: Partial<A11yConfig>;
  }
}

function sanitizeColor(input: string | undefined, fallback: string): string {
  if (!input) {
    return fallback;
  }
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(input.trim()) ? input.trim() : fallback;
}

function sanitizeText(input: string | undefined, fallback: string): string {
  if (!input) {
    return fallback;
  }
  return input.replace(/[<>]/g, '').trim() || fallback;
}

function mergeConfig(base: A11yConfig, extra?: Partial<A11yConfig> | null): A11yConfig {
  if (!extra) {
    return base;
  }
  return {
    ...base,
    ...extra,
    features: {
      ...base.features,
      ...extra.features
    },
    ui: {
      ...base.ui,
      ...extra.ui,
      title: sanitizeText(extra.ui?.title, extra.ui?.title ? extra.ui.title : base.ui.title),
      description: sanitizeText(
        extra.ui?.description,
        extra.ui?.description ? extra.ui.description : base.ui.description
      ),
      accentColor: sanitizeColor(extra.ui?.accentColor, base.ui.accentColor)
    },
    analytics: {
      ...base.analytics,
      ...extra.analytics
    }
  };
}

async function fetchRemoteConfig(config: A11yConfig): Promise<Partial<A11yConfig> | null> {
  if (config.configProvider) {
    return config.configProvider(config);
  }
  if (!config.remoteConfig?.url || !isBrowser()) {
    return null;
  }

  const cacheKey = `${config.storageKey}:remote-config:${config.token ?? config.siteId ?? 'default'}`;
  const ttl = config.remoteConfig.cacheTtlMs ?? 300000;
  try {
    const cached = window.sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as { expiresAt: number; value: Partial<A11yConfig> };
      if (Date.now() < parsed.expiresAt) {
        return parsed.value;
      }
    }
  } catch {
    // ignore cache failures
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), config.remoteConfig.timeoutMs ?? 3000);
  try {
    const response = await fetch(config.remoteConfig.url, {
      signal: controller.signal,
      credentials: config.remoteConfig.credentials ?? 'same-origin',
      headers: {
        'content-type': 'application/json',
        'x-site-token': config.token ?? '',
        'x-site-id': config.siteId ?? ''
      }
    });
    if (!response.ok) {
      return null;
    }
    const value = (await response.json()) as Partial<A11yConfig>;
    try {
      window.sessionStorage.setItem(
        cacheKey,
        JSON.stringify({ expiresAt: Date.now() + ttl, value })
      );
    } catch {
      // ignore cache failures
    }
    return value;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function isDomainAllowed(config: A11yConfig): boolean {
  if (!isBrowser() || !config.allowedDomains || config.allowedDomains.length === 0) {
    return true;
  }
  const hostname = window.location.hostname;
  return config.allowedDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

export async function resolveConfig(programmatic?: Partial<A11yConfig>): Promise<A11yConfig> {
  const inline = isBrowser() ? window.OUR_A11Y_CONFIG : undefined;
  let config = mergeConfig(defaultConfig, inline);
  config = mergeConfig(config, programmatic);
  const remote = await fetchRemoteConfig(config);
  config = mergeConfig(config, remote);
  return config;
}
