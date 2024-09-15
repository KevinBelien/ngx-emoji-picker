import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';
import { EmojiPickerComponent, EmojiSelectedEvent } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';
import { TextBoxComponent } from '@chit-chat/ngx-emoji-picker/lib/components/text-box';

@Component({
    selector: 'ch-emoji-picker-basic',
    standalone: true,
    imports: [CommonModule, EmojiPickerComponent, TextBoxComponent],
    templateUrl: './emoji-picker-basic.component.html',
    styleUrl: './emoji-picker-basic.component.scss'
})
export class EmojiPickerBasicComponent {
    inputValue = model<string>('');

    handleEmojiSelected = (evt: EmojiSelectedEvent) => {
        this.inputValue.update((previous) => (previous += evt.emoji.value));
    };
}
