import { TestBed } from '@angular/core/testing';
import { EmojiFilterService } from './emoji-filter.service';

jest.mock('../locales', () => ({
	enKeywordTranslations: {
		'd6139ca7-a4ff-49c1-a69d-cc61a08f64b3': [
			'cheerful',
			'happy',
			'smile',
			'grinning',
		],
		'99e123f7-b998-46b7-a281-9d418b05e52a': [
			'awesome',
			'happy',
			'smile',
			'joy',
		],
	},
	nlKeywordTranslations: {
		'd6139ca7-a4ff-49c1-a69d-cc61a08f64b3': [
			'blij',
			'vrolijk',
			'glimlach',
		],
		'99e123f7-b998-46b7-a281-9d418b05e52a': [
			'geweldig',
			'vrolijk',
			'glimlach',
			'vreugde',
		],
	},
}));

describe('EmojiFilterService', () => {
	let service: EmojiFilterService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(EmojiFilterService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should filter emojis based on a search value in English', async () => {
		const result = await service.filter('happy', 'en');
		expect(result).toEqual([
			'd6139ca7-a4ff-49c1-a69d-cc61a08f64b3',
			'99e123f7-b998-46b7-a281-9d418b05e52a',
		]);
	});

	it('should filter emojis based on a search value in Dutch', async () => {
		const result = await service.filter('vrolijk', 'nl');
		expect(result).toEqual([
			'd6139ca7-a4ff-49c1-a69d-cc61a08f64b3',
			'99e123f7-b998-46b7-a281-9d418b05e52a',
		]);
	});

	it('should filter emojis based on a search value in English with restricted emoji list', async () => {
		const result = await service.filter('happy', 'en', [
			'd6139ca7-a4ff-49c1-a69d-cc61a08f64b3',
		]);
		expect(result).toEqual(['d6139ca7-a4ff-49c1-a69d-cc61a08f64b3']);
	});

	it('should prioritize exact matches with Infinity score', async () => {
		const result = await service.filter('happy', 'en');
		expect(result[0]).toBe('d6139ca7-a4ff-49c1-a69d-cc61a08f64b3');
	});

	it('should return an empty array when no matches are found', async () => {
		const result = await service.filter('nonexistent', 'en');
		expect(result).toEqual([]);
	});

	it('should throw an error when translation module fails to load', async () => {
		jest
			.spyOn(service as any, 'getTranslations')
			.mockRejectedValue(new Error('Test Error'));

		await expect(service.filter('happy', 'en')).rejects.toThrow(
			'Test Error'
		);
	});
});
