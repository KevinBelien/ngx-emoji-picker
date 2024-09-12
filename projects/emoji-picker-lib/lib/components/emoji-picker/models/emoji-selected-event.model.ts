import { Emoji } from './emoji.model';

export interface EmojiSelectedEvent {
    emoji: Emoji;
    source: EmojiSelectionSource;
}

export enum EmojiSelectionSource {
    EmojiPicker = 'emojiPicker',
    EmojiSkintonePicker = 'emojiSkintonetonePicker',
    NONE = 'none'
}
