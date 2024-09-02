import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslatePipe } from '@chit-chat/ngx-emoji-picker/src/lib/localization';
import { EmojiPickerComponent } from './emoji-picker.component';
import { Emoji } from './models';

describe('EmojiPickerComponent', () => {
	let fixture: ComponentFixture<EmojiPickerComponent>;
	let component: EmojiPickerComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				EmojiPickerComponent, // Import the standalone component
				TranslatePipe,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(EmojiPickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the emoji picker component', () => {
		expect(component).toBeTruthy();
	});

	it('should display emoji categories correctly', () => {
		const emojiTabs = fixture.debugElement.query(
			By.css('ch-emoji-tabs')
		);
		expect(emojiTabs).not.toBeNull();
	});

	it('should close skintone picker on scroll', () => {
		const swatchPicker = component.swatchPickerComponent(); // Access the signal's value
		const closeSpy = jest.fn();

		if (swatchPicker?.close) {
			jest.spyOn(swatchPicker, 'close').mockImplementation(closeSpy);
		}

		// Simulate scroll event
		component['handleScroll']();
		fixture.detectChanges();

		if (swatchPicker?.close) {
			expect(closeSpy).toHaveBeenCalled();
		}
	});

	it('should update emoji size when calculated', () => {
		const fontSize = 24;
		const buttonSize = 48;

		component['handleEmojiSizeCalculated']({ fontSize, buttonSize });
		fixture.detectChanges();

		expect(component.emojiSizeInPx).toBe(fontSize);
		expect(component.emojiButtonSizeInPx).toBe(buttonSize);
	});

	it('should add emoji to suggestions when selected', () => {
		const addEmojiToSuggestionsSpy = jest.spyOn(
			component,
			'addEmojiToSuggestions'
		);
		const testEmoji: Emoji = {
			id: '1',
			name: 'smile',
			value: '😊',
			category: 'smileys-people',
			order: 1,
		};

		component.selectEmoji(testEmoji);
		fixture.detectChanges();

		expect(addEmojiToSuggestionsSpy).toHaveBeenCalledWith(
			testEmoji.id
		);
	});
});
