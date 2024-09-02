import { Directive, HostListener, output } from '@angular/core';
import { HoverEvent } from '../models';

/**
 * A directive that listens for hover events (mouseenter and mouseleave) on an element and emits
 * a custom event with hover state information.
 *
 * @directive
 * @selector [chHover]
 */
@Directive({
	standalone: true,
	selector: '[chHover]',
})
export class HoverDirective {
	/**
	 * Emits an event when the hover state of the element changes.
	 * The emitted event contains information about whether the element is being hovered over.
	 *
	 * @output
	 * @type {Output<HoverEvent>}- The event object containing details of the event itself and if the element is hovered.
	 * @description This event is triggered whenever the mouse enters or leaves the element.
	 */
	hoverChange = output<HoverEvent>();

	@HostListener('mouseenter') onMouseEnter = (event: Event) => {
		this.hoverChange.emit({ event, isHovered: true });
	};

	@HostListener('mouseleave') onMouseLeave = (event: Event) => {
		this.hoverChange.emit({ event, isHovered: false });
	};
}
