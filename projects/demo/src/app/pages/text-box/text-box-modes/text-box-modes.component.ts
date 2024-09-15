import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TextBoxComponent } from '@chit-chat/ngx-emoji-picker/lib/components/text-box';

@Component({
    selector: 'ch-text-box-modes',
    standalone: true,
    imports: [CommonModule, TextBoxComponent],
    templateUrl: './text-box-modes.component.html',
    styleUrl: './text-box-modes.component.scss'
})
export class TextBoxModesComponent {}
