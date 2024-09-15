import { ConnectedPosition, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';
import { DialogComponent } from '@chit-chat/ngx-emoji-picker/lib/components/dialog';
import { EmojiPickerComponent } from '@chit-chat/ngx-emoji-picker/lib/components/emoji-picker';

@Component({
    selector: 'ch-emoji-picker-dialog',
    standalone: true,
    imports: [CommonModule, DialogComponent, EmojiPickerComponent, ButtonComponent],
    templateUrl: './emoji-picker-dialog.component.html',
    styleUrl: './emoji-picker-dialog.component.scss'
})
export class EmojiPickerDialogComponent {
    buttonElement = viewChild(ButtonComponent, { read: ElementRef });
    emojiPickerComponent = viewChild(EmojiPickerComponent);

    visible = signal<boolean>(false);

    dialogPositions: ConnectedPosition[] = [
        {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -5
        }
    ];

    handleOnOpened = (_ref: OverlayRef) => {
        setTimeout(() => this.emojiPickerComponent()?.refreshViewport());
    };

    handleClick = (_evt: MouseEvent) => {
        this.visible.set(true);
    };
}
