import { inject, Injectable } from '@angular/core';
import { Language, TranslationService } from '@chit-chat/ngx-emoji-picker/lib/localization';
import { ObjectHelper } from '@chit-chat/ngx-emoji-picker/lib/utils';

/**
 * A service responsible for filtering emojis based on a search value and language.
 * It provides methods to match and score emojis according to their keywords in different languages.
 *
 * @service
 * @providedIn root
 */
@Injectable({ providedIn: 'root' })
export class EmojiFilterService {
    private translationService = inject(TranslationService);
    /**
     * Filters emojis based on a search value and language.
     * Optionally restricts the search to a specified list of included emojis.
     * @group Method
     * @param {string} searchValue - The value to search for within emoji keywords.
     * @param {Language} language - The language in which to perform the search.
     * @param {string[]} [includedEmojis] - An optional list of emoji IDs to include in the search.
     * @returns {Promise<string[]>} A promise that resolves to a list of emoji IDs that match the search criteria.
     */
    filter = (searchValue: string, language: Language, includedEmojis?: Array<string>): string[] => {
        const translatedKeywords = this.getTranslations(language);

        const filteredTranslations = this.getFilteredTranslations(translatedKeywords, includedEmojis);

        const normalizedSearchValue = searchValue.trim().toLowerCase();

        const scoredResults = this.getScoredResults(filteredTranslations, normalizedSearchValue);

        return this.sortResults(scoredResults).map((result) => result.key);
    };

    private getFilteredTranslations = (translatedKeywords: Map<string, string[]>, includedEmojis?: Array<string>): Map<string, string[]> => {
        if (includedEmojis) {
            return new Map([...translatedKeywords.keys()].filter((key) => includedEmojis.includes(key)).map((key) => [key, translatedKeywords.get(key) ?? []]));
        }
        return translatedKeywords;
    };

    private getScoredResults = (filteredTranslations: Map<string, string[]>, normalizedSearchValue: string): { key: string; score: number }[] => {
        const scoredResults: { key: string; score: number }[] = [];

        for (const [key, keywords] of filteredTranslations.entries()) {
            if (!keywords) continue;

            const bestScore = this.calculateBestScore(keywords, normalizedSearchValue);

            if (bestScore > 0) {
                scoredResults.push({ key, score: bestScore });
            }
        }

        return scoredResults;
    };

    private calculateBestScore = (keywords: string[], normalizedSearchValue: string): number => {
        let bestScore = 0;

        for (let i = 0; i < keywords.length; i++) {
            const score = this.getMatchScore(keywords[i], normalizedSearchValue);

            if (score === Infinity) {
                return score; // Early exit if exact match is found
            } else if (score > bestScore) {
                bestScore = score;
            }
        }

        return bestScore;
    };

    private sortResults = (scoredResults: { key: string; score: number }[]): { key: string; score: number }[] => scoredResults.sort((a, b) => b.score - a.score);

    private getMatchScore(keyword: string, searchValue: string): number {
        if (keyword === searchValue) {
            return Infinity;
        }

        if (keyword.startsWith(searchValue)) {
            return 1 / (keyword.length - searchValue.length + 1);
        }

        return 0;
    }

    private getTranslations = (language: Language): Map<string, string[]> => {
        const defaultTranslations = this.translationService.getEmojiKeywordTranslationsByLanguage('en') ?? new Map();

        const localeTranslations = this.translationService.getEmojiKeywordTranslationsByLanguage(language) ?? new Map();

        return ObjectHelper.combineArrayMap(defaultTranslations, localeTranslations);
    };
}
