import { afterEach, describe, expect, it } from 'vitest';
import OurA11y, { destroy, getPreferences, init, setPreference } from '../src/index';

describe('engine', () => {
  afterEach(() => {
    destroy();
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('lang');
  });

  it('initializes widget and exposes API', async () => {
    destroy();
    document.body.innerHTML = '<main><h1>Example</h1></main>';
    await init({ autoInit: false });
    expect(window.OurA11y).toBe(OurA11y);
    expect(document.getElementById('our-a11y-widget-host')).not.toBeNull();
  });

  it('applies preferences to the document', async () => {
    destroy();
    document.body.innerHTML = '<main><h1>Example</h1></main>';
    await init({ autoInit: false });
    setPreference('underlineLinks', true);
    expect(getPreferences().underlineLinks).toBe(true);
    expect(document.documentElement.getAttribute('data-oa-underline-links')).toBe('true');
  });

  it('cleans up injected UI on destroy', async () => {
    destroy();
    document.body.innerHTML = '<main><h1>Example</h1></main>';
    await init({ autoInit: false });
    destroy();
    expect(document.getElementById('our-a11y-widget-host')).toBeNull();
  });
});
