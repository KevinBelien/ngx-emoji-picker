import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconComponent } from '@chit-chat/ngx-emoji-picker/lib/components/icon';

@Component({
    selector: 'ch-icon-basic',
    standalone: true,
    imports: [CommonModule, IconComponent],
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss'
})
export class IconBasicComponent {}
