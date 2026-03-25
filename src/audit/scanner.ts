import type { ScanIssue, ScanSummary } from '../types';
import { getAccessibleText, getSafeSelector, isProbablyInformativeImage } from '../utils/dom';

function createIssue(
  type: string,
  severity: ScanIssue['severity'],
  message: string,
  element: Element,
  suggestion: string,
  autoFixAvailable = false
): ScanIssue {
  return {
    id: `${type}-${Math.random().toString(36).slice(2, 10)}`,
    type,
    severity,
    message,
    selector: getSafeSelector(element),
    suggestion,
    autoFixAvailable
  };
}

export class AuditScanner {
  scan(root: ParentNode = document): ScanSummary {
    const issues: ScanIssue[] = [];
    const documentRoot = root instanceof Document ? root : document;

    if (!documentRoot.documentElement.hasAttribute('lang')) {
      issues.push(
        createIssue(
          'missing-lang',
          'medium',
          'Document language is not declared.',
          documentRoot.documentElement,
          'Add a valid lang attribute to the html element.',
          true
        )
      );
    }

    if (!documentRoot.querySelector('main, [role="main"]')) {
      issues.push(
        createIssue(
          'missing-main',
          'medium',
          'No main landmark was found.',
          documentRoot.body,
          'Add a main element or a role="main" landmark.',
          false
        )
      );
    }

    documentRoot.querySelectorAll('img').forEach((node) => {
      const img = node as HTMLImageElement;
      if (!img.hasAttribute('alt') && isProbablyInformativeImage(img)) {
        issues.push(
          createIssue(
            'missing-alt',
            'medium',
            'Image appears to be missing alternative text.',
            img,
            'Add meaningful alt text or mark decorative images appropriately.',
            false
          )
        );
      }
    });

    documentRoot.querySelectorAll('input, select, textarea').forEach((node) => {
      const control = node as HTMLElement;
      const id = control.getAttribute('id');
      const hasLabel = Boolean(id && documentRoot.querySelector(`label[for="${CSS.escape(id)}"]`));
      const hasName = Boolean(getAccessibleText(control));
      if (!hasLabel && !hasName) {
        issues.push(
          createIssue(
            'missing-form-label',
            'high',
            'Form control does not have a clear accessible name.',
            control,
            'Associate a visible label or provide aria-label/aria-labelledby.',
            Boolean(control.getAttribute('placeholder'))
          )
        );
      }
    });

    documentRoot.querySelectorAll('button, [role="button"], a[href]').forEach((node) => {
      const interactive = node as HTMLElement;
      if (!getAccessibleText(interactive) && !interactive.querySelector('img[alt], svg title')) {
        issues.push(
          createIssue(
            interactive.tagName.toLowerCase() === 'a' ? 'empty-link' : 'unnamed-button',
            'high',
            'Interactive element does not have a discernible accessible name.',
            interactive,
            'Add visible text, aria-label, aria-labelledby, or meaningful image alt text.',
            false
          )
        );
      }
    });

    documentRoot.querySelectorAll('iframe').forEach((node) => {
      if (!node.getAttribute('title')) {
        issues.push(
          createIssue(
            'iframe-missing-title',
            'medium',
            'Iframe is missing a title.',
            node,
            'Add a concise title describing the embedded content.',
            false
          )
        );
      }
    });

    documentRoot.querySelectorAll('video[autoplay], audio[autoplay]').forEach((node) => {
      issues.push(
        createIssue(
          'autoplay-media',
          'medium',
          'Autoplaying media may create accessibility barriers.',
          node,
          'Provide controls and avoid autoplay when possible.',
          false
        )
      );
    });

    const headings = Array.from(documentRoot.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let lastLevel = 0;
    headings.forEach((heading) => {
      const level = Number(heading.tagName[1]);
      if (lastLevel && level > lastLevel + 1) {
        issues.push(
          createIssue(
            'heading-order',
            'low',
            'Heading level appears to skip levels.',
            heading,
            'Review heading hierarchy for a logical outline.',
            false
          )
        );
      }
      lastLevel = level;
    });

    documentRoot.querySelectorAll('a[href]').forEach((node) => {
      const text = getAccessibleText(node);
      if (!text && node.childElementCount > 0) {
        return;
      }
      if (text && /^(click here|read more|more)$/i.test(text)) {
        issues.push(
          createIssue(
            'weak-link-text',
            'low',
            'Link text may not be descriptive out of context.',
            node,
            'Use more descriptive link text.',
            false
          )
        );
      }
    });

    return {
      scannedAt: Date.now(),
      issues
    };
  }
}
