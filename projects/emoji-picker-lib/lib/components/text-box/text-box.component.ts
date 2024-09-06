import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, forwardRef, HostListener, inject, input, model, OnDestroy, output, Renderer2, untracked } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';
import { IconComponent } from '@chit-chat/ngx-emoji-picker/lib/components/icon';
import { AutofocusDirective } from '@chit-chat/ngx-emoji-picker/lib/utils';
import { icons } from './icons';
import { ValueChangeEvent } from './models';
import { TextBoxMode } from './models/text-box-mode.type';
import { TextBoxVariant } from './models/text-box-variant.type';

/**
 * A customizable text box component that supports different modes, visual variants, and value change handling.
 * @component
 */
@Component({
    selector: 'ch-text-box',
    standalone: true,
    imports: [CommonModule, IconComponent, AutofocusDirective, ButtonComponent],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextBoxComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './text-box.component.html',
    styleUrls: ['./text-box.component.scss'],
    host: {
        'collision-id': crypto.randomUUID(),
        class: 'ch-element'
    }
})
export class TextBoxComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
    private elementRef = inject(ElementRef);
    private renderer = inject(Renderer2);

    /**
     * The input's current value
     * @group TwoWayBindings
     * @default ''
     */
    value = model<string>('');

    /**
     * Specifies whether the textbox should automatically receive focus when the page loads.
     * @group Props
     * @default false
     */
    autofocus = input<boolean>(false);

    /**
     * Specifies the mode of the textbox, determining its type and behavior.
     * @group Props
     * @default 'text'
     */
    mode = input<TextBoxMode>('text');

    /**
     * Specifies the event that triggers the value change in the textbox.
     * @group Props
     * @default 'change'
     */
    valueChangeEvent = input<string>('change');

    /**
     * Specifies the placeholder text to be displayed inside the textbox when it is empty.
     * @group Props
     * @default ''
     */
    placeholder = input<string>('');

    /**
     * Specifies whether the textbox is disabled.
     * @group Props
     * @default false
     */
    disabled = input<boolean>(false);

    /**
     * Specifies the visual variant of the textbox, affecting its appearance.
     * @group Props
     * @default 'filled'
     */
    variant = input<TextBoxVariant>('filled');

    /**
     * Specifies whether a clear button should be displayed inside the textbox.
     * @group Props
     * @default false
     */
    showClearButton = input<boolean>(false);

    /**
     * Callback to execute when the value is changed.
     * @param {ValueChangeEvent} event - The event object containing details of the value change.
     * @group Outputs
     */
    onValueChanged = output<ValueChangeEvent>();

    textBoxClass = computed(() => ({
        'ch-editor-outlined': this.variant() === 'outlined',
        'ch-editor-filled': this.variant() === 'filled'
    }));

    readonly icons = { ...icons };

    private currentListenerFn: () => void = () => {};
    private elementClickListener: () => void = () => {};

    private onChange: (value: string) => void = () => {};
    private onTouched: () => void = () => {};

    @HostListener('blur', ['$event'])
    onBlur(): void {
        this.onTouched();
    }

    constructor() {
        effect(() => {
            const valueChangeEvent = this.valueChangeEvent();
            untracked(() => this.updateEventListener(valueChangeEvent));
        });
    }

    ngAfterViewInit(): void {
        this.elementClickListener = this.renderer.listen(this.elementRef.nativeElement, 'pointerdown', (event: Event) => {
            this.handleElementClick(event);
        });
    }

    handleElementClick = (event: Event): void => {
        const inputElement = this.elementRef.nativeElement.querySelector('input');

        if (event.target !== inputElement) {
            event.preventDefault();
            inputElement.focus();
        }
    };

    ngOnDestroy(): void {
        this.cleanupCurrentListener();

        if (this.elementClickListener) {
            this.elementClickListener();
        }
    }

    registerOnChange = (fn: (value: string) => void): void => {
        this.onChange = fn;
    };

    registerOnTouched = (fn: () => void): void => {
        this.onTouched = fn;
    };

    writeValue = (value: string): void => {
        this.value.set(value || '');
    };

    private cleanupCurrentListener = () => {
        if (this.currentListenerFn) {
            this.currentListenerFn();
        }
    };

    private updateEventListener = (valueChangeEvent: string): void => {
        this.cleanupCurrentListener();

        this.currentListenerFn = this.renderer.listen(this.elementRef.nativeElement.querySelector('input'), valueChangeEvent, (event: Event) => this.onEvent(event));
    };

    private onEvent = (evt: Event): void => {
        const inputElement = evt.target as HTMLInputElement;

        this.setValue(inputElement.value, evt, this.valueChangeEvent());
    };

    private setValue = (value: string, evt: Event, action: string) => {
        this.onChange(value);
        this.value.set(value); // Update internal value
        this.onValueChanged.emit({
            event: evt,
            value: value,
            action
        });
    };

    protected handleClearClick = (evt: MouseEvent) => {
        this.value.set('');
        this.setValue(this.value(), evt, 'clear');
    };
}
