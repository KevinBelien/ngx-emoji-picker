import { Emoji } from './emoji.model';

/**
 * Represents the state and results of an emoji filtering operation.
 * @group Interfaces
 */
export interface FilteredEmojis {
	/**
	 * Indicates whether the emoji filter is currently active.
	 */
	filterActive: boolean;

	/**
	 * An array of emojis that match the current filter criteria.
	 *
	 * If `filterActive` is `true`, this array contains the filtered results. If `false`, it may be empty or contain all available emojis.
	 */
	emojis: Emoji[];
}
