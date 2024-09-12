import { IndividualEmojiSkintone, Skintone } from './skin-tone.model';

export interface StorageConfig {
    suggestionEmojis?: StorageOptions<string[]>;
    globalSkintone?: StorageOptions<Skintone>;
    individualSkintones?: StorageOptions<IndividualEmojiSkintone[]>;
}

export type StorageOptions<T> = DefaultStorageOptions | CustomStorageOptions<T>;

export interface DefaultStorageOptions {
    limit?: number;
    allowAutoSave?: boolean;
    storage: 'localstorage';
}

export interface CustomStorageOptions<T> {
    storage: 'custom';
    value: T;
}
