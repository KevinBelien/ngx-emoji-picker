import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button.component';
import { ButtonIconProps } from './models';

@Component({
	imports: [ButtonComponent],
	standalone: true,
	template: `<ch-button
		[disabled]="disabled"
		[icon]="icon"
		[label]="label"
		[focusStateEnabled]="focusStateEnabled"
		[activeStateEnabled]="activeStateEnabled"
		[hoverStateEnabled]="hoverStateEnabled"
	>
	</ch-button>`,
})
class TestButtonComponent {
	disabled: boolean = false;
	label?: string;
	icon?: Partial<ButtonIconProps>;
	focusStateEnabled: boolean = true;
	activeStateEnabled: boolean = true;
	hoverStateEnabled: boolean = true;
}

describe('Button', () => {
	let fixture: ComponentFixture<TestButtonComponent>;

	beforeEach(() => {
		fixture = TestBed.createComponent(TestButtonComponent);
		fixture.autoDetectChanges();
	});

	it('should render the button element', () => {
		const buttonElement = fixture.debugElement.query(
			By.css('ch-button')
		);
		expect(buttonElement).not.toBeNull();
	});

	it('should enabled by default', () => {
		fixture.detectChanges();
		const hostButtonEl = fixture.debugElement.query(
			By.css('ch-button')
		);

		const buttonEl = fixture.debugElement.query(By.css('.ch-button'));

		expect(buttonEl.nativeElement.disabled).toBe(false);
		expect(hostButtonEl.nativeElement.className).not.toContain(
			'ch-disabled'
		);
	});

	it('should be disabled when disabled is true', () => {
		fixture.componentInstance.disabled = true;
		fixture.detectChanges();

		const hostButtonEl = fixture.debugElement.query(
			By.css('ch-button')
		);
		const buttonEl = fixture.debugElement.query(By.css('.ch-button'));

		expect(buttonEl.nativeElement.disabled).toBeTruthy();
		expect(hostButtonEl.nativeElement.className).toContain(
			'ch-disabled'
		);
	});

	it('should display the label and have text only', () => {
		fixture.componentInstance.label = 'ChitChat';
		fixture.detectChanges();

		const buttonEl = fixture.debugElement.query(By.css('.ch-button'));
		expect(buttonEl.nativeElement.textContent).toContain('ChitChat');
		expect(buttonEl.nativeElement.children.length).toEqual(1);
	});

	it('should display the icon when provided', () => {
		fixture.componentInstance.icon = {
			path: 'M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z',
		};
		fixture.detectChanges();

		const iconEl = fixture.debugElement.query(By.css('ch-icon'));
		expect(iconEl).not.toBeNull();
	});

	it('should display the icon to be on the left by default ', () => {
		fixture.componentInstance.label = 'ChitChat';
		fixture.componentInstance.icon = {
			path: 'M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z',
		};
		fixture.detectChanges();

		const buttonEl = fixture.debugElement.query(By.css('.ch-button'));
		expect(buttonEl.nativeElement.children[0].className).toContain(
			'ch-button-icon-left'
		);
	});

	it('should display the icon on the right and have a label', () => {
		fixture.componentInstance.label = 'ChitChat';
		fixture.componentInstance.icon = {
			path: 'M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z',
			position: 'right',
		};

		fixture.detectChanges();

		const buttonEl = fixture.debugElement.query(By.css('.ch-button'));
		expect(buttonEl.nativeElement.children[0].className).toContain(
			'ch-button-icon-right'
		);
		expect(buttonEl.nativeElement.children[1].textContent).toContain(
			'ChitChat'
		);
	});

	it('should be hoverable, focusable and active by default', () => {
		fixture.detectChanges(); // Trigger initial data binding

		const buttonEl = fixture.debugElement.query(By.css('.ch-button'));

		expect(buttonEl.nativeElement.className).not.toContain(
			'ch-hover-state-disabled'
		);

		buttonEl.nativeElement.focus();
		expect(document.activeElement).toBe(buttonEl.nativeElement);
		expect(buttonEl.nativeElement.className).not.toContain(
			'ch-focus-state-disabled'
		);

		buttonEl.nativeElement.click();
		expect(buttonEl.nativeElement.className).not.toContain(
			'ch-active-state-disabled'
		);
	});

	it('should not look focused when focusStateEnabled is false', () => {
		fixture.componentInstance.focusStateEnabled = false;
		fixture.detectChanges();

		const buttonEl = fixture.debugElement.query(By.css('.ch-button'));

		buttonEl.nativeElement.focus();

		expect(buttonEl.nativeElement.className).toContain(
			'ch-focus-state-disabled'
		);
	});

	it('should not look active when activeStateEnabled is false', () => {
		fixture.componentInstance.activeStateEnabled = false;
		fixture.detectChanges();

		const buttonEl = fixture.debugElement.query(By.css('.ch-button'));

		buttonEl.nativeElement.click();

		expect(buttonEl.nativeElement.className).toContain(
			'ch-active-state-disabled'
		);
	});

	it('should not look hovered when hoverStateEnabled is false', () => {
		fixture.componentInstance.hoverStateEnabled = false;
		fixture.detectChanges();

		const buttonEl = fixture.debugElement.query(By.css('.ch-button'));

		buttonEl.nativeElement.click();

		expect(buttonEl.nativeElement.className).toContain(
			'ch-hover-state-disabled'
		);
	});
});
