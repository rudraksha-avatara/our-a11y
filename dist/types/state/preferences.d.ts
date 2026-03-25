import type { PreferenceKey, Preferences } from '../types';
export declare const PREFERENCE_VERSION = 1;
export declare const defaultPreferences: Preferences;
export declare function normalizePreferences(input?: Partial<Preferences> | null): Preferences;
export declare class PreferenceStore {
    private readonly storageKey;
    private readonly storage;
    private current;
    constructor(storageKey: string);
    private load;
    private persist;
    getAll(): Preferences;
    get<K extends PreferenceKey>(key: K): Preferences[K];
    set<K extends PreferenceKey>(key: K, value: Preferences[K]): Preferences;
    reset(): Preferences;
}
