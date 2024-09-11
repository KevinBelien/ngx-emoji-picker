import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';
import { DialogComponent } from '@chit-chat/ngx-emoji-picker/lib/components/dialog';

@Component({
    selector: 'ch-dialog-scroll',
    standalone: true,
    imports: [CommonModule, DialogComponent, ButtonComponent],
    templateUrl: './dialog-scroll.component.html',
    styleUrl: './dialog-scroll.component.scss'
})
export class DialogScrollComponent {
    visible = signal<boolean>(false);

    handleClick = (_evt: MouseEvent) => {
        this.visible.set(true);
    };
}
