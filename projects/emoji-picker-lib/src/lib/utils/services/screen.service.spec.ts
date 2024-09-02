import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Breakpoint, BreakpointStatus } from '../models'; // Adjust the path to where your types are defined
import { ScreenService } from './screen.service';

@Component({
	template: '',
})
class TestComponent {
	screenService = inject(ScreenService);
}

describe('ScreenService', () => {
	let fixture: ComponentFixture<TestComponent>;
	let screenService: ScreenService;
	let breakpointObserver: BreakpointObserver;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent],
			providers: [
				ScreenService,
				{
					provide: BreakpointObserver,
					useValue: {
						observe: jest.fn().mockReturnValue(of({ matches: true })),
						isMatched: jest.fn(
							(query: string) => query === Breakpoints.Small
						),
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		screenService = fixture.componentInstance.screenService;
		breakpointObserver = TestBed.inject(BreakpointObserver);
	});

	it('should be created', () => {
		expect(screenService).toBeTruthy();
	});

	it('should provide the correct initial breakpoint state', () => {
		// Simulate only the "sm" breakpoint being active
		jest
			.spyOn(breakpointObserver, 'isMatched')
			.mockImplementation((query) => {
				switch (query) {
					case Breakpoints.XSmall:
						return false;
					case Breakpoints.Small:
						return true;
					default:
						return false;
				}
			});

		const initialState = screenService.breakpointState();

		expect(initialState.current).toBe('sm');
		expect(initialState.breakpoints).toEqual<BreakpointStatus>({
			xs: true,
			sm: true,
			md: false,
			lg: false,
			xl: false,
		});
	});

	it('should return the correct current breakpoint', () => {
		const breakpointStatus: BreakpointStatus = {
			xs: false,
			sm: true,
			md: false,
			lg: false,
			xl: false,
		};

		const result =
			screenService.getCurrentBreakpoint(breakpointStatus);

		expect(result).toBe<Breakpoint>('sm');
	});

	it('should consolidate breakpoint status correctly', () => {
		const breakpointStatus: BreakpointStatus = {
			xs: true,
			sm: false,
			md: true,
			lg: false,
			xl: true,
		};

		const result =
			screenService.calculateBreakpointStatus(breakpointStatus);

		expect(result).toEqual<BreakpointStatus>({
			xs: true,
			sm: true,
			md: true,
			lg: true,
			xl: true,
		});
	});

	it('should detect mobile devices correctly', () => {
		jest
			.spyOn(navigator, 'userAgent', 'get')
			.mockReturnValue('iPhone');

		const result = screenService.isMobile();

		expect(result).toBe(true);
	});

	it('should detect iOS devices correctly', () => {
		jest
			.spyOn(navigator, 'userAgent', 'get')
			.mockReturnValue('iPhone');

		const result = screenService.isIos();

		expect(result).toBe(true);
	});

	it('should return false for non-iOS devices', () => {
		jest
			.spyOn(navigator, 'userAgent', 'get')
			.mockReturnValue('Android');

		const result = screenService.isIos();

		expect(result).toBe(false);
	});
});
