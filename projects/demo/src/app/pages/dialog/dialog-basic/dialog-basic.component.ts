import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';
import { DialogComponent } from '@chit-chat/ngx-emoji-picker/lib/components/dialog';
import { EmojiPickerComponent } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';

@Component({
    selector: 'ch-dialog-basic',
    standalone: true,
    imports: [CommonModule, DialogComponent, ButtonComponent, EmojiPickerComponent],
    templateUrl: './dialog-basic.component.html',
    styleUrl: './dialog-basic.component.scss'
})
export class DialogBasicComponent {
    buttonElement = viewChild(ButtonComponent, { read: ElementRef });
    emojiPickerComponent = viewChild(EmojiPickerComponent);

    visible = signal<boolean>(false);

    handleOnOpened = (_ref: OverlayRef) => {
        setTimeout(() => this.emojiPickerComponent()?.refreshViewport());
    };

    handleClick = (_evt: MouseEvent) => {
        this.visible.set(true);
    };
}
