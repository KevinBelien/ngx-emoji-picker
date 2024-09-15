import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent, ButtonShape } from '@chit-chat/ngx-emoji-picker/lib/components/button';

@Component({
    selector: 'ch-button-shape',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './button-shape.component.html',
    styleUrl: './button-shape.component.scss'
})
export class ButtonShapeComponent {
    shapes: ButtonShape[] = ['square', 'round'];
}
