import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonComponent, ButtonIconProps } from '@chit-chat/ngx-emoji-picker/lib/components/button';
import { DialogComponent } from '@chit-chat/ngx-emoji-picker/lib/components/dialog';
import { TextBoxComponent } from '@chit-chat/ngx-emoji-picker/lib/components/text-box';

@Component({
    selector: 'ch-dialog-templates',
    standalone: true,
    imports: [CommonModule, DialogComponent, ButtonComponent, TextBoxComponent],
    templateUrl: './dialog-templates.component.html',
    styleUrl: './dialog-templates.component.scss'
})
export class DialogTemplatesComponent {
    visible = signal<boolean>(false);

    closeIconConfig: Partial<ButtonIconProps> = { path: 'm256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z', height: 19, width: 19 };

    handleClick = (_evt: MouseEvent) => {
        this.visible.set(true);
    };

    close = (evt: MouseEvent) => {
        evt.stopPropagation();
        this.visible.set(false);
    };
}
