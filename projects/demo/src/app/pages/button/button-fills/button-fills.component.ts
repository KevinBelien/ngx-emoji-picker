import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent, ButtonFill } from '@chit-chat/ngx-emoji-picker/lib/components/button';

@Component({
    selector: 'ch-button-fills',
    imports: [CommonModule, ButtonComponent],
    templateUrl: './button-fills.component.html',
    styleUrl: './button-fills.component.scss'
})
export class ButtonFillsComponent {
    fills: ButtonFill[] = ['solid', 'outlined', 'clear'];
}
