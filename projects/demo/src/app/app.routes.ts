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
        path: 'button-types',
        loadComponent: () => import('./pages/button/button-types/button-types.component').then((c) => c.ButtonTypesComponent),
        pathMatch: 'full'
    },
    {
        path: 'button-fill',
        loadComponent: () => import('./pages/button/button-fills/button-fills.component').then((c) => c.ButtonFillsComponent),
        pathMatch: 'full'
    },
    {
        path: 'button-basic',
        loadComponent: () => import('./pages/button/button-basic/button-basic.component').then((c) => c.ButtonBasicComponent),
        pathMatch: 'full'
    },
    {
        path: 'button-icon',
        loadComponent: () => import('./pages/button/button-icon/button-icon.component').then((c) => c.ButtonIconComponent),
        pathMatch: 'full'
    },
    {
        path: 'button-icon-only',
        loadComponent: () => import('./pages/button/button-icon-only/button-icon-only.component').then((c) => c.ButtonIconOnlyComponent),
        pathMatch: 'full'
    },
    {
        path: 'button-raised',
        loadComponent: () => import('./pages/button/button-raised/button-raised.component').then((c) => c.ButtonRaisedComponent),
        pathMatch: 'full'
    },

    {
        path: 'button-shape',
        loadComponent: () => import('./pages/button/button-shape/button-shape.component').then((c) => c.ButtonShapeComponent),
        pathMatch: 'full'
    },
    {
        path: 'button-states',
        loadComponent: () => import('./pages/button/button-states/button-states.component').then((c) => c.ButtonStatesComponent),
        pathMatch: 'full'
    },
    {
        path: 'button-custom-content',
        loadComponent: () => import('./pages/button/button-custom-content/button-custom-content.component').then((c) => c.ButtonCustomContentComponent),
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
