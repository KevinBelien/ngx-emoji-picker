import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TextBoxMode } from './models';
import { TextBoxComponent } from './text-box.component';

@Component({
	imports: [TextBoxComponent],
	standalone: true,
	template: `<ch-text-box
		[value]="value"
		[valueChangeEvent]="valueChangeEvent"
		[placeholder]="placeholder"
		[showClearButton]="showClearButton"
		(onValueChanged)="handleValueChanged($event)"
	></ch-text-box> `,
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
			imports: [TestTextBoxComponent], // Ensure component is declared
		}).compileComponents();

		fixture = TestBed.createComponent(TestTextBoxComponent);
		componentInstance = fixture.componentInstance;
		fixture.detectChanges();

		textBoxComponent = fixture.debugElement.query(
			By.directive(TextBoxComponent)
		).componentInstance;
	});

	it('should render the text box element', () => {
		const element = fixture.debugElement.query(By.css('ch-text-box'));
		expect(element).not.toBeNull();
	});

	it('should display the initial value in the input field', () => {
		fixture.componentInstance.value = 'ChitChat';
		fixture.detectChanges();

		const inputElement = fixture.debugElement.query(
			By.css('input')
		).nativeElement;

		expect(inputElement.value).toBe('ChitChat');
	});

	it('should display the placeholder text', () => {
		fixture.componentInstance.placeholder = 'ChitChat';
		fixture.detectChanges();
		const inputElement = fixture.debugElement.query(
			By.css('input')
		).nativeElement;
		expect(inputElement.placeholder).toBe('ChitChat');
	});

	it('should display the search icon when mode is set to "search"', () => {
		fixture.componentInstance.mode = 'search';
		fixture.detectChanges();

		const searchIcon = fixture.debugElement.query(
			By.css('.ch-search-icon')
		);
		expect(searchIcon).not.toBeNull();
	});

	it('should trigger the value change event when the input value is changed', () => {
		const handleValueChangedSpy = jest.spyOn(
			componentInstance,
			'handleValueChanged'
		);

		const inputElement = fixture.debugElement.query(
			By.css('input')
		).nativeElement;
		inputElement.value = 'New Value';
		inputElement.dispatchEvent(new Event('change'));

		// Trigger change detection
		fixture.detectChanges();

		// Check if handleValueChanged was called
		expect(handleValueChangedSpy).toHaveBeenCalled();
		expect(handleValueChangedSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				value: 'New Value',
				action: 'change',
			})
		);
	});

	it('should trigger the value change event when valueChangeEvent is "input" and an input event has been fired', () => {
		fixture.componentInstance.valueChangeEvent = 'input';
		fixture.detectChanges();

		const setValueSpy = jest.spyOn(
			textBoxComponent as any,
			'setValue'
		);

		const onValueChangedSpy = jest.spyOn(
			textBoxComponent.onValueChanged,
			'emit'
		);

		const inputElement = fixture.debugElement.query(
			By.css('input')
		).nativeElement;
		inputElement.value = 'N';
		inputElement.dispatchEvent(new Event('input'));

		fixture.detectChanges();

		expect(setValueSpy).toHaveBeenCalled();
		expect(setValueSpy).toHaveBeenCalledWith(
			'N',
			expect.any(Event),
			'input'
		);

		expect(onValueChangedSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				value: 'N',
				action: 'input',
			})
		);
	});

	it('should not render the clear button when showClearButton is false', () => {
		fixture.componentInstance.value = 'ChitChat';
		componentInstance.showClearButton = false;
		fixture.detectChanges(); // Apply changes

		const clearButton = fixture.debugElement.query(
			By.css('.ch-clear-button')
		);
		expect(clearButton).toBeNull();
	});

	it('should show the clear button when input has a value and showClearButton is true', () => {
		fixture.componentInstance.value = 'ChitChat';
		componentInstance.showClearButton = true;
		fixture.detectChanges();

		const clearButton = fixture.debugElement.query(
			By.css('.ch-clear-button')
		);
		expect(clearButton).not.toBeNull();
	});

	it('should not render the clear button when input has no value and showClearButton is true', () => {
		componentInstance.showClearButton = true;
		fixture.detectChanges();

		const clearButton = fixture.debugElement.query(
			By.css('.ch-clear-button')
		);
		expect(clearButton).toBeNull();
	});

	it('should clear the input when the clear button is clicked', () => {
		fixture.componentInstance.value = 'ChitChat';
		componentInstance.showClearButton = true;
		fixture.detectChanges();

		const setValueSpy = jest.spyOn(
			textBoxComponent as any,
			'setValue'
		);

		const onValueChangedSpy = jest.spyOn(
			textBoxComponent.onValueChanged,
			'emit'
		);

		const clearButton = fixture.debugElement.query(
			By.css('.ch-clear-button')
		).nativeElement;
		clearButton.click();

		fixture.detectChanges();

		const inputElement = fixture.debugElement.query(
			By.css('input')
		).nativeElement;

		expect(setValueSpy).toHaveBeenCalledWith(
			'',
			expect.any(Event),
			'clear'
		);

		expect(inputElement.value).toBe('');

		expect(onValueChangedSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				value: '',
				action: 'clear',
			})
		);
	});
});
