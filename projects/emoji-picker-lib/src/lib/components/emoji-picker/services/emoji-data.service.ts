import { computed, inject, Injectable, signal } from '@angular/core';
import { emojis } from '../data';
import { Emoji, Skintone } from '../models';
import { IndividualEmojiSkintone } from '../models/skin-tone.model';
import { SkintoneSetting } from '../models/skintone-setting.model';
import { EmojiStorageService } from './emoji-storage.service';

/**
 * A service responsible for managing and providing emoji data, including skintone settings, recent emojis, and frequently used emojis.
 * This service interacts with storage to persist user preferences and frequently used emojis.
 *
 * @service
 * @providedIn root
 */
@Injectable({ providedIn: 'root' })
export class EmojiDataService {
	private emojiStorageService = inject(EmojiStorageService);

	/**
	 * A signal representing the list of recent emojis.
	 *
	 * @type {Signal<Emoji[]>}
	 */
	recentEmojis = signal<Emoji[]>([]);

	/**
	 * A signal representing the list of frequently used emojis.
	 *
	 * @type {Signal<Emoji[]>}
	 */
	frequentEmojis = signal<Emoji[]>([]);

	/**
	 * A signal representing the global skintone setting.
	 *
	 * @type {Signal<Skintone>}
	 */
	globalSkintoneSetting = signal<Skintone>('default');

	/**
	 * A signal representing individual skintone settings for specific emojis.
	 *
	 * @type {Signal<IndividualEmojiSkintone[]>}
	 */
	individualSkintones = signal<IndividualEmojiSkintone[]>([]);

	/**
	 * A signal representing the current skintone setting strategy (e.g., 'none', 'individual', 'global').
	 *
	 * @type {Signal<SkintoneSetting>}
	 */
	skintoneSetting = signal<SkintoneSetting>('none');

	/**
	 * A signal representing the list of all available emojis.
	 *
	 * @type {Signal<Emoji[]>}
	 */
	emojis = signal<Emoji[]>([...emojis]);

	/**
	 * A computed map of emojis by their ID, taking into account skintone settings.
	 *
	 * @type {Signal<Map<string, Emoji>>}
	 */
	emojiMap = computed(
		(): Map<string, Emoji> =>
			this.generateEmojiMap(
				this.emojis(),
				this.skintoneSetting(),
				this.globalSkintoneSetting(),
				this.individualSkintones()
			)
	);

	constructor() {
		this.globalSkintoneSetting.update(() =>
			this.fetchGlobalSkintone()
		);

		this.individualSkintones.update(() =>
			this.emojiStorageService.fetchIndividualEmojisSkintones()
		);

		this.recentEmojis.update(() =>
			this.fetchRecentEmojisFromStorage()
		);

		this.frequentEmojis.update(() =>
			this.fetchFrequentEmojisFromStorage()
		);
	}

	/**
	 * Updates the skintone for a specific emoji and persists the change in storage.
	 * @group Method
	 * @param {string} emojiId - The ID of the emoji to update.
	 * @param {string} value - The new skintone value for the emoji.
	 * @returns {void}
	 */
	updateEmojiSkintone = (emojiId: string, value: string): void => {
		this.emojiStorageService.updateEmojiSkintone(emojiId, value);
		this.individualSkintones.set(
			this.emojiStorageService.fetchIndividualEmojisSkintones()
		);
	};

	/**
	 * Fetches the global skintone setting from storage.
	 * @group Method
	 * @returns {Skintone} The global skintone setting.
	 */
	fetchGlobalSkintone = (): Skintone => {
		return this.emojiStorageService.fetchGlobalSkintone();
	};

	/**
	 * Retrieves the skintone-specific version of an emoji based on the provided skintone.
	 * @group Method
	 * @param {Emoji} emoji - The emoji to retrieve the skintone for.
	 * @param {Skintone} skintone - The skintone to apply.
	 * @returns {string} The emoji value corresponding to the provided skintone.
	 */
	fetchSkintoneFromEmoji = (
		emoji: Emoji,
		skintone: Skintone
	): string => {
		if (!emoji.skintones) {
			return emoji.value;
		}
		const skintoneObj = emoji.skintones.find(
			(s) => s.skintone === skintone
		);

		return skintoneObj ? skintoneObj.value : emoji.value;
	};

	/**
	 * Fetches an emoji by its ID.
	 * @group Method
	 * @param {string} id - The ID of the emoji to retrieve.
	 * @returns {Emoji | undefined} The emoji with the specified ID, or undefined if not found.
	 */
	fetchEmojiById = (id: string): Emoji | undefined => {
		const emojiMap = this.emojiMap();
		return emojiMap?.get(id);
	};

	/**
	 * Fetches multiple emojis by their IDs.
	 * @group Method
	 * @param {string[]} emojiIds - The list of emoji IDs to retrieve.
	 * @returns {Emoji[]} The list of emojis matching the provided IDs.
	 */
	fetchEmojisByIds = (emojiIds: string[]): Emoji[] => {
		return emojiIds
			.map((id) => this.fetchEmojiById(id))
			.filter((emoji): emoji is Emoji => !!emoji);
	};

	/**
	 * Retrieves the full list of available emojis.
	 * @group Method
	 * @returns {Emoji[]} The list of available emojis.
	 */
	getEmojis = (): Emoji[] => {
		return this.emojis();
	};

	/**
	 * Generates a map of emojis by their ID, applying skintone settings.
	 * @group Method
	 * @param {Emoji[]} emojis - The list of emojis to map.
	 * @param {SkintoneSetting} skintoneSetting - The skintone setting strategy.
	 * @param {Skintone} globalSkintoneSetting - The global skintone setting.
	 * @param {IndividualEmojiSkintone[]} individualEmojiSkintones - The list of individual skintone settings.
	 * @returns {Map<string, Emoji>} A map of emojis by their ID, considering skintone settings.
	 */
	generateEmojiMap = (
		emojis: Emoji[],
		skintoneSetting: SkintoneSetting,
		globalSkintoneSetting: Skintone,
		individualEmojiSkintones: IndividualEmojiSkintone[]
	): Map<string, Emoji> => {
		return new Map(
			emojis.map((emoji) => [
				emoji.id,
				this.getEmojiBySkintoneSettings(
					emoji,
					skintoneSetting,
					globalSkintoneSetting,
					individualEmojiSkintones
				),
			])
		);
	};

	/**
	 * Retrieves an emoji by applying the appropriate skintone settings.
	 * @group Method
	 * @param {Emoji} emoji - The emoji to process.
	 * @param {SkintoneSetting} skintoneSetting - The skintone setting strategy.
	 * @param {Skintone} globalSkintoneSetting - The global skintone setting.
	 * @param {IndividualEmojiSkintone[]} individualEmojisSkintones - The list of individual skintone settings.
	 * @returns {Emoji} The emoji with the applied skintone settings.
	 */
	getEmojiBySkintoneSettings = (
		emoji: Emoji,
		skintoneSetting: SkintoneSetting,
		globalSkintoneSetting: Skintone,
		individualEmojisSkintones: IndividualEmojiSkintone[]
	): Emoji => {
		if (
			!emoji.skintones ||
			emoji.skintones.length === 0 ||
			skintoneSetting === 'none'
		) {
			return emoji;
		}

		if (skintoneSetting === 'individual') {
			const individualEmoji = individualEmojisSkintones.find(
				(e) => e.emojiId === emoji.id
			);

			return !!individualEmoji
				? Object.assign(
						{ ...emoji },
						{ value: individualEmoji.emojiValue }
				  )
				: emoji;
		}

		const alternativeSkintone = emoji.skintones.find(
			(skintone) => skintone.skintone === globalSkintoneSetting
		);

		return Object.assign(
			{ ...emoji },
			{
				value: alternativeSkintone
					? alternativeSkintone.value
					: emoji.value,
			}
		);
	};

	/**
	 * Determines whether an emoji has skintone variations available.
	 * @group Method
	 * @param {Emoji} emoji - The emoji to check.
	 * @returns {boolean} True if the emoji has skintone variations, otherwise false.
	 */
	hasEmojiSkintones = (emoji: Emoji): boolean => {
		return !!emoji.skintones && emoji.skintones.length > 0;
	};

	/**
	 * Fetches the list of recent emojis from storage.
	 * @group Method
	 * @returns {Emoji[]} The list of recent emojis.
	 */
	fetchRecentEmojisFromStorage = (): Emoji[] => {
		const emojiIds =
			this.emojiStorageService.retrieveFromStorage<string>('recent');

		return this.fetchEmojisByIds(emojiIds).map((emoji) =>
			Object.assign({ ...emoji }, { category: 'suggestions' })
		);
	};

	/**
	 * Fetches the list of frequently used emojis from storage.
	 * @group Method
	 * @returns {Emoji[]} The list of frequently used emojis.
	 */
	fetchFrequentEmojisFromStorage = (): Emoji[] => {
		const frequentEmojis =
			this.emojiStorageService.fetchFrequentEmojis();

		return this.fetchEmojisByIds(
			frequentEmojis.map((frequentEmoji) => frequentEmoji.id)
		).map((emoji) =>
			Object.assign({ ...emoji }, { category: 'suggestions' })
		);
	};

	/**
	 * Adds an emoji to the list of recent emojis and updates the storage.
	 * @group Method
	 * @param {string} id - The ID of the emoji to add.
	 * @returns {void}
	 */
	addEmojiToRecents = (id: string): void => {
		const emojiIds = this.emojiStorageService.prependIdToStorage(
			'recent',
			id
		);
		const emojis = this.fetchEmojisByIds(emojiIds).map((emoji) =>
			Object.assign({ ...emoji }, { category: 'suggestions' })
		);

		this.recentEmojis.set(emojis);
	};

	/**
	 * Increases the frequency count of an emoji and updates the list of frequent emojis in storage.
	 * @group Method
	 * @param {string} id - The ID of the emoji to update.
	 * @returns {void}
	 */
	increaseEmojiFrequency = (id: string): void => {
		const frequentEmojis =
			this.emojiStorageService.increaseEmojiFrequency(id);

		const emojis = this.fetchEmojisByIds(
			frequentEmojis.map((frequentEmoji) => frequentEmoji.id)
		).map((emoji) =>
			Object.assign({ ...emoji }, { category: 'suggestions' })
		);

		this.frequentEmojis.set(emojis);
	};

	/**
	 * Sets the skintone setting strategy.
	 * @group Method
	 * @param {SkintoneSetting} setting - The skintone setting strategy to apply.
	 * @returns {void}
	 */
	setSkintoneSetting = (setting: SkintoneSetting): void => {
		this.skintoneSetting.set(setting);
	};

	/**
	 * Sets the global skintone and updates the setting in storage.
	 * @group Method
	 * @param {Skintone} skintone - The global skintone to set.
	 * @returns {void}
	 */
	setGlobalEmojiSkintone = (skintone: Skintone): void => {
		this.emojiStorageService.updateGlobalSkintone(skintone);
		this.globalSkintoneSetting.update(() => skintone);
	};

	/*

	getAllKeywords = (): any => {
		const result: any = {};

		emojis.forEach((emoji) => {
			result[emoji.id] = [
				emoji.keywords.map((keyword) => keyword.replaceAll('_', ' ')),
				emoji.name,
			].flat();
		});

		return result;
	};


	loseDuplicates = (): any => {
		const obj: any = {};
		Object.keys(deKeywordTranslations).forEach((key: string) => {
			obj[key] = [
				...new Set(
					deKeywordTranslations[key].map((k: string) =>
						k.toLowerCase()
					)
				),
			];
		});

		return obj;
	};
	*/
}
