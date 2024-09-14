import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmojiPickerComponent } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';

@Component({
    selector: 'ch-emoji-picker-headerless',
    standalone: true,
    imports: [CommonModule, EmojiPickerComponent],
    templateUrl: './emoji-picker-headerless.component.html',
    styleUrl: './emoji-picker-headerless.component.scss'
})
export class EmojiPickerHeaderlessComponent {}
