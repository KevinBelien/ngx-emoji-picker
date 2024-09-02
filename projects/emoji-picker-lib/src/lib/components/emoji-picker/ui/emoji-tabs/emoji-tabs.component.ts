import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	inject,
	input,
	model,
	output,
	signal,
} from '@angular/core';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/src/lib/components/button';
import { IconComponent } from '@chit-chat/ngx-emoji-picker/src/lib/components/icon';
import {
	HoverDirective,
	HoverEvent,
	ScreenService,
} from '@chit-chat/ngx-emoji-picker/src/lib/utils';
import { emojiCategories, EmojiCategory } from '../../models';
import { emojiCategoryIcons } from '../icons';

/**
 * A component that renders tabs for different emoji categories.
 * @component
 */
@Component({
	selector: 'ch-emoji-tabs',
	standalone: true,
	imports: [
		CommonModule,
		HoverDirective,
		IconComponent,
		ButtonComponent,
	],
	templateUrl: './emoji-tabs.component.html',
	styleUrl: './emoji-tabs.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class EmojiTabsComponent {
	private screenService = inject(ScreenService);

	/**
	 * Specifies the list of emoji categories that should be displayed.
	 * @group Props
	 */
	emojiCategories = input<EmojiCategory[]>([...emojiCategories]);

	/**
	 * Specifies the currently selected emoji category tab.
	 * @group TwoWayBindings
	 * @default 0
	 */
	selectedTab = model<EmojiCategory>(this.emojiCategories()[0]);

	categoryHovered = signal<EmojiCategory | null>(null);

	/**
	 * Callback function to be executed when an emoji category tab is clicked.
	 * @param {EmojiCategory} category - The `EmojiCategory` object representing the clicked tab.
	 * @group Outputs
	 */
	onTabClicked = output<EmojiCategory>();

	readonly emojiCategoryIcons = emojiCategoryIcons;

	readonly isMobile = this.screenService.isMobile();

	constructor() {}

	protected handleHoverChange = (
		evt: HoverEvent,
		category: EmojiCategory
	) => {
		if (evt.isHovered) this.categoryHovered.set(category);
		else if (this.categoryHovered() === category)
			this.categoryHovered.set(null);
	};

	protected handleCategoryButtonClick = (
		evt: MouseEvent,
		category: EmojiCategory
	) => {
		this.selectedTab.set(category);
		this.onTabClicked.emit(category);
	};
}
