import {
	Overlay,
	OverlayContainer,
	OverlayModule,
} from '@angular/cdk/overlay';
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import {
	ComponentFixture,
	TestBed,
	fakeAsync,
	flush,
	tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './dialog.component'; // Adjust the path as necessary

@Component({
	template: `
		<ch-dialog
			[visible]="isVisible"
			[closeOnBackdropClick]="closeOnBackdropClick"
			[width]="width"
			[height]="height"
		>
			<ng-container header>
				<p>Dialog Header</p>
			</ng-container>
			<ng-container content>
				<p>Dialog Content</p>
			</ng-container>
			<ng-container footer>
				<p>Dialog Footer</p>
			</ng-container>
		</ch-dialog>
	`,
	standalone: true,
	imports: [DialogComponent, CdkPortal],
})
class TestHostComponent {
	isVisible = false;
	closeOnBackdropClick = true;
	width: number | string = 'auto';
	height: number | string = 'auto';
}

describe('DialogComponent', () => {
	let fixture: ComponentFixture<TestHostComponent>;
	let component: DialogComponent;
	let overlay: Overlay;
	let overlayContainer: OverlayContainer;
	let overlayContainerElement: HTMLElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				OverlayModule,
				PortalModule,
				NoopAnimationsModule,
				TestHostComponent,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(TestHostComponent);
		fixture.detectChanges();

		const dialogDebugElement = fixture.debugElement.query(
			By.directive(DialogComponent)
		);
		component = dialogDebugElement.componentInstance;

		overlay = TestBed.inject(Overlay);
		overlayContainer = TestBed.inject(OverlayContainer);
		overlayContainerElement = overlayContainer.getContainerElement();
	});

	afterEach(() => {
		overlayContainer.ngOnDestroy();
	});

	it('should create and attach overlay when visible is true', fakeAsync(() => {
		fixture.componentInstance.isVisible = true;
		fixture.detectChanges();
		tick();

		const dialogRef = component['dialogRef'];

		expect(dialogRef).toBeTruthy();
		expect(dialogRef!.hasAttached()).toBe(true);
	}));

	it('should display the content when provided', fakeAsync(() => {
		fixture.componentInstance.isVisible = true;
		fixture.detectChanges();
		tick();

		const contentElement = overlayContainerElement.querySelector(
			'.ch-dialog-content'
		) as HTMLElement;

		expect(contentElement).toBeTruthy();
		expect(contentElement.textContent).toContain('Dialog Content');
	}));

	it('should display the header content when provided', fakeAsync(() => {
		fixture.componentInstance.isVisible = true;
		fixture.detectChanges();
		tick();

		const headerElement = overlayContainerElement.querySelector(
			'.ch-dialog-header'
		) as HTMLElement;

		expect(headerElement).toBeTruthy();
		expect(headerElement.textContent).toContain('Dialog Header');
	}));

	it('should display the footer content when provided', fakeAsync(() => {
		fixture.componentInstance.isVisible = true;
		fixture.detectChanges();
		tick();

		const footerElement = overlayContainerElement.querySelector(
			'.ch-dialog-footer'
		) as HTMLElement;

		expect(footerElement).toBeTruthy();
		expect(footerElement.textContent).toContain('Dialog Footer');
	}));

	it('should dispose of the overlay when visible is set to false', fakeAsync(() => {
		fixture.componentInstance.isVisible = true;
		fixture.detectChanges();
		tick();

		const dialogRef = component['dialogRef'];
		expect(dialogRef!.hasAttached()).toBe(true);

		fixture.componentInstance.isVisible = false;
		fixture.detectChanges();
		tick();

		expect(dialogRef!.hasAttached()).toBe(false);
		flush();
	}));

	it('should dispose of the overlay when the component is destroyed', fakeAsync(() => {
		fixture.componentInstance.isVisible = true;
		fixture.detectChanges();
		tick();

		const dialogRef = component['dialogRef'];
		expect(dialogRef!.hasAttached()).toBe(true);

		fixture.destroy();
		tick();

		expect(dialogRef!.hasAttached()).toBe(false);
		flush();
	}));

	it('should close the dialog when the backdrop is clicked', fakeAsync(() => {
		fixture.componentInstance.isVisible = true;
		fixture.detectChanges();
		tick();

		const dialogRef = component['dialogRef'];
		expect(dialogRef!.hasAttached()).toBe(true);

		const backdrop = overlayContainerElement.querySelector(
			'.cdk-overlay-backdrop'
		) as HTMLElement;
		backdrop.click();
		fixture.detectChanges();
		tick();

		expect(dialogRef!.hasAttached()).toBe(false);
	}));

	it('should not close the dialog when the backdrop is clicked and closeOnBackdropClick is set to false', fakeAsync(() => {
		fixture.componentInstance.isVisible = true;
		fixture.componentInstance.closeOnBackdropClick = false;
		fixture.detectChanges();
		tick();

		const dialogRef = component['dialogRef'];
		expect(dialogRef!.hasAttached()).toBe(true);

		const backdrop = overlayContainerElement.querySelector(
			'.cdk-overlay-backdrop'
		) as HTMLElement;
		backdrop.click();
		fixture.detectChanges();
		tick();

		expect(dialogRef!.hasAttached()).toBe(true);
	}));

	it('should close the dialog when the Escape key is pressed', fakeAsync(() => {
		fixture.componentInstance.isVisible = true;
		fixture.detectChanges();
		tick();

		const dialogRef = component['dialogRef'];
		expect(dialogRef!.hasAttached()).toBe(true);

		const event = new KeyboardEvent('keyup', { key: 'Escape' });
		document.dispatchEvent(event);
		fixture.detectChanges();
		tick();

		expect(dialogRef!.hasAttached()).toBe(false);
	}));

	it('should apply the correct height and width to the dialog', fakeAsync(() => {
		fixture.componentInstance.isVisible = true;
		fixture.componentInstance.height = 400;
		fixture.componentInstance.width = 600;
		fixture.detectChanges();
		tick();

		const dialogElement = overlayContainerElement.querySelector(
			'.ch-dialog'
		) as HTMLElement;

		expect(dialogElement.style.height).toBe('400px');
		expect(dialogElement.style.width).toBe('600px');
	}));

	it('should apply auto height and width when default values are used', fakeAsync(() => {
		fixture.componentInstance.isVisible = true;
		fixture.detectChanges();
		tick();

		const dialogElement = overlayContainerElement.querySelector(
			'.ch-dialog'
		) as HTMLElement;

		expect(dialogElement.style.height).toBe('auto');
		expect(dialogElement.style.width).toBe('auto');
	}));
});
