import type { A11yConfig } from '../types';
export declare class RemediationEngine {
    private appliedMutations;
    private skipLink?;
    apply(config: A11yConfig, root?: ParentNode): void;
    private ensureSkipLink;
    private recordAttr;
    destroy(): void;
}
