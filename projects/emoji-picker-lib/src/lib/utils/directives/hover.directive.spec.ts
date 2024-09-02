import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HoverDirective } from './hover.directive';

@Component({
	imports: [HoverDirective],
	standalone: true,
	template: `<div chHover></div>`,
})
class TestHoverComponent {}

describe('HoverDirective', () => {
	let fixture: any;
	let directive: HoverDirective;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestHoverComponent],
		});

		fixture = TestBed.createComponent(TestHoverComponent);
		fixture.detectChanges();

		directive = fixture.debugElement
			.query(By.directive(HoverDirective))
			.injector.get(HoverDirective);
	});

	it('should create an instance of HoverDirective', () => {
		expect(directive).toBeTruthy();
	});

	it('should emit hoverChange event with isHovered true on mouseenter', () => {
		jest.spyOn(directive.hoverChange, 'emit');

		const mockEvent = new Event('mouseenter');
		directive.onMouseEnter(mockEvent);

		expect(directive.hoverChange.emit).toHaveBeenCalledWith({
			event: mockEvent,
			isHovered: true,
		});
	});

	it('should emit hoverChange event with isHovered false on mouseleave', () => {
		jest.spyOn(directive.hoverChange, 'emit');

		const mockEvent = new Event('mouseleave');
		directive.onMouseLeave(mockEvent);

		expect(directive.hoverChange.emit).toHaveBeenCalledWith({
			event: mockEvent,
			isHovered: false,
		});
	});
});
