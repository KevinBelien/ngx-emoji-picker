import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';
import { DialogComponent } from '@chit-chat/ngx-emoji-picker/lib/components/dialog';

@Component({
    selector: 'ch-dialog-draggable',
    standalone: true,
    imports: [CommonModule, DialogComponent, ButtonComponent],
    templateUrl: './dialog-draggable.component.html',
    styleUrl: './dialog-draggable.component.scss'
})
export class DialogDraggableComponent {
    visible = signal<boolean>(false);

    handleClick = (_evt: MouseEvent) => {
        this.visible.set(true);
    };
}
