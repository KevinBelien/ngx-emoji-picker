import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmojiPickerComponent } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';

@Component({
    selector: 'ch-emoji-picker-category-bar-position',
    standalone: true,
    imports: [CommonModule, EmojiPickerComponent],
    templateUrl: './emoji-picker-category-bar-position.component.html',
    styleUrl: './emoji-picker-category-bar-position.component.scss'
})
export class EmojiPickerCategoryBarPositionComponent {}
