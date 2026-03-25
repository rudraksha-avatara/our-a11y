import { describe, expect, it } from 'vitest';
import { AuditScanner } from '../src/audit/scanner';

describe('audit scanner', () => {
  it('reports common detectable issues', () => {
    document.body.innerHTML = `
      <img src="test.jpg">
      <button></button>
      <input type="text">
      <iframe src="about:blank"></iframe>
      <h1>Heading</h1>
      <h3>Skipped</h3>
    `;
    document.documentElement.removeAttribute('lang');

    const summary = new AuditScanner().scan();
    expect(summary.issues.some((issue) => issue.type === 'missing-lang')).toBe(true);
    expect(summary.issues.some((issue) => issue.type === 'unnamed-button')).toBe(true);
    expect(summary.issues.some((issue) => issue.type === 'missing-form-label')).toBe(true);
    expect(summary.issues.some((issue) => issue.type === 'iframe-missing-title')).toBe(true);
  });
});
