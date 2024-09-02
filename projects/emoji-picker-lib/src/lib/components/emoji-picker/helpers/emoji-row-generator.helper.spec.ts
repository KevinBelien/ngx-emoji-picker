import { Emoji } from '../models';
import { EmojiRowGenerator } from './emoji-row-generator.helper';

describe('EmojiRowGenerator', () => {
	const sampleEmojis: Emoji[] = [
		{
			id: '1',
			name: 'Smile',
			value: '😊',
			category: 'smileys-people',
			order: 1,
		},
		{
			id: '2',
			name: 'Dog',
			value: '🐶',
			category: 'animals-nature',
			order: 2,
		},
		{
			id: '3',
			name: 'Burger',
			value: '🍔',
			category: 'food-drink',
			order: 3,
		},
		{
			id: '4',
			name: 'Cat',
			value: '🐱',
			category: 'animals-nature',
			order: 1,
		},
		{
			id: '5',
			name: 'Airplane',
			value: '✈️',
			category: 'travel-places',
			order: 1,
		},
	];

	const config = {
		emojisPerRow: 2,
		generateCategoryRows: true,
	};

	let rowGenerator: EmojiRowGenerator;

	beforeEach(() => {
		rowGenerator = new EmojiRowGenerator(config);
	});

	describe('generateEmojiRows', () => {
		it('should generate emoji rows grouped by category', () => {
			const rows = rowGenerator.generateEmojiRows(sampleEmojis);

			expect(rows).toHaveLength(8);

			expect(rows[0].type).toBe('category');
			expect(rows[0].value).toBe('smileys-people');
			expect(typeof rows[0].id).toBe('string');

			expect(rows[1].type).toBe('emoji');
			expect(rows[1].value).toHaveLength(1);
			expect(typeof rows[1].id).toBe('string');

			expect(rows[2].type).toBe('category');
			expect(rows[2].value).toBe('animals-nature');
			expect(typeof rows[2].id).toBe('string');

			expect(rows[3].type).toBe('emoji');
			expect(rows[3].value).toHaveLength(2);
			expect(typeof rows[3].id).toBe('string');
		});
	});

	describe('generateEmojiRowsPerCategory', () => {
		it('should generate emoji rows for a single category', () => {
			const rows = rowGenerator.generateEmojiRowsPerCategory(
				{ category: 'animals-nature' },
				sampleEmojis.filter((e) => e.category === 'animals-nature')
			);

			expect(rows).toHaveLength(2);

			if (rows[0].type === 'category') {
				expect(rows[0].value).toBe('animals-nature');
				expect(rows[0].translationKey).toBe(
					'emojipicker.category.animals-nature'
				);
				expect(typeof rows[0].id).toBe('string');
			}

			expect(rows[1].type).toBe('emoji');
			expect(rows[1].value).toHaveLength(2);
			expect(typeof rows[1].id).toBe('string');
		});

		it('should generate emoji rows without a category row if configured not to', () => {
			rowGenerator = new EmojiRowGenerator({
				...config,
				generateCategoryRows: false,
			});

			const rows = rowGenerator.generateEmojiRowsPerCategory(
				{ category: 'animals-nature' },
				sampleEmojis.filter((e) => e.category === 'animals-nature')
			);

			expect(rows).toHaveLength(1); // Only emoji row
			expect(rows[0].type).toBe('emoji');
			expect(rows[0].value).toHaveLength(2); // Two emojis in this category
			expect(typeof rows[0].id).toBe('string');
		});
	});

	describe('createEmojiRows', () => {
		it('should correctly split emojis into rows based on emojisPerRow config', () => {
			const emojis = sampleEmojis.filter(
				(e) => e.category === 'animals-nature'
			);
			const rows = rowGenerator['createEmojiRows'](emojis);

			expect(rows).toHaveLength(1);
			expect(rows[0].type).toBe('emoji');
			expect(rows[0].value).toHaveLength(2);
			expect(typeof rows[0].id).toBe('string');
		});

		it('should create multiple rows if there are more emojis than fit in one row', () => {
			const moreEmojis: Emoji[] = [
				...sampleEmojis,
				{
					id: '6',
					name: 'Car',
					value: '🚗',
					category: 'travel-places',
					order: 2,
				},
				{
					id: '7',
					name: 'Boat',
					value: '🚤',
					category: 'travel-places',
					order: 3,
				},
			];
			const rows = rowGenerator['createEmojiRows'](moreEmojis);

			expect(rows).toHaveLength(4);
			expect(typeof rows[0].id).toBe('string');
		});
	});

	describe('createCategoryRow', () => {
		it('should create a category row with the correct translation key', () => {
			const row = rowGenerator['createCategoryRow'](
				'animals-nature',
				'emojipicker.category.animals-nature'
			);

			if (row.type === 'category') {
				expect(row.value).toBe('animals-nature');
				expect(row.translationKey).toBe(
					'emojipicker.category.animals-nature'
				);
				expect(typeof row.id).toBe('string');
			}
		});
	});
});
