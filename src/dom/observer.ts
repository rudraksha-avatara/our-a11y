import { scheduleIdle, cancelIdle } from '../utils/idle';

export class DomObserver {
  private observer?: MutationObserver;
  private pendingHandle?: number;
  private routeHandler = () => this.schedule();
  private originalPushState?: History['pushState'];
  private originalReplaceState?: History['replaceState'];

  constructor(private readonly onChange: () => void) {}

  start(): void {
    this.observer = new MutationObserver((mutations) => {
      const significant = mutations.some(
        (mutation) => mutation.type === 'childList' || mutation.type === 'attributes'
      );
      if (significant) {
        this.schedule();
      }
    });

    this.observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'aria-label', 'id']
    });

    window.addEventListener('hashchange', this.routeHandler);
    window.addEventListener('popstate', this.routeHandler);
    this.patchHistory();
  }

  private schedule(): void {
    if (this.pendingHandle) {
      cancelIdle(this.pendingHandle);
    }
    this.pendingHandle = scheduleIdle(() => {
      this.pendingHandle = undefined;
      this.onChange();
    }, 700);
  }

  private patchHistory(): void {
    this.originalPushState = history.pushState;
    this.originalReplaceState = history.replaceState;
    history.pushState = (...args) => {
      const result = this.originalPushState?.apply(history, args as any);
      this.schedule();
      return result as any;
    };
    history.replaceState = (...args) => {
      const result = this.originalReplaceState?.apply(history, args as any);
      this.schedule();
      return result as any;
    };
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    if (this.pendingHandle) {
      cancelIdle(this.pendingHandle);
      this.pendingHandle = undefined;
    }
    window.removeEventListener('hashchange', this.routeHandler);
    window.removeEventListener('popstate', this.routeHandler);
    if (this.originalPushState) {
      history.pushState = this.originalPushState;
    }
    if (this.originalReplaceState) {
      history.replaceState = this.originalReplaceState;
    }
  }
}
