import { DOCUMENT } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RippleDirective } from './ripple.directive';

@Component({
	standalone: true,
	imports: [RippleDirective],
	template: `<div chRipple [rippleEnabled]="rippleEnabled"></div>`,
})
class TestComponent {
	rippleEnabled = true;
}

describe('RippleDirective', () => {
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;
	let directiveElement: HTMLElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestComponent],
			providers: [
				Renderer2,
				{ provide: DOCUMENT, useValue: document },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		directiveElement = fixture.nativeElement.querySelector('div');

		fixture.detectChanges();
	});

	it('should create the directive', () => {
		expect(directiveElement).toBeTruthy();
	});

	it('should not create ripple effect when rippleEnabled is false', () => {
		component.rippleEnabled = false;
		fixture.detectChanges();

		const event = new MouseEvent('pointerdown');
		directiveElement.dispatchEvent(event);

		expect(directiveElement.querySelector('.ch-ink')).toBeNull();
	});

	it('should create ripple effect when rippleEnabled is true', () => {
		component.rippleEnabled = true;
		fixture.detectChanges();

		const event = new MouseEvent('pointerdown');
		directiveElement.dispatchEvent(event);

		expect(directiveElement.querySelector('.ch-ink')).not.toBeNull();
	});

	it('should remove the previous ink element before creating a new one', () => {
		component.rippleEnabled = true;
		fixture.detectChanges();

		let event = new MouseEvent('pointerdown');
		directiveElement.dispatchEvent(event);

		let inkElement = directiveElement.querySelector(
			'.ch-ink'
		) as HTMLElement;
		expect(inkElement).not.toBeNull();

		event = new MouseEvent('pointerdown');
		directiveElement.dispatchEvent(event);

		const newInkElement = directiveElement.querySelector(
			'.ch-ink'
		) as HTMLElement;
		expect(newInkElement).not.toBe(inkElement);
	});
});
