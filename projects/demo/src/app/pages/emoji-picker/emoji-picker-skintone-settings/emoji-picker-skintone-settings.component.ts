import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmojiPickerComponent, SkintoneSetting } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';

@Component({
    selector: 'ch-emoji-picker-skintone-settings',
    standalone: true,
    imports: [CommonModule, EmojiPickerComponent, FormsModule],
    templateUrl: './emoji-picker-skintone-settings.component.html',
    styleUrl: './emoji-picker-skintone-settings.component.scss'
})
export class EmojiPickerSkintoneSettingsComponent {
    skintoneSettings: SkintoneSetting[] = ['global', 'individual', 'both', 'none'];
    selectedSetting = signal<SkintoneSetting>('global');
}
