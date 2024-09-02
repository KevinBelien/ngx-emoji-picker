import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EmojiButtonComponent } from './emoji-button.component';

@Component({
	imports: [EmojiButtonComponent],
	standalone: true,
	template: `<ch-emoji-button
		[emoji]="emoji"
		[showSkintoneIndicator]="showSkintoneIndicator"
	></ch-emoji-button>`,
})
class TestEmojiButtonComponent {
	emoji = '😀';
	showSkintoneIndicator = false;
}

describe('EmojiButtonComponent', () => {
	let fixture: ComponentFixture<TestEmojiButtonComponent>;
	let component: TestEmojiButtonComponent;

	beforeEach(() => {
		fixture = TestBed.createComponent(TestEmojiButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the test component', () => {
		expect(component).toBeTruthy();
	});

	it('should display the emoji passed to it', () => {
		const buttonElement = fixture.debugElement.query(
			By.css('.ch-emoji')
		);
		expect(buttonElement.nativeElement.textContent).toBe('😀');
	});

	it('should not show the skintone indicator by default', () => {
		const buttonElement = fixture.debugElement.query(
			By.css('button')
		);
		expect(buttonElement.nativeElement.className).not.toContain(
			'ch-emoji-variation-indicator'
		);
	});

	it('should show the skintone indicator when showSkintoneIndicator is true', () => {
		component.showSkintoneIndicator = true;
		fixture.detectChanges();

		const buttonElement = fixture.debugElement.query(
			By.css('button')
		);
		expect(buttonElement.nativeElement.className).toContain(
			'ch-emoji-variation-indicator'
		);
	});

	it('should update the displayed emoji when the input changes', () => {
		component.emoji = '👍';
		fixture.detectChanges();

		const buttonElement = fixture.debugElement.query(
			By.css('.ch-emoji')
		);
		expect(buttonElement.nativeElement.textContent).toBe('👍');
	});
});
