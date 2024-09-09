import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';

@Component({
    selector: 'ch-button-raised',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './button-raised.component.html',
    styleUrl: './button-raised.component.scss'
})
export class ButtonRaisedComponent {}
