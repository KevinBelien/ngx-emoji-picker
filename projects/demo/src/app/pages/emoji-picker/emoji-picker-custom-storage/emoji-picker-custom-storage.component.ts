import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmojiPickerComponent, EmojiSelectedEvent, EmojiSelectionSource, IndividualEmojiSkintone, Skintone, SkintoneSetting, StorageConfig } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';
import { CustomStorageService } from './custom-storage.service';

@Component({
    selector: 'ch-emoji-picker-custom-storage',
    standalone: true,
    imports: [CommonModule, EmojiPickerComponent, FormsModule],
    providers: [CustomStorageService],
    templateUrl: './emoji-picker-custom-storage.component.html',
    styleUrl: './emoji-picker-custom-storage.component.scss'
})
export class EmojiPickerCustomStorageComponent {
    private storageService = inject(CustomStorageService);
    suggestionEmojis: WritableSignal<string[]>;
    globalSkintone: WritableSignal<Skintone>;
    individualEmojiSkintones: WritableSignal<IndividualEmojiSkintone[]>;

    skintoneSetting = signal<SkintoneSetting>('individual');

    storageConfig = computed(
        (): StorageConfig => ({
            suggestionEmojis: { storage: 'custom', value: this.suggestionEmojis() },
            globalSkintone: { storage: 'custom', value: this.globalSkintone() },
            individualSkintones: { storage: 'custom', value: this.individualEmojiSkintones() }
        })
    );

    constructor() {
        this.suggestionEmojis = signal<string[]>(this.storageService.getCustomSuggestions());
        this.globalSkintone = signal<Skintone>(this.storageService.getGlobalSkintone());
        this.individualEmojiSkintones = signal<IndividualEmojiSkintone[]>(this.storageService.getIndividualEmojiSkintones());
    }

    handleEmojiSelected = (evt: EmojiSelectedEvent) => {
        this.suggestionEmojis.set(this.storageService.addEmojiToRecents(evt.emoji.id));

        if (evt.source === EmojiSelectionSource.EmojiSkintonePicker) {
            this.individualEmojiSkintones.set(this.storageService.addIndividualEmojiSkintone(evt.emoji));
        }
    };

    handleGlobalSkintoneChanged = (skintone: Skintone) => {
        this.globalSkintone.set(this.storageService.saveGlobalSkintone(skintone));
    };
}
