import { DOCUMENT } from '@angular/common';
import {
	AfterViewInit,
	Directive,
	ElementRef,
	Inject,
	input,
	OnDestroy,
	Renderer2,
} from '@angular/core';

/**
 * A directive that adds a ripple effect to an element when it is clicked or tapped.
 * The ripple effect is a visual feedback indicating the point of interaction.
 *
 * @directive
 * @selector [chRipple]
 * @hostclass ch-ripple
 */
@Directive({
	selector: '[chRipple]',
	standalone: true,
	host: {
		class: 'ch-ripple',
	},
})
export class RippleDirective implements AfterViewInit, OnDestroy {
	private hostEl: HTMLElement;
	private inkElement?: HTMLElement;

	/**
	 * Controls whether the ripple effect is enabled.
	 *
	 * @group Props
	 * @default true
	 */
	rippleEnabled = input<boolean>(true);

	private pointerDownListener?: () => void;

	constructor(
		private renderer: Renderer2,
		private el: ElementRef,
		@Inject(DOCUMENT) private document: Document
	) {
		this.hostEl = el.nativeElement as HTMLElement;
	}

	ngAfterViewInit() {
		this.pointerDownListener = this.renderer.listen(
			this.el.nativeElement,
			'pointerdown',
			this.onPointerDown.bind(this)
		);
	}

	ngOnDestroy() {
		this.removeInkElement();
		if (this.pointerDownListener) {
			this.pointerDownListener();
		}
	}

	private createInkElement() {
		this.removeInkElement();
		this.inkElement = this.renderer.createElement('span');
		this.renderer.addClass(this.inkElement, 'ch-ink');
		this.renderer.appendChild(this.hostEl, this.inkElement);
		this.renderer.setAttribute(
			this.inkElement,
			'aria-hidden',
			'true'
		);
		this.renderer.setAttribute(
			this.inkElement,
			'role',
			'presentation'
		);

		this.renderer.listen(this.inkElement, 'animationend', () => {
			if (this.inkElement) {
				this.renderer.removeClass(this.inkElement, 'ch-ink-animate');
			}
		});
	}

	private removeInkElement() {
		if (this.inkElement) {
			this.renderer.removeChild(this.hostEl, this.inkElement);
			this.inkElement = undefined;
		}
	}

	private onPointerDown(evt: MouseEvent) {
		if (!this.rippleEnabled()) return;

		this.createInkElement();
		if (!this.inkElement) return;

		const diameter = Math.max(
			this.hostEl.offsetWidth,
			this.hostEl.offsetHeight
		);
		this.renderer.setStyle(this.inkElement, 'width', `${diameter}px`);
		this.renderer.setStyle(
			this.inkElement,
			'height',
			`${diameter}px`
		);

		const rect = this.hostEl.getBoundingClientRect();
		const scrollLeft =
			this.document.documentElement.scrollLeft ||
			this.document.body.scrollLeft;
		const scrollTop =
			this.document.documentElement.scrollTop ||
			this.document.body.scrollTop;

		const x =
			evt.pageX -
			rect.left -
			scrollLeft -
			this.inkElement.offsetWidth / 2;
		const y =
			evt.pageY -
			rect.top -
			scrollTop -
			this.inkElement.offsetHeight / 2;

		this.renderer.setStyle(this.inkElement, 'top', `${y}px`);
		this.renderer.setStyle(this.inkElement, 'left', `${x}px`);
		this.renderer.addClass(this.inkElement, 'ch-ink-animate');
	}
}
