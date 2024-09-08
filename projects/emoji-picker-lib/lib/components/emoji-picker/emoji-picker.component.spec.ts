import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EmojiPickerComponent } from './emoji-picker.component';
import { Emoji, SkintoneSetting } from './models';
import { EmojiDataService } from './services';

describe('EmojiPickerComponent', () => {
    let fixture: ComponentFixture<EmojiPickerComponent>;
    let component: EmojiPickerComponent;
    let emojiDataService: EmojiDataService; // Real service instance

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                EmojiPickerComponent // Import the standalone component
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EmojiPickerComponent);
        component = fixture.componentInstance;
        emojiDataService = TestBed.inject(EmojiDataService);

        fixture.detectChanges();
    });

    it('should create the emoji picker component', () => {
        expect(component).toBeTruthy();
    });

    it('should display emoji categories correctly', () => {
        const emojiTabs = fixture.debugElement.query(By.css('ch-emoji-tabs'));
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
        const addEmojiToSuggestionsSpy = jest.spyOn(component, 'addEmojiToSuggestions');
        const testEmoji: Emoji = {
            id: '1',
            name: 'smile',
            value: '😊',
            category: 'smileys-people',
            order: 1
        };

        component.selectEmoji(testEmoji);
        fixture.detectChanges();

        expect(addEmojiToSuggestionsSpy).toHaveBeenCalledWith(testEmoji.id);
    });

    it('should open skintone dialog and set the selected emoji', () => {
        const testEmoji: Emoji = {
            id: '1',
            name: 'smile',
            value: '😊',
            category: 'smileys-people',
            order: 1
        };

        const mockTargetElement = document.createElement('div'); // Mock the target element

        // Call the openSkintoneDialog method
        component['openSkintoneDialog'](mockTargetElement, testEmoji);

        // Verify that the selectedEmoji signal is set
        expect(component.selectedEmoji()).toEqual(testEmoji);

        // Verify that the targetElement is set
        expect(component.targetElement).toBe(mockTargetElement);

        // Verify that isSkintoneDialogVisible is set to true
        expect(component.isSkintoneDialogVisible()).toBe(true);
    });

    it('should update emoji skintone and select emoji when skintone is changed', () => {
        const testEmoji: Emoji = {
            id: '2',
            name: 'thumbs up',
            value: '👍',
            category: 'smileys-people',
            order: 1
        };
        const newEmojiValue = '👍🏽';
        const skintoneSetting: SkintoneSetting = 'individual';

        const updateEmojiSkintoneSpy = jest.spyOn(emojiDataService, 'updateEmojiSkintone');

        const selectEmojiSpy = jest.spyOn(component, 'selectEmoji');

        component['handleIndividualEmojiSkintoneChanged'](skintoneSetting, testEmoji, newEmojiValue);

        expect(updateEmojiSkintoneSpy).toHaveBeenCalledWith(testEmoji.id, newEmojiValue);

        expect(selectEmojiSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                id: testEmoji.id,
                value: newEmojiValue
            })
        );
    });
});
