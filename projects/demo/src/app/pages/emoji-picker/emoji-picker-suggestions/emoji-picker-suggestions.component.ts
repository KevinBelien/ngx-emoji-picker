import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmojiPickerComponent, EmojiSuggestionMode, SuggestionConfig } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';

@Component({
    selector: 'ch-emoji-picker-suggestions',
    standalone: true,
    imports: [CommonModule, EmojiPickerComponent, FormsModule],
    templateUrl: './emoji-picker-suggestions.component.html',
    styleUrl: './emoji-picker-suggestions.component.scss'
})
export class EmojiPickerSuggestionsComponent {
    suggestionModes: EmojiSuggestionMode[] = ['recent', 'frequent'];
    selectedSuggestionMode = signal<EmojiSuggestionMode>('frequent');
    limit = signal<number>(10);

    suggestionOptions = computed((): SuggestionConfig => ({ mode: this.selectedSuggestionMode(), limitToShow: this.limit() }));
}
