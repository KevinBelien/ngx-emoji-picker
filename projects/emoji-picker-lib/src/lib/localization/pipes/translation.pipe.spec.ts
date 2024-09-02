import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { TranslationService } from '../services/translation.service';
import { TranslatePipe } from './translation.pipe';

describe('TranslatePipe', () => {
	let pipe: TranslatePipe;
	let translationService: TranslationService;
	let cdr: ChangeDetectorRef;

	beforeEach(() => {
		const translationServiceMock = {
			currentLanguage$: new BehaviorSubject('en'),
			getTranslationByKey: jest.fn(),
		};

		TestBed.configureTestingModule({
			providers: [
				TranslatePipe,
				{
					provide: TranslationService,
					useValue: translationServiceMock,
				},
				{
					provide: ChangeDetectorRef,
					useValue: { markForCheck: jest.fn() },
				},
			],
		});

		pipe = TestBed.inject(TranslatePipe);
		translationService = TestBed.inject(TranslationService);
		cdr = TestBed.inject(ChangeDetectorRef);
	});

	it('should create the pipe', () => {
		expect(pipe).toBeTruthy();
	});

	it('should return the translation for a given key', () => {
		const key = 'greeting';
		const translatedValue = 'Hello';
		jest
			.spyOn(translationService, 'getTranslationByKey')
			.mockReturnValue(translatedValue);

		const result = pipe.transform(key);

		expect(result).toBe(translatedValue);
		expect(
			translationService.getTranslationByKey
		).toHaveBeenCalledWith(key);
	});

	it('should return the key itself if translation is not found', () => {
		const key = 'nonexistent_key';
		jest
			.spyOn(translationService, 'getTranslationByKey')
			.mockReturnValue(undefined);

		const result = pipe.transform(key);

		expect(result).toBe(key);
	});

	it('should update when the language changes', () => {
		translationService.currentLanguage$.next('es');
		expect(cdr.markForCheck).toHaveBeenCalled();
	});
});
