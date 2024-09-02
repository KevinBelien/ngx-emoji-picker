/**
 * A list of predefined emoji categories used in the emoji picker.
 * @group Constants
 * @type {ReadonlyArray<string>}
 */
export const emojiCategories = [
	'suggestions',
	'smileys-people',
	'animals-nature',
	'food-drink',
	'travel-places',
	'objects',
	'activities',
	'symbols',
	'flags',
] as const;

/**
 * Represents a single emoji category from the predefined list.
 * This type is a union of string literals representing the possible values of emoji categories.
 * @group Types
 */
export type EmojiCategory = (typeof emojiCategories)[number];
