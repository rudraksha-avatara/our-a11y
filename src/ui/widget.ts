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
  [key: string]: HTMLInputElement | HTMLSelectElement | null;
}

export class WidgetUI {
  private host?: HTMLDivElement;
  private shadow?: ShadowRoot;
  private launcher?: HTMLButtonElement;
  private panel?: HTMLDivElement;
  private liveRegion?: HTMLDivElement;
  private controls: ControlMap = {};
  private lastFocusedBeforeOpen?: HTMLElement | null;

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

    const shell = createEl('div', { class: 'oa-shell', 'data-position': this.config.position });
    shell.style.setProperty('--oa-accent', this.config.ui.accentColor);
    shell.style.setProperty('--oa-z-index', String(this.config.zIndex));

    this.launcher = createEl('button', {
      class: 'oa-launcher',
      type: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': 'false',
      'aria-controls': 'oa-panel'
    });
    this.launcher.innerHTML = '<span aria-hidden="true">A11y</span><span>Accessibility</span>';
    this.launcher.addEventListener('click', () => this.callbacks.onTogglePanel());

    this.panel = createEl('div', {
      class: 'oa-panel',
      id: 'oa-panel',
      role: 'dialog',
      'aria-label': this.config.ui.title,
      'aria-modal': 'false',
      'data-open': 'false'
    });
    this.panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.callbacks.onClosePanel();
      }
    });

    const header = createEl('div', { class: 'oa-header' });
    const title = createEl('h2', { class: 'oa-title' });
    title.textContent = this.config.ui.title;
    const description = createEl('p', { class: 'oa-description' });
    description.textContent = this.config.ui.description;
    header.append(title, description);

    const body = createEl('div', { class: 'oa-body' });
    body.append(
      this.buildRangeGroup(initialPreferences),
      this.buildToggleGroup(initialPreferences),
      this.buildPresetGroup(),
      this.buildDiagnosticsGroup()
    );

    this.liveRegion = createEl('div', { class: 'oa-live', 'aria-live': 'polite' });
    this.liveRegion.textContent = '';

    this.panel.append(header, body, this.liveRegion);
    shell.append(this.launcher, this.panel);
    this.shadow.appendChild(shell);

    document.addEventListener('click', this.handleDocumentClick, true);
    this.sync(initialPreferences);
  }

  private buildRangeGroup(preferences: Preferences): HTMLElement {
    const group = createEl('section', { class: 'oa-group' });
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
    const group = createEl('section', { class: 'oa-group' });
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
    const group = createEl('section', { class: 'oa-group' });
    group.append(this.groupTitle('Presets'));
    const row = createEl('div', { class: 'oa-row' });
    const labelWrap = createEl('div');
    const label = createEl('div', { class: 'oa-label' });
    label.textContent = 'Quick profile';
    const hint = createEl('div', { class: 'oa-hint' });
    hint.textContent = 'Applies a curated set of preference values.';
    labelWrap.append(label, hint);

    const select = createEl('select') as HTMLSelectElement;
    Object.keys(presetMap).forEach((name) => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name === 'none' ? 'None' : name;
      select.appendChild(option);
    });
    select.addEventListener('change', () => this.callbacks.onApplyPreset(select.value));
    this.controls.preset = select;
    row.append(labelWrap, select);

    const actions = createEl('div', { class: 'oa-actions' });
    const resetButton = createEl('button', { class: 'oa-button', type: 'button' });
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => this.callbacks.onReset());
    actions.append(resetButton);

    group.append(row, actions);
    return group;
  }

  private buildDiagnosticsGroup(): HTMLElement {
    const group = createEl('section', { class: 'oa-group' });
    group.append(this.groupTitle('Diagnostics'));
    const actions = createEl('div', { class: 'oa-actions' });
    const scanButton = createEl('button', { class: 'oa-button', type: 'button' });
    scanButton.textContent = 'Scan page';
    scanButton.addEventListener('click', () => this.callbacks.onScan());
    actions.append(scanButton);
    const list = createEl('ul', { class: 'oa-issues' });
    group.append(actions, list);
    return group;
  }

  private groupTitle(text: string): HTMLElement {
    const title = createEl('h3', { class: 'oa-group-title' });
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
    const row = createEl('div', { class: 'oa-row' });
    const label = createEl('label');
    const text = createEl('div', { class: 'oa-label' });
    text.textContent = labelText;
    label.appendChild(text);

    const input = createEl('input', {
      class: 'oa-range',
      type: 'range',
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(value),
      'aria-label': labelText
    }) as HTMLInputElement;
    input.addEventListener('input', () => this.callbacks.onSetPreference(key, Number(input.value) as never));
    this.controls[key] = input;
    row.append(label, input);
    return row;
  }

  private toggleRow(labelText: string, key: PreferenceKey, checked: boolean, hintText: string): HTMLElement {
    const row = createEl('div', { class: 'oa-row' });
    const wrap = createEl('label');
    const label = createEl('div', { class: 'oa-label' });
    label.textContent = labelText;
    const hint = createEl('div', { class: 'oa-hint' });
    hint.textContent = hintText;
    wrap.append(label, hint);

    const input = createEl('input', {
      class: 'oa-toggle',
      type: 'checkbox',
      'aria-label': labelText
    }) as HTMLInputElement;
    input.checked = checked;
    input.addEventListener('change', () => this.callbacks.onSetPreference(key, input.checked as never));
    this.controls[key] = input;
    row.append(wrap, input);
    return row;
  }

  setOpen(open: boolean): void {
    if (!this.panel || !this.launcher) {
      return;
    }
    if (open) {
      this.lastFocusedBeforeOpen = document.activeElement as HTMLElement | null;
      this.panel.setAttribute('data-open', 'true');
      this.launcher.setAttribute('aria-expanded', 'true');
      this.panel.querySelector<HTMLElement>('input, button, select')?.focus();
    } else {
      this.panel.setAttribute('data-open', 'false');
      this.launcher.setAttribute('aria-expanded', 'false');
      this.launcher.focus();
      this.lastFocusedBeforeOpen = null;
    }
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
      } else {
        control.value = String(value);
      }
    });
  }

  renderScanResults(summary: ScanSummary): void {
    const list = this.shadow?.querySelector('.oa-issues');
    if (!list) {
      return;
    }
    list.innerHTML = '';
    if (summary.issues.length === 0) {
      const item = createEl('li', { class: 'oa-issue' });
      item.textContent = 'No issues detected by the lightweight scanner.';
      list.appendChild(item);
      return;
    }
    summary.issues.slice(0, 10).forEach((issue) => {
      const item = createEl('li', { class: 'oa-issue' });
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
