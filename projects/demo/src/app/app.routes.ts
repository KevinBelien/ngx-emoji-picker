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
        path: 'dialog-basic',
        loadComponent: () => import('./pages/dialog/dialog-basic/dialog-basic.component').then((c) => c.DialogBasicComponent),
        pathMatch: 'full'
    },
    {
        path: 'dialog-templates',
        loadComponent: () => import('./pages/dialog/dialog-templates/dialog-templates.component').then((c) => c.DialogTemplatesComponent),
        pathMatch: 'full'
    },
    {
        path: 'dialog-positions',
        loadComponent: () => import('./pages/dialog/dialog-position/dialog-position.component').then((c) => c.DialogPositionComponent),
        pathMatch: 'full'
    },
    {
        path: 'dialog-draggable',
        loadComponent: () => import('./pages/dialog/dialog-draggable/dialog-draggable.component').then((c) => c.DialogDraggableComponent),
        pathMatch: 'full'
    },

    {
        path: 'dialog-scroll',
        loadComponent: () => import('./pages/dialog/dialog-scroll/dialog-scroll.component').then((c) => c.DialogScrollComponent),
        pathMatch: 'full'
    },

    {
        path: 'emoji-picker',
        loadComponent: () => import('./pages/emoji-picker/emoji-picker-demo.component').then((c) => c.EmojiPickerDemoComponent),
        pathMatch: 'full'
    },
    {
        path: 'emoji-picker-basic',
        loadComponent: () => import('./pages/emoji-picker/emoji-picker-basic/emoji-picker-basic.component').then((c) => c.EmojiPickerBasicComponent),
        pathMatch: 'full'
    },
    {
        path: 'emoji-picker-dialog',
        loadComponent: () => import('./pages/emoji-picker/emoji-picker-dialog/emoji-picker-dialog.component').then((c) => c.EmojiPickerDialogComponent),
        pathMatch: 'full'
    },
    {
        path: 'emoji-picker-categories',
        loadComponent: () => import('./pages/emoji-picker/emoji-picker-categories/emoji-picker-categories.component').then((c) => c.EmojiPickerCategoriesComponent),
        pathMatch: 'full'
    },
    {
        path: 'emoji-picker-bar-position',
        loadComponent: () => import('./pages/emoji-picker/emoji-picker-category-bar-position/emoji-picker-category-bar-position.component').then((c) => c.EmojiPickerCategoryBarPositionComponent),
        pathMatch: 'full'
    },
    {
        path: 'emoji-picker-custom-storage',
        loadComponent: () => import('./pages/emoji-picker/emoji-picker-custom-storage/emoji-picker-custom-storage.component').then((c) => c.EmojiPickerCustomStorageComponent),
        pathMatch: 'full'
    },
    {
        path: 'emoji-picker-headerless',
        loadComponent: () => import('./pages/emoji-picker/emoji-picker-headerless/emoji-picker-headerless.component').then((c) => c.EmojiPickerHeaderlessComponent),
        pathMatch: 'full'
    },
    {
        path: 'emoji-picker-localization',
        loadComponent: () => import('./pages/emoji-picker/emoji-picker-localization/emoji-picker-localization.component').then((c) => c.EmojiPickerLocalizationComponent),
        pathMatch: 'full'
    },
    {
        path: 'emoji-picker-sizes',
        loadComponent: () => import('./pages/emoji-picker/emoji-picker-sizes/emoji-picker-sizes.component').then((c) => c.EmojiPickerSizesComponent),
        pathMatch: 'full'
    },
    {
        path: 'emoji-picker-suggestions',
        loadComponent: () => import('./pages/emoji-picker/emoji-picker-suggestions/emoji-picker-suggestions.component').then((c) => c.EmojiPickerSuggestionsComponent),
        pathMatch: 'full'
    },
    {
        path: 'emoji-picker-skintone-settings',
        loadComponent: () => import('./pages/emoji-picker/emoji-picker-skintone-settings/emoji-picker-skintone-settings.component').then((c) => c.EmojiPickerSkintoneSettingsComponent),
        pathMatch: 'full'
    },
    {
        path: 'icon',
        loadComponent: () => import('./pages/icon/icon.component').then((c) => c.IconBasicComponent),
        pathMatch: 'full'
    },
    {
        path: 'text-box-basic',
        loadComponent: () => import('./pages/text-box/text-box-basic/text-box-basic.component').then((c) => c.TextBoxBasicComponent),
        pathMatch: 'full'
    },
    {
        path: 'text-box-custom-content',
        loadComponent: () => import('./pages/text-box/text-box-custom-content/text-box-custom-content.component').then((c) => c.TextBoxCustomContentComponent),
        pathMatch: 'full'
    },
    {
        path: 'text-box-disabled',
        loadComponent: () => import('./pages/text-box/text-box-disabled/text-box-disabled.component').then((c) => c.TextBoxDisabledComponent),
        pathMatch: 'full'
    },
    {
        path: 'text-box-modes',
        loadComponent: () => import('./pages/text-box/text-box-modes/text-box-modes.component').then((c) => c.TextBoxModesComponent),
        pathMatch: 'full'
    },
    {
        path: 'text-box-variants',
        loadComponent: () => import('./pages/text-box/text-box-variants/text-box-variants.component').then((c) => c.TextBoxVariantsComponent),
        pathMatch: 'full'
    },

    {
        path: '**',
        redirectTo: 'home'
    }
];
