import { EmojiCategory } from './emoji-category.model';
import { AlternativeSkintone } from './skin-tone.model';

/**
 * Representing an emoji object.
 * @group Interfaces
 */
export interface Emoji {
	/**
	 * The unique identifier for the emoji.
	 */
	id: string;

	/**
	 * The name of the emoji.
	 */
	name: string;

	/**
	 * The string value that represents the emoji.
	 */
	value: string;

	/**
	 * The category to which the emoji belongs (e.g., 'smileys-people', 'animals-nature').
	 */
	category: EmojiCategory;

	/**
	 * The order in which the emoji appears within its category.
	 */
	order: number;

	/**
	 * An optional array of skintone variations for the emoji.
	 */
	skintones?: AlternativeSkintone[];
}
