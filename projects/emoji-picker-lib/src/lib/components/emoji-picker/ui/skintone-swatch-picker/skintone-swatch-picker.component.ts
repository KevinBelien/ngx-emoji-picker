import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	HostBinding,
	Input,
	model,
	output,
	signal,
} from '@angular/core';
import {
	Skintone,
	SkintoneColor,
	skintoneColors,
} from '../../models';

/**
 * A component that provides a swatch picker for selecting different global skintones.
 * @component
 */
@Component({
	selector: 'ch-skintone-swatch-picker',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule],
	templateUrl: './skintone-swatch-picker.component.html',
	styleUrl: './skintone-swatch-picker.component.scss',
	host: {
		'collision-id': crypto.randomUUID(),
	},
})
export class SkintoneSwatchPickerComponent {
	readonly skintoneColors: SkintoneColor[] = [...skintoneColors];
	isOpen = signal<boolean>(false);

	/**
	 * Specifies the currently selected skintone.
	 * @group TwoWayBindings
	 * @default 'default'
	 */
	selectedSkintone = model<Skintone>('default');

	/**
	 * Specifies the size of the skintone swatch in pixels.
	 * @group Props
	 * @default 20
	 */
	@Input()
	@HostBinding('style.--ch-skincolor-swatch-size')
	size: number = 20;

	@HostBinding('style.--ch-skincolor-swatch-padding')
	itemPadding: number = 12;

	@HostBinding('style.--ch-skincolor-swatch-count')
	skintoneCount: number = this.skintoneColors.length;

	/**
	 * Callback function to be executed when a skintone is selected.
	 * @param {Skintone} skintone - The `Skintone` object representing the selected skintone.
	 * @group Outputs
	 */
	onSelectionChanged = output<Skintone>();

	selectedColor = computed(() => {
		return this.getColorBySkintone(this.selectedSkintone());
	});

	private getColorBySkintone = (
		skintone: Skintone
	): SkintoneColor => {
		return (
			this.skintoneColors.find(
				(color) => color.skintone === skintone
			) ?? this.skintoneColors[0]
		);
	};

	/**
	 * Toggles the visibility of the swatch picker.
	 * @group Method
	 */
	toggle() {
		this.isOpen.set(!this.isOpen());
	}

	/**
	 * Closes the swatch picker.
	 * @group Method
	 */
	close = () => {
		this.isOpen.set(false);
	};

	protected handleClick = (
		skintoneColor: SkintoneColor,
		event: Event
	) => {
		event.stopPropagation();

		if (!!this.isOpen()) {
			this.selectedSkintone.set(skintoneColor.skintone);
			this.onSelectionChanged.emit(skintoneColor.skintone);
		}
		this.toggle();
	};

	protected getPosition = (index: number) => {
		if (!this.isOpen()) return 'translateX(0px)';

		const position = -(index * (this.size + this.itemPadding));
		return `translateX(${position}px) ${
			this.selectedColor() === this.skintoneColors[index]
				? 'scale(1.2)'
				: ''
		}`;
	};
}
