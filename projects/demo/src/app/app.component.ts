import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';
import { nlTranslations, TranslationService } from '@chit-chat/ngx-emoji-picker/lib/localization';

@Component({
    selector: 'ch-root',
    standalone: true,
    imports: [RouterOutlet, RouterModule, CommonModule, MatSidenavModule, MatListModule, ButtonComponent, MatToolbarModule, MatSlideToggleModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    private translationService = inject(TranslationService);
    constructor() {
        window.addEventListener('message', (event) => {
            // Check if the event contains a valid theme
            const { theme } = event.data;
            if (theme && (theme === 'dark' || theme === 'light')) {
                // Check if the theme is already applied to avoid redundant updates
                document.documentElement.setAttribute('data-theme', theme);
            }
        });

        this.translationService.loadTranslations('nl', nlTranslations);
        this.translationService.setLanguage('nl');
        // document.documentElement.setAttribute('data-theme', 'dark');
    }
}
