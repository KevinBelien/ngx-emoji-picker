/**
 * Specifies the possible types for a button component.
 *
 * - `primary`: Adopts the primary color of the current theme.
 * - `success`: Indicates a successful or positive action, typically styled with a green color.
 * - `danger`: Represents a dangerous or potentially negative action, usually styled with a red color.
 * - `warning`: Indicates a warning or a cautionary action, often styled with an orange or yellow color.
 * - `info`: Represents informational content or actions, typically styled with a blue color.
 * - `contrast`: Provides a high-contrast style, often used to ensure accessibility.
 *
 * @group Types
 */
export type ButtonType =
	| 'primary'
	| 'success'
	| 'danger'
	| 'warning'
	| 'info'
	| 'contrast';
