import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TextBoxMode } from './models';
import { TextBoxComponent } from './text-box.component';

@Component({
    imports: [TextBoxComponent],
    standalone: true,
    template: `<ch-text-box [value]="value" [valueChangeEvent]="valueChangeEvent" [placeholder]="placeholder" [showClearButton]="showClearButton" (onValueChanged)="handleValueChanged($event)"></ch-text-box> `
})
class TestTextBoxComponent {
    value: string = '';
    placeholder: string = '';
    valueChangeEvent: string = 'change';
    showClearButton: boolean = false;
    mode: TextBoxMode = 'text';

    handleValueChanged(event: any) {
        // Handle value change event
    }
}

describe('TextBox', () => {
    let fixture: ComponentFixture<TestTextBoxComponent>;
    let componentInstance: TestTextBoxComponent;
    let textBoxComponent: TextBoxComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestTextBoxComponent] // Ensure component is declared
        }).compileComponents();

        fixture = TestBed.createComponent(TestTextBoxComponent);
        componentInstance = fixture.componentInstance;
        fixture.detectChanges();

        textBoxComponent = fixture.debugElement.query(By.directive(TextBoxComponent)).componentInstance;
    });

    it('should render the text box element', () => {
        const element = fixture.debugElement.query(By.css('ch-text-box'));
        expect(element).not.toBeNull();
    });

    it('should display the initial value in the input field', () => {
        fixture.componentInstance.value = 'ChitChat';
        fixture.detectChanges();

        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

        expect(inputElement.value).toBe('ChitChat');
    });

    it('should display the placeholder text', () => {
        fixture.componentInstance.placeholder = 'ChitChat';
        fixture.detectChanges();
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.placeholder).toBe('ChitChat');
    });

    it('should display the search icon when mode is set to "search"', () => {
        fixture.componentInstance.mode = 'search';
        fixture.detectChanges();

        const searchIcon = fixture.debugElement.queryAll(By.css('.ch-search-icon'));
        expect(searchIcon).not.toBeNull();
    });

    it('should trigger the value change event when the input value is changed', () => {
        const handleValueChangedSpy = jest.spyOn(componentInstance, 'handleValueChanged');

        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.value = 'New Value';
        inputElement.dispatchEvent(new Event('change'));

        // Trigger change detection
        fixture.detectChanges();

        // Check if handleValueChanged was called
        expect(handleValueChangedSpy).toHaveBeenCalled();
        expect(handleValueChangedSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                value: 'New Value',
                action: 'change'
            })
        );
    });

    it('should trigger the value change event when valueChangeEvent is "input" and an input event has been fired', () => {
        fixture.componentInstance.valueChangeEvent = 'input';
        fixture.detectChanges();

        const setValueSpy = jest.spyOn(textBoxComponent as any, 'setValue');

        const onValueChangedSpy = jest.spyOn(textBoxComponent.onValueChanged, 'emit');

        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.value = 'N';
        inputElement.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        expect(setValueSpy).toHaveBeenCalled();
        expect(setValueSpy).toHaveBeenCalledWith('N', 'input', expect.any(Event));

        expect(onValueChangedSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                value: 'N',
                action: 'input'
            })
        );
    });

    it('should not render the clear button when showClearButton is false', () => {
        fixture.componentInstance.value = 'ChitChat';
        componentInstance.showClearButton = false;
        fixture.detectChanges(); // Apply changes

        const clearButton = fixture.debugElement.query(By.css('.ch-clear-button'));
        expect(clearButton).toBeNull();
    });

    it('should show the clear button when input has a value and showClearButton is true', () => {
        fixture.componentInstance.value = 'ChitChat';
        componentInstance.showClearButton = true;
        fixture.detectChanges();

        const clearButton = fixture.debugElement.query(By.css('.ch-clear-button'));
        expect(clearButton).not.toBeNull();
    });

    it('should not render the clear button when input has no value and showClearButton is true', () => {
        componentInstance.showClearButton = true;
        fixture.detectChanges();

        const clearButton = fixture.debugElement.query(By.css('.ch-clear-button'));
        expect(clearButton).toBeNull();
    });

    it('should clear the input when the clear button is clicked', () => {
        fixture.componentInstance.value = 'ChitChat';
        componentInstance.showClearButton = true;
        fixture.detectChanges();

        const setValueSpy = jest.spyOn(textBoxComponent as any, 'setValue');

        const onValueChangedSpy = jest.spyOn(textBoxComponent.onValueChanged, 'emit');

        const clearButton = fixture.debugElement.query(By.css('.ch-clear-button')).nativeElement;
        clearButton.click();

        fixture.detectChanges();

        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

        expect(setValueSpy).toHaveBeenCalledWith('', 'clear', expect.any(Event));

        expect(inputElement.value).toBe('');

        expect(onValueChangedSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                value: '',
                action: 'clear'
            })
        );
    });

    it('should prevent default and focus input when a non-input element is clicked', () => {
        // Spy on the event.preventDefault method
        const preventDefaultSpy = jest.fn();

        // Simulate a custom click event
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        });

        Object.defineProperty(clickEvent, 'target', { value: fixture.nativeElement });

        // Add the preventDefault spy to the event
        clickEvent.preventDefault = preventDefaultSpy;

        // Spy on the input focus method
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const focusSpy = jest.spyOn(inputElement, 'focus');

        // Call the handleElementClick method
        (textBoxComponent as any).handleElementClick(clickEvent);

        // Verify that event.preventDefault was called
        expect(preventDefaultSpy).toHaveBeenCalled();

        // Verify that the input was focused
        expect(focusSpy).toHaveBeenCalled();
    });

    it('should register onChange callback and call it on value change', () => {
        const onChangeFn = jest.fn(); // Mock function
        textBoxComponent.registerOnChange(onChangeFn);

        // Simulate the change event on the input element
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        inputElement.value = 'New Value';
        inputElement.dispatchEvent(new Event('change')); // Use 'change' event as per component logic

        fixture.detectChanges();

        // The onChange callback should be called with the new value
        expect(onChangeFn).toHaveBeenCalledWith('New Value');
    });

    it('should register onTouched callback and call it on blur', () => {
        const onTouchedFn = jest.fn(); // Mock function

        // Register the onTouched callback
        textBoxComponent.registerOnTouched(onTouchedFn);

        // Simulate a blur event on the input element
        const inputElement = fixture.debugElement.query(By.css('ch-text-box')).nativeElement;
        inputElement.dispatchEvent(new Event('blur'));

        fixture.detectChanges();

        // The onTouched callback should be called when the input is blurred
        expect(onTouchedFn).toHaveBeenCalled();
    });

    it('should write value to the component', () => {
        // Write value to the component
        textBoxComponent.writeValue('Test Value');
        fixture.detectChanges();

        // Verify the component's value was updated
        expect(textBoxComponent.value()).toBe('Test Value');
    });

    it('should clear the value when clear is called', () => {
        const setValueSpy = jest.spyOn(textBoxComponent as any, 'setValue');
        const onValueChangedSpy = jest.spyOn(textBoxComponent.onValueChanged, 'emit');

        textBoxComponent.writeValue('Test Value');
        fixture.detectChanges();

        textBoxComponent.clear();
        fixture.detectChanges();

        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        expect(inputElement.value).toBe('');

        expect(setValueSpy).toHaveBeenCalledWith('', 'clear');
        expect(onValueChangedSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                value: '',
                action: 'clear'
            })
        );
    });
});
