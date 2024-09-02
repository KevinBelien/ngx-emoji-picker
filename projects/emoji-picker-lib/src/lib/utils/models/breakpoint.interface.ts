export const breakpoints = ['xl', 'lg', 'md', 'sm', 'xs'] as const;

export type Breakpoint = (typeof breakpoints)[number];

export type BreakpointStatus = {
	[key in Breakpoint]: boolean;
};

export interface BreakpointState {
	current: Breakpoint;
	breakpoints: BreakpointStatus;
}
