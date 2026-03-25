export declare class DomObserver {
    private readonly onChange;
    private observer?;
    private pendingHandle?;
    private routeHandler;
    private originalPushState?;
    private originalReplaceState?;
    constructor(onChange: () => void);
    start(): void;
    private schedule;
    private patchHistory;
    stop(): void;
}
