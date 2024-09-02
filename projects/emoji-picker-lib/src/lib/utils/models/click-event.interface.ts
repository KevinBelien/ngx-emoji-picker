import { ClickActionType, PointerDeviceType } from '../models';

export interface ClickEvent {
	event: PointerEvent | KeyboardEvent;
	targetElement: HTMLElement;
	data?: any;
	pointerType?: PointerDeviceType;
	action?: ClickActionType;
}
