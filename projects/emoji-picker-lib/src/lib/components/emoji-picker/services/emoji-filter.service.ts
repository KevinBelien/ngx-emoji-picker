import { Injectable } from '@angular/core';
import { Language } from '@chit-chat/ngx-emoji-picker/src/lib/localization';
import {
	ArrayMap,
	ObjectHelper,
} from '@chit-chat/ngx-emoji-picker/src/lib/utils';

/**
 * A service responsible for filtering emojis based on a search value and language.
 * It provides methods to match and score emojis according to their keywords in different languages.
 *
 * @service
 * @providedIn root
 */
@Injectable({ providedIn: 'root' })
export class EmojiFilterService {
	/**
	 * Filters emojis based on a search value and language.
	 * Optionally restricts the search to a specified list of included emojis.
	 * @group Method
	 * @param {string} searchValue - The value to search for within emoji keywords.
	 * @param {Language} language - The language in which to perform the search.
	 * @param {string[]} [includedEmojis] - An optional list of emoji IDs to include in the search.
	 * @returns {Promise<string[]>} A promise that resolves to a list of emoji IDs that match the search criteria.
	 */
	filter = async (
		searchValue: string,
		language: Language,
		includedEmojis?: Array<string>
	): Promise<string[]> => {
		const translatedKeywords = await this.getTranslations(language);

		const filteredTranslations = includedEmojis
			? Object.keys(translatedKeywords)
					.filter((key) => includedEmojis.includes(key))
					.reduce((obj: ArrayMap<string>, key: string) => {
						obj[key] = translatedKeywords[key];
						return obj;
					}, {})
			: translatedKeywords;

		const normalizedSearchValue = searchValue.trim().toLowerCase();

		const scoredResults: Array<{ key: string; score: number }> = [];

		for (const key in filteredTranslations) {
			const keywords = filteredTranslations[key];
			let bestScore = 0;

			for (let i = 0; i < keywords.length; i++) {
				const score = this.getMatchScore(
					keywords[i],
					normalizedSearchValue
				);

				if (score === Infinity) {
					bestScore = score;
					break; // Early exit if exact match is found
				} else if (score > bestScore) {
					bestScore = score;
				}
			}

			if (bestScore > 0) {
				scoredResults.push({ key, score: bestScore });
			}
		}

		scoredResults.sort((a, b) => b.score - a.score);

		return scoredResults.map((result) => result.key);
	};

	private getMatchScore(
		keyword: string,
		searchValue: string
	): number {
		if (keyword === searchValue) {
			return Infinity;
		}

		if (keyword.startsWith(searchValue)) {
			return 1 / (keyword.length - searchValue.length + 1);
		}

		return 0; // No match
	}

	private getTranslations = async (
		language: Language
	): Promise<ArrayMap<string>> => {
		try {
			const filename = this.getTranslationFilename(language);
			const module = await import('../locales');
			const defaultTranslations = module.enKeywordTranslations;
			const localeTranslations = filename ? module[filename] : null;

			return localeTranslations
				? ObjectHelper.combineArrayMap(
						localeTranslations,
						defaultTranslations
				  )
				: defaultTranslations;
		} catch (error: any) {
			throw new Error(
				`Error loading translation module: ${error.message}`
			);
		}
	};

	private getTranslationFilename = (
		language: Language
	): TranslationFilename | null => {
		switch (language) {
			case 'nl':
				return 'nlKeywordTranslations';
			case 'de':
				return 'deKeywordTranslations';
			default:
				return null;
		}
	};
}

type TranslationFilename =
	| 'nlKeywordTranslations'
	| 'deKeywordTranslations';
