import type { A11yConfig } from '../types';
import { getAccessibleText } from '../utils/dom';

interface MutationRecordEntry {
  element: Element;
  attribute: string;
  previous: string | null;
}

export class RemediationEngine {
  private appliedMutations: MutationRecordEntry[] = [];
  private skipLink?: HTMLAnchorElement;

  apply(config: A11yConfig, root: ParentNode = document): void {
    const doc = root instanceof Document ? root : document;

    if (!doc.documentElement.getAttribute('lang')) {
      this.recordAttr(doc.documentElement, 'lang');
      doc.documentElement.setAttribute('lang', config.locale || navigator.language.split('-')[0] || 'en');
    }

    if (config.features.skipLink) {
      this.ensureSkipLink(doc);
    }

    doc.querySelectorAll('button, [role="button"], a[href]').forEach((node) => {
      const el = node as HTMLElement;
      if (getAccessibleText(el)) {
        return;
      }
      const imageAlt = el.querySelector('img[alt]')?.getAttribute('alt')?.trim();
      const title = el.getAttribute('title')?.trim();
      const dataLabel = el.getAttribute('data-label')?.trim();
      const candidate = imageAlt || title || dataLabel;
      if (candidate) {
        this.recordAttr(el, 'aria-label');
        el.setAttribute('aria-label', candidate);
      }
    });

    doc.querySelectorAll('input, textarea').forEach((node) => {
      const control = node as HTMLInputElement | HTMLTextAreaElement;
      const id = control.getAttribute('id');
      const hasLabel = Boolean(id && doc.querySelector(`label[for="${CSS.escape(id)}"]`));
      if (hasLabel || getAccessibleText(control)) {
        return;
      }
      const placeholder = control.getAttribute('placeholder')?.trim();
      if (placeholder) {
        this.recordAttr(control, 'aria-label');
        control.setAttribute('aria-label', placeholder);
      }
    });
  }

  private ensureSkipLink(doc: Document): void {
    if (doc.getElementById('our-a11y-skip-link')) {
      return;
    }
    const target =
      doc.querySelector<HTMLElement>('main, [role="main"], #main, #content, article') ?? doc.body.firstElementChild;
    if (!target) {
      return;
    }
    if (!target.id) {
      this.recordAttr(target, 'id');
      target.id = 'our-a11y-main-target';
    }
    this.skipLink = document.createElement('a');
    this.skipLink.id = 'our-a11y-skip-link';
    this.skipLink.href = `#${target.id}`;
    this.skipLink.textContent = 'Skip to main content';
    doc.body.prepend(this.skipLink);
  }

  private recordAttr(element: Element, attribute: string): void {
    if (element.hasAttribute(`data-oa-managed-${attribute}`)) {
      return;
    }
    this.appliedMutations.push({
      element,
      attribute,
      previous: element.getAttribute(attribute)
    });
    element.setAttribute(`data-oa-managed-${attribute}`, 'true');
  }

  destroy(): void {
    this.appliedMutations.forEach(({ element, attribute, previous }) => {
      element.removeAttribute(`data-oa-managed-${attribute}`);
      if (previous === null) {
        element.removeAttribute(attribute);
      } else {
        element.setAttribute(attribute, previous);
      }
    });
    this.appliedMutations = [];
    this.skipLink?.remove();
    this.skipLink = undefined;
  }
}
