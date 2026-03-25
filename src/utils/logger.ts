export function createLogger(enabled: boolean) {
  return {
    info: (...args: unknown[]) => {
      if (enabled) {
        console.info('[OurA11y]', ...args);
      }
    },
    warn: (...args: unknown[]) => {
      console.warn('[OurA11y]', ...args);
    }
  };
}
