import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { emojis } from '../data';
import { EmojiRowGenerator } from '../helpers';
import { EmojiRowGenerationConfig } from '../models';
import { EmojiPickerService } from './emoji-picker.service';

@Component({
	selector: 'app-emoji-picker-mock',
	template: `<div></div>`,
})
class EmojiPickerMockComponent {
	emojis = [...emojis];
	constructor(public emojiPickerService: EmojiPickerService) {}

	setMultiplier(value: number) {
		this.emojiPickerService.setEmojiContainerSizeMultiplier(value);
	}

	setPadding(value: number) {
		this.emojiPickerService.setPadding(value);
	}

	generateRows(config: EmojiRowGenerationConfig) {
		return this.emojiPickerService.generateEmojiRows(config);
	}

	calculateEmojiSize(
		viewportSize: number,
		emojiSize: number,
		itemSizeMultiplier: number
	) {
		return this.emojiPickerService.calculateEmojiSize(
			viewportSize,
			emojiSize,
			itemSizeMultiplier
		);
	}

	calculateEmojisPerRow(
		emojiSize: number,
		viewportSize: number,
		itemSizeMultiplier: number
	) {
		return this.emojiPickerService.calculateEmojisPerRow(
			emojiSize,
			viewportSize,
			itemSizeMultiplier
		);
	}
}

describe('EmojiPickerService', () => {
	let component: EmojiPickerMockComponent;
	let service: EmojiPickerService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [EmojiPickerMockComponent],
			providers: [EmojiPickerService],
		}).compileComponents();

		const fixture = TestBed.createComponent(EmojiPickerMockComponent);
		component = fixture.componentInstance;
		service = TestBed.inject(EmojiPickerService);
	});

	it('should calculate correct emoji size', () => {
		const viewportSize = 432;
		const emojiSize = 24;
		const itemSizeMultiplier = 1.5;

		const calculatedSize = component.calculateEmojiSize(
			viewportSize,
			emojiSize,
			itemSizeMultiplier
		);

		expect(calculatedSize).toBeCloseTo(24);
	});

	it('should calculate correct number of emojis per row', () => {
		const emojiSize1 = 24;
		const viewportSize1 = 400;
		const itemSizeMultiplier1 = 1.5;

		const emojisPerRow1 = component.calculateEmojisPerRow(
			emojiSize1,
			viewportSize1,
			itemSizeMultiplier1
		);

		const emojiSize2 = 16;
		const viewportSize2 = 300;
		const itemSizeMultiplier2 = 2;

		const emojisPerRow2 = component.calculateEmojisPerRow(
			emojiSize2,
			viewportSize2,
			itemSizeMultiplier2
		);

		const emojiSize3 = 34;
		const viewportSize3 = 800;
		const itemSizeMultiplier3 = 1.5;

		const emojisPerRow3 = component.calculateEmojisPerRow(
			emojiSize3,
			viewportSize3,
			itemSizeMultiplier3
		);

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
			emojis: emojis.splice(0, 50),
		};

		const generatorSpy = jest.spyOn(
			EmojiRowGenerator.prototype,
			'generateEmojiRowsPerCategory'
		);

		const rows = component.generateRows(config);

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
