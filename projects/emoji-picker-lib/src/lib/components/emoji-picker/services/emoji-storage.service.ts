import { Injectable } from '@angular/core';
import {
	FrequentEmoji,
	IndividualEmojiSkintone,
	isValidSkintone,
	Skintone,
} from '../models';

/**
 * A service responsible for managing emoji-related data in localStorage,
 * including recent emojis, frequently used emojis, and skintone settings.
 *
 * @service
 * @providedIn root
 */
@Injectable({ providedIn: 'root' })
export class EmojiStorageService {
	readonly STORAGE_CONFIG = {
		recent: { key: 'ch-recent-emojis', limit: 100 },
		frequent: { key: 'ch-emojis-frequently', limit: 100 },
		emojisSkintone: { key: 'ch-emojis-skintone', limit: 100 },
		globalSkintone: { key: 'ch-emojis-global-skintone' },
	} as const;

	/**
	 * Retrieves data from localStorage based on the provided storage key.
	 * @group Method
	 * @template T
	 * @param {keyof typeof STORAGE_CONFIG} storageKey - The key for the storage configuration.
	 * @returns {T[]} The data retrieved from localStorage.
	 */
	retrieveFromStorage = <T>(
		storageKey: keyof typeof this.STORAGE_CONFIG
	): T[] => {
		const response = localStorage.getItem(
			this.STORAGE_CONFIG[storageKey].key
		);
		return !!response ? (JSON.parse(response) as T[]) : [];
	};

	/**
	 * Stores data in localStorage under the specified storage key.
	 * @group Method
	 * @template T
	 * @param {keyof typeof STORAGE_CONFIG} storageKey - The key for the storage configuration.
	 * @param {T} data - The data to store in localStorage.
	 * @returns {void}
	 */
	storeInStorage = <T>(
		storageKey: keyof typeof this.STORAGE_CONFIG,
		data: T
	): void => {
		localStorage.setItem(
			this.STORAGE_CONFIG[storageKey].key,
			JSON.stringify(data)
		);
	};

	/**
	 * Prepends id to the beginning of the array in localStorage,
	 * ensuring that the data does not exceed the configured limit.
	 * @group Method
	 * @template T
	 * @param {keyof typeof STORAGE_CONFIG} storageKey - The key for the storage configuration.
	 * @param {string} data - The id to prepend.
	 * @returns {string[]} The updated id array stored in localStorage.
	 */
	prependIdToStorage = (
		storageKey: keyof typeof this.STORAGE_CONFIG,
		id: string
	): string[] => {
		const config = this.STORAGE_CONFIG[storageKey];

		let emojis = this.retrieveFromStorage<string>(storageKey);
		emojis.unshift(id);
		emojis = [...new Set(emojis)];
		if ('limit' in config && emojis.length > config.limit) {
			emojis = emojis.slice(0, config.limit);
		}
		localStorage.setItem(config.key, JSON.stringify(emojis));

		return emojis;
	};

	/**
	 * Fetches the list of frequently used emojis from localStorage, sorted by frequency and date.
	 * @group Method
	 * @returns {FrequentEmoji[]} The sorted list of frequently used emojis.
	 */
	fetchFrequentEmojis = (): FrequentEmoji[] => {
		const frequentEmojis =
			this.retrieveFromStorage<FrequentEmoji>('frequent');
		return this.sortFrequentEmojis(frequentEmojis);
	};

	/**
	 * Increases the usage frequency of an emoji and stores the updated data in localStorage.
	 * @group Method
	 * @param {string} id - The ID of the emoji to update.
	 * @returns {FrequentEmoji[]} The updated list of frequently used emojis.
	 */
	increaseEmojiFrequency = (id: string): FrequentEmoji[] => {
		const config = this.STORAGE_CONFIG.frequent;
		const dateInMs = Date.now();

		let frequentEmojis =
			this.retrieveFromStorage<FrequentEmoji>('frequent');

		const emojiIndex = frequentEmojis.findIndex(
			(emoji) => emoji.id === id
		);

		if (emojiIndex > -1) {
			frequentEmojis[emojiIndex].count += 1;
			frequentEmojis[emojiIndex].dateInMs = dateInMs;
		} else {
			frequentEmojis.push({ id, count: 1, dateInMs: dateInMs });
		}

		if (frequentEmojis.length > config.limit) {
			frequentEmojis = this.sortFrequentEmojis(frequentEmojis, true);
			frequentEmojis = frequentEmojis.slice(0, config.limit);
		}

		this.storeInStorage<FrequentEmoji[]>('frequent', frequentEmojis);

		return this.sortFrequentEmojis(frequentEmojis);
	};

	/**
	 * Sorts an array of frequent emojis first by count, then by date.
	 * @group Method
	 * @param {FrequentEmoji[]} emojis - The array of frequent emojis to sort.
	 * @param {boolean} [sortDateDescending=false] - Whether to sort dates in descending order.
	 * @returns {FrequentEmoji[]} The sorted array of frequent emojis.
	 */
	sortFrequentEmojis = (
		emojis: FrequentEmoji[],
		sortDateDescending: boolean = false
	): FrequentEmoji[] => {
		return emojis.sort((a, b) => {
			if (b.count !== a.count) {
				return b.count - a.count;
			}
			return sortDateDescending
				? b.dateInMs - a.dateInMs
				: a.dateInMs - b.dateInMs;
		});
	};

	/**
	 * Fetches the individual skintone settings for emojis from localStorage.
	 * @group Method
	 * @returns {IndividualEmojiSkintone[]} The list of individual skintone settings.
	 */
	fetchIndividualEmojisSkintones = (): IndividualEmojiSkintone[] => {
		return this.retrieveFromStorage<IndividualEmojiSkintone>(
			'emojisSkintone'
		);
	};

	/**
	 * Updates or adds a skintone setting for a specific emoji and stores the data in localStorage.
	 * @group Method
	 * @param {string} emojiId - The ID of the emoji to update.
	 * @param {string} emojiValue - The value representing the skintone.
	 * @returns {IndividualEmojiSkintone[]} The updated list of individual emoji skintone settings.
	 */
	updateEmojiSkintone = (
		emojiId: string,
		emojiValue: string
	): IndividualEmojiSkintone[] => {
		const storageEmojiSkintones =
			this.fetchIndividualEmojisSkintones();

		const dto: IndividualEmojiSkintone = { emojiId, emojiValue };

		const index = storageEmojiSkintones.findIndex(
			(record) => record.emojiId === emojiId
		);

		if (index !== -1) {
			// If found, replace the existing record
			storageEmojiSkintones[index] = dto;
		} else {
			// If not found, add the new record
			storageEmojiSkintones.push(dto);
		}
		this.storeInStorage<IndividualEmojiSkintone[]>(
			'emojisSkintone',
			storageEmojiSkintones
		);

		return storageEmojiSkintones;
	};

	/**
	 * Fetches the global skintone setting from localStorage.
	 * @group Method
	 * @returns {Skintone} The global skintone setting.
	 */
	fetchGlobalSkintone = (): Skintone => {
		const response = localStorage.getItem(
			this.STORAGE_CONFIG.globalSkintone.key
		);
		return !!response && isValidSkintone(response)
			? (response as Skintone)
			: 'default';
	};

	/**
	 * Updates the global skintone setting in localStorage.
	 * @group Method
	 * @param {Skintone} skintone - The skintone setting to store.
	 * @returns {void}
	 */
	updateGlobalSkintone = (skintone: Skintone): void => {
		if (!isValidSkintone(skintone)) return;
		localStorage.setItem(
			this.STORAGE_CONFIG.globalSkintone.key,
			skintone
		);
	};
}
