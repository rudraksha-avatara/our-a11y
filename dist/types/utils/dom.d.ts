export declare function isBrowser(): boolean;
export declare function onReady(callback: () => void): void;
export declare function clamp(value: number, min: number, max: number): number;
export declare function createEl<K extends keyof HTMLElementTagNameMap>(tag: K, props?: Record<string, string>): HTMLElementTagNameMap[K];
export declare function getAccessibleText(node: Element | null): string;
export declare function getSafeSelector(node: Element): string;
export declare function isProbablyInformativeImage(img: HTMLImageElement): boolean;
