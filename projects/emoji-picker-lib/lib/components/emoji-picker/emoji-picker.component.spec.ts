import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EmojiPickerComponent } from './emoji-picker.component';
import { Emoji, SkintoneSetting, StorageConfig } from './models';
import { EmojiDataService } from './services';

@Component({
    template: ` <ch-emoji-picker [storageOptions]="storageConfig"></ch-emoji-picker> `,
    standalone: true,
    imports: [EmojiPickerComponent]
})
class TestHostComponent {
    @ViewChild(EmojiPickerComponent)
    emojiPicker?: EmojiPickerComponent;
    storageConfig?: StorageConfig;
}

describe('EmojiPickerSuggestions', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: EmojiPickerComponent;
    let emojiDataService: EmojiDataService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);

        const debugElement = fixture.debugElement.query(By.directive(EmojiPickerComponent));
        component = debugElement.componentInstance;

        emojiDataService = TestBed.inject(EmojiDataService);

        fixture.detectChanges();
    });

    // it('should update the suggestionEmojis when storageConfig changes', fakeAsync(() => {
    //     // Set initial storageConfig and trigger change detection
    //     fixture.componentInstance.storageConfig = {
    //         suggestionEmojis: {
    //             storage: 'localstorage',
    //             limit: 50
    //         }
    //     };
    //     fixture.detectChanges();
    //     tick(); // Simulates the passage of time

    //     // Modify the storageConfig to trigger the signal update
    //     fixture.componentInstance.storageConfig = {
    //         suggestionEmojis: {
    //             storage: 'custom',
    //             value: ['women-holding-hands', 'men-holding-hands']
    //         }
    //     };

    //     fixture.detectChanges();
    //     tick(); // Ensures that the computed signal has updated

    //     const suggestionEmojis = component.suggestionEmojis();
    //     console.log(suggestionEmojis);
    //     expect(suggestionEmojis).not.toBeNull();
    //     expect(suggestionEmojis!.emojis.map((emoji) => emoji.id)).toStrictEqual(['women-holding-hands', 'men-holding-hands']);
    // }));

    it('should use custom suggested emojis when configured', () => {
        // Set storageConfig to trigger change detection and recomputation of the computed signal
        fixture.componentInstance.storageConfig = {
            suggestionEmojis: { storage: 'custom', value: ['women-holding-hands', 'men-holding-hands'] }
        };

        fixture.detectChanges();

        fixture.detectChanges(); // Trigger change detection again

        const suggestionEmojis = component.suggestionEmojis();

        expect(suggestionEmojis).not.toBeNull();
        expect(suggestionEmojis!.emojis.map((emoji) => emoji.id)).toStrictEqual(['women-holding-hands', 'men-holding-hands']);
    });
});

describe('EmojiPickerComponent', () => {
    let fixture: ComponentFixture<EmojiPickerComponent>;
    let component: EmojiPickerComponent;
    let emojiDataService: EmojiDataService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent]
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
        const saveSuggestionEmojiInStorageSpy = jest.spyOn(component, 'saveSuggestionEmojiInStorage');
        const testEmoji: Emoji = {
            id: '1',
            name: 'smile',
            value: '😊',
            category: 'smileys-people',
            order: 1
        };

        component.selectEmoji(testEmoji);
        fixture.detectChanges();

        expect(saveSuggestionEmojiInStorageSpy).toHaveBeenCalledWith(testEmoji.id);
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

        const updateEmojiSkintoneSpy = jest.spyOn(emojiDataService, 'updateEmojiSkintoneInStorage');

        const selectEmojiSpy = jest.spyOn(component, 'selectEmoji');

        component['handleIndividualEmojiSkintoneChanged'](skintoneSetting, testEmoji, newEmojiValue);

        expect(updateEmojiSkintoneSpy).toHaveBeenCalledWith(testEmoji.id, newEmojiValue);

        expect(selectEmojiSpy).toHaveBeenCalled();
    });
});
