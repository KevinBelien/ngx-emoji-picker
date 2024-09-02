/**
 * Represents a frequently used emoji, including usage count and last usage timestamp.
 * @group Interfaces
 */
export interface FrequentEmoji {
	/**
	 * The unique identifier of the emoji.
	 */
	id: string;

	/**
	 * The number of times this emoji has been used.
	 */
	count: number;

	/**
	 * The timestamp (in milliseconds) of the last time this emoji was used.
	 */
	dateInMs: number;
}
