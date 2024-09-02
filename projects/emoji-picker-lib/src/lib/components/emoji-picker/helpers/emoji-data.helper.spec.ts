import { Emoji } from '../models';
import { EmojiDataHelper } from './emoji-data.helper';

describe('EmojiDataHelper', () => {
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

	describe('groupEmojisByCategory', () => {
		it('should group emojis by their categories', () => {
			const groupedEmojis =
				EmojiDataHelper.groupEmojisByCategory(sampleEmojis);

			expect(groupedEmojis['smileys-people']).toHaveLength(1);
			expect(groupedEmojis['animals-nature']).toHaveLength(2);
			expect(groupedEmojis['food-drink']).toHaveLength(1);
			expect(groupedEmojis['travel-places']).toHaveLength(1);
		});

		it('should return an empty object when no emojis are provided', () => {
			const groupedEmojis = EmojiDataHelper.groupEmojisByCategory([]);
			expect(groupedEmojis).toEqual({});
		});
	});

	describe('filterEmojisByCategories', () => {
		it('should filter emojis by the included categories', () => {
			const filteredEmojis = EmojiDataHelper.filterEmojisByCategories(
				sampleEmojis,
				['animals-nature', 'food-drink']
			);

			expect(filteredEmojis).toHaveLength(3);
			expect(
				filteredEmojis.some(
					(emoji) => emoji.category === 'animals-nature'
				)
			).toBe(true);
			expect(
				filteredEmojis.some(
					(emoji) => emoji.category === 'food-drink'
				)
			).toBe(true);
		});

		it('should return an empty array when no categories match', () => {
			const filteredEmojis = EmojiDataHelper.filterEmojisByCategories(
				sampleEmojis,
				['flags']
			);

			expect(filteredEmojis).toHaveLength(0);
		});
	});

	describe('filterAndSortEmojis', () => {
		it('should filter and then sort emojis by their categories and order', () => {
			const sortedEmojis = EmojiDataHelper.filterAndSortEmojis(
				sampleEmojis,
				['animals-nature', 'food-drink', 'smileys-people']
			);

			expect(sortedEmojis).toHaveLength(4);
			expect(sortedEmojis[0].name).toBe('Cat'); // First in 'animals-nature' by order
			expect(sortedEmojis[1].name).toBe('Dog'); // Second in 'animals-nature' by order
			expect(sortedEmojis[2].name).toBe('Burger'); // First in 'food-drink'
			expect(sortedEmojis[3].name).toBe('Smile'); // First in 'smileys-people'
		});
	});

	describe('sortEmojis', () => {
		it('should sort emojis based on the provided category order and emoji order', () => {
			const sortedEmojis = EmojiDataHelper.sortEmojis(sampleEmojis, [
				'food-drink',
				'smileys-people',
				'animals-nature',
				'travel-places',
			]);

			expect(sortedEmojis[0].name).toBe('Burger'); // First in 'food-drink'
			expect(sortedEmojis[1].name).toBe('Smile'); // First in 'smileys-people'
			expect(sortedEmojis[2].name).toBe('Cat'); // First in 'animals-nature' by order
			expect(sortedEmojis[3].name).toBe('Dog'); // Second in 'animals-nature' by order
			expect(sortedEmojis[4].name).toBe('Airplane'); // First in 'travel-places'
		});

		it('should return the array as is when categories are empty', () => {
			const sortedEmojis = EmojiDataHelper.sortEmojis(
				sampleEmojis,
				[]
			);
			expect(sortedEmojis).toEqual(sampleEmojis);
		});
	});
});
