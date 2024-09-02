import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { jest } from '@jest/globals';
import { AutofocusDirective } from './autofocus.directive';

@Component({
	template: `
		<button
			id="autofocus-button"
			chAutofocus
			[autofocus]="autofocus()"
		>
			Click me
		</button>
	`,
	standalone: true,
	imports: [AutofocusDirective],
})
class TestComponent {
	autofocus = signal(true);
}

describe('AutofocusDirective', () => {
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it('should add autofocus attribute when autofocus is true', () => {
		fixture.componentInstance.autofocus.set(true);
		fixture.detectChanges();

		const buttonEl = fixture.debugElement.query(
			By.css('#autofocus-button')
		);
		expect(buttonEl.nativeElement.getAttribute('autofocus')).toBe(
			'true'
		);
	});

	it('should remove autofocus attribute when autofocus is false', () => {
		fixture.componentInstance.autofocus.set(false);
		fixture.detectChanges();

		const buttonEl = fixture.debugElement.query(
			By.css('#autofocus-button')
		);
		expect(
			buttonEl.nativeElement.getAttribute('autofocus')
		).toBeNull();
	});

	it('should focus the button element when autofocus is true', () => {
		fixture.componentInstance.autofocus.set(true);
		fixture.detectChanges();

		const buttonEl = fixture.debugElement.query(
			By.css('#autofocus-button')
		);
		const focusSpy = jest.spyOn(buttonEl.nativeElement, 'focus');

		jest.runAllTimers();

		expect(focusSpy).toHaveBeenCalled();
	});

	it('should not focus the button element when autofocus is false', () => {
		fixture.componentInstance.autofocus.set(false);
		fixture.detectChanges();

		const buttonEl = fixture.debugElement.query(
			By.css('#autofocus-button')
		);
		const focusSpy = jest.spyOn(buttonEl.nativeElement, 'focus');

		jest.runAllTimers();

		expect(focusSpy).not.toHaveBeenCalled();
	});
});
