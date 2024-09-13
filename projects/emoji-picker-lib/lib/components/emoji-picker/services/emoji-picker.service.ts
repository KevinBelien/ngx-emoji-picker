import { inject, Injectable, signal } from '@angular/core';
import { NumberHelper } from '@chit-chat/ngx-emoji-picker/lib/utils';
import { EmojiRowGenerator } from '../helpers';
import { Emoji, EmojiPickerRow, EmojiRowGenerationConfig, EmojiSize, SuggestionEmojis } from '../models';
import { EmojiDataService } from './emoji-data.service';

/**
 * A service that provides utilities for generating emoji rows, calculating emoji sizes,
 * and managing configuration settings related to the emoji picker.
 *
 * @service
 * @providedIn root
 */
@Injectable({ providedIn: 'root' })
export class EmojiPickerService {
    private dataService = inject(EmojiDataService);

    /**
     * A signal representing the map of all emojis, organized by their ID.
     *
     * @type {WritableSignal<Map<string, Emoji>>}
     */
    emojiDataMap = this.dataService.emojiMap;

    /**
     * A signal representing the multiplier used to calculate the size of each emoji item.
     * This multiplier affects the number of emojis displayed per row.
     *
     * @type {WritableSignal<number>}
     */
    emojiItemSizeMultiplier = signal<number>(1.5);

    /**
     * A signal representing the padding value (in pixels) used around the emoji container.
     *
     * @type {WritableSignal<number>}
     */
    padding = signal<number>(6);

    /**
     * Sets the emoji item size multiplier, which determines the relative size of each emoji.
     * @group Method
     * @param {number} value - The new multiplier value.
     * @returns {void}
     */
    setEmojiContainerSizeMultiplier = (value: number): void => {
        this.emojiItemSizeMultiplier.set(value);
    };

    /**
     * Sets the padding around the emoji container.
     * @group Method
     * @param {number} value - The new padding value in pixels.
     * @returns {void}
     */
    setPadding = (value: number): void => {
        this.padding.set(value);
    };

    /**
     * Generates emoji rows based on the provided configuration.
     * @group Method
     * @param {EmojiRowGenerationConfig} config - The configuration object for generating emoji rows.
     * @returns {EmojiPickerRow[]} The generated emoji rows.
     */
    generateEmojiRows = ({ emojiSize, viewportWidth, itemSizeMultiplier, generateCategoryRows, type, emojis }: EmojiRowGenerationConfig): EmojiPickerRow[] => {
        const emojisPerRow = this.calculateEmojisPerRow(emojiSize, viewportWidth, itemSizeMultiplier);

        switch (type) {
            case 'suggestions':
                return this.generateSuggestionRows(emojis, emojisPerRow, generateCategoryRows);
            case 'filter':
                return this.generateFilterRows(emojis, emojisPerRow, generateCategoryRows);
            default:
                return this.generateDefaultEmojiRows(emojis, emojisPerRow, generateCategoryRows);
        }
    };

    /**
     * Generates rows for filtered emojis based on a search result or filter criteria.
     * @group Method
     * @param {Emoji[]} emojis - The list of filtered emojis.
     * @param {number} emojisPerRow - The number of emojis to display per row.
     * @param {boolean} [generateCategoryRows=true] - Whether to generate category rows.
     * @returns {EmojiPickerRow[]} The generated rows of filtered emojis.
     */
    generateFilterRows = (emojis: Emoji[], emojisPerRow: number, generateCategoryRows: boolean = true): EmojiPickerRow[] => {
        const generator = new EmojiRowGenerator({
            emojisPerRow,
            generateCategoryRows
        });
        return generator.generateEmojiRowsPerCategory(
            {
                category: 'search'
            },
            emojis
        );
    };

    /**
     * Generates rows for suggested emojis based on recent or frequent usage.
     * @group Method
     * @param {SuggestionEmojis} suggestionEmojis - The suggestion emojis to display.
     * @param {number} emojisPerRow - The number of emojis to display per row.
     * @param {boolean} [generateCategoryRows=true] - Whether to generate category rows.
     * @returns {EmojiPickerRow[]} The generated rows of suggested emojis.
     */
    generateSuggestionRows = (suggestionEmojis: SuggestionEmojis, emojisPerRow: number, generateCategoryRows: boolean = true): EmojiPickerRow[] => {
        const generator = new EmojiRowGenerator({
            emojisPerRow,
            generateCategoryRows
        });
        return generator.generateEmojiRowsPerCategory(
            {
                category: 'suggestions',
                translationKey: `emojipicker.category.${suggestionEmojis.suggestionMode}`
            },
            suggestionEmojis.emojis
        );
    };

    /**
     * Generates rows for the default set of emojis, organized by category.
     * @group Method
     * @param {Emoji[]} emojis - The list of emojis to display.
     * @param {number} emojisPerRow - The number of emojis to display per row.
     * @param {boolean} [generateCategoryRows=true] - Whether to generate category rows.
     * @returns {EmojiPickerRow[]} The generated rows of default emojis.
     */
    generateDefaultEmojiRows = (emojis: Emoji[], emojisPerRow: number, generateCategoryRows: boolean = true): EmojiPickerRow[] => {
        const generator = new EmojiRowGenerator({
            emojisPerRow,
            generateCategoryRows
        });
        return generator.generateEmojiRows(emojis);
    };

    /**
     * Calculates the optimal emoji size for the given viewport and item size multiplier.
     * @group Method
     * @param {number} viewportSize - The width of the viewport in pixels.
     * @param {EmojiSize} emojiSize - The desired size of the emojis.
     * @param {number} itemSizeMultiplier - The multiplier used to calculate the size of each emoji item.
     * @returns {number} The calculated size of each emoji in pixels.
     */
    calculateEmojiSize = (viewportSize: number, emojiSize: EmojiSize, itemSizeMultiplier: number): number => {
        const idealEmojiSize = emojiSize;
        const maxEmojisPerRow = this.calculateEmojisPerRow(idealEmojiSize, viewportSize, itemSizeMultiplier);

        return NumberHelper.toFixedAndFloor(viewportSize / (maxEmojisPerRow * itemSizeMultiplier), 2);
    };

    /**
     * Calculates the number of emojis that can fit per row based on the given emoji size, viewport size, and item size multiplier.
     * @group Method
     * @param {number} emojiSize - The size of the emoji in pixels.
     * @param {number} viewportSize - The width of the viewport in pixels.
     * @param {number} itemSizeMultiplier - The multiplier used to calculate the size of each emoji item.
     * @returns {number} The number of emojis that can fit per row.
     */
    calculateEmojisPerRow = (emojiSize: number, viewportSize: number, itemSizeMultiplier: number): number => Math.floor(viewportSize / NumberHelper.toFixedAndFloor(emojiSize * itemSizeMultiplier, 2));
}
