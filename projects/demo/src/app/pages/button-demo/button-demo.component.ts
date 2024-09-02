import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	ButtonComponent,
	ButtonFill,
	ButtonType,
} from '@chit-chat/ngx-emoji-picker/src/lib/components/button';

@Component({
	selector: 'app-button-demo',
	standalone: true,
	imports: [CommonModule, FormsModule, ButtonComponent],
	templateUrl: './button-demo.component.html',
	styleUrl: './button-demo.component.scss',
})
export class ButtonDemoComponent {
	readonly buttonTypes: ButtonType[] = [
		'primary',
		'success',
		'danger',
		'warning',
		'info',
		'contrast',
	];
	icon: string =
		'M220-130v-650h323.84l16 80H780v360H536.16l-16-80H280v290h-60Z';
	readonly buttonFills: ButtonFill[] = ['solid', 'outlined', 'clear'];

	form: any = {
		isRaised: false,
		isRound: false,
		disabled: false,
		activeStateDisabled: false,
		hoverStateDisabled: false,
		focusStateDisabled: false,
		selectedIconPosition: 'left',
	};

	formItems: string[][] = [
		['isRaised', 'Raised'],
		['isRound', 'Round'],
		['disabled', 'Disabled'],
		['hoverStateDisabled', 'Hover state disabled'],
		['focusStateDisabled', 'Focus state disabled'],
		['activeStateDisabled', 'Active state disabled'],
	];

	constructor() {}

	handleClick = (evt: MouseEvent) => {
		alert('button clicked');
	};
}
