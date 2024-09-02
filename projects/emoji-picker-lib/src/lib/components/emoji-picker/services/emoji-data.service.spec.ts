import { TestBed } from '@angular/core/testing';
import { Emoji, FrequentEmoji, Skintone } from '../models';
import { EmojiDataService } from './emoji-data.service';
import { EmojiStorageService } from './emoji-storage.service';

jest.mock('./emoji-storage.service');

describe('EmojiDataService', () => {
	let service: EmojiDataService;
	let emojiStorageService: jest.Mocked<EmojiStorageService>;

	const mockEmojis: Emoji[] = [
		{
			id: '1',
			name: 'grinning face',
			value: '😀',
			category: 'smileys-people',
			order: 1,
		},
		{
			id: '2',
			name: 'thumbs up',
			value: '👍',
			category: 'smileys-people',
			order: 2,
			skintones: [
				{ skintone: 'light', value: '👍🏻', order: 1 },
				{ skintone: 'medium', value: '👍🏽', order: 2 },
				{ skintone: 'dark', value: '👍🏿', order: 3 },
			],
		},
		{
			id: '3',
			name: 'red heart',
			value: '❤️',
			category: 'symbols',
			order: 3,
		},
	];

	beforeEach(() => {
		const emojiStorageServiceMock = {
			fetchGlobalSkintone: jest.fn().mockReturnValue('default'),
			fetchIndividualEmojisSkintones: jest.fn().mockReturnValue([]),
			retrieveFromStorage: jest.fn().mockReturnValue([]),
			fetchFrequentEmojis: jest.fn().mockReturnValue([]),
			prependIdToStorage: jest.fn().mockReturnValue([]),
			increaseEmojiFrequency: jest.fn().mockReturnValue([]),
			updateEmojiSkintone: jest.fn(),
			updateGlobalSkintone: jest.fn(),
		};

		TestBed.configureTestingModule({
			providers: [
				EmojiDataService,
				{
					provide: EmojiStorageService,
					useValue: emojiStorageServiceMock,
				},
			],
		});

		service = TestBed.inject(EmojiDataService);
		emojiStorageService = TestBed.inject(
			EmojiStorageService
		) as jest.Mocked<EmojiStorageService>;
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should initialize global skintone setting from storage', () => {
		expect(service.globalSkintoneSetting()).toBe('default');
	});

	it('should initialize individual skintones from storage', () => {
		expect(service.individualSkintones()).toEqual([]);
	});

	it('should initialize recent emojis from storage', () => {
		expect(service.recentEmojis()).toEqual([]);
	});

	it('should initialize frequent emojis from storage', () => {
		expect(service.frequentEmojis()).toEqual([]);
	});

	it('should fetch an emoji by its ID', () => {
		service.emojis.set(mockEmojis);
		const emoji = service.fetchEmojiById('1');
		expect(emoji).toEqual(mockEmojis[0]);
	});

	it('should fetch multiple emojis by their IDs', () => {
		service.emojis.set(mockEmojis);
		const result = service.fetchEmojisByIds(['1', '2']);
		expect(result).toEqual([mockEmojis[0], mockEmojis[1]]);
	});

	it('should add an emoji to recents and update storage', () => {
		const id = mockEmojis[0].id;
		const recentEmojiIds = [id];

		// Mock the return value of prependIdToStorage to return the recentEmojiIds array
		emojiStorageService.prependIdToStorage.mockReturnValue(
			recentEmojiIds
		);

		// Call the method to add the emoji to recents
		service.addEmojiToRecents(id);

		// Verify that fetchEmojisByIds was called correctly
		const fetchedEmojis = service
			.fetchEmojisByIds(recentEmojiIds)
			.map((emoji) => ({
				...emoji,
				category: 'suggestions',
			}));

		// Verify that the recentEmojis signal has been updated correctly
		expect(service.recentEmojis()).toEqual(fetchedEmojis);

		// Ensure the storage service method was called with the correct ID
		expect(
			emojiStorageService.prependIdToStorage
		).toHaveBeenCalledWith('recent', id);
	});

	it('should increase emoji frequency and update frequent emojis in storage', () => {
		const id = mockEmojis[0].id;
		const frequentEmojis: FrequentEmoji[] = [
			{ id, count: 1, dateInMs: Date.now() },
		];

		// Mock the return value of increaseEmojiFrequency to return the frequentEmojis array
		emojiStorageService.increaseEmojiFrequency.mockReturnValue(
			frequentEmojis
		);

		// Call the method to increase the emoji frequency
		service.increaseEmojiFrequency(id);

		// Verify that fetchEmojisByIds was called correctly
		const fetchedEmojis = service
			.fetchEmojisByIds([id])
			.map((emoji) => ({
				...emoji,
				category: 'suggestions',
			}));

		// Verify that the frequentEmojis signal has been updated correctly
		expect(service.frequentEmojis()).toEqual(fetchedEmojis);

		// Ensure the storage service method was called with the correct ID
		expect(
			emojiStorageService.increaseEmojiFrequency
		).toHaveBeenCalledWith(id);
	});

	it('should update emoji skintone and update individual skintones', () => {
		const id = mockEmojis[1].id;
		const skintoneValue = '👍🏽';

		service.updateEmojiSkintone(id, skintoneValue);

		expect(
			emojiStorageService.updateEmojiSkintone
		).toHaveBeenCalledWith(id, skintoneValue);
		expect(service.individualSkintones()).toEqual([]);
	});

	it('should fetch the correct skintone from an emoji', () => {
		const emoji = mockEmojis[1];

		const result = service.fetchSkintoneFromEmoji(emoji, 'medium');
		expect(result).toBe('👍🏽');
	});

	it('should correctly set the global emoji skintone', () => {
		const skintone: Skintone = 'medium';

		service.setGlobalEmojiSkintone(skintone);

		expect(
			emojiStorageService.updateGlobalSkintone
		).toHaveBeenCalledWith(skintone);
		expect(service.globalSkintoneSetting()).toBe(skintone);
	});

	it('should generate an emoji map with skintone settings', () => {
		service.emojis.set(mockEmojis);
		const map = service.generateEmojiMap(
			mockEmojis,
			'global',
			'medium',
			[]
		);
		const firstEmoji = map.get(mockEmojis[1].id);

		expect(firstEmoji?.value).toBe('👍🏽');
	});

	it('should apply skintone settings correctly', () => {
		const emoji = mockEmojis[1];
		const skintoneSetting: Skintone = 'medium';
		const result = service.getEmojiBySkintoneSettings(
			emoji,
			'global',
			skintoneSetting,
			[]
		);
		expect(result.value).toEqual('👍🏽');
	});

	it('should check if an emoji has skintones', () => {
		const result = service.hasEmojiSkintones(mockEmojis[1]);
		expect(result).toBe(true);
	});
});
