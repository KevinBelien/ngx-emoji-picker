import {
	CdkVirtualScrollViewport,
	ScrollingModule,
} from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	DestroyRef,
	HostBinding,
	inject,
	input,
	model,
	output,
	signal,
	viewChild,
} from '@angular/core';
import { emojis } from '../../data';
import {
	Emoji,
	emojiCategories,
	EmojiCategory,
	EmojiPickerRow,
	EmojiSize,
	EmojiSizeOption,
	FilteredEmojis,
	SuggestionEmojis,
} from '../../models';
import { EmojiButtonComponent } from '../emoji-button/emoji-button.component';

import {
	takeUntilDestroyed,
	toObservable,
} from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@chit-chat/ngx-emoji-picker/src/lib/localization';
import {
	ClickEvent,
	ClickTouchHoldDirective,
	NumberHelper,
	PreventContextMenuDirective,
	RippleDirective,
	TouchHoldEvent,
} from '@chit-chat/ngx-emoji-picker/src/lib/utils';
import { zip } from 'rxjs';
import { EmojiPickerService } from '../../services';

/**
 * A virtual scroll viewport component for displaying emojis in different categories.
 * Supports filtering, category navigation, and size calculations for efficient rendering.
 * @component
 */
@Component({
	selector: 'ch-emoji-viewport',
	standalone: true,
	imports: [
		CommonModule,
		ScrollingModule,
		ClickTouchHoldDirective,
		PreventContextMenuDirective,
		EmojiButtonComponent,
		RippleDirective,
		TranslatePipe,
	],
	templateUrl: './emoji-viewport.component.html',
	styleUrls: ['./emoji-viewport.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	hostDirectives: [PreventContextMenuDirective],
	host: {
		'collision-id': crypto.randomUUID(),
		class: 'ch-element',
	},
})
export class EmojiViewportComponent implements AfterViewInit {
	private emojiPickerService = inject(EmojiPickerService);
	private destroyRef = inject(DestroyRef);

	viewport = viewChild<CdkVirtualScrollViewport>(
		CdkVirtualScrollViewport
	);

	/**
	 * Specifies the list of default emojis to be displayed.
	 * @group Props
	 */
	emojis = input<Emoji[]>([...emojis]);

	/**
	 * Specifies the suggested emojis that should be displayed.
	 * This includes a list of emojis to be suggested in either 'recent' or 'frequent' mode.
	 * @group Props
	 */
	suggestionEmojis = input<SuggestionEmojis | null>(null);

	/**
	 * Filtered emojis based on active filters.
	 * Contains filter state and the list of emojis that match the filter criteria.
	 * @group Props
	 */
	filteredEmojis = input<FilteredEmojis>({
		filterActive: false,
		emojis: [],
	});

	filteredEmojiStream$ = toObservable(this.filteredEmojis)
		.pipe(takeUntilDestroyed())
		.subscribe(() => {
			this.currentCategory.set(this.emojiCategories()[0]);
			this.viewport()?.scrollToIndex(0);
		});

	/**
	 * List of emoji categories to be displayed.
	 * @group Props
	 */
	emojiCategories = input<EmojiCategory[]>([...emojiCategories]);

	/**
	 * Specifies the size option for the emojis.
	 * @group Props
	 * @default 'default'
	 */
	emojiSize = input<EmojiSizeOption>('default');

	/**
	 * Height of the viewport in pixels.
	 * @group Props
	 * @default 400
	 */
	height = input<number>(400);

	/**
	 * Width of the viewport in pixels.
	 * @group Props
	 * @default 350
	 */
	width = input<number>(350);

	/**
	 * Specifies whether the scrollbar should be visible.
	 * @group Props
	 * @default true
	 */
	scrollbarVisible = input<boolean>(true);

	/**
	 * The currently selected emoji category.
	 * @group TwoWayBindings
	 * @default 0
	 */
	currentCategory = model<EmojiCategory>(this.emojiCategories()[0]);

	/**
	 * Step size for scrolling using the scroll wheel, in pixels.
	 * @group Props
	 */
	scrollWheelStep = input<number>();

	/**
	 * This indicator signifies that skintone variations are available for the associated emoji.
	 * @group Props
	 * @default true
	 */
	showSkintoneIndicator = input<boolean>(true);

	/**
	 * Callback function to be executed when an emoji is clicked.
	 * @param {ClickEvent} event - The event object containing details about the click.
	 * @group Outputs
	 */
	onClick = output<ClickEvent>();

	/**
	 * Callback function to be executed when the component is scrolled.
	 * @group Outputs
	 */
	onScroll = output<void>();

	/**
	 * Callback function to be executed when an emoji is held down (long press).
	 * @param {TouchHoldEvent} event - The event object containing details about the touch hold.
	 * @group Outputs
	 */
	onTouchHold = output<TouchHoldEvent>();

	/**
	 * Callback function to be executed when the emoji size is calculated in pixels.
	 * @param {Object} size - An object containing the calculated font size and button size.
	 * @param {number} size.fontSize - The calculated font size in pixels.
	 * @param {number} size.buttonSize - The calculated button size in pixels.
	 * @group Outputs
	 */
	onEmojiSizeCalculated = output<{
		fontSize: number;
		buttonSize: number;
	}>();

	scrollIndex = signal<number>(0);

	stickyHeaderCategory = signal<EmojiCategory>(
		this.emojiCategories()[0]
	);

	navigatedManually = signal<boolean>(false);

	scrollBarWidth = computed(() => {
		const scrollbarVisible = this.scrollbarVisible();
		return scrollbarVisible ? this.getGlobalScrollbarWidth() : 0;
	});

	viewportWidth = computed(() =>
		this.getViewportWidth(
			this.width(),
			this.emojiPickerService.padding(),
			this.scrollBarWidth()
		)
	);

	emojiSizeInPx = computed(() =>
		this.calculateEmojiSize(
			this.viewportWidth(),
			EmojiSize[this.emojiSize()],
			this.emojiPickerService.emojiItemSizeMultiplier()
		)
	);

	itemSize = computed(() => {
		return NumberHelper.toFixedAndFloor(
			this.emojiSizeInPx() *
				this.emojiPickerService.emojiItemSizeMultiplier(),
			2
		);
	});

	suggestionEmojiRows = computed(() => {
		const suggestionEmojis = this.suggestionEmojis();
		if (
			!suggestionEmojis ||
			!this.emojiCategories().includes('suggestions')
		)
			return [];

		return this.emojiPickerService.generateEmojiRows({
			emojiSize: this.emojiSizeInPx(),
			viewportWidth: this.viewportWidth(),
			itemSizeMultiplier:
				this.emojiPickerService.emojiItemSizeMultiplier(),
			generateCategoryRows: true,
			type: 'suggestions',
			emojis: suggestionEmojis,
		});
	});

	filteredEmojiRows = computed(() => {
		const filteredEmojis = this.filteredEmojis();

		if (!filteredEmojis.filterActive) return [];

		return this.emojiPickerService.generateEmojiRows({
			emojiSize: this.emojiSizeInPx(),
			viewportWidth: this.viewportWidth(),
			itemSizeMultiplier:
				this.emojiPickerService.emojiItemSizeMultiplier(),
			generateCategoryRows: true,
			type: 'filter',
			emojis: filteredEmojis.emojis,
		});
	});

	defaultEmojiRows = computed(() => {
		return this.emojiPickerService.generateEmojiRows({
			emojiSize: this.emojiSizeInPx(),
			viewportWidth: this.viewportWidth(),
			itemSizeMultiplier:
				this.emojiPickerService.emojiItemSizeMultiplier(),
			generateCategoryRows: true,
			type: 'default',
			emojis: this.emojis(),
		});
	});

	emojiRows = computed((): EmojiPickerRow[] => {
		const filteredEmojis = this.filteredEmojis();
		return !filteredEmojis.filterActive
			? [...this.suggestionEmojiRows(), ...this.defaultEmojiRows()]
			: this.filteredEmojiRows();
	});

	emojiDataMap = this.emojiPickerService.emojiDataMap;

	emojiSizeInPx$ = zip([
		toObservable(this.emojiSizeInPx),
		toObservable(this.itemSize),
	])
		.pipe(takeUntilDestroyed())
		.subscribe(([emojiSizeInPx, itemSize]) => {
			this.onEmojiSizeCalculated.emit({
				fontSize: emojiSizeInPx,
				buttonSize: itemSize,
			});
		});

	@HostBinding('style.--sticky-offset')
	stickyHeaderOffset: number = 0;

	ngAfterViewInit(): void {
		this.initializeViewportObservers();
	}

	private initializeViewportObservers = () => {
		this.initializeRendererObserver();
		this.initializeScrollerObserver();
	};

	private initializeRendererObserver = () => {
		this.viewport()
			?.renderedRangeStream.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				this.viewport()?.checkViewportSize();
				this.updateStickyHeaderOffset();
			});
	};

	private updateStickyHeaderOffset(): void {
		const offset =
			this.viewport()?.getOffsetToRenderedContentStart() || 0;
		this.stickyHeaderOffset = -offset;
	}

	private initializeScrollerObserver = () => {
		this.viewport()
			?.elementScrolled()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				//SET NEW CURRENT CATEGORY FOR STICKY ELEMENT HEADER + MAKE SURE THE THE RIGHT CATEGORY IS SELECTED
				const scrollIndex = this.calculateCurrentScrollIndex();

				const currentRow = this.emojiRows()[scrollIndex];
				const previousRow = this.emojiRows()[scrollIndex - 1];

				const currentCategoryRow =
					this.navigatedManually() || !previousRow
						? currentRow
						: previousRow;

				this.navigatedManually.set(false);

				const stickyHeaderCategory = this.determineCurrentCategory(
					currentCategoryRow
				);
				this.stickyHeaderCategory.set(stickyHeaderCategory);

				this.onScroll.emit();
			});
	};

	private calculateEmojiSize(
		viewportWidth: number,
		emojiSize: EmojiSize,
		itemSizeMultiplier: number
	): number {
		return this.emojiPickerService.calculateEmojiSize(
			viewportWidth,
			emojiSize,
			itemSizeMultiplier
		);
	}

	private calculateCurrentScrollIndex = () => {
		const offset = this.viewport()?.measureScrollOffset() || 0;
		return Math.floor(offset / this.itemSize());
	};

	private getViewportWidth = (
		width: number,
		padding: number,
		scrollbarWidth: number
	): number => {
		return width - scrollbarWidth - padding * 2;
	};

	private getGlobalScrollbarWidth = (): number => {
		const root = document.querySelector(':root') as HTMLElement;
		const scrollbarWidth = getComputedStyle(root).getPropertyValue(
			'--ch-scrollbar-size'
		);
		return parseFloat(scrollbarWidth.replace('px', '').trim());
	};

	private handleNavigation = (index: number): void => {
		const targetNode = document.querySelector(
			'.ch-static-category.ch-sticky.ch-row'
		) as HTMLElement;
		if (!targetNode) return;

		const navigateIfReady = () => {
			if (targetNode.style.display === 'block') {
				this.navigatedManually.set(true);
				this.viewport()?.scrollToIndex(
					index === 0 ? index : index + 1
				);

				return true;
			}
			return false;
		};

		if (!navigateIfReady()) {
			this.observeStyleChanges(targetNode, navigateIfReady);
		}
	};

	private observeStyleChanges = (
		targetNode: HTMLElement,
		shouldDisconnect: () => boolean
	): void => {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'style'
				) {
					if (shouldDisconnect()) {
						observer.disconnect();
					}
				}
			});
		});

		observer.observe(targetNode, {
			attributes: true,
			attributeFilter: ['style'],
		});

		setTimeout(() => observer.disconnect(), 5000);
	};

	private calculateIndexOfCategory = (
		category: EmojiCategory
	): number => {
		const rows = this.emojiRows();
		return rows.findIndex(
			(row) => row.type === 'category' && row.value === category
		);
	};

	protected handleScrolledIndexChanged = (index: number): void => {
		const rows = this.emojiRows();
		if (rows.length === 0) return;

		this.scrollIndex.set(index);

		const currentRow = rows[index];
		const currentCategory = this.determineCurrentCategory(currentRow);
		this.currentCategory.set(currentCategory);
	};

	private determineCurrentCategory(
		currentRow: EmojiPickerRow
	): EmojiCategory {
		return currentRow.type === 'emoji'
			? currentRow.value[0].category
			: (currentRow.value as EmojiCategory);
	}

	protected handleTouchHold = (evt: TouchHoldEvent): void => {
		this.onTouchHold.emit(evt);
	};

	protected handleClick = (evt: ClickEvent): void => {
		this.onClick.emit(evt);
	};

	protected handleWheelScroll(event: WheelEvent): void {
		const viewport = this.viewport();
		if (!viewport) return;

		event.preventDefault();

		const step = this.scrollWheelStep() ?? this.emojiSizeInPx() * 4;

		const scrollAmount = Math.sign(event.deltaY) * step;

		viewport?.scrollToOffset(
			viewport?.measureScrollOffset() + scrollAmount
		);
	}

	protected trackEmojiRow = (
		index: number,
		row: EmojiPickerRow
	): string => {
		return row.id;
	};

	/**
	 * Navigates to the specified emoji category.
	 * Scrolls the emoji picker to the first emoji in the specified category if it exists.
	 * @param {EmojiCategory} category - The `EmojiCategory` to navigate to.
	 * @group Method
	 */
	navigateToCategory = (category: EmojiCategory): void => {
		const index = this.calculateIndexOfCategory(category);

		if (index !== -1) {
			this.scrollIndex.set(index);
			this.handleNavigation(index);
		} else {
			console.error(`Invalid category: ${category}.`);
		}
	};
}
