import { TestBed } from '@angular/core/testing';
import { Language } from '@chit-chat/ngx-emoji-picker/lib/localization';
import { EmojiFilterService } from './emoji-filter.service';

describe('EmojiFilterService', () => {
    let service: EmojiFilterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EmojiFilterService);

        // Mocking getTranslations method
        (service as any).getTranslations = jest.fn(async (language: Language) => {
            if (language === 'en') {
                return {
                    test1: ['cheerful', 'happy', 'smile', 'grinning'],
                    test2: ['awesome', 'happy', 'smile', 'joy']
                };
            } else if (language === 'nl') {
                return {
                    test1: ['blij', 'vrolijk', 'glimlach'],
                    test2: ['geweldig', 'vrolijk', 'glimlach', 'vreugde']
                };
            }
            return {};
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should filter emojis based on a search value in English', async () => {
        const result = await service.filter('happy', 'en');
        expect(result).toEqual(['test1', 'test2']);
    });

    it('should filter emojis based on a search value in Dutch', async () => {
        const result = await service.filter('vrolijk', 'nl');
        expect(result).toEqual(['test1', 'test2']);
    });

    it('should filter emojis based on a search value in English with restricted emoji list', async () => {
        const result = await service.filter('happy', 'en', ['test1']);
        expect(result).toEqual(['test1']);
    });

    it('should prioritize exact matches with Infinity score', async () => {
        const result = await service.filter('happy', 'en');
        expect(result).toEqual(['test1', 'test2']);
    });

    it('should return an empty array when no matches are found', async () => {
        const result = await service.filter('nonexistent', 'en');
        expect(result).toEqual([]);
    });

    it('should throw an error when translation module fails to load', async () => {
        (service as any).getTranslations = jest.fn().mockRejectedValue(new Error('Test Error'));

        await expect(service.filter('happy', 'en')).rejects.toThrow('Test Error');
    });
});
