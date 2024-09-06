import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject, Input, model, output, Renderer2 } from '@angular/core';
import { ClickEvent, ClickTouchHoldDirective, PreventContextMenuDirective } from '@chit-chat/ngx-emoji-picker/lib/utils';
import { Emoji } from '../../models';
import { EmojiButtonComponent } from '../emoji-button/emoji-button.component';

/**
 * A component for selecting different skintones of an emoji.
 * @component
 */
@Component({
    selector: 'ch-emoji-skintone-picker',
    standalone: true,
    imports: [CommonModule, EmojiButtonComponent, ClickTouchHoldDirective, PreventContextMenuDirective],
    templateUrl: './emoji-skintone-picker.component.html',
    styleUrl: './emoji-skintone-picker.component.scss',
    hostDirectives: [PreventContextMenuDirective],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'collision-id': crypto.randomUUID(),
        class: 'ch-element'
    }
})
export class EmojiSkintonePickerComponent {
    private renderer = inject(Renderer2);

    /**
     * Specifies the emoji that should be displayed.
     * @group TwoWayBindings
     */
    emoji = model<Emoji | null>(null);

    /**
     * Specifies the font size of the emoji in pixels.
     * @group Props
     */
    @Input()
    @HostBinding('style.--ch-emoji-fontsize')
    emojiSizeInPx?: number;

    /**
     * Specifies the button size of the emoji in pixels.
     * @group Props
     */
    @Input()
    @HostBinding('style.--ch-emoji-buttonsize')
    emojiButtonSizeInPx?: number;

    /**
     * Callback function to be executed when a skintone is selected.
     * @param {ClickEvent} clickEvent - The event object representing the user's selection.
     * @group Outputs
     */
    onSelectionChanged = output<ClickEvent>();

    readonly dataAttribute = 'data-skintone';

    constructor() {}

    protected handleEmojiClick = (evt: ClickEvent) => {
        if (evt.action === 'right-click') return;
        this.onSelectionChanged.emit(evt);
    };
}
