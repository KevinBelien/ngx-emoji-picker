import { Component, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PreventContextMenuDirective } from './prevent-context-menu.directive';

@Component({
	template: `<div
		chPreventContextMenu
		[preventContextMenu]="preventContextMenu"
	></div>`,
	standalone: true,
	imports: [PreventContextMenuDirective],
})
class TestPreventContextMenuComponent {
	preventContextMenu = true; // Default to true for the tests
}

describe('PreventContextMenuDirective', () => {
	let fixture: any;
	let renderer: Renderer2;
	let divElement: any;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestPreventContextMenuComponent],
		});

		fixture = TestBed.createComponent(
			TestPreventContextMenuComponent
		);
		renderer = fixture.componentRef.injector.get(Renderer2);
		divElement = fixture.debugElement.query(By.css('div'));
		fixture.detectChanges();
	});

	it('should create an instance of PreventContextMenuDirective', () => {
		const directive = fixture.debugElement
			.query(By.directive(PreventContextMenuDirective))
			.injector.get(PreventContextMenuDirective);
		expect(directive).toBeTruthy();
	});

	it('should prevent context menu when preventContextMenu is true', () => {
		const event = new MouseEvent('contextmenu', {
			bubbles: true,
			cancelable: true,
		});
		const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

		divElement.nativeElement.dispatchEvent(event);

		expect(preventDefaultSpy).toHaveBeenCalled();
	});

	it('should allow context menu when preventContextMenu is false', () => {
		fixture.componentInstance.preventContextMenu = false;
		fixture.detectChanges();

		const event = new MouseEvent('contextmenu', {
			bubbles: true,
			cancelable: true,
		});
		const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

		divElement.nativeElement.dispatchEvent(event);

		expect(preventDefaultSpy).not.toHaveBeenCalled();
	});

	it('should remove the event listener on destroy', () => {
		const directive = fixture.debugElement
			.query(By.directive(PreventContextMenuDirective))
			.injector.get(PreventContextMenuDirective);

		directive.contextMenuListener = jest.fn();

		fixture.destroy();

		expect(directive.contextMenuListener).toHaveBeenCalled();
	});
});
