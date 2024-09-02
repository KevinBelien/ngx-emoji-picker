/**
 * Representing different emoji sizes in pixels.
 * @group Enums
 * @enum {number} EmojiSize
 */
export enum EmojiSize {
	'xs' = 16,
	'sm' = 20,
	'default' = 24,
	'lg' = 28,
	'xl' = 32,
}

/**
 * Representing the available options for emoji sizes.
 * @group Types
 */
export type EmojiSizeOption = keyof typeof EmojiSize;
