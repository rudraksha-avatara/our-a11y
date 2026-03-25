import type { Preferences } from '../types';
import { defaultPreferences } from '../state/preferences';

const HOST_STYLE_ID = 'our-a11y-host-styles';

const hostStyles = `
html[data-oa-enabled="true"] {
  --oa-text-scale: 1;
  --oa-line-height: 1.6;
  --oa-letter-spacing: 0em;
  --oa-word-spacing: 0em;
  --oa-focus-color: #ff9f0a;
  --oa-document-filter: none;
}
html[data-oa-enabled="true"][data-oa-text-resize="true"] {
  font-size: calc(100% * var(--oa-text-scale));
}
html[data-oa-enabled="true"][data-oa-read-font="true"] body,
html[data-oa-enabled="true"][data-oa-read-font="true"] button,
html[data-oa-enabled="true"][data-oa-read-font="true"] input,
html[data-oa-enabled="true"][data-oa-read-font="true"] textarea,
html[data-oa-enabled="true"][data-oa-read-font="true"] select {
  font-family: Verdana, Tahoma, Arial, sans-serif !important;
}
html[data-oa-enabled="true"][data-oa-line-height="true"] body,
html[data-oa-enabled="true"][data-oa-line-height="true"] p,
html[data-oa-enabled="true"][data-oa-line-height="true"] li,
html[data-oa-enabled="true"][data-oa-line-height="true"] blockquote,
html[data-oa-enabled="true"][data-oa-line-height="true"] dd,
html[data-oa-enabled="true"][data-oa-line-height="true"] dt {
  line-height: var(--oa-line-height) !important;
}
html[data-oa-enabled="true"][data-oa-spacing="true"] p,
html[data-oa-enabled="true"][data-oa-spacing="true"] li,
html[data-oa-enabled="true"][data-oa-spacing="true"] a,
html[data-oa-enabled="true"][data-oa-spacing="true"] button,
html[data-oa-enabled="true"][data-oa-spacing="true"] label,
html[data-oa-enabled="true"][data-oa-spacing="true"] input,
html[data-oa-enabled="true"][data-oa-spacing="true"] textarea {
  letter-spacing: var(--oa-letter-spacing) !important;
  word-spacing: var(--oa-word-spacing) !important;
}
html[data-oa-enabled="true"][data-oa-underline-links="true"] a {
  text-decoration: underline !important;
  text-underline-offset: 0.18em;
}
html[data-oa-enabled="true"][data-oa-highlight-links="true"] a {
  background: #fff3bf !important;
  color: #111827 !important;
}
html[data-oa-enabled="true"][data-oa-highlight-headings="true"] h1,
html[data-oa-enabled="true"][data-oa-highlight-headings="true"] h2,
html[data-oa-enabled="true"][data-oa-highlight-headings="true"] h3,
html[data-oa-enabled="true"][data-oa-highlight-headings="true"] h4,
html[data-oa-enabled="true"][data-oa-highlight-headings="true"] h5,
html[data-oa-enabled="true"][data-oa-highlight-headings="true"] h6 {
  background: #e0f2fe !important;
  color: #0f172a !important;
}
html[data-oa-enabled="true"][data-oa-focus-highlight="true"] :focus-visible {
  outline: 3px solid var(--oa-focus-color) !important;
  outline-offset: 2px !important;
}
html[data-oa-enabled="true"] {
  filter: var(--oa-document-filter);
}
html[data-oa-enabled="true"][data-oa-big-cursor="true"],
html[data-oa-enabled="true"][data-oa-big-cursor="true"] * {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='42' height='42' viewBox='0 0 42 42'%3E%3Cpath fill='%23000' stroke='%23fff' stroke-width='2' d='M4 3l11 28 5-10 10 5L39 21 11 10 4 3z'/%3E%3C/svg%3E") 4 4, auto !important;
}
html[data-oa-enabled="true"][data-oa-reduce-motion="true"] *,
html[data-oa-enabled="true"][data-oa-reduce-motion="true"] *::before,
html[data-oa-enabled="true"][data-oa-reduce-motion="true"] *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
#our-a11y-reading-guide {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 42px;
  background: rgba(15, 23, 42, 0.12);
  pointer-events: none;
  z-index: 2147482999;
  display: none;
}
html[data-oa-reading-guide="true"] #our-a11y-reading-guide {
  display: block;
}
#our-a11y-skip-link {
  position: fixed;
  left: 12px;
  top: 12px;
  transform: translateY(-200%);
  background: #0f172a;
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 10px;
  z-index: 2147483001;
  text-decoration: none;
}
#our-a11y-skip-link:focus {
  transform: translateY(0);
}
`;

export class FeatureEngine {
  private styleEl?: HTMLStyleElement;
  private readingGuide?: HTMLDivElement;
  private readonly root = document.documentElement;
  private readonly body = document.body;
  private mouseMoveHandler?: (event: MouseEvent) => void;

  init(): void {
    this.styleEl = (document.getElementById(HOST_STYLE_ID) as HTMLStyleElement | null) ?? document.createElement('style');
    this.styleEl.id = HOST_STYLE_ID;
    this.styleEl.textContent = hostStyles;
    if (!this.styleEl.parentNode) {
      document.head.appendChild(this.styleEl);
    }
    this.root.setAttribute('data-oa-enabled', 'true');
    this.ensureReadingGuide();
  }

  apply(preferences: Preferences): void {
    this.root.style.setProperty('--oa-text-scale', String(preferences.textScale));
    this.root.style.setProperty('--oa-line-height', String(preferences.lineHeight));
    this.root.style.setProperty('--oa-letter-spacing', `${preferences.letterSpacing}em`);
    this.root.style.setProperty('--oa-word-spacing', `${preferences.wordSpacing}em`);
    this.root.style.setProperty('--oa-document-filter', this.getFilterValue(preferences));

    this.toggleAttr('data-oa-text-resize', preferences.textScale !== defaultPreferences.textScale);
    this.toggleAttr('data-oa-line-height', preferences.lineHeight !== defaultPreferences.lineHeight);
    this.toggleAttr(
      'data-oa-spacing',
      preferences.letterSpacing !== defaultPreferences.letterSpacing ||
        preferences.wordSpacing !== defaultPreferences.wordSpacing
    );
    this.toggleAttr('data-oa-read-font', preferences.readableFont);
    this.toggleAttr('data-oa-underline-links', preferences.underlineLinks);
    this.toggleAttr('data-oa-highlight-links', preferences.highlightLinks);
    this.toggleAttr('data-oa-highlight-headings', preferences.highlightHeadings);
    this.toggleAttr('data-oa-focus-highlight', preferences.focusHighlight);
    this.toggleAttr('data-oa-high-contrast', preferences.highContrast);
    this.toggleAttr('data-oa-invert', preferences.invertColors);
    this.toggleAttr('data-oa-grayscale', preferences.grayscale);
    this.toggleAttr('data-oa-reduce-motion', preferences.reduceMotion);
    this.toggleAttr('data-oa-big-cursor', preferences.bigCursor);
    this.toggleAttr('data-oa-reading-guide', preferences.readingGuide);

    if (preferences.readingGuide) {
      this.enableReadingGuide();
    } else {
      this.disableReadingGuide();
    }
  }

  private getFilterValue(preferences: Preferences): string {
    const filters: string[] = [];
    if (preferences.highContrast) {
      filters.push('contrast(1.15)');
    }
    if (preferences.invertColors) {
      filters.push('invert(1)', 'hue-rotate(180deg)');
    }
    if (preferences.grayscale) {
      filters.push('grayscale(1)');
    }
    return filters.join(' ') || 'none';
  }

  private toggleAttr(name: string, enabled: boolean): void {
    if (enabled) {
      this.root.setAttribute(name, 'true');
      return;
    }
    this.root.removeAttribute(name);
  }

  private ensureReadingGuide(): void {
    if (this.readingGuide) {
      return;
    }
    this.readingGuide = document.getElementById('our-a11y-reading-guide') as HTMLDivElement | null ?? document.createElement('div');
    this.readingGuide.id = 'our-a11y-reading-guide';
    this.body.appendChild(this.readingGuide);
  }

  private enableReadingGuide(): void {
    this.ensureReadingGuide();
    if (this.mouseMoveHandler) {
      return;
    }
    this.mouseMoveHandler = (event: MouseEvent) => {
      if (this.readingGuide) {
        this.readingGuide.style.transform = `translateY(${Math.max(0, event.clientY - 20)}px)`;
      }
    };
    document.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
  }

  private disableReadingGuide(): void {
    if (this.mouseMoveHandler) {
      document.removeEventListener('mousemove', this.mouseMoveHandler);
      this.mouseMoveHandler = undefined;
    }
  }

  destroy(): void {
    this.disableReadingGuide();
    this.root.removeAttribute('data-oa-enabled');
    [
      'data-oa-text-resize',
      'data-oa-line-height',
      'data-oa-spacing',
      'data-oa-read-font',
      'data-oa-underline-links',
      'data-oa-highlight-links',
      'data-oa-highlight-headings',
      'data-oa-focus-highlight',
      'data-oa-high-contrast',
      'data-oa-invert',
      'data-oa-grayscale',
      'data-oa-reduce-motion',
      'data-oa-big-cursor',
      'data-oa-reading-guide'
    ].forEach((name) => this.root.removeAttribute(name));
    this.root.style.removeProperty('--oa-text-scale');
    this.root.style.removeProperty('--oa-line-height');
    this.root.style.removeProperty('--oa-letter-spacing');
    this.root.style.removeProperty('--oa-word-spacing');
    this.root.style.removeProperty('--oa-document-filter');
    this.readingGuide?.remove();
    this.readingGuide = undefined;
    this.styleEl?.remove();
    this.styleEl = undefined;
  }
}
