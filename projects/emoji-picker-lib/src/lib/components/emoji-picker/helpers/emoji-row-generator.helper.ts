import { Emoji, EmojiCategory, EmojiPickerRow } from '../models';
import { EmojiDataHelper } from './emoji-data.helper';

export class EmojiRowGenerator {
	constructor(
		private config: {
			emojisPerRow: number;
			generateCategoryRows: boolean;
		}
	) {}

	generateEmojiRows(emojis: Emoji[]): EmojiPickerRow[] {
		const groupedEmojis =
			EmojiDataHelper.groupEmojisByCategory(emojis);

		return Object.entries(groupedEmojis).flatMap(
			([category, emojis]) =>
				this.generateEmojiRowsPerCategory(
					{ category: category as EmojiCategory },
					emojis
				)
		);
	}

	generateEmojiRowsPerCategory(
		categoryConfig: {
			category: EmojiCategory | 'search';
			translationKey?: string;
		},
		emojis: Emoji[]
	): EmojiPickerRow[] {
		const rows: EmojiPickerRow[] = this.createEmojiRows(emojis);

		if (this.config.generateCategoryRows) {
			rows.unshift(
				this.createCategoryRow(
					categoryConfig.category,
					categoryConfig.translationKey ||
						`emojipicker.category.${categoryConfig.category}`
				)
			);
		}

		return rows;
	}

	private createEmojiRows(emojis: Emoji[]): EmojiPickerRow[] {
		const { emojisPerRow } = this.config;

		return Array.from(
			{ length: Math.ceil(emojis.length / emojisPerRow) },
			(_, index) => ({
				id: crypto.randomUUID(),
				type: 'emoji',
				value: emojis.slice(
					index * emojisPerRow,
					(index + 1) * emojisPerRow
				),
			})
		);
	}

	private createCategoryRow(
		category: EmojiCategory | 'search',
		translationKey: string
	): EmojiPickerRow {
		return {
			id: crypto.randomUUID(),
			type: 'category',
			value: category,
			translationKey: translationKey,
		};
	}
}
