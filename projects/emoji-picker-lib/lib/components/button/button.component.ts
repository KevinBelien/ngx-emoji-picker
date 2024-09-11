import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, output } from '@angular/core';
import { IconComponent } from '@chit-chat/ngx-emoji-picker/lib/components/icon';
import { AutofocusDirective, RippleDirective } from '@chit-chat/ngx-emoji-picker/lib/utils';
import { ButtonIconProps, ButtonShape, ButtonType } from './models';
import { ButtonFill } from './models/button-fill.type';

/**
 * A customizable button component that supports different styles, sizes, shapes, and behaviors.
 * @component
 * @standalone
 */
@Component({
    selector: 'ch-button',
    standalone: true,
    imports: [CommonModule, IconComponent, RippleDirective, AutofocusDirective],
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'collision-id': crypto.randomUUID(),
        class: 'ch-element',
        '[class.ch-disabled]': 'disabled()'
    }
})
export class ButtonComponent {
    private elementRef = inject(ElementRef);

    /**
     * Text of the button.
     * @group Props
     */
    label = input<string>();

    /**
     * Icon of the button.
     * @group Props
     */
    icon = input<Partial<ButtonIconProps>>();

    /**
     * Specifies the name of the CSS class to be applied to the root button level.
     * @group Props
     */
    cssClass = input<string>();

    /**
     * Specifies the width of the button
     * @group Props
     */
    width = input<number>();

    /**
     * Specifies the height of the button
     * @group Props
     */
    height = input<number>();

    /**
     * 	Specifies whether the button responds to user interaction.
     * @group Props
     * @default false
     */
    disabled = input<boolean>(false);

    /**
     * Specifies whether the button changes its visual state as a result of user interaction.
     * @group Props
     * @default true
     */
    activeStateEnabled = input<boolean>(true);

    /**
     * Specifies whether the button can be focused.
     * @group Props
     * @default true
     */
    focusStateEnabled = input<boolean>(true);

    /**
     * Specifies whether the button changes its state when a user pauses on it.
     * @group Props
     * @default true
     */
    hoverStateEnabled = input<boolean>(true);

    /**
     * Specifies the button's visual type.
     * @group Props
     * @default 'primary'
     */
    type = input<ButtonType>('primary');

    /**
     * Specifies how the button is styled.
     * @group Props
     * @default 'solid'
     */
    fill = input<ButtonFill>('solid');

    /**
     * Indicates whether the button should have an elevated appearance.
     * @group Props
     * @default false
     */
    raised = input<boolean>(false);

    /**
     * Indicates the shape of the button
     * @group Props
     * @default 'square'
     */
    shape = input<ButtonShape>('square');

    /**
     * Specifies a tabindex to the button.
     * @group Props
     */
    tabIndex = input<number | null>(null);

    /**
     * Provides an accessible label for the button, enhancing screen reader support.
     * @group Props
     */
    ariaLabel = input<string>();

    /**
     * Specifies whether the button should automatically receive focus when the page loads.
     * @group Props
     * @default false
     */
    autofocus = input<boolean>(false);

    /**
     * Callback to execute when button is clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Outputs
     */
    onClick = output<MouseEvent>();

    iconPosition = computed(() => {
        const icon = this.icon();
        if (!!icon && 'position' in icon) {
            return icon.position;
        }

        return 'left';
    });

    iconClass = computed(() => ({
        'ch-button-icon': true,
        'ch-button-icon-left': this.iconPosition() === 'left' && this.label(),
        'ch-button-icon-right': this.iconPosition() === 'right' && this.label(),
        'ch-button-icon-top': this.iconPosition() === 'top' && this.label(),
        'ch-button-icon-bottom': this.iconPosition() === 'bottom' && this.label()
    }));

    buttonClass = computed(() => {
        const extraClasses = this.cssClass();

        return {
            'ch-button': true,
            'ch-button-icon-only': !!this.icon() && !this.label(),
            'ch-button-vertical': (this.iconPosition() === 'top' || this.iconPosition() === 'bottom') && this.label,

            [`ch-button-${this.type()}`]: true,
            'ch-button-raised': this.raised(),
            'ch-button-rounded': this.shape() === 'round',
            [`ch-button-${this.fill()}`]: true,
            ['ch-hover-state-disabled']: !this.hoverStateEnabled(),
            ['ch-focus-state-disabled']: !this.focusStateEnabled(),
            ['ch-active-state-disabled']: !this.activeStateEnabled(),

            ...(extraClasses ? { [extraClasses]: true } : undefined)
        };
    });

    protected handleClick = (evt: MouseEvent) => {
        this.onClick.emit(evt);
    };

    /**
     * Get the native element of the button component
     * @group Method
     */
    getNativeElement = (): HTMLElement => this.elementRef.nativeElement;
}
