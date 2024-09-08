import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent),
        pathMatch: 'full'
    },
    {
        path: 'button',
        loadComponent: () => import('./pages/button/button-demo.component').then((c) => c.ButtonDemoComponent),
        pathMatch: 'full'
    },
    {
        path: 'button-outline',
        loadComponent: () => import('./pages/button/button-outline/button-outline.component').then((c) => c.ButtonOutlineComponent),
        pathMatch: 'full'
    },
    {
        path: 'emoji-picker',
        loadComponent: () => import('./pages/emoji-picker/emoji-picker-demo.component').then((c) => c.EmojiPickerDemoComponent),
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
