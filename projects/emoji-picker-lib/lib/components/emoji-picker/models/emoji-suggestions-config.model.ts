import { EmojiSuggestionMode } from './emoji-suggestion-mode.model';

export type EmojiSuggestionsConfig = BaseSuggestionConfig & (CustomStorageSuggestionConfig | DefaultStorageSuggestionConfig);

type BaseSuggestionConfig = {
    mode: EmojiSuggestionMode;
};

type DefaultStorageSuggestionConfig = {
    storage?: 'localstorage';
    autoUpdate?: boolean;
    limit?: number;
};

type CustomStorageSuggestionConfig = {
    storage: 'custom';
    emojis: string[];
};
