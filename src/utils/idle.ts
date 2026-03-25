export function scheduleIdle(callback: () => void, timeout = 400): number {
  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
    return window.requestIdleCallback(() => callback(), { timeout });
  }
  return window.setTimeout(callback, Math.min(timeout, 120));
}

export function cancelIdle(handle: number): void {
  if (typeof window !== 'undefined' && typeof window.cancelIdleCallback === 'function') {
    window.cancelIdleCallback(handle);
    return;
  }
  window.clearTimeout(handle);
}
