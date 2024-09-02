import { isPlatformBrowser } from '@angular/common';
import {
	booleanAttribute,
	Directive,
	ElementRef,
	inject,
	input,
	PLATFORM_ID,
	signal,
} from '@angular/core';

/**
 * AutoFocus manages focus on focusable element on load.
 * @directive
 * @selector [chAutofocus]
 */
@Directive({
	selector: '[chAutofocus]',
	standalone: true,
})
export class AutofocusDirective {
	private platformId = inject(PLATFORM_ID);
	private host: ElementRef = inject(ElementRef);

	/**
	 * When present, it specifies that the component should automatically get focus on load.
	 * @group Props
	 * @default true
	 */
	autofocus = input(true, {
		transform: booleanAttribute,
	});

	private focused = signal<boolean>(false);

	ngAfterContentChecked() {
		if (!this.autofocus()) {
			this.host.nativeElement.removeAttribute('autofocus');
		} else {
			this.host.nativeElement.setAttribute('autofocus', true);
		}

		if (!this.focused()) {
			this.startAutoFocus();
		}
	}

	ngAfterViewChecked() {
		if (!this.focused()) {
			this.startAutoFocus();
		}
	}

	startAutoFocus() {
		if (isPlatformBrowser(this.platformId) && this.autofocus()) {
			setTimeout(() => {
				const focusableElements = this.getFocusableElements(
					this.host?.nativeElement
				);

				if (focusableElements.length === 0) {
					this.host.nativeElement.focus();
				}
				if (focusableElements.length > 0) {
					focusableElements[0].focus();
				}

				this.focused.set(true);
			});
		}
	}

	getFocusableElements(element: HTMLElement): HTMLElement[] {
		const selectors = [
			'a[href]',
			'area[href]',
			'input:not([disabled]):not([type="hidden"])',
			'select:not([disabled])',
			'textarea:not([disabled])',
			'button:not([disabled])',
			'iframe',
			'object',
			'embed',
			'[contenteditable]',
			'[tabindex]:not([tabindex="-1"])',
		];

		const focusableElements = Array.from(
			element.querySelectorAll<HTMLElement>(selectors.join(','))
		);

		// Filter out elements that are not actually visible or cannot be focused
		const visibleFocusableElements = focusableElements.filter(
			(el) => {
				return this.isVisible(el);
			}
		);

		// If there are visible focusable elements, return them
		if (visibleFocusableElements.length > 0) {
			return visibleFocusableElements;
		}

		// If no focusable elements found, check recursively in child elements
		for (let i = 0; i < element.children.length; i++) {
			const child = element.children[i] as HTMLElement;
			const childFocusableElements = this.getFocusableElements(child);
			if (childFocusableElements.length > 0) {
				return childFocusableElements;
			}
		}

		return [];
	}

	private isVisible(element: HTMLElement): boolean {
		const style = window.getComputedStyle(element);
		return style.display !== 'none' && style.visibility !== 'hidden';
	}
}
