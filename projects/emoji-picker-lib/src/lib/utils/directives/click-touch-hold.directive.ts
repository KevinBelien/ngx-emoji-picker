import {
	DestroyRef,
	Directive,
	ElementRef,
	inject,
	input,
	OnInit,
	output,
	Renderer2,
	signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import {
	ClickActionType,
	ClickEvent,
	PointerDeviceType,
	TouchHoldEvent,
} from '../models';

/**
 * ClickTouchHold handles click, touch, and hold events on an element.
 * It allows you to detect regular clicks, right-clicks, and long-press (touch hold) interactions,
 * and emits corresponding events.
 * @directive
 * @selector [chClickTouchHold]
 */
@Directive({
	selector: '[chClickTouchHold]',
	standalone: true,
})
export class ClickTouchHoldDirective implements OnInit {
	private renderer = inject(Renderer2);
	private elementRef = inject(ElementRef);
	private destroyRef = inject(DestroyRef);

	/**
	 * The duration (in milliseconds) required for a touch to be recognized as a "hold."
	 * @group Props
	 * @default 500
	 */
	touchHoldTimeInMillis = input<number>(500);

	/**
	 * The data attribute used to identify elements for click and touch interactions.
	 * @group Props
	 */
	dataAttribute = input<string>();

	/**
	 * Event emitted when a click interaction is detected.
	 * @group Outputs
	 * @type {EventEmitter<ClickEvent>} -The click event
	 */
	onClick = output<ClickEvent>();

	/**
	 * Event emitted when a touch hold interaction is detected.
	 * @group Outputs
	 * @type {EventEmitter<TouchHoldEvent>} - the touch hold event
	 */
	onTouchHold = output<TouchHoldEvent>();

	private pointerDown$ = new Subject<PointerEvent>();
	private pointerUp$ = new Subject<PointerEvent>();
	private pointerMove$ = new Subject<PointerEvent>();
	private touchMove$ = new Subject<TouchEvent>();
	private scroll$ = new Subject<void>();

	private pointerDownTarget = signal<EventTarget | null>(null);
	private pointerDownDataAttribute = signal<string | null>(null);

	private eventListeners: Array<() => void> = [];

	ngOnInit(): void {
		this.addEventListeners();

		this.pointerDown$
			.pipe(
				switchMap((event) =>
					timer(this.touchHoldTimeInMillis()).pipe(
						takeUntil(this.pointerUp$),
						takeUntil(this.pointerMove$),
						takeUntil(this.touchMove$),
						takeUntil(this.scroll$),
						tap(() => this.handleTouchHold(event))
					)
				),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();

		this.pointerUp$
			.pipe(
				tap((event) => this.handlePointerUp(event)),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		this.removeEventListeners();
	}

	private addEventListeners = (): void => {
		const nativeElement = this.elementRef.nativeElement;

		this.eventListeners = [
			this.renderer.listen(
				nativeElement,
				'pointerdown',
				(event: PointerEvent) => {
					this.onPointerDown(event);
				}
			),
			this.renderer.listen(
				nativeElement,
				'pointerup',
				(event: PointerEvent) => {
					this.onPointerUp(event);
				}
			),

			this.renderer.listen(nativeElement, 'scroll', () =>
				this.scroll$.next()
			),

			this.renderer.listen(
				nativeElement,
				'keyup',
				(event: KeyboardEvent) => this.onKeyUp(event)
			),
		];
	};

	private removeEventListeners = (): void => {
		this.eventListeners.forEach((unlisten) => unlisten());
	};

	private onPointerDown = (event: PointerEvent): void => {
		if (!this.isPointerDownValid(event) || !event.target) return;

		const targetElement = this.findElementByAttribute(
			event.target as HTMLElement
		);
		if (targetElement) {
			this.pointerDownTarget.set(targetElement);
			this.pointerDownDataAttribute.set(
				this.getAttributeValue(targetElement)
			);
			this.pointerDown$.next(event);
		}
	};

	private onPointerUp = (event: PointerEvent): void => {
		if (this.isPointerUpValid(event)) this.pointerUp$.next(event);

		this.pointerDownTarget.set(null);
		this.pointerDownDataAttribute.set(null);
	};

	private onKeyUp = (event: KeyboardEvent): void => {
		if (!event.target) return;

		const targetElement = this.findElementByAttribute(
			event.target as HTMLElement
		);
		if (this.isClickTriggerKey(event.key) && targetElement) {
			const data = this.getAttributeValue(targetElement);
			this.onClick.emit({
				event,
				targetElement,
				data,
				action:
					event.key === 'Enter'
						? ClickActionType.ENTER
						: ClickActionType.SPACE,
			});
		}
	};

	private handleTouchHold = (event: PointerEvent): void => {
		if (!event.target) return;

		const targetElement = this.findElementByAttribute(
			event.target as HTMLElement
		);
		if (!targetElement) return;

		const data = this.getAttributeValue(targetElement);
		if (this.isTargetDataAttributeMatch(targetElement, data)) {
			this.onTouchHold.emit({ event, data, targetElement });
		}
	};

	private handlePointerUp = (event: PointerEvent): void => {
		if (!event.target) return;

		const targetElement = this.findElementByAttribute(
			event.target as HTMLElement
		);
		if (!targetElement) return;

		const data = this.getAttributeValue(targetElement);
		this.onClick.emit({
			event,
			targetElement,
			data,
			pointerType: event.pointerType as PointerDeviceType,
			action:
				event.pointerType === PointerDeviceType.MOUSE
					? event.button === 0
						? ClickActionType.LEFTCLICK
						: ClickActionType.RIGHTCLICK
					: undefined,
		});
	};

	private findElementByAttribute = (
		targetElement: HTMLElement
	): HTMLElement | null => {
		const dataAttribute = this.dataAttribute();
		while (
			targetElement &&
			dataAttribute &&
			!targetElement.hasAttribute(dataAttribute) &&
			targetElement.parentElement
		) {
			targetElement = targetElement.parentElement;
		}
		return targetElement;
	};

	private getAttributeValue = (
		targetElement: HTMLElement
	): string | null => {
		const dataAttribute = this.dataAttribute();
		if (!targetElement || !dataAttribute) return null;
		const elementWithAttribute =
			this.findElementByAttribute(targetElement);
		return elementWithAttribute
			? elementWithAttribute.getAttribute(dataAttribute)
			: null;
	};

	private isTargetDataAttributeMatch = (
		targetElement: HTMLElement,
		data?: string | null
	): boolean => {
		const dataAttribute = this.dataAttribute();

		return (
			!dataAttribute ||
			(targetElement.hasAttribute(dataAttribute) &&
				this.pointerDownDataAttribute() === data)
		);
	};

	private isPointerDownValid = (event: PointerEvent): boolean => {
		return (
			(event.pointerType === PointerDeviceType.MOUSE &&
				[0, 2].includes(event.button)) ||
			(event.pointerType !== PointerDeviceType.MOUSE &&
				event.button === 0)
		);
	};

	private isPointerUpValid = (event: PointerEvent): boolean => {
		const targetElement = this.findElementByAttribute(
			event.target as HTMLElement
		);
		if (!targetElement) return false;

		const pointerUpDataAttribute =
			this.getAttributeValue(targetElement);
		return this.pointerDownDataAttribute() === pointerUpDataAttribute;
	};

	private isClickTriggerKey = (key: string): boolean =>
		['ENTER', ' '].includes(key.toUpperCase());
}
