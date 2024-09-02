import { Emoji, SuggestionEmojis } from '.';

/**
 * Configuration object for generating rows in the emoji picker.
 * This configuration determines how emojis are displayed, including their size, the number of items per row, and whether category rows should be generated.
 * @group Types
 */
export type EmojiRowGenerationConfig = {
	/**
	 * The size of the emojis in pixels.
	 */
	emojiSize: number;

	/**
	 * The width of the viewport in pixels.
	 */
	viewportWidth: number;

	/**
	 * Multiplier to adjust the size of each emoji button.
	 */
	itemSizeMultiplier: number;

	/**
	 * Indicates whether category rows should be generated.
	 */
	generateCategoryRows: boolean;
} & (
	| {
			/**
			 * Specifies that the configuration is for generating suggestion rows.
			 */
			type: 'suggestions';

			/**
			 * The emojis to be displayed as suggestions.
			 */
			emojis: SuggestionEmojis;
	  }
	| {
			/**
			 * Specifies that the configuration is for generating filtered or default emoji rows.
			 */
			type: 'filter' | 'default';

			/**
			 * The emojis to be displayed in the rows.
			 */
			emojis: Emoji[];
	  }
);
