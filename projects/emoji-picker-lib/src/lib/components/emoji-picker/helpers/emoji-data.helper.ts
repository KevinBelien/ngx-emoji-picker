import { Emoji, EmojiCategory } from '../models';

export class EmojiDataHelper {
	public static groupEmojisByCategory(
		emojis: Emoji[]
	): Partial<Record<EmojiCategory, Emoji[]>> {
		return emojis.reduce<Partial<Record<EmojiCategory, Emoji[]>>>(
			(acc, emoji) => {
				(acc[emoji.category] ||= []).push(emoji);
				return acc;
			},
			{}
		);
	}

	public static filterEmojisByCategories = (
		emojis: Emoji[],
		includedCategories: EmojiCategory[]
	): Emoji[] => {
		return emojis.filter((emoji) =>
			includedCategories.includes(emoji.category)
		);
	};

	public static filterAndSortEmojis = (
		emojis: Emoji[],
		categories: EmojiCategory[]
	): Emoji[] => {
		const filteredEmojis = EmojiDataHelper.filterEmojisByCategories(
			[...emojis],
			categories
		);
		return EmojiDataHelper.sortEmojis(filteredEmojis, categories);
	};

	public static sortEmojis = (
		emojis: Emoji[],
		categories: EmojiCategory[]
	): Emoji[] => {
		return emojis.sort((a, b) => {
			const categoryComparison =
				categories.indexOf(a.category) -
				categories.indexOf(b.category);
			if (categoryComparison !== 0) {
				return categoryComparison;
			}
			return a.order - b.order;
		});
	};
}
