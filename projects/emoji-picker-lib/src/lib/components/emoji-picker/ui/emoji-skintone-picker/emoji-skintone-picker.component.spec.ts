import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Emoji } from '../../models';
import { EmojiSkintonePickerComponent } from './emoji-skintone-picker.component';

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
	imports: [EmojiSkintonePickerComponent],
	standalone: true,
	template: `<ch-emoji-skintone-picker
		[emoji]="emoji"
		[emojiSizeInPx]="emojiSizeInPx"
		[emojiButtonSizeInPx]="emojiButtonSizeInPx"
		(onSelectionChanged)="handleSelectionChanged($event)"
	></ch-emoji-skintone-picker>`,
})
class TestEmojiSkintonePickerComponent {
	emoji: Emoji | null = null;
	emojiSizeInPx?: number;
	emojiButtonSizeInPx?: number;

	handleSelectionChanged = jest.fn();
}

describe('EmojiSkintonePickerComponent', () => {
	let fixture: ComponentFixture<TestEmojiSkintonePickerComponent>;

	const testEmoji: Emoji = {
		id: '4ab8a84b-5dba-4108-b8dc-ffca70cf8f81',
		name: 'heart hands',
		value: '🫶',
		category: 'smileys-people',
		order: 92,
		skintones: [
			{ skintone: 'default', value: '🫶', order: 1 },
			{ skintone: 'light', value: '🫶🏻', order: 2 },
			{ skintone: 'medium-light', value: '🫶🏼', order: 3 },
			{ skintone: 'medium', value: '🫶🏽', order: 4 },
			{ skintone: 'medium-dark', value: '🫶🏾', order: 5 },
			{ skintone: 'dark', value: '🫶🏿', order: 6 },
		],
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestEmojiSkintonePickerComponent], // Use imports for standalone components/directives
		}).compileComponents();

		fixture = TestBed.createComponent(
			TestEmojiSkintonePickerComponent
		);
		fixture.autoDetectChanges();

		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it('should render the emoji skintone picker element', () => {
		const pickerElement = fixture.debugElement.query(
			By.css('ch-emoji-skintone-picker')
		);
		expect(pickerElement).not.toBeNull();
	});

	it('should render emoji buttons based on skintones provided', () => {
		fixture.componentInstance.emoji = testEmoji;
		fixture.detectChanges();

		const emojiButtons = fixture.debugElement.queryAll(
			By.css('ch-emoji-button')
		);
		expect(emojiButtons.length).toBe(testEmoji.skintones?.length);
	});

	it('should emit event when an emoji button is clicked', () => {
		fixture.componentInstance.emoji = testEmoji;
		fixture.detectChanges();

		const emojiButtonDebugElement = fixture.debugElement.query(
			By.css('ch-emoji-button')
		);
		expect(emojiButtonDebugElement).not.toBeNull();

		if (emojiButtonDebugElement) {
			const containerDiv = fixture.debugElement.query(
				By.css('.skintone-picker-container')
			);
			expect(containerDiv).not.toBeNull();

			const pointerDownEvent = new PointerEvent('pointerdown', {
				button: 0,
				pointerType: 'mouse',
			});

			const pointerUpEvent = new PointerEvent('pointerup', {
				button: 0,
				pointerType: 'mouse',
			});

			containerDiv.nativeElement.dispatchEvent(pointerDownEvent);
			fixture.detectChanges();

			containerDiv.nativeElement.dispatchEvent(pointerUpEvent);
			fixture.detectChanges();
			jest.useFakeTimers();

			expect(
				fixture.componentInstance.handleSelectionChanged
			).toHaveBeenCalled();
		}
	});

	it('should apply the correct emoji size and button size styles', () => {
		fixture.componentInstance.emojiSizeInPx = 24;
		fixture.componentInstance.emojiButtonSizeInPx = 48;
		fixture.detectChanges();

		const pickerElement = fixture.debugElement.query(
			By.css('ch-emoji-skintone-picker')
		);

		expect(
			parseFloat(
				pickerElement.nativeElement.style.getPropertyValue(
					'--ch-emoji-fontsize'
				)
			)
		).toBe(24);
		expect(
			parseFloat(
				pickerElement.nativeElement.style.getPropertyValue(
					'--ch-emoji-buttonsize'
				)
			)
		).toBe(48);
	});

	it('should not emit event on right-click', () => {
		fixture.componentInstance.emoji = testEmoji;
		fixture.detectChanges();

		const emojiButtonDebugElement = fixture.debugElement.query(
			By.css('ch-emoji-button')
		);
		expect(emojiButtonDebugElement).not.toBeNull();

		if (emojiButtonDebugElement) {
			const containerDiv = fixture.debugElement.query(
				By.css('.skintone-picker-container')
			);
			expect(containerDiv).not.toBeNull();

			const pointerDownEvent = new PointerEvent('pointerdown', {
				button: 2,
				pointerType: 'mouse',
			});

			const pointerUpEvent = new PointerEvent('pointerup', {
				button: 2,
				pointerType: 'mouse',
			});

			containerDiv.nativeElement.dispatchEvent(pointerDownEvent);
			fixture.detectChanges();

			containerDiv.nativeElement.dispatchEvent(pointerUpEvent);
			fixture.detectChanges();
			jest.runAllTimers();

			expect(
				fixture.componentInstance.handleSelectionChanged
			).not.toHaveBeenCalled();
		}
	});
});
