import type { PreferenceKey, Preferences } from '../types';
import { clamp } from '../utils/dom';
import { getStorage } from './storage';

export const PREFERENCE_VERSION = 1;

export const defaultPreferences: Preferences = {
  version: PREFERENCE_VERSION,
  textScale: 1,
  lineHeight: 1.6,
  letterSpacing: 0,
  wordSpacing: 0,
  readableFont: false,
  underlineLinks: false,
  highlightLinks: false,
  highlightHeadings: false,
  focusHighlight: false,
  highContrast: false,
  invertColors: false,
  grayscale: false,
  reduceMotion: false,
  bigCursor: false,
  readingGuide: false
};

function normalizeBoolean(value: unknown): boolean {
  return Boolean(value);
}

export function normalizePreferences(input?: Partial<Preferences> | null): Preferences {
  const source = input ?? {};
  return {
    version: PREFERENCE_VERSION,
    textScale: clamp(Number(source.textScale ?? defaultPreferences.textScale), 1, 1.6),
    lineHeight: clamp(Number(source.lineHeight ?? defaultPreferences.lineHeight), 1.4, 2.4),
    letterSpacing: clamp(Number(source.letterSpacing ?? defaultPreferences.letterSpacing), 0, 0.2),
    wordSpacing: clamp(Number(source.wordSpacing ?? defaultPreferences.wordSpacing), 0, 0.3),
    readableFont: normalizeBoolean(source.readableFont),
    underlineLinks: normalizeBoolean(source.underlineLinks),
    highlightLinks: normalizeBoolean(source.highlightLinks),
    highlightHeadings: normalizeBoolean(source.highlightHeadings),
    focusHighlight: normalizeBoolean(source.focusHighlight),
    highContrast: normalizeBoolean(source.highContrast),
    invertColors: normalizeBoolean(source.invertColors),
    grayscale: normalizeBoolean(source.grayscale),
    reduceMotion: normalizeBoolean(source.reduceMotion),
    bigCursor: normalizeBoolean(source.bigCursor),
    readingGuide: normalizeBoolean(source.readingGuide)
  };
}

export class PreferenceStore {
  private readonly storage = getStorage();
  private current: Preferences;

  constructor(private readonly storageKey: string) {
    this.current = this.load();
  }

  private load(): Preferences {
    try {
      const raw = this.storage.getItem(this.storageKey);
      if (!raw) {
        return { ...defaultPreferences };
      }
      return normalizePreferences(JSON.parse(raw) as Partial<Preferences>);
    } catch {
      return { ...defaultPreferences };
    }
  }

  private persist(): void {
    this.storage.setItem(this.storageKey, JSON.stringify(this.current));
  }

  getAll(): Preferences {
    return { ...this.current };
  }

  get<K extends PreferenceKey>(key: K): Preferences[K] {
    return this.current[key];
  }

  set<K extends PreferenceKey>(key: K, value: Preferences[K]): Preferences {
    const next = normalizePreferences({ ...this.current, [key]: value });
    this.current = next;
    this.persist();
    return this.getAll();
  }

  reset(): Preferences {
    this.current = { ...defaultPreferences };
    this.persist();
    return this.getAll();
  }
}
