import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';

@Component({
    selector: 'ch-button-basic',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './button-basic.component.html',
    styleUrl: './button-basic.component.scss'
})
export class ButtonBasicComponent {
    handleClick = (_evt: MouseEvent) => {
        alert('Button clicked');
    };
}
