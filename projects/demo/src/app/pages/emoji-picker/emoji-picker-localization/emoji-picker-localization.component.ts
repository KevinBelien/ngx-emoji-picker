import { Component, inject, OnInit } from '@angular/core';
import { EmojiPickerComponent } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';
import { nlTranslations, TranslationService } from '@chit-chat/ngx-emoji-picker/lib/localization';

@Component({
    selector: 'ch-emoji-picker-localization',
    standalone: true,
    imports: [EmojiPickerComponent],
    templateUrl: './emoji-picker-localization.component.html',
    styleUrl: './emoji-picker-localization.component.scss'
})
export class EmojiPickerLocalizationComponent implements OnInit {
    private translationService = inject(TranslationService);

    ngOnInit(): void {
        this.translationService.loadTranslations('nl', nlTranslations);
        this.translationService.setLanguage('nl');
    }
}
