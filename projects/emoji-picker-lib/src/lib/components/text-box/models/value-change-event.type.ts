/**
 * Represents the event data for a value change in a text box component.
 *
 * This interface captures the details of a change in the text box's value, including the new value, the original event that triggered the change, and the specific action associated with the change.
 *
 * @group Interfaces
 */
export interface ValueChangeEvent {
	/**
	 * The new value of the text box after the change.
	 */
	value: string;

	/**
	 * The original event that triggered the value change.
	 */
	event: Event;

	/**
	 * The action associated with the value change (e.g., 'input', 'blur', 'clear').
	 */
	action: string;
}
