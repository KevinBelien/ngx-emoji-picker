import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IconComponent } from './icon.component';

// Mock component to test IconComponent in a real usage scenario
@Component({
	imports: [IconComponent],
	standalone: true,
	template: `<ch-icon
		[cssClass]="cssClass"
		[iconPath]="iconPath"
		[height]="height"
		[width]="width"
		[viewBox]="viewBox"
	></ch-icon>`,
})
class TestIconComponent {
	cssClass: string = '';
	iconPath: string = '';
	height: number | string = 24;
	width: number | string = 24;
	viewBox: string = '0 -960 960 960';
}

describe('IconComponent', () => {
	let fixture: ComponentFixture<TestIconComponent>;
	let testComponent: TestIconComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestIconComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TestIconComponent);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the test component', () => {
		expect(testComponent).toBeTruthy();
	});

	it('should render the SVG element with default attributes', () => {
		const svgElement = fixture.debugElement.query(By.css('svg'));
		expect(svgElement).toBeTruthy();
		expect(svgElement.attributes['height']).toBe('24');
		expect(svgElement.attributes['width']).toBe('24');
		expect(svgElement.attributes['viewBox']).toBe('0 -960 960 960');
	});

	it('should apply the CSS class to the SVG element', () => {
		testComponent.cssClass = 'custom-class';
		fixture.detectChanges();

		const svgElement = fixture.debugElement.query(By.css('svg'));
		expect(svgElement.nativeElement.classList).toContain(
			'custom-class'
		);
	});

	it('should update the SVG path data', () => {
		const testPath = 'M10 10 H 90 V 90 H 10 L 10 10';
		testComponent.iconPath = testPath;
		fixture.detectChanges();

		const pathElement = fixture.debugElement.query(By.css('path'));
		expect(pathElement.attributes['d']).toBe(testPath);
	});

	it('should update the SVG height and width', () => {
		testComponent.height = 48;
		testComponent.width = 48;
		fixture.detectChanges();

		const svgElement = fixture.debugElement.query(By.css('svg'));
		expect(svgElement.attributes['height']).toBe('48');
		expect(svgElement.attributes['width']).toBe('48');
	});

	it('should update the SVG viewBox', () => {
		const newViewBox = '0 0 100 100';
		testComponent.viewBox = newViewBox;
		fixture.detectChanges();

		const svgElement = fixture.debugElement.query(By.css('svg'));
		expect(svgElement.attributes['viewBox']).toBe(newViewBox);
	});
});
