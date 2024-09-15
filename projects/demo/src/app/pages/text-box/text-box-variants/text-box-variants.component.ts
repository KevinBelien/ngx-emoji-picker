import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TextBoxComponent } from '@chit-chat/ngx-emoji-picker/lib/components/text-box';

@Component({
    selector: 'ch-text-box-variants',
    standalone: true,
    imports: [CommonModule, TextBoxComponent],
    templateUrl: './text-box-variants.component.html',
    styleUrl: './text-box-variants.component.scss'
})
export class TextBoxVariantsComponent {}
