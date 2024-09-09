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
            const theme = event.data.theme;
            console.log('gets to angular theme change');
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        });
    }
}
