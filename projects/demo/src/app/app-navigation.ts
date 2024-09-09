export const navigationItems = [
    { text: 'Button', path: '/button' },
    { text: 'Dialog', path: '/dialog-basic' },
    { text: 'Emoji picker', path: '/emoji-picker' }
] as const;
export type NavigationItem = (typeof navigationItems)[number];
