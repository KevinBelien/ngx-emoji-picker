import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RippleDirective } from '@chit-chat/ngx-emoji-picker/src/lib/utils';

/**
 * A button component for displaying an emoji, with optional support for indicating skintone variations.
 * @component
 */
@Component({
    selector: 'ch-emoji-button',
    standalone: true,
    imports: [CommonModule, RippleDirective],
    templateUrl: './emoji-button.component.html',
    styleUrl: './emoji-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'collision-id': crypto.randomUUID(),
        class: 'ch-element'
    }
})
export class EmojiButtonComponent {
    /**
     * Specifies the emoji that should be displayed.
     * @group Props
     */
    emoji = input<string>();

    /**
     * This indicator signifies that skintone variations are available for the associated emoji.
     * @group Props
     * @default false
     */
    showSkintoneIndicator = input<boolean>(false);
}
