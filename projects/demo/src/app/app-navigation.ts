export const navigationItems = [
    { text: 'Button', path: '/button' },
    { text: 'Dialog', path: '/dialog-basic' },
    { text: 'Emoji picker', path: '/emoji-picker' },
    { text: 'Icon', path: '/icon' },
    { text: 'Text Box', path: '/text-box-basic' }
] as const;
export type NavigationItem = (typeof navigationItems)[number];
