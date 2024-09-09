import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';

@Component({
    selector: 'ch-button-icon',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './button-icon.component.html',
    styleUrl: './button-icon.component.scss'
})
export class ButtonIconComponent {}
