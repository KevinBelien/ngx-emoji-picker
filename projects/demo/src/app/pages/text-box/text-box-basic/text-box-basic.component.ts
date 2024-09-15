import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TextBoxComponent } from '@chit-chat/ngx-emoji-picker/lib/components/text-box';

@Component({
    selector: 'ch-text-box-basic',
    standalone: true,
    imports: [CommonModule, TextBoxComponent],
    templateUrl: './text-box-basic.component.html',
    styleUrl: './text-box-basic.component.scss'
})
export class TextBoxBasicComponent {
    value = signal<string>('');
}
