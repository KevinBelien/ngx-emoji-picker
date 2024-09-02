import { IconPosition } from './icon-position.type';

/**
 * Properties for configuring an icon within a button component.
 * @group Interfaces
 */
export interface ButtonIconProps {
	/**
	 * The CSS class or classes to be applied to the icon for styling purposes.
	 */
	cssClass: string;

	/**
	 * The SVG path data for the icon
	 */
	path: string;

	/**
	 * The height of the icon, specified as a number (in pixels) or as a string with units (e.g., '24px', '1em').
	 */
	height: number | string;

	/**
	 * The width of the icon, specified as a number (in pixels) or as a string with units (e.g., '24px', '1em').
	 */
	width: number | string;

	/**
	 * The viewBox attribute of the SVG element, which defines the position and dimension of the icon within the SVG canvas.
	 */
	viewBox: string;

	/**
	 * The position of the icon relative to the button text (e.g., left, right, top, bottom).
	 */
	position: IconPosition;
}
