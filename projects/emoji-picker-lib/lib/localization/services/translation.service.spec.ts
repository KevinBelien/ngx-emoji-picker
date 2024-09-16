import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
    let service: TranslationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TranslationService]
        });

        service = TestBed.inject(TranslationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize with default English translations and emoji keywords', () => {
        const translations = service.getAllTranslations();
        const emojiTranslations = service.getAllEmojiKeywordTranslations();

        expect(translations.get('en')).toBeTruthy();
        expect(translations.get('en')).toBeInstanceOf(Map);
        expect(emojiTranslations.get('en')).toBeTruthy();
        expect(emojiTranslations.get('en')).toBeInstanceOf(Map);
    });

    it('should set the current language', () => {
        service.setLanguage('fr');
        expect(service.getLanguage()).toBe('fr');
    });

    it('should load translations for a specific language', () => {
        const frTranslations = { hello: 'bonjour', goodbye: 'au revoir' };
        service.loadTranslations('fr', frTranslations);

        const translations = service.getTranslationsByLanguage('fr');
        expect(translations?.get('hello')).toBe('bonjour');
        expect(translations?.get('goodbye')).toBe('au revoir');
    });

    it('should load emoji keyword translations for a specific language', () => {
        const frEmojiKeywords = { smile: ['sourire'], heart: ['coeur'] };
        service.loadEmojiKeywordTranslations('fr', frEmojiKeywords);

        const emojiTranslations = service.getEmojiKeywordTranslationsByLanguage('fr');
        expect(emojiTranslations?.get('smile')).toEqual(['sourire']);
        expect(emojiTranslations?.get('heart')).toEqual(['coeur']);
    });

    it('should retrieve a translation by key for the current language', () => {
        const frTranslations = { welcome: 'bienvenue' };
        service.loadTranslations('fr', frTranslations);
        service.setLanguage('fr');

        const translation = service.getTranslationByKey('welcome');
        expect(translation).toBe('bienvenue');
    });

    it('should retrieve an emoji keyword translation by key for the current language', () => {
        const frEmojiKeywords = { sun: ['soleil'], moon: ['lune'] };
        service.loadEmojiKeywordTranslations('fr', frEmojiKeywords);
        service.setLanguage('fr');

        const emojiTranslation = service.getEmojiKeywordTranslationByKey('sun');
        expect(emojiTranslation).toEqual(['soleil']);
    });

    it('should unload translations for a specific language', () => {
        const deTranslations = { hello: 'hallo' };
        service.loadTranslations('de', deTranslations);

        service.unloadTranslations('de');
        const translations = service.getTranslationsByLanguage('de');
        expect(translations).toBeUndefined();
    });

    it('should unload emoji keyword translations for a specific language', () => {
        const deEmojiKeywords = { smile: ['lächeln'] };
        service.loadEmojiKeywordTranslations('de', deEmojiKeywords);

        service.unloadEmojiKeywordTranslations('de');
        const emojiTranslations = service.getEmojiKeywordTranslationsByLanguage('de');
        expect(emojiTranslations).toBeUndefined();
    });
});
