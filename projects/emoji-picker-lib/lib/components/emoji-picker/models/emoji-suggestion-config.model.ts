import { EmojiSuggestionMode } from './emoji-suggestion-mode.model';

export interface SuggestionConfig {
    mode: EmojiSuggestionMode;
    limitToShow?: number;
}
