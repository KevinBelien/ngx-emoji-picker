import { TestBed } from '@angular/core/testing';
import { TranslationService } from '@chit-chat/ngx-emoji-picker/lib/localization';
import { ObjectHelper } from '@chit-chat/ngx-emoji-picker/lib/utils';
import { EmojiFilterService } from './emoji-filter.service';

// Mock data for translations
const mockTranslations = new Map<string, string[]>([
    ['smile', ['happy', 'grin']],
    ['heart', ['love', 'like']],
    ['thumbsup', ['approve', 'good', 'ok']]
]);

describe('EmojiFilterService', () => {
    let service: EmojiFilterService;
    let translationService: jest.Mocked<TranslationService>;

    beforeEach(() => {
        // Mock TranslationService
        translationService = {
            getEmojiKeywordTranslationsByLanguage: jest.fn().mockReturnValue(mockTranslations)
        } as unknown as jest.Mocked<TranslationService>;

        // Mock ObjectHelper
        jest.spyOn(ObjectHelper, 'combineArrayMap').mockImplementation((map1, map2) => {
            const combined = new Map(map1);
            map2.forEach((value, key) => {
                combined.set(key, value);
            });
            return combined;
        });

        TestBed.configureTestingModule({
            providers: [EmojiFilterService, { provide: TranslationService, useValue: translationService }]
        });

        service = TestBed.inject(EmojiFilterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should filter emojis based on search value and language', () => {
        const searchValue = 'happy';
        const result = service.filter(searchValue, 'en');

        expect(result).toEqual(['smile']);
    });

    it('should return an empty array if no matching emojis are found', () => {
        const searchValue = 'sad';
        const result = service.filter(searchValue, 'en');

        expect(result).toEqual([]);
    });

    it('should handle exact matches with higher priority', () => {
        const searchValue = 'grin';
        const result = service.filter(searchValue, 'en');

        expect(result).toEqual(['smile']); // Exact match should come first
    });

    it('should filter within a provided set of included emojis', () => {
        const searchValue = 'good';
        const includedEmojis = ['heart'];
        const result = service.filter(searchValue, 'en', includedEmojis);

        expect(result).toEqual([]);
    });

    it('should combine default and locale-specific translations', () => {
        // Set up locale-specific translations
        const localeTranslations = new Map<string, string[]>([['fire', ['burn', 'hot']]]);
        translationService.getEmojiKeywordTranslationsByLanguage.mockReturnValueOnce(localeTranslations);

        const searchValue = 'hot';
        const result = service.filter(searchValue, 'en');

        expect(result).toEqual(['fire']);
    });
});
