import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmojiCategory, EmojiPickerComponent } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';

@Component({
    selector: 'ch-emoji-picker-categories',
    standalone: true,
    imports: [CommonModule, EmojiPickerComponent],
    templateUrl: './emoji-picker-categories.component.html',
    styleUrl: './emoji-picker-categories.component.scss'
})
export class EmojiPickerCategoriesComponent {
    emojiCategories: EmojiCategory[] = ['food-drink', 'animals-nature', 'travel-places', 'objects', 'activities', 'smileys-people'];
}
