import type { A11yConfig, PreferenceKey, Preferences, ScanSummary } from '../types';
import { presetMap } from '../features/presets';
import { createEl } from '../utils/dom';
import { widgetStyles } from './styles';

type Callbacks = {
  onTogglePanel: () => void;
  onClosePanel: () => void;
  onSetPreference: <K extends PreferenceKey>(key: K, value: Preferences[K]) => void;
  onApplyPreset: (name: string) => void;
  onReset: () => void;
  onScan: () => void;
};

interface ControlMap {
  [key: string]: HTMLInputElement | HTMLSelectElement | HTMLSpanElement | null;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export class WidgetUI {
  private host?: HTMLDivElement;
  private shadow?: ShadowRoot;
  private launcher?: HTMLButtonElement;
  private panel?: HTMLDivElement;
  private liveRegion?: HTMLDivElement;
  private controls: ControlMap = {};

  constructor(private readonly config: A11yConfig, private readonly callbacks: Callbacks) {}

  mount(initialPreferences: Preferences): void {
    this.host = createEl('div');
    this.host.id = 'our-a11y-widget-host';
    this.host.style.position = 'fixed';
    this.host.style.zIndex = String(this.config.zIndex);
    document.body.appendChild(this.host);

    this.shadow = this.host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = widgetStyles;
    this.shadow.appendChild(style);

    const shell = createEl('div', { class: 'a11y-shell', 'data-position': this.config.position });
    shell.style.setProperty('--a11y-primary', this.config.ui.accentColor);
    shell.style.setProperty('--a11y-z-index', String(this.config.zIndex));

    this.launcher = createEl('button', {
      class: 'a11y-fab',
      type: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': 'false',
      'aria-controls': 'a11y-panel',
      'aria-label': 'Open accessibility panel'
    });
    this.launcher.append(this.createLauncherIcon(), this.createLauncherLabel());
    this.launcher.addEventListener('click', () => this.callbacks.onTogglePanel());

    this.panel = createEl('div', {
      class: 'a11y-panel',
      id: 'a11y-panel',
      role: 'dialog',
      'aria-label': 'Accessibility',
      'aria-modal': 'true',
      'data-open': 'false'
    });
    this.panel.addEventListener('keydown', this.handlePanelKeydown);

    const header = createEl('div', { class: 'a11y-header' });
    const headerCopy = createEl('div', { class: 'a11y-header-copy' });
    const title = createEl('h2', { class: 'a11y-title' });
    title.textContent = 'Accessibility';
    const description = createEl('p', { class: 'a11y-description' });
    description.textContent = this.config.ui.description;
    headerCopy.append(title, description);

    const closeButton = createEl('button', {
      class: 'a11y-close',
      type: 'button',
      'aria-label': 'Close accessibility panel'
    });
    closeButton.append(this.createCloseIcon());
    closeButton.addEventListener('click', () => this.callbacks.onClosePanel());
    header.append(headerCopy, closeButton);

    const body = createEl('div', { class: 'a11y-body' });
    body.append(
      this.buildRangeGroup(initialPreferences),
      this.buildToggleGroup(initialPreferences),
      this.buildPresetGroup(),
      this.buildDiagnosticsGroup()
    );

    const footer = createEl('div', { class: 'a11y-footer' });
    const resetButton = createEl('button', {
      class: 'a11y-button',
      type: 'button',
      'aria-label': 'Reset accessibility preferences'
    });
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => this.callbacks.onReset());
    footer.append(resetButton);

    this.liveRegion = createEl('div', { class: 'a11y-live', 'aria-live': 'polite' });
    this.panel.append(header, body, footer, this.liveRegion);
    shell.append(this.launcher, this.panel);
    this.shadow.appendChild(shell);

    document.addEventListener('click', this.handleDocumentClick, true);
    this.sync(initialPreferences);
  }

  private buildRangeGroup(preferences: Preferences): HTMLElement {
    const group = createEl('section', { class: 'a11y-group' });
    group.append(this.groupTitle('Readability'));
    group.append(
      this.rangeRow('Text size', 'textScale', preferences.textScale, 1, 1.6, 0.1),
      this.rangeRow('Line height', 'lineHeight', preferences.lineHeight, 1.4, 2.4, 0.1),
      this.rangeRow('Letter spacing', 'letterSpacing', preferences.letterSpacing, 0, 0.2, 0.02),
      this.rangeRow('Word spacing', 'wordSpacing', preferences.wordSpacing, 0, 0.3, 0.02)
    );
    return group;
  }

  private buildToggleGroup(preferences: Preferences): HTMLElement {
    const group = createEl('section', { class: 'a11y-group' });
    group.append(this.groupTitle('Enhancements'));
    const toggles: Array<[string, PreferenceKey, string]> = [
      ['Readable font', 'readableFont', 'Switch to a highly legible system font stack.'],
      ['Underline links', 'underlineLinks', 'Increase link differentiation.'],
      ['Highlight links', 'highlightLinks', 'Apply a clear link background.'],
      ['Highlight headings', 'highlightHeadings', 'Make headings easier to scan.'],
      ['Focus highlight', 'focusHighlight', 'Strengthen keyboard focus visibility.'],
      ['High contrast', 'highContrast', 'Increase contrast with a mild document filter.'],
      ['Invert colors', 'invertColors', 'Invert page colors for user preference.'],
      ['Grayscale', 'grayscale', 'Reduce color intensity.'],
      ['Reduce motion', 'reduceMotion', 'Minimize animations and transitions.'],
      ['Bigger cursor', 'bigCursor', 'Use a more visible pointer.'],
      ['Reading guide', 'readingGuide', 'Show a movable reading highlight.']
    ];

    toggles.forEach(([label, key, hint]) => {
      group.append(this.toggleRow(label, key, preferences[key] as boolean, hint));
    });
    return group;
  }

  private buildPresetGroup(): HTMLElement {
    const group = createEl('section', { class: 'a11y-group' });
    group.append(this.groupTitle('Presets'));

    const row = createEl('div', { class: 'a11y-row a11y-row-inline' });
    const copy = this.rowCopy('Quick profile', 'Apply a curated set of preference values.');
    const select = createEl('select', {
      class: 'a11y-select',
      'aria-label': 'Select accessibility preset'
    }) as HTMLSelectElement;

    Object.keys(presetMap).forEach((name) => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name === 'none' ? 'None' : name;
      select.appendChild(option);
    });

    select.addEventListener('change', () => this.callbacks.onApplyPreset(select.value));
    this.controls.preset = select;
    row.append(copy, select);
    group.append(row);
    return group;
  }

  private buildDiagnosticsGroup(): HTMLElement {
    const group = createEl('section', { class: 'a11y-group' });
    group.append(this.groupTitle('Diagnostics'));

    const row = createEl('div', { class: 'a11y-row a11y-row-inline' });
    row.append(
      this.rowCopy('Scan page', 'Run a lightweight scan for common detectable issues.'),
      this.createActionButton('Scan', 'Scan page for accessibility issues', () => this.callbacks.onScan(), true)
    );

    const list = createEl('ul', { class: 'a11y-issues' });
    group.append(row, list);
    return group;
  }

  private groupTitle(text: string): HTMLElement {
    const title = createEl('h3', { class: 'a11y-group-title' });
    title.textContent = text;
    return title;
  }

  private rangeRow(
    labelText: string,
    key: PreferenceKey,
    value: number,
    min: number,
    max: number,
    step: number
  ): HTMLElement {
    const row = createEl('div', { class: 'a11y-row' });
    row.append(this.rowCopy(labelText, this.getRangeHint(key)));

    const rangeWrap = createEl('div', { class: 'a11y-range-wrap' });
    const input = createEl('input', {
      class: 'a11y-range',
      type: 'range',
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(value),
      'aria-label': labelText
    }) as HTMLInputElement;
    const valueBadge = createEl('span', { class: 'a11y-range-value', 'aria-hidden': 'true' });
    input.addEventListener('input', () => {
      valueBadge.textContent = this.formatRangeValue(key, Number(input.value));
      this.callbacks.onSetPreference(key, Number(input.value) as never);
    });

    this.controls[key] = input;
    this.controls[`${key}Display`] = valueBadge;
    valueBadge.textContent = this.formatRangeValue(key, value);
    rangeWrap.append(input, valueBadge);
    row.append(rangeWrap);
    return row;
  }

  private toggleRow(labelText: string, key: PreferenceKey, checked: boolean, hintText: string): HTMLElement {
    const row = createEl('div', { class: 'a11y-row a11y-row-inline' });
    row.append(this.rowCopy(labelText, hintText));

    const switchWrap = createEl('label', { class: 'a11y-switch' });
    const input = createEl('input', {
      class: 'a11y-switch-input',
      type: 'checkbox',
      'aria-label': labelText,
      role: 'switch'
    }) as HTMLInputElement;
    input.checked = checked;
    input.addEventListener('change', () => this.callbacks.onSetPreference(key, input.checked as never));

    const ui = createEl('span', { class: 'a11y-switch-ui', 'aria-hidden': 'true' });
    switchWrap.append(input, ui);
    this.controls[key] = input;
    row.append(switchWrap);
    return row;
  }

  setOpen(open: boolean): void {
    if (!this.panel || !this.launcher) {
      return;
    }

    this.panel.setAttribute('data-open', open ? 'true' : 'false');
    this.launcher.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (open) {
      this.panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
      return;
    }

    this.launcher.focus();
  }

  announce(message: string): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
    }
  }

  sync(preferences: Preferences): void {
    Object.entries(preferences).forEach(([key, value]) => {
      const control = this.controls[key];
      if (!control) {
        return;
      }

      if (control instanceof HTMLInputElement && control.type === 'checkbox') {
        control.checked = Boolean(value);
      } else if (control instanceof HTMLInputElement && control.type === 'range') {
        control.value = String(value);
        const valueBadge = this.controls[`${key}Display`];
        if (valueBadge instanceof HTMLSpanElement) {
          valueBadge.textContent = this.formatRangeValue(key as PreferenceKey, Number(value));
        }
      } else if (control instanceof HTMLSelectElement) {
        control.value = String(value);
      }
    });
  }

  renderScanResults(summary: ScanSummary): void {
    const list = this.shadow?.querySelector('.a11y-issues');
    if (!list) {
      return;
    }

    list.innerHTML = '';
    if (summary.issues.length === 0) {
      const item = createEl('li', { class: 'a11y-issue' });
      item.textContent = 'No issues detected by the lightweight scanner.';
      list.appendChild(item);
      return;
    }

    summary.issues.slice(0, 10).forEach((issue) => {
      const item = createEl('li', { class: 'a11y-issue' });
      const strong = createEl('strong');
      strong.textContent = issue.message;
      const selector = createEl('div');
      selector.textContent = issue.selector;
      const suggestion = createEl('div');
      suggestion.textContent = issue.suggestion;
      item.append(strong, selector, suggestion);
      list.appendChild(item);
    });
  }

  private rowCopy(labelText: string, hintText: string): HTMLElement {
    const copy = createEl('div', { class: 'a11y-copy' });
    const label = createEl('div', { class: 'a11y-label' });
    label.textContent = labelText;
    const hint = createEl('div', { class: 'a11y-hint' });
    hint.textContent = hintText;
    copy.append(label, hint);
    return copy;
  }

  private createActionButton(
    text: string,
    ariaLabel: string,
    handler: () => void,
    primary = false
  ): HTMLButtonElement {
    const button = createEl('button', {
      class: primary ? 'a11y-button a11y-button-primary' : 'a11y-button',
      type: 'button',
      'aria-label': ariaLabel
    }) as HTMLButtonElement;
    button.textContent = text;
    button.addEventListener('click', handler);
    return button;
  }

  private createLauncherIcon(): HTMLElement {
    const icon = createEl('span', { class: 'a11y-fab-icon', 'aria-hidden': 'true' });
    icon.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3a9 9 0 1 0 9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 7.2v4.8l3.6 2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/></svg>';
    return icon;
  }

  private createLauncherLabel(): HTMLElement {
    const label = createEl('span', { class: 'a11y-fab-label' });
    label.textContent = 'Accessibility';
    return label;
  }

  private createCloseIcon(): HTMLElement {
    const icon = createEl('span', { class: 'a11y-close-icon', 'aria-hidden': 'true' });
    icon.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    return icon;
  }

  private getRangeHint(key: PreferenceKey): string {
    const hints: Partial<Record<PreferenceKey, string>> = {
      textScale: 'Increase overall text size without changing page zoom.',
      lineHeight: 'Add more vertical breathing room between lines.',
      letterSpacing: 'Increase spacing between individual characters.',
      wordSpacing: 'Increase spacing between words for easier scanning.'
    };
    return hints[key] ?? '';
  }

  private formatRangeValue(key: PreferenceKey, value: number): string {
    if (key === 'textScale') {
      return `${Math.round(value * 100)}%`;
    }
    return value.toFixed(2).replace(/\.00$/, '');
  }

  private getFocusableElements(): HTMLElement[] {
    return Array.from(this.panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []).filter(
      (element) => !element.hasAttribute('disabled')
    );
  }

  private handlePanelKeydown = (event: KeyboardEvent): void => {
    if (!this.panel || this.panel.getAttribute('data-open') !== 'true') {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.callbacks.onClosePanel();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusables = this.getFocusableElements();
    if (focusables.length === 0) {
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) {
      return;
    }
    const active = this.shadow?.activeElement ?? document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  private handleDocumentClick = (event: MouseEvent): void => {
    if (!this.panel || this.panel.getAttribute('data-open') !== 'true') {
      return;
    }

    const path = event.composedPath();
    if (!path.includes(this.host as EventTarget)) {
      this.callbacks.onClosePanel();
    }
  };

  destroy(): void {
    document.removeEventListener('click', this.handleDocumentClick, true);
    this.host?.remove();
    this.controls = {};
    this.host = undefined;
    this.shadow = undefined;
    this.panel = undefined;
    this.launcher = undefined;
    this.liveRegion = undefined;
  }
}
