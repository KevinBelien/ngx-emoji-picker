import { TestBed } from '@angular/core/testing';
import { Translations } from '../models';
import { TranslationService } from './translation.service';

// Simplified translation data as Map
const enTranslations: Translations = new Map([
	['greeting', 'Hello'],
	['farewell', 'Goodbye'],
	['thankYou', 'Thank you'],
]);

const esTranslations: Translations = new Map([
	['greeting', 'Hola'],
	['farewell', 'Adiós'],
	['thankYou', 'Gracias'],
]);

describe('TranslationService', () => {
	let service: TranslationService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(TranslationService);
		// Load the enTranslations by default
		service.loadTranslations(
			'en',
			Object.fromEntries(enTranslations)
		);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should set and get the current language', () => {
		service.setLanguage('es');
		expect(service.getLanguage()).toBe('es');
	});

	it('should load translations and merge them with existing translations', () => {
		const additionalTranslations: Translations = new Map([
			['welcome', 'Welcome'],
		]);
		service.loadTranslations(
			'en',
			Object.fromEntries(additionalTranslations)
		);

		const translations = service.getTranslationsByLanguage('en');
		expect(translations).toBeTruthy();
		expect(translations!.get('greeting')).toBe('Hello');
		expect(translations!.get('welcome')).toBe('Welcome');
	});

	it('should unload translations for a specific language', () => {
		service.unloadTranslations('en');
		const translations = service.getTranslationsByLanguage('en');
		expect(translations).toBeUndefined();
	});

	it('should get all loaded translations', () => {
		const translations = service.getAllTranslations();
		expect(translations.size).toBe(1); // Assuming only 'en' is loaded initially
	});

	it('should get translations by the current language', () => {
		const currentTranslations =
			service.getTranslationsByCurrentLanguage();
		expect(currentTranslations).toBeTruthy();
		expect(currentTranslations!.get('greeting')).toBe('Hello');
	});

	it('should get translation by key for the current language', () => {
		const translation = service.getTranslationByKey('thankYou');
		expect(translation).toBe('Thank you');
	});

	it('should return undefined for a missing translation key', () => {
		const missingTranslation =
			service.getTranslationByKey('nonexistent_key');
		expect(missingTranslation).toBeUndefined();
	});

	it('should load and retrieve translations in a different language', () => {
		service.loadTranslations(
			'es',
			Object.fromEntries(esTranslations)
		);
		service.setLanguage('es');

		const translation = service.getTranslationByKey('greeting');
		expect(translation).toBe('Hola');
	});
});
