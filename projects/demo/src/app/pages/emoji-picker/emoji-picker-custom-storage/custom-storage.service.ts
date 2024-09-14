import { Injectable } from '@angular/core';
import { Emoji, Skintone } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';
import { IndividualEmojiSkintone } from './../../../../../../emoji-picker-lib/lib/components/emoji-picker/models/skin-tone.model';

export const suggestionEmojis: string[] = ['heart-hands', 'pile-of-poo', 'clown-face', 'melting-face'];

export const globalSkintone: Skintone = 'light';

export const individualEmojiSkintones: IndividualEmojiSkintone[] = [
    {
        emojiId: 'heart-hands',
        emojiValue: '🫶🏽'
    },
    {
        emojiId: 'pinching-hand',
        emojiValue: '🤏🏽'
    },
    {
        emojiId: 'foot',
        emojiValue: '🦶🏽'
    },
    {
        emojiId: 'rightwards-hand',
        emojiValue: '🫱🏿'
    },
    {
        emojiId: 'raised-fist',
        emojiValue: '✊'
    }
];

@Injectable()
export class CustomStorageService {
    getCustomSuggestions = (): string[] => suggestionEmojis;

    getGlobalSkintone = (): Skintone => globalSkintone;

    getIndividualEmojiSkintones = (): IndividualEmojiSkintone[] => individualEmojiSkintones;

    addEmojiToRecents = (emojiId: string) => {
        const emojis = this.getCustomSuggestions();
        emojis.unshift(emojiId);
        const recents = [...new Set(emojis)];

        //SAVE TO YOUR OWN STORAGE HERE

        return recents;
    };

    addIndividualEmojiSkintone = (data: Emoji): IndividualEmojiSkintone[] => {
        const individualEmojiSkintones = this.getIndividualEmojiSkintones();
        //SAVE TO YOUR OWN STORAGE HERE

        return [...individualEmojiSkintones.filter((emoji) => emoji.emojiId !== data.id), { emojiId: data.id, emojiValue: data.value }];
    };

    saveGlobalSkintone = (skintone: Skintone) =>
        //SAVE TO YOUR OWN STORAGE HERE
        skintone;
}
