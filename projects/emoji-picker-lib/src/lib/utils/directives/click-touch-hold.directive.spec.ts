import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { jest } from '@jest/globals';
import { ClickActionType, PointerDeviceType } from '../models';
import { ClickTouchHoldDirective } from './click-touch-hold.directive';

if (typeof PointerEvent === 'undefined') {
	(global as any).PointerEvent = class PointerEvent extends (
		MouseEvent
	) {
		pointerType: string;

		constructor(type: string, params: any = {}) {
			super(type, params);
			this.pointerType = params.pointerType || 'mouse';
		}
	};
}

@Component({
	template: `
		<button
			id="test-button"
			chClickTouchHold
			[touchHoldTimeInMillis]="500"
			[dataAttribute]="'data-attribute'"
			(onClick)="onClick($event)"
			(onTouchHold)="onTouchHold($event)"
			data-attribute="test-value"
		>
			Test Button
		</button>
	`,
	standalone: true,
	imports: [ClickTouchHoldDirective],
})
class TestComponent {
	onClick = jest.fn();
	onTouchHold = jest.fn();
}

describe('ClickTouchHoldDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let buttonEl: HTMLElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		buttonEl = fixture.debugElement.query(By.css('#test-button'))
			.nativeElement as HTMLElement;

		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it('should emit onClick event on left click', () => {
		const pointerDownEvent = new PointerEvent('pointerdown', {
			button: 0,
			pointerType: 'mouse',
		});

		const pointerUpEvent = new PointerEvent('pointerup', {
			button: 0,
			pointerType: 'mouse',
		});

		buttonEl.dispatchEvent(pointerDownEvent);
		fixture.detectChanges();

		buttonEl.dispatchEvent(pointerUpEvent);
		fixture.detectChanges();
		jest.runAllTimers();

		expect(fixture.componentInstance.onClick).toHaveBeenCalledWith({
			event: pointerUpEvent,
			targetElement: buttonEl,
			data: 'test-value',
			pointerType: PointerDeviceType.MOUSE,
			action: ClickActionType.LEFTCLICK,
		});
	});

	it('should emit onClick event on right click', () => {
		const pointerDownEvent = new PointerEvent('pointerdown', {
			button: 2,
			pointerType: 'mouse',
		});

		const pointerUpEvent = new PointerEvent('pointerup', {
			button: 2,
			pointerType: 'mouse',
		});

		buttonEl.dispatchEvent(pointerDownEvent);
		fixture.detectChanges();

		buttonEl.dispatchEvent(pointerUpEvent);
		fixture.detectChanges();
		jest.runAllTimers();

		expect(fixture.componentInstance.onClick).toHaveBeenCalledWith({
			event: pointerUpEvent,
			targetElement: buttonEl,
			data: 'test-value',
			pointerType: PointerDeviceType.MOUSE,
			action: ClickActionType.RIGHTCLICK,
		});
	});

	it('should emit onTouchHold event after holding down', () => {
		const pointerDownEvent = new PointerEvent('pointerdown', {
			button: 0,
			pointerType: 'touch',
		});

		buttonEl.dispatchEvent(pointerDownEvent);
		fixture.detectChanges();

		jest.advanceTimersByTime(500);
		jest.runAllTimers();

		expect(
			fixture.componentInstance.onTouchHold
		).toHaveBeenCalledWith({
			event: pointerDownEvent,
			targetElement: buttonEl,
			data: 'test-value',
		});
	});

	it('should not emit onTouchHold event if released before hold time', () => {
		const pointerDownEvent = new PointerEvent('pointerdown', {
			button: 0,
			pointerType: 'touch',
		});

		buttonEl.dispatchEvent(pointerDownEvent);
		fixture.detectChanges();

		jest.advanceTimersByTime(300);
		buttonEl.dispatchEvent(
			new PointerEvent('pointerup', {
				button: 0,
				pointerType: 'touch',
			})
		);
		fixture.detectChanges();
		jest.runAllTimers();

		expect(
			fixture.componentInstance.onTouchHold
		).not.toHaveBeenCalled();
	});

	it('should emit onClick event on Enter key press', () => {
		const keyupEvent = new KeyboardEvent('keyup', { key: 'Enter' });

		buttonEl.dispatchEvent(keyupEvent);
		fixture.detectChanges();
		jest.runAllTimers();

		expect(fixture.componentInstance.onClick).toHaveBeenCalledWith({
			event: keyupEvent,
			targetElement: buttonEl,
			data: 'test-value',
			action: ClickActionType.ENTER,
		});
	});

	it('should emit onClick event on Space key press', () => {
		const keyupEvent = new KeyboardEvent('keyup', { key: ' ' });

		buttonEl.dispatchEvent(keyupEvent);
		fixture.detectChanges();
		jest.runAllTimers();

		expect(fixture.componentInstance.onClick).toHaveBeenCalledWith({
			event: keyupEvent,
			targetElement: buttonEl,
			data: 'test-value',
			action: ClickActionType.SPACE,
		});
	});

	it('should not emit onTouchHold event if scroll event is triggered', () => {
		const pointerDownEvent = new PointerEvent('pointerdown', {
			button: 0,
			pointerType: 'touch',
		});

		buttonEl.dispatchEvent(pointerDownEvent);
		fixture.detectChanges();

		buttonEl.dispatchEvent(new Event('scroll'));
		fixture.detectChanges();

		jest.advanceTimersByTime(500);
		jest.runAllTimers();

		expect(
			fixture.componentInstance.onTouchHold
		).not.toHaveBeenCalled();
	});
});
