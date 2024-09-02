import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Skintone, SkintoneColor } from '../../models';
import { SkintoneSwatchPickerComponent } from './skintone-swatch-picker.component';

// Mock the skintone colors with RGB values
const mockSkintoneColors: SkintoneColor[] = [
	{ skintone: 'default', color: 'rgb(255, 200, 61)' },
	{ skintone: 'light', color: 'rgb(255, 215, 194)' },
	{ skintone: 'medium-light', color: 'rgb(238, 191, 170)' },
	{ skintone: 'medium', color: 'rgb(198, 141, 123)' },
	{ skintone: 'medium-dark', color: 'rgb(150, 102, 97)' },
	{ skintone: 'dark', color: 'rgb(87, 55, 57)' },
];

describe('SkintoneSwatchPickerComponent', () => {
	let fixture: ComponentFixture<SkintoneSwatchPickerComponent>;
	let component: SkintoneSwatchPickerComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [SkintoneSwatchPickerComponent],
			providers: [
				{
					provide: SkintoneSwatchPickerComponent,
					useFactory: () => {
						const instance = new SkintoneSwatchPickerComponent();
						Object.defineProperty(instance, 'skintoneColors', {
							value: mockSkintoneColors,
							writable: false,
						});
						return instance;
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(SkintoneSwatchPickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should render the correct number of skintone swatches', () => {
		const swatches = fixture.debugElement.queryAll(
			By.css('.ch-color-swatch')
		);
		expect(swatches.length).toBe(mockSkintoneColors.length);
	});

	it('should highlight the selected skintone', () => {
		component.selectedSkintone.set('medium-dark' as Skintone);
		fixture.detectChanges();

		const selectedSwatch = fixture.debugElement.query(
			By.css('.ch-color-swatch.selected')
		);
		expect(selectedSwatch).not.toBeNull();

		const expectedColor = mockSkintoneColors.find(
			(color) => color.skintone === 'medium-dark'
		)?.color;
		const rgbColor = window.getComputedStyle(
			selectedSwatch.nativeElement
		).backgroundColor;

		expect(rgbColor).toBe(expectedColor);
	});

	it('should emit event when a skintone swatch is clicked', () => {
		component.toggle();
		fixture.detectChanges();

		const selectedSkintone = mockSkintoneColors[2].skintone;
		const selectionChangedSpy = jest.spyOn(
			component.onSelectionChanged,
			'emit'
		);

		const swatch = fixture.debugElement.queryAll(
			By.css('.ch-color-swatch')
		)[2];

		swatch.triggerEventHandler('click', new Event('click'));
		fixture.detectChanges();

		expect(selectionChangedSpy).toHaveBeenCalledWith(
			selectedSkintone
		);
		expect(component.selectedSkintone()).toBe(selectedSkintone);
	});

	it('should correctly position swatches when open', () => {
		component.toggle();
		fixture.detectChanges();

		const swatches = fixture.debugElement.queryAll(
			By.css('.ch-color-swatch')
		);

		swatches.forEach((swatch, index) => {
			const transformStyle = swatch.nativeElement.style.transform;
			const expectedTransform = `translateX(-${
				index * (component.size + component.itemPadding)
			}px)`;

			if (
				component.selectedColor().skintone ===
				mockSkintoneColors[index].skintone
			) {
				expect(transformStyle).toContain('translateX(0px)');
			} else {
				expect(transformStyle).toContain(expectedTransform);
			}
		});
	});

	it('should close the swatch picker when close method is called', () => {
		component.toggle();
		fixture.detectChanges();

		component.close();
		fixture.detectChanges();

		expect(component.isOpen()).toBe(false);
	});

	it('should scale up the selected skintone swatch', () => {
		component.toggle();
		component.selectedSkintone.set('medium-dark' as Skintone);
		fixture.detectChanges();

		const selectedSwatch = fixture.debugElement.query(
			By.css('.ch-color-swatch.selected')
		);
		expect(selectedSwatch).not.toBeNull();

		fixture.detectChanges();

		const transformStyle =
			selectedSwatch.nativeElement.style.transform;

		expect(transformStyle).toContain('scale(1.2)');
	});
});
