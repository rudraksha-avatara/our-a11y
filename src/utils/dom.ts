export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function onReady(callback: () => void): void {
  if (!isBrowser()) {
    return;
  }
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    callback();
    return;
  }
  document.addEventListener('DOMContentLoaded', callback, { once: true });
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function createEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Record<string, string> = {}
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
}

export function getAccessibleText(node: Element | null): string {
  if (!node) {
    return '';
  }
  const ariaLabel = node.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }
  const labelledBy = node.getAttribute('aria-labelledby');
  if (labelledBy) {
    const text = labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
      .join(' ')
      .trim();
    if (text) {
      return text;
    }
  }
  const title = node.getAttribute('title');
  if (title) {
    return title.trim();
  }
  return (node.textContent ?? '').trim();
}

export function getSafeSelector(node: Element): string {
  const parts: string[] = [];
  let current: Element | null = node;

  while (current && current !== document.body && parts.length < 4) {
    let part = current.tagName.toLowerCase();
    if (current.id) {
      part += `#${current.id}`;
      parts.unshift(part);
      break;
    }
    if (current.classList.length > 0) {
      part += `.${Array.from(current.classList).slice(0, 2).join('.')}`;
    }
    parts.unshift(part);
    current = current.parentElement;
  }

  return parts.join(' > ') || node.tagName.toLowerCase();
}

export function isProbablyInformativeImage(img: HTMLImageElement): boolean {
  if (img.getAttribute('role') === 'presentation' || img.getAttribute('aria-hidden') === 'true') {
    return false;
  }
  if (!img.alt && img.width <= 24 && img.height <= 24) {
    return false;
  }
  return true;
}
