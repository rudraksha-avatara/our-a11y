import type { Preferences } from '../types';

export const presetMap: Record<string, Partial<Preferences>> = {
  none: {},
  lowVision: {
    textScale: 1.2,
    lineHeight: 1.9,
    underlineLinks: true,
    focusHighlight: true,
    highContrast: true
  },
  dyslexiaFriendly: {
    textScale: 1.1,
    lineHeight: 1.9,
    letterSpacing: 0.06,
    wordSpacing: 0.08,
    readableFont: true
  },
  keyboardFriendly: {
    focusHighlight: true,
    underlineLinks: true,
    highlightLinks: true
  },
  seizureSafe: {
    reduceMotion: true,
    highContrast: false,
    invertColors: false
  }
};
