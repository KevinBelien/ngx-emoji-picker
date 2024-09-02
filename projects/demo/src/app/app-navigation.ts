export const navigationItems = [
	{ text: 'Button', path: '/button' },
	{ text: 'Emoji picker', path: '/emoji-picker' },
] as const;
export type NavigationItem = (typeof navigationItems)[number];
