import { Emoji, EmojiCategory } from '.';

/**
 * Represents a row in the emoji picker, which can either be a category row or an emoji row.
 * @group Types
 */
export type EmojiPickerRow = { id: string } & (
	| {
			type: 'category';
			value: EmojiCategory | Emoji[] | 'search';
			translationKey: string;
	  }
	| { type: 'emoji'; value: Emoji[] }
);
