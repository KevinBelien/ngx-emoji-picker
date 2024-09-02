import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	input,
} from '@angular/core';

/**
 * Icon component that supports rendering SVG icons.
 *
 * @component
 */
@Component({
	selector: 'ch-icon',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './icon.component.html',
	styleUrl: './icon.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class IconComponent {
	/**
	 * Specifies the CSS class or classes to be applied to the svg element.
	 * @group Props
	 */
	cssClass = input<string>('');

	/**
	 * Specifies the path data for the SVG icon.
	 * @group Props
	 */
	iconPath = input<string>('');

	/**
	 * Specifies the height of the SVG icon.
	 * @group Props
	 */
	height = input<number | string>(24);

	/**
	 * Specifies the width of the SVG icon.
	 * @group Props
	 */
	width = input<number | string>(24);

	/**
	 * Specifies the viewBox attribute for the SVG element.
	 * The viewBox is a string of four numbers, typically representing the
	 * position and dimension of the SVG canvas, in the format 'min-x min-y width height'.
	 * This allows the icon to scale properly while maintaining its aspect ratio.
	 * @group Props
	 */
	viewBox = input<string>('0 -960 960 960');
}
