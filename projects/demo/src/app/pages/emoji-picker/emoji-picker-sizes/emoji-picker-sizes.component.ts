import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmojiPickerComponent, EmojiSizeOption } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';

@Component({
    selector: 'ch-emoji-picker-sizes',
    standalone: true,
    imports: [CommonModule, EmojiPickerComponent, FormsModule],
    templateUrl: './emoji-picker-sizes.component.html',
    styleUrl: './emoji-picker-sizes.component.scss'
})
export class EmojiPickerSizesComponent {
    sizes: EmojiSizeOption[] = ['xs', 'sm', 'default', 'lg', 'xl'];
    selectedSize = signal<EmojiSizeOption>('xl');
}
