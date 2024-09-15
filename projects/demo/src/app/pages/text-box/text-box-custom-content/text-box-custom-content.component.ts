import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';
import { IconComponent } from '@chit-chat/ngx-emoji-picker/lib/components/icon';
import { TextBoxComponent, TextBoxMode } from '@chit-chat/ngx-emoji-picker/lib/components/text-box';

@Component({
    selector: 'ch-text-box-custom-content',
    standalone: true,
    imports: [CommonModule, TextBoxComponent, ButtonComponent, IconComponent],
    templateUrl: './text-box-custom-content.component.html',
    styleUrl: './text-box-custom-content.component.scss'
})
export class TextBoxCustomContentComponent {
    value = signal<string>('');
    mode = signal<TextBoxMode>('password');

    handleTogglePassword = (evt: MouseEvent) => {
        evt.stopPropagation();
        this.mode.update((previousMode) => (previousMode === 'password' ? 'text' : 'password'));
    };
}
