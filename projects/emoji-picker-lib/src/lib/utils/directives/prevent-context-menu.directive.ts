import {
	DestroyRef,
	Directive,
	ElementRef,
	inject,
	input,
	OnInit,
	Renderer2,
} from '@angular/core';

/**
 * A directive that prevents the context menu (right-click menu) from appearing on an element.
 * @directive
 * @selector [chPreventContextMenu]
 */
@Directive({
	selector: '[chPreventContextMenu]',
	standalone: true,
})
export class PreventContextMenuDirective implements OnInit {
	private renderer = inject(Renderer2);
	private elementRef = inject(ElementRef);
	private destroyref = inject(DestroyRef);

	/**
	 * Controls whether the context menu should be prevented from appearing.
	 *
	 * @group Props
	 * @default true
	 */
	preventContextMenu = input<boolean>(true);

	private contextMenuListener?: () => void;

	ngOnInit(): void {
		this.renderer.listen(
			this.elementRef.nativeElement,
			'contextmenu',
			(event: MouseEvent) => {
				if (this.preventContextMenu()) event.preventDefault();
			}
		);

		this.destroyref.onDestroy(() => {
			if (!!this.contextMenuListener) {
				this.contextMenuListener();
			}
		});
	}
}
