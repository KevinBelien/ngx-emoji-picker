import { TestBed } from '@angular/core/testing';
import { emojis } from '../data';
import { EmojiRowGenerator } from '../helpers';
import { EmojiRowGenerationConfig } from '../models';
import { EmojiPickerService } from './emoji-picker.service';

describe('EmojiPickerService', () => {
    let service: EmojiPickerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EmojiPickerService]
        });

        service = TestBed.inject(EmojiPickerService);
    });

    it('should calculate correct emoji size', () => {
        const viewportSize = 432;
        const emojiSize = 24;
        const itemSizeMultiplier = 1.5;

        const calculatedSize = service.calculateEmojiSize(viewportSize, emojiSize, itemSizeMultiplier);

        expect(calculatedSize).toBeCloseTo(24);
    });

    it('should calculate correct number of emojis per row', () => {
        const emojiSize1 = 24;
        const viewportSize1 = 400;
        const itemSizeMultiplier1 = 1.5;

        const emojisPerRow1 = service.calculateEmojisPerRow(emojiSize1, viewportSize1, itemSizeMultiplier1);

        const emojiSize2 = 16;
        const viewportSize2 = 300;
        const itemSizeMultiplier2 = 2;

        const emojisPerRow2 = service.calculateEmojisPerRow(emojiSize2, viewportSize2, itemSizeMultiplier2);

        const emojiSize3 = 34;
        const viewportSize3 = 800;
        const itemSizeMultiplier3 = 1.5;

        const emojisPerRow3 = service.calculateEmojisPerRow(emojiSize3, viewportSize3, itemSizeMultiplier3);

        expect(emojisPerRow1).toEqual(11);
        expect(emojisPerRow2).toEqual(9);
        expect(emojisPerRow3).toEqual(15);
    });

    it('should generate the right amount emoji rows based on config', () => {
        const config: EmojiRowGenerationConfig = {
            emojiSize: 24,
            viewportWidth: 400,
            itemSizeMultiplier: 1.5,
            generateCategoryRows: true,
            type: 'filter',
            emojis: emojis.slice(0, 50) // Use slice instead of splice to avoid modifying the original array
        };

        const generatorSpy = jest.spyOn(EmojiRowGenerator.prototype, 'generateEmojiRowsPerCategory');

        const rows = service.generateEmojiRows(config);

        expect(generatorSpy).toHaveBeenCalled();

        expect(rows.length).toBe(6);
        rows.forEach((row, index) => {
            if (row.type === 'category') return;
            else if (index === 5) {
                expect(row.value.length).toBe(6);
            } else expect(row.value.length).toBe(11);
        });
    });
});
