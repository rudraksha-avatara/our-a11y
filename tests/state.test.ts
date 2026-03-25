import { describe, expect, it } from 'vitest';
import { PreferenceStore, normalizePreferences } from '../src/state/preferences';

describe('preferences', () => {
  it('normalizes values into safe bounds', () => {
    const normalized = normalizePreferences({ textScale: 9, lineHeight: 0.2, letterSpacing: 2 });
    expect(normalized.textScale).toBe(1.6);
    expect(normalized.lineHeight).toBe(1.4);
    expect(normalized.letterSpacing).toBe(0.2);
  });

  it('persists and resets preference values', () => {
    const store = new PreferenceStore('test-pref-store');
    store.set('underlineLinks', true);
    expect(store.get('underlineLinks')).toBe(true);
    store.reset();
    expect(store.get('underlineLinks')).toBe(false);
  });
});
