import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmojiKeywordTranslations, Language, LocaleEmojiKeywordTranslations, LocaleTranslations, Translations } from '../models';
import { enEmojiKeywordTranslations, enTranslations } from '../public-api';

/**
 * A service that manages translations for different languages in the application.
 * It provides methods to set the current language, load/unload translations, and retrieve translations by key.
 */
@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    /** Observable that holds the current language. Default is 'en'. */
    readonly currentLanguage$ = new BehaviorSubject<Language>('en');

    /** Observable that holds all loaded translations mapped by language. */
    readonly translations$ = new BehaviorSubject<LocaleTranslations>(new Map());

    /** Observable that holds all loaded emoji keywords mapped by language. */
    readonly emojiKeywordsTranslations$ = new BehaviorSubject<LocaleEmojiKeywordTranslations>(new Map());

    constructor() {
        // Load default 'en' language translations and emoji keyword translations
        this.loadTranslations('en', enTranslations);
        this.loadEmojiKeywordTranslations('en', enEmojiKeywordTranslations);
    }

    /**
     * Sets the current language for the application.
     * @param language The language to set as the current language.
     */
    setLanguage(language: Language): void {
        this.currentLanguage$.next(language);
    }

    /**
     * Gets the current language of the application.
     */
    getLanguage(): Language {
        return this.currentLanguage$.getValue();
    }

    /**
     * Loads translations for a specific language and merges them with any existing translations.
     * @param language The language for which translations are being loaded.
     * @param translations A dictionary of translation key-value pairs.
     */
    loadTranslations(language: Language, translations: { [key: string]: string }): void {
        const updatedTranslations = this.updateTranslations(this.translations$.getValue(), translations, language);
        this.translations$.next(updatedTranslations);
    }

    /**
     * Loads emoji keyword translations for a specific language and merges them with any existing translations.
     * @param language The language for which translations are being loaded.
     * @param translations A dictionary of emoji keyword translation key-value pairs.
     */
    loadEmojiKeywordTranslations(language: Language, translations: { [key: string]: string[] }): void {
        const updatedTranslations = this.updateEmojiKeywordsTranslations(this.emojiKeywordsTranslations$.getValue(), translations, language);
        this.emojiKeywordsTranslations$.next(updatedTranslations);
    }

    /**
     * Updates the translations for a given language.
     * @param currentTranslations The current translation map.
     * @param newTranslations The new translation data to merge.
     * @param language The language being updated.
     */
    private updateTranslations(currentTranslations: LocaleTranslations, newTranslations: { [key: string]: string }, language: Language): LocaleTranslations {
        let languageTranslations = currentTranslations.get(language);

        if (!languageTranslations) {
            languageTranslations = new Map<string, string>();
            currentTranslations.set(language, languageTranslations);
        }

        Object.entries(newTranslations).forEach(([key, value]) => {
            languageTranslations!.set(key, value);
        });

        return currentTranslations;
    }

    /**
     * Updates the emoji keyword translations for a given language.
     * @param currentTranslations The current emoji keyword translation map.
     * @param newTranslations The new emoji keyword data to merge.
     * @param language The language being updated.
     */
    private updateEmojiKeywordsTranslations(currentTranslations: LocaleEmojiKeywordTranslations, newTranslations: { [key: string]: string[] }, language: Language): LocaleEmojiKeywordTranslations {
        let languageTranslations = currentTranslations.get(language);

        if (!languageTranslations) {
            languageTranslations = new Map<string, string[]>();
            currentTranslations.set(language, languageTranslations);
        }

        Object.entries(newTranslations).forEach(([key, value]) => {
            languageTranslations!.set(key, value);
        });

        return currentTranslations;
    }

    /**
     * Unloads (removes) all translations for a specific language.
     * @param language The language for which translations should be unloaded.
     */
    unloadTranslations(language: Language): void {
        const mappedTranslations = this.translations$.getValue();
        mappedTranslations.delete(language);
        this.translations$.next(mappedTranslations);
    }

    /**
     * Unloads (removes) all emoji keyword translations for a specific language.
     * @param language The language for which emoji keyword translations should be unloaded.
     */
    unloadEmojiKeywordTranslations(language: Language): void {
        const mappedTranslations = this.emojiKeywordsTranslations$.getValue();
        mappedTranslations.delete(language);
        this.emojiKeywordsTranslations$.next(mappedTranslations);
    }

    /**
     * Retrieves all loaded translations for all languages.
     */
    getAllTranslations(): LocaleTranslations {
        return this.translations$.getValue();
    }

    /**
     * Retrieves translations for a specific language.
     * @param language The language for which to retrieve translations.
     */
    getTranslationsByLanguage(language: Language): Translations | undefined {
        return this.getAllTranslations().get(language);
    }

    /**
     * Retrieves translations for the current language.
     */
    getTranslationsByCurrentLanguage(): Translations | undefined {
        return this.getTranslationsByLanguage(this.getLanguage());
    }

    /**
     * Retrieves a translation by its key for the current language.
     * @param key The key for the translation to retrieve.
     */
    getTranslationByKey(key: string): string | undefined {
        return this.getTranslationsByCurrentLanguage()?.get(key);
    }

    /**
     * Retrieves all loaded emoji keyword translations for all languages.
     */
    getAllEmojiKeywordTranslations(): LocaleEmojiKeywordTranslations {
        return this.emojiKeywordsTranslations$.getValue();
    }

    /**
     * Retrieves emoji keyword translations for a specific language.
     * @param language The language for which to retrieve emoji keyword translations.
     */
    getEmojiKeywordTranslationsByLanguage(language: Language): EmojiKeywordTranslations | undefined {
        return this.getAllEmojiKeywordTranslations().get(language);
    }

    /**
     * Retrieves emoji keyword translations for the current language.
     */
    getEmojiKeywordTranslationsByCurrentLanguage(): EmojiKeywordTranslations | undefined {
        return this.getEmojiKeywordTranslationsByLanguage(this.getLanguage());
    }

    /**
     * Retrieves an emoji keyword translation by its key for the current language.
     * @param key The key for the emoji keyword translation to retrieve.
     */
    getEmojiKeywordTranslationByKey(key: string): string[] | undefined {
        return this.getEmojiKeywordTranslationsByCurrentLanguage()?.get(key);
    }
}
