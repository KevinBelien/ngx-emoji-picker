import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent, ButtonType } from '@chit-chat/ngx-emoji-picker/lib/components/button';

@Component({
    selector: 'ch-button-outline',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './button-outline.component.html',
    styleUrl: './button-outline.component.scss'
})
export class ButtonOutlineComponent {
    buttonTypes: ButtonType[] = ['primary', 'success', 'danger', 'warning', 'info', 'contrast'];

    constructor() {
        window.addEventListener('message', (event) => {
            // Make sure the message is coming from the trusted source (Docusaurus)
            if (event.origin !== window.location.origin) {
                return;
            }

            // Check if the event contains a valid theme
            const { theme } = event.data;
            if (theme && (theme === 'dark' || theme === 'light')) {
                console.log('gets to theme change in angular');
                // Check if the theme is already applied to avoid redundant updates
                document.documentElement.setAttribute('data-theme', theme);
            }
        });
    }
}
