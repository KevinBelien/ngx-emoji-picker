import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostBinding, inject, Input, input, OnDestroy, OnInit, output, Renderer2, signal, viewChild } from '@angular/core';

import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

import { DialogComponent } from '@chit-chat/ngx-emoji-picker/lib/components/dialog';
import { TextBoxComponent, ValueChangeEvent } from '@chit-chat/ngx-emoji-picker/lib/components/text-box';
import { TranslatePipe, TranslationService } from '@chit-chat/ngx-emoji-picker/lib/localization';
import { ClickActionType, ClickEvent, TouchHoldEvent } from '@chit-chat/ngx-emoji-picker/lib/utils';
import { debounce, distinctUntilChanged, from, map, Observable, of, switchMap, timer } from 'rxjs';
import { emojis } from './data';
import { EmojiDataHelper } from './helpers';
import { DefaultStorageOptions, Emoji, emojiCategories, EmojiCategory, EmojiSelectedEvent, EmojiSelectionSource, EmojiSizeOption, EmojiSuggestionMode, Skintone, SkintoneSetting, StorageConfig } from './models';
import { CategoryBarPosition } from './models/category-bar-position.model';
import { FilteredEmojis } from './models/filtered-emojis.model';
import { EmojiDataService, EmojiPickerService } from './services';
import { EmojiFilterService } from './services/emoji-filter.service';
import { EmojiSkintonePickerComponent } from './ui/emoji-skintone-picker/emoji-skintone-picker.component';
import { EmojiTabsComponent } from './ui/emoji-tabs/emoji-tabs.component';
import { EmojiViewportComponent } from './ui/emoji-viewport/emoji-viewport.component';
import { SkintoneSwatchPickerComponent } from './ui/skintone-swatch-picker/skintone-swatch-picker.component';

/**
 * A highly customizable emoji picker that allows users to select emojis,
 * filter them, and adjust settings like skintone. This component supports
 * multiple categories, custom emoji sizes, and skintone selection.
 * @component
 */
@Component({
    selector: 'ch-emoji-picker',
    standalone: true,
    imports: [CommonModule, EmojiViewportComponent, EmojiTabsComponent, SkintoneSwatchPickerComponent, EmojiSkintonePickerComponent, TextBoxComponent, TranslatePipe, DialogComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './emoji-picker.component.html',
    styleUrl: './emoji-picker.component.scss',
    host: {
        'collision-id': crypto.randomUUID(),
        class: 'ch-element'
    }
})
export class EmojiPickerComponent implements OnInit, OnDestroy {
    private emojiDataService = inject(EmojiDataService);
    private emojiFilterService = inject(EmojiFilterService);
    private renderer = inject(Renderer2);
    private elementRef = inject(ElementRef);
    private emojiPickerService = inject(EmojiPickerService);
    private translationService = inject(TranslationService);

    emojiViewportComponent = viewChild<EmojiViewportComponent>(EmojiViewportComponent);
    searchComponent = viewChild<TextBoxComponent>(TextBoxComponent);
    swatchPickerComponent = viewChild<SkintoneSwatchPickerComponent>(SkintoneSwatchPickerComponent);

    @HostBinding('style.--ch-emoji-fontsize') emojiSizeInPx?: number;

    @HostBinding('style.--ch-emoji-buttonsize')
    emojiButtonSizeInPx?: number;

    @HostBinding('style.--ch-padding-inline') padding?: number;

    /**
     * Specifies the height of the button
     * @group Props
     * @default 450
     */
    @Input()
    @HostBinding('style.--picker-height')
    height = 450;

    /**
     * Specifies the width of the button
     * @group Props
     * @default 400
     */
    @Input()
    @HostBinding('style.--picker-width')
    width = 400;

    /**
     * Specifies the display size of the emoji.
     * This will be used to determine the emoji size in pixels.
     * @group Props
     * @default 'default'
     */
    emojiSize = input<EmojiSizeOption>('default');

    /**
     * Specifies the mode for displaying emoji suggestions in the picker.
     * @group Props
     * @default 'recent'
     */
    suggestionMode = input<EmojiSuggestionMode>('recent');

    // /**
    //  * Specifies the options for storage of suggestion emojis and skintones.
    //  * @group Props
    //  * @default {mode: 'recent'}
    //  */
    storageOptions = input<StorageConfig>();

    /**
     * Specifies the location of the category bar.
     * @group Props
     * @default 'top'
     */
    categoryBarPosition = input<CategoryBarPosition>('top');

    /**
     * Specifies if the scrollbar is visible.
     * @group Props
     * @default true
     */
    scrollbarVisible = input<boolean>(true);

    /**
     * Specifies the categories to be included in the emoji picker
     * The order will be respected, except for suggestion category
     * @group Props
     */
    emojiCategories = input<EmojiCategory[]>([...emojiCategories]);

    /**
     * Specifies the approach for handling skintone variations within the emoji picker.
     * @group Props
     * @default 'both'
     */
    skintoneSetting = input<SkintoneSetting>('both');

    /**
     * Callback to execute when button is clicked.
     * @param {Emoji} emoji - selected emoji.
     * @group Outputs
     */
    onEmojiSelected = output<EmojiSelectedEvent>();

    /**
     * Fires whenever the global skintone has changed
     * @param {Skintone}
     * @group Outputs
     */
    onGlobalSkintoneChanged = output<Skintone>();

    searchValue = signal<string>('');

    isSkintoneDialogVisible = signal<boolean>(false);

    targetElement?: HTMLElement;

    selectedEmoji = signal<Emoji | null>(null);

    emojiCategoriesStream$ = toObservable(this.emojiCategories)
        .pipe(takeUntilDestroyed())
        .subscribe((categories) => {
            if (!categories.includes(this.selectedCategory())) {
                this.selectedCategory.set(categories[0]);
                this.emojiViewportComponent()?.navigateToCategory(categories[0]);
            }
        });

    skintoneSettingStream$ = toObservable(this.skintoneSetting)
        .pipe(takeUntilDestroyed())
        .subscribe((setting) => this.emojiDataService.setSkintoneSetting(setting));

    selectedCategory = signal<EmojiCategory>(this.emojiCategories()[0]);

    emojiTouchHoldEventActive: boolean = false;

    isIndividualSkintoneEnabled = computed(() => this.isIndividualSkintoneSettingEnabled(this.skintoneSetting()));
    isGlobalSkintoneEnabled = computed(() => this.isGlobalSkintoneSettingEnabled(this.skintoneSetting()));

    defaultEmojis = computed(() => {
        const categories = this.emojiCategories();
        return EmojiDataHelper.filterAndSortEmojis([...emojis], categories);
    });

    suggestionEmojis = computed(() => {
        const storageOptions = this.storageOptions();
        const suggestionMode = this.suggestionMode();

        if (!storageOptions || !storageOptions.suggestionEmojis || storageOptions.suggestionEmojis.storage === 'localstorage') {
            const suggestionConfig = storageOptions ? (storageOptions.suggestionEmojis as DefaultStorageOptions) : undefined;
            const suggestionLimit = suggestionConfig?.limit || 50;
            const categories = this.emojiCategories();
            const recentEmojis = this.emojiDataService.recentEmojis();
            const frequentEmojis = this.emojiDataService.frequentEmojis();

            if (!categories.includes('suggestions')) return null;

            return suggestionMode === 'recent'
                ? {
                      suggestionMode: suggestionMode,
                      emojis: recentEmojis.slice(0, suggestionLimit)
                  }
                : {
                      suggestionMode: suggestionMode,
                      emojis: frequentEmojis.slice(0, suggestionLimit)
                  };
        }

        const customEmojis: Emoji[] = this.emojiDataService.fetchEmojisByIds([...new Set(storageOptions.suggestionEmojis.value)]);
        return { suggestionMode: suggestionMode, emojis: customEmojis };
    });

    filteredEmojis$: Observable<FilteredEmojis> = toObservable(this.searchValue).pipe(
        debounce((searchValue) => {
            if (searchValue.trim() === '') {
                return of(0);
            }

            return timer(250);
        }),
        distinctUntilChanged(),
        switchMap((searchValue) => {
            if (searchValue === '') {
                return of({ filterActive: false, emojis: [] });
            }

            return from(
                this.emojiFilterService.filter(
                    searchValue,
                    this.translationService.getLanguage(),
                    this.defaultEmojis().map((emoji) => emoji.id)
                )
            ).pipe(
                map<string[], FilteredEmojis>((emojiIds) => ({
                    filterActive: true,
                    emojis: this.emojiDataService.fetchEmojisByIds(emojiIds)
                }))
            );
        })
    );

    filteredEmojis = toSignal(this.filteredEmojis$);

    emojis = computed(() => {
        const defaultEmojis = this.defaultEmojis();
        const suggestionEmojis = this.suggestionEmojis();
        const filteredEmojis = this.filteredEmojis();

        return {
            defaultEmojis,
            suggestionEmojis,
            filteredEmojis: filteredEmojis
        };
    });

    noDataEmoji = computed(() => this.emojiDataService.emojiMap()?.get('person-shrugging')?.value ?? '🤷');

    globalSkintone = computed((): Skintone => {
        const storageConfig = this.storageOptions();
        if (storageConfig && storageConfig.globalSkintone && storageConfig.globalSkintone.storage === 'custom') {
            return storageConfig.globalSkintone.value;
        }
        return this.emojiDataService.globalSkintoneSetting();
    });

    private pointerDownListener?: () => void;

    constructor() {
        effect(() => (this.padding = this.emojiPickerService.padding()));

        toObservable(this.storageOptions)
            .pipe(takeUntilDestroyed())
            .subscribe((storageOptions) => {
                if (storageOptions?.globalSkintone?.storage === 'custom') this.emojiDataService.setGlobalEmojiSkintone(storageOptions.globalSkintone.value, false);
                if (storageOptions?.individualSkintones?.storage === 'custom') this.emojiDataService.setEmojiSkintones(storageOptions?.individualSkintones.value);
            });
    }

    ngOnInit(): void {
        this.loadCountryFlagEmojiPolyfill();

        this.emojiDataService.skintoneSetting.set(this.skintoneSetting());

        this.pointerDownListener = this.createPointerDownListener();
    }

    ngOnDestroy(): void {
        if (this.pointerDownListener) {
            this.pointerDownListener();
        }
    }

    private createPointerDownListener = () =>
        this.renderer.listen(this.elementRef.nativeElement, 'pointerdown', (evt: PointerEvent) => {
            if (!(evt.target as HTMLElement).closest('.ch-color-picker-container')) {
                this.swatchPickerComponent()?.close();
            }
        });

    protected handleScroll = () => {
        this.swatchPickerComponent()?.close();
    };

    /**
     * Load a polyfill for flag emojis. Windows doesn't support flag emojis
     */
    private loadCountryFlagEmojiPolyfill() {
        const script = this.renderer.createElement('script');
        script.type = 'module';
        script.defer = true;
        script.text = `
      import { polyfillCountryFlagEmojis } from 'https://cdn.skypack.dev/country-flag-emoji-polyfill';
      polyfillCountryFlagEmojis();
    `;
        this.renderer.appendChild(document.body, script);
    }

    protected handleSearchValueChanged = (evt: ValueChangeEvent) => {
        this.searchValue.set(evt.value);
    };

    protected handleEmojiSizeCalculated = ({ fontSize, buttonSize }: { fontSize: number; buttonSize: number }) => {
        this.emojiSizeInPx = fontSize;
        this.emojiButtonSizeInPx = buttonSize;
    };

    protected handleCategoryTabClicked = (category: EmojiCategory) => {
        this.emojiViewportComponent()?.navigateToCategory(category);
    };

    protected handleEmojiClick = (evt: ClickEvent) => {
        if (!evt.data || this.emojiTouchHoldEventActive) {
            this.emojiTouchHoldEventActive = false;
            return;
        }
        this.processEmojiSelection(evt);
    };

    protected handleEmojiTouchHold = (evt: TouchHoldEvent) => {
        const emoji = this.emojiDataService.fetchEmojiById(evt.data);

        if (!emoji) return;

        this.emojiTouchHoldEventActive = this.isTouchHoldValid(evt, emoji);

        if (this.emojiTouchHoldEventActive && this.isIndividualSkintoneSettingEnabled(this.skintoneSetting())) {
            this.openSkintoneDialog(evt.targetElement, emoji);
        }
    };

    protected handleGlobalSkintoneChanged = (skintone: Skintone) => {
        if (this.globalSkintone() === skintone) return;

        const storageConfig = this.storageOptions();

        const canSaveInStorage = !storageConfig || !storageConfig.globalSkintone || (storageConfig.globalSkintone.storage === 'localstorage' && storageConfig.globalSkintone.allowAutoSave !== false);
        this.emojiDataService.setGlobalEmojiSkintone(skintone, canSaveInStorage);
        this.onGlobalSkintoneChanged.emit(skintone);
    };

    private processEmojiSelection = (evt: ClickEvent) => {
        const emoji = this.emojiDataService.fetchEmojiById(evt.data);
        if (!emoji) throw new Error(`No emoji found with id: ${evt.data}`);

        if (evt.action === ClickActionType.RIGHTCLICK) {
            if (this.shouldOpenSkintoneDialog(emoji)) {
                this.openSkintoneDialog(evt.targetElement, emoji);
            }

            this.emojiTouchHoldEventActive = false;
            return;
        }
        this.selectEmoji(emoji, EmojiSelectionSource.EmojiPicker);
    };

    private shouldOpenSkintoneDialog(emoji: Emoji): boolean {
        return this.emojiDataService.hasEmojiSkintones(emoji) && this.isIndividualSkintoneSettingEnabled(this.skintoneSetting());
    }

    private isTouchHoldValid(evt: TouchHoldEvent, emoji: Emoji | null): boolean {
        return !!emoji && this.emojiDataService.hasEmojiSkintones(emoji) && evt.event.pointerType === 'touch' && this.isIndividualSkintoneSettingEnabled(this.skintoneSetting());
    }

    private isIndividualSkintoneSettingEnabled = (skintoneSetting: SkintoneSetting): boolean => ['both', 'individual'].includes(skintoneSetting);

    private isGlobalSkintoneSettingEnabled = (skintoneSetting: SkintoneSetting): boolean => ['both', 'global'].includes(skintoneSetting);

    protected handleEmojiSkintoneSelected = (evt: ClickEvent): void => {
        const selectedEmoji = this.selectedEmoji();

        if (!selectedEmoji) return;
        this.handleIndividualEmojiSkintoneChanged(this.skintoneSetting(), selectedEmoji, evt.data);
        this.isSkintoneDialogVisible.set(false);
    };

    private handleIndividualEmojiSkintoneChanged = (skintoneSetting: SkintoneSetting, emoji: Emoji, emojiValue: string): void => {
        const storageConfig = this.storageOptions();

        if (skintoneSetting === 'individual') {
            if (!storageConfig || !storageConfig.individualSkintones || (storageConfig.individualSkintones?.storage === 'localstorage' && storageConfig.individualSkintones.allowAutoSave !== false))
                this.emojiDataService.updateEmojiSkintoneInStorage(emoji.id, emojiValue);
            else this.emojiDataService.updateEmojiSkintoneLocally({ emojiId: emoji.id, emojiValue });
        }

        this.selectEmoji(Object.assign({ ...emoji }, { value: emojiValue }), EmojiSelectionSource.EmojiSkintonePicker);
    };

    private openSkintoneDialog = (targetElement: HTMLElement, emoji: Emoji) => {
        this.selectedEmoji.set(emoji);
        this.targetElement = targetElement;
        this.isSkintoneDialogVisible.set(true);
    };

    /**
     * Update suggestions (recent and frequently) in storage
     * @param {string} emojiId - The id of the emoji to be updated.
     * @group Method
     */
    saveSuggestionEmojiInStorage = (emojiId: string) => {
        this.emojiDataService.addEmojiToRecents(emojiId);
        this.emojiDataService.increaseEmojiFrequency(emojiId);
    };

    /**
     * Select an emoji manually and update the suggestion in storage if option was enabled
     * @param {Emoji} emoji - Emoji object.
     * @group Method
     */
    selectEmoji = (emoji: Emoji, source: EmojiSelectionSource = EmojiSelectionSource.NONE) => {
        const suggestionOptions = this.storageOptions()?.suggestionEmojis;
        if (!suggestionOptions || (suggestionOptions.storage === 'localstorage' && suggestionOptions.allowAutoSave !== false)) {
            this.saveSuggestionEmojiInStorage(emoji.id);
        }
        this.onEmojiSelected.emit({ emoji, source });
    };

    /**
     * Navigate to a category of the emoji picker
     * @param {EmojiCategory} category - Category
     * @group Method
     */
    navigateToCategory = (category: EmojiCategory) => {
        this.emojiViewportComponent()?.navigateToCategory(category);
    };

    /**
     * Navigate to the first emoji of the first category of the emoji picker
     * @group Method
     */
    navigateToStart = () => {
        this.selectedCategory.set(this.emojiCategories()[0]);
        this.emojiViewportComponent()?.navigateToStart();
    };

    /**
     * Reset the emoji picker by clearing the filter and navigating to first category
     * @group Method
     */
    reset = () => {
        this.searchComponent()?.clear();
        this.navigateToStart();
    };

    /**
     * Update the viewport dimensions and re-render.
     * @group Method
     */
    refreshViewport = () => {
        this.emojiViewportComponent()?.checkViewportSize();
    };
}
