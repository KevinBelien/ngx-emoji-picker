import { EmojiSuggestionMode } from './emoji-suggestion-mode.model';
import { Emoji } from './emoji.model';

/**
 * Represents a set of suggested emojis based on a specific suggestion mode.
 *
 * @group Interfaces
 */
export interface SuggestionEmojis {
	/**
	 * The mode used to determine the suggested emojis (e.g., recent, frequent).
	 */
	suggestionMode: EmojiSuggestionMode;

	/**
	 * An array of emojis that are suggested based on the suggestion mode.
	 */
	emojis: Emoji[];
}
