import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'button',
		pathMatch: 'full',
	},
	{
		path: 'button',
		loadComponent: () =>
			import('./pages/button-demo/button-demo.component').then(
				(c) => c.ButtonDemoComponent
			),
		pathMatch: 'full',
	},
	{
		path: 'emoji-picker',
		loadComponent: () =>
			import(
				'./pages/emoji-picker-demo/emoji-picker-demo.component'
			).then((c) => c.EmojiPickerDemoComponent),
		pathMatch: 'full',
	},
	{
		path: '**',
		redirectTo: 'button',
	},
];
