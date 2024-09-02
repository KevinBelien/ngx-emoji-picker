import { TestBed } from '@angular/core/testing';
import {
	FrequentEmoji,
	IndividualEmojiSkintone,
	Skintone,
} from '../models';
import { EmojiStorageService } from './emoji-storage.service';

describe('EmojiStorageService', () => {
	let service: EmojiStorageService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [EmojiStorageService],
		});
		service = TestBed.inject(EmojiStorageService);

		// Clear any previous mocks or data
		localStorage.clear();
		jest.clearAllMocks();
	});

	describe('retrieveFromStorage', () => {
		it('should retrieve data from localStorage', () => {
			const mockData: FrequentEmoji[] = [
				{ id: '1', count: 10, dateInMs: 12345 },
			];
			localStorage.setItem(
				service.STORAGE_CONFIG.frequent.key,
				JSON.stringify(mockData)
			);

			const result =
				service.retrieveFromStorage<FrequentEmoji>('frequent');
			expect(result).toEqual(mockData);
		});

		it('should return an empty array if no data is found', () => {
			const result =
				service.retrieveFromStorage<FrequentEmoji>('frequent');
			expect(result).toEqual([]);
		});
	});

	describe('storeInStorage', () => {
		it('should store data in localStorage', () => {
			const mockData: FrequentEmoji[] = [
				{ id: '1', count: 10, dateInMs: 12345 },
			];

			service.storeInStorage<FrequentEmoji[]>('frequent', mockData);

			const storedData = localStorage.getItem(
				service.STORAGE_CONFIG.frequent.key
			);
			expect(storedData).toEqual(JSON.stringify(mockData));
		});
	});

	describe('prependToStorage', () => {
		it('should prepend data to the existing array in localStorage', () => {
			const initialData: string[] = ['1'];
			localStorage.setItem(
				service.STORAGE_CONFIG.recent.key,
				JSON.stringify(initialData)
			);

			const newData: string = '2';
			const result = service.prependIdToStorage('recent', newData);

			expect(result).toEqual([newData, ...initialData]);
			expect(
				localStorage.getItem(service.STORAGE_CONFIG.recent.key)
			).toEqual(JSON.stringify([newData, ...initialData]));
		});

		it('should not create duplicates when prepending existing id', () => {
			const initialData = ['1', '2'];
			localStorage.setItem(
				service.STORAGE_CONFIG.recent.key,
				JSON.stringify(initialData)
			);

			const result = service.prependIdToStorage(
				'recent',
				initialData[0]
			);

			expect(result.length).toBe(2);
			expect(result[0]).toBe('1');
		});

		it('should not exceed limit when prepending data', () => {
			const initialData = Array.from({ length: 100 }, (_, index) =>
				index.toString()
			);

			localStorage.setItem(
				service.STORAGE_CONFIG.recent.key,
				JSON.stringify(initialData)
			);

			const newData = '101';

			const result = service.prependIdToStorage('recent', newData);

			expect(result.length).toBe(100);

			expect(result[0]).toBe('101');

			expect(
				localStorage.getItem(service.STORAGE_CONFIG.recent.key)
			).toEqual(JSON.stringify(result));
		});
	});

	describe('fetchFrequentEmojis', () => {
		it('should return sorted frequent emojis', () => {
			const mockData: FrequentEmoji[] = [
				{ id: '1', count: 5, dateInMs: 12345 },
				{ id: '2', count: 10, dateInMs: 67890 },
			];

			localStorage.setItem(
				service.STORAGE_CONFIG.frequent.key,
				JSON.stringify(mockData)
			);

			const result = service.fetchFrequentEmojis();
			expect(result).toEqual([
				{ id: '2', count: 10, dateInMs: 67890 },
				{ id: '1', count: 5, dateInMs: 12345 },
			]);
		});
	});

	describe('increaseEmojiFrequency', () => {
		it('should increase frequency of an existing emoji', () => {
			const mockData: FrequentEmoji[] = [
				{ id: '1', count: 5, dateInMs: 12345 },
			];
			localStorage.setItem(
				service.STORAGE_CONFIG.frequent.key,
				JSON.stringify(mockData)
			);

			const result = service.increaseEmojiFrequency('1');
			expect(result[0].count).toBe(6);
		});

		it('should add a new emoji if it does not exist', () => {
			const mockData: FrequentEmoji[] = [
				{ id: '1', count: 5, dateInMs: 12345 },
			];
			localStorage.setItem(
				service.STORAGE_CONFIG.frequent.key,
				JSON.stringify(mockData)
			);

			const result = service.increaseEmojiFrequency('2');
			expect(result).toEqual(
				expect.arrayContaining([
					{ id: '1', count: 5, dateInMs: 12345 },
					expect.objectContaining({ id: '2', count: 1 }),
				])
			);
		});
	});

	describe('sortFrequentEmojis', () => {
		it('should sort emojis by count and then by date ascending by default', () => {
			const mockData = [
				{ id: '1', count: 5, dateInMs: 12345 },
				{ id: '2', count: 10, dateInMs: 67890 },
				{ id: '3', count: 10, dateInMs: 11111 },
			];

			const result = service.sortFrequentEmojis(mockData);

			expect(result).toEqual([
				{ id: '3', count: 10, dateInMs: 11111 },
				{ id: '2', count: 10, dateInMs: 67890 },
				{ id: '1', count: 5, dateInMs: 12345 },
			]);
		});

		it('should sort emojis by date descending when specified', () => {
			const mockData = [
				{ id: '1', count: 5, dateInMs: 12345 },
				{ id: '2', count: 10, dateInMs: 67890 },
				{ id: '3', count: 10, dateInMs: 11111 },
			];

			const result = service.sortFrequentEmojis(mockData, true);

			expect(result).toEqual([
				{ id: '2', count: 10, dateInMs: 67890 },
				{ id: '3', count: 10, dateInMs: 11111 },
				{ id: '1', count: 5, dateInMs: 12345 },
			]);
		});
	});

	describe('fetchIndividualEmojisSkintones', () => {
		it('should return individual skintone settings from localStorage', () => {
			const mockData: IndividualEmojiSkintone[] = [
				{ emojiId: '1', emojiValue: 'skin-tone-2' },
			];

			localStorage.setItem(
				service.STORAGE_CONFIG.emojisSkintone.key,
				JSON.stringify(mockData)
			);

			const result = service.fetchIndividualEmojisSkintones();
			expect(result).toEqual(mockData);
		});
	});

	describe('updateEmojiSkintone', () => {
		it('should update the skintone of an existing emoji', () => {
			const initialData: IndividualEmojiSkintone[] = [
				{ emojiId: '1', emojiValue: 'skin-tone-2' },
			];
			localStorage.setItem(
				service.STORAGE_CONFIG.emojisSkintone.key,
				JSON.stringify(initialData)
			);

			const result = service.updateEmojiSkintone('1', 'skin-tone-3');
			expect(result[0].emojiValue).toBe('skin-tone-3');
		});

		it('should add a new skintone setting if the emoji does not exist', () => {
			const initialData: IndividualEmojiSkintone[] = [
				{ emojiId: '1', emojiValue: 'skin-tone-2' },
			];
			localStorage.setItem(
				service.STORAGE_CONFIG.emojisSkintone.key,
				JSON.stringify(initialData)
			);

			const result = service.updateEmojiSkintone('2', 'skin-tone-3');
			expect(result).toEqual(
				expect.arrayContaining([
					{ emojiId: '1', emojiValue: 'skin-tone-2' },
					{ emojiId: '2', emojiValue: 'skin-tone-3' },
				])
			);
		});
	});

	describe('fetchGlobalSkintone', () => {
		it('should return the global skintone from localStorage', () => {
			localStorage.setItem(
				service.STORAGE_CONFIG.globalSkintone.key,
				'medium-light'
			);
			const result = service.fetchGlobalSkintone();
			expect(result).toBe('medium-light');
		});

		it('should return default if no skintone is found in localStorage', () => {
			const result = service.fetchGlobalSkintone();
			expect(result).toBe('default');
		});

		it('should return default if the skintone in localStorage is invalid', () => {
			localStorage.setItem(
				service.STORAGE_CONFIG.globalSkintone.key,
				'invalid-skintone'
			);
			const result = service.fetchGlobalSkintone();
			expect(result).toBe('default');
		});
	});

	describe('updateGlobalSkintone', () => {
		it('should update the global skintone in localStorage', () => {
			service.updateGlobalSkintone('dark');
			expect(
				localStorage.getItem(
					service.STORAGE_CONFIG.globalSkintone.key
				)
			).toBe('dark');
		});

		it('should not update global skintone if the skintone is invalid', () => {
			service.updateGlobalSkintone('invalid-skintone' as Skintone);
			expect(
				localStorage.getItem(
					service.STORAGE_CONFIG.globalSkintone.key
				)
			).toBeNull();
		});
	});
});
