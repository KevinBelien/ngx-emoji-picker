import {
	BreakpointObserver,
	Breakpoints,
	BreakpointState as CdkBreakpointState,
} from '@angular/cdk/layout';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
	Breakpoint,
	breakpoints,
	BreakpointState,
	BreakpointStatus,
} from '../models';

/**
 * A service that provides information about the current screen size and device type.
 * It leverages Angular's CDK BreakpointObserver to monitor screen size changes and determine the current breakpoint.
 *
 * @service
 * @providedIn root
 */
@Injectable({ providedIn: 'root' })
export class ScreenService {
	breakpointObserver = inject(BreakpointObserver);

	/**
	 * A signal that represents the current breakpoint state, including the active breakpoint and status of all breakpoints.
	 *
	 * @type {Signal<BreakpointState>}
	 * @description This signal updates automatically when the screen size changes.
	 */
	breakpointState: Signal<BreakpointState>;

	constructor() {
		this.breakpointState = toSignal(
			this.breakpointObserver
				.observe([
					Breakpoints.XSmall,
					Breakpoints.Small,
					Breakpoints.Medium,
					Breakpoints.Large,
				])
				.pipe(
					map<CdkBreakpointState, BreakpointState>(() =>
						this.calculateBreakpoints()
					)
				),
			{ initialValue: this.calculateBreakpoints() }
		);
	}

	private calculateBreakpoints = (): BreakpointState => {
		const breakpointStatus = this.getBreakpoints();

		return {
			current: this.getCurrentBreakpoint(breakpointStatus),
			breakpoints: this.calculateBreakpointStatus(breakpointStatus),
		};
	};

	private getBreakpoints = (): BreakpointStatus => {
		return {
			xs: this.breakpointObserver.isMatched(Breakpoints.XSmall),
			sm: this.breakpointObserver.isMatched(Breakpoints.Small),
			md: this.breakpointObserver.isMatched(Breakpoints.Medium),
			lg: this.breakpointObserver.isMatched(Breakpoints.Large),
			xl: this.breakpointObserver.isMatched(Breakpoints.XLarge),
		};
	};

	/**
	 * Determines the current active breakpoint based on the status of all breakpoints.
	 * @group Method
	 * @param {BreakpointStatus} breakpointStatus - The status of each breakpoint.
	 * @returns {Breakpoint} The current active breakpoint.
	 */
	getCurrentBreakpoint = (
		breakpointStatus: BreakpointStatus
	): Breakpoint => {
		return (
			breakpoints.find(
				(breakpoint) => breakpointStatus[breakpoint]
			) || 'xs'
		);
	};

	/**
	 * Calculates a consolidated status for each breakpoint, indicating whether a breakpoint or any larger breakpoint is active.
	 * @group Method
	 * @param {BreakpointStatus} breakpointStatus - The status of each breakpoint.
	 * @returns {BreakpointStatus} A consolidated status for each breakpoint.
	 */
	calculateBreakpointStatus = (
		breakpointStatus: BreakpointStatus
	): BreakpointStatus => {
		return {
			xs:
				breakpointStatus.xs ||
				breakpointStatus.sm ||
				breakpointStatus.md ||
				breakpointStatus.lg ||
				breakpointStatus.xl,
			sm:
				breakpointStatus.sm ||
				breakpointStatus.md ||
				breakpointStatus.lg ||
				breakpointStatus.xl,
			md:
				breakpointStatus.md ||
				breakpointStatus.lg ||
				breakpointStatus.xl,
			lg: breakpointStatus.lg || breakpointStatus.xl,
			xl: breakpointStatus.xl,
		};
	};

	/**
	 * Determines whether the application is running on a mobile device based on the user agent string.
	 * @group Method
	 * @returns {boolean} True if the application is running on a mobile device, otherwise false.
	 */
	isMobile = (): boolean => {
		return (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			) ||
			(navigator.userAgent.includes('Mac') &&
				'ontouchend' in document)
		);
	};

	/**
	 * Determines whether the application is running on an iOS device based on the user agent string.
	 * @group Method
	 * @returns {boolean} True if the application is running on an iOS device, otherwise false.
	 */
	isIos = (): boolean => {
		return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
	};
}
