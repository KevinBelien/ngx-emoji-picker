import {
	ChangeDetectorRef,
	inject,
	Pipe,
	PipeTransform,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslationService } from '../services';

/**
 * A pipe that translates a given key into the current language using the `TranslationService`.
 * It is an impure pipe, meaning it will re-evaluate whenever the language changes.
 *
 * @pipe
 * @name translate
 * @pure false
 */
@Pipe({
	name: 'translate',
	standalone: true,
	pure: false,
})
export class TranslatePipe implements PipeTransform {
	private translationsService = inject(TranslationService);
	private cdr = inject(ChangeDetectorRef);

	constructor() {
		this.translationsService.currentLanguage$
			.pipe(takeUntilDestroyed())
			.subscribe(() => {
				this.cdr.markForCheck();
			});
	}

	/**
	 * Transforms a translation key into the corresponding translated string.
	 *
	 * @param {string} value - The translation key to be translated.
	 * @returns {string} The translated string if found, otherwise returns the key itself.
	 */
	transform(value: string): string {
		return (
			this.translationsService.getTranslationByKey(value) ?? value
		);
	}
}
