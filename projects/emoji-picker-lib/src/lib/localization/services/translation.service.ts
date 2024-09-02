import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
	Language,
	LocaleTranslations,
	Translations,
} from '../models';
import { enTranslations } from '../public-api';

/**
 * A service that manages translations for different languages in the application.
 * It provides methods to set the current language, load/unload translations, and retrieve translations by key.
 *
 * @service
 * @providedIn root
 */
@Injectable({
	providedIn: 'root',
})
export class TranslationService {
	/**
	 * Observable that holds the current language as a `BehaviorSubject`.
	 * @type {BehaviorSubject<Language>}
	 * @readonly
	 * @default 'en'
	 */
	readonly currentLanguage$ = new BehaviorSubject<Language>('en');

	/**
	 * Observable that holds all loaded translations mapped by language.
	 * @type {BehaviorSubject<LocaleTranslations>}
	 * @readonly
	 */
	readonly translations$: BehaviorSubject<LocaleTranslations> =
		new BehaviorSubject<LocaleTranslations>(new Map());

	constructor() {
		this.loadTranslations('en', enTranslations);
	}

	/**
	 * Sets the current language for the application.
	 * @group Method
	 * @param {Language} language - The language to set as the current language.
	 * @returns {void}
	 */
	setLanguage = (language: Language): void => {
		this.currentLanguage$.next(language);
	};

	/**
	 * Gets the current language of the application.
	 * @group Method
	 * @returns {Language} The current language.
	 */
	getLanguage = (): Language => {
		return this.currentLanguage$.getValue();
	};

	/**
	 * Loads translations for a specific language and merges them with any existing translations for that language.
	 * @group Method
	 * @param {Language} language - The language for which translations are being loaded.
	 * @param {Translations} translations - A dictionary of translation key-value pairs.
	 * @returns {void}
	 */
	loadTranslations = (
		language: Language,
		translations: { [key: string]: string }
	): void => {
		const mappedTranslations: LocaleTranslations =
			this.translations$.getValue();

		let localeTranslations = mappedTranslations.get(language);

		if (!localeTranslations) {
			localeTranslations = new Map<string, string>();
			mappedTranslations.set(language, localeTranslations);
		}

		Object.entries(translations).forEach(([key, value]) => {
			localeTranslations.set(key, value);
		});

		this.translations$.next(mappedTranslations);
	};

	/**
	 * Unloads (removes) all translations for a specific language.
	 * @group Method
	 * @param {Language} language - The language for which translations should be unloaded.
	 * @returns {void}
	 */
	unloadTranslations = (language: Language): void => {
		const mappedTranslations: LocaleTranslations =
			this.translations$.getValue();

		mappedTranslations.delete(language);

		this.translations$.next(mappedTranslations);
	};

	/**
	 * Retrieves all loaded translations for all languages.
	 * @group Method
	 * @returns {LocaleTranslations} A map containing all loaded translations.
	 */
	getAllTranslations = (): LocaleTranslations => {
		return this.translations$.getValue();
	};

	/**
	 * Retrieves translations for a specific language.
	 * @group Method
	 * @param {Language} language - The language for which to retrieve translations.
	 * @returns {Translations | undefined} A map of translations, or undefined if the language is not loaded.
	 */
	getTranslationsByLanguage = (
		language: Language
	): Translations | undefined => {
		return this.getAllTranslations().get(language);
	};

	/**
	 * Retrieves translations for the current language.
	 * @group Method
	 * @returns {Translations | undefined} A map of translations for the current language, or undefined if not available.
	 */
	getTranslationsByCurrentLanguage = (): Translations | undefined => {
		return this.getTranslationsByLanguage(this.getLanguage());
	};

	/**
	 * Retrieves a translation by its key for the current language.
	 * @group Method
	 * @param {string} key - The key for the translation to retrieve.
	 * @returns {string | undefined} The translated string, or undefined if the key does not exist.
	 */
	getTranslationByKey = (key: string): string | undefined => {
		return this.getTranslationsByCurrentLanguage()?.get(key);
	};
}
