import type { Preferences } from '../types';
export declare class FeatureEngine {
    private styleEl?;
    private readingGuide?;
    private readonly root;
    private readonly body;
    private mouseMoveHandler?;
    init(): void;
    apply(preferences: Preferences): void;
    private getFilterValue;
    private toggleAttr;
    private ensureReadingGuide;
    private enableReadingGuide;
    private disableReadingGuide;
    destroy(): void;
}
