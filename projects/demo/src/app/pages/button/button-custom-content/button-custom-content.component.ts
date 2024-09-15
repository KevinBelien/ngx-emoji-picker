import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';

@Component({
    selector: 'ch-button-custom-content',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './button-custom-content.component.html',
    styleUrl: './button-custom-content.component.scss'
})
export class ButtonCustomContentComponent {}
