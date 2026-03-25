import type { A11yConfig } from '../types';
export declare const defaultConfig: A11yConfig;
declare global {
    interface Window {
        OUR_A11Y_CONFIG?: Partial<A11yConfig>;
    }
}
export declare function isDomainAllowed(config: A11yConfig): boolean;
export declare function resolveConfig(programmatic?: Partial<A11yConfig>): Promise<A11yConfig>;
