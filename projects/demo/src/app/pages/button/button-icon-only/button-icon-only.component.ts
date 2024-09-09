import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';

@Component({
    selector: 'ch-button-icon-only',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './button-icon-only.component.html',
    styleUrl: './button-icon-only.component.scss'
})
export class ButtonIconOnlyComponent {}
