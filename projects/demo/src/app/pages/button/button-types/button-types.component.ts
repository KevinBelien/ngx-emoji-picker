import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent, ButtonType } from '@chit-chat/ngx-emoji-picker/lib/components/button';

@Component({
    selector: 'ch-button-types',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './button-types.component.html',
    styleUrl: './button-types.component.scss'
})
export class ButtonTypesComponent {
    buttonTypes: ButtonType[] = ['primary', 'success', 'danger', 'warning', 'info', 'contrast'];

    constructor() {}
}
