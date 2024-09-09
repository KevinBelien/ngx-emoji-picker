import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';

@Component({
    selector: 'ch-button-states',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './button-states.component.html',
    styleUrl: './button-states.component.scss'
})
export class ButtonStatesComponent {}
