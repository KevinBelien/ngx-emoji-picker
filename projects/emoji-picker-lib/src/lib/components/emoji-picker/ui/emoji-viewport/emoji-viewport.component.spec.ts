import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { emojis } from '../../data';
import { Emoji, EmojiCategory, FilteredEmojis, SuggestionEmojis } from '../../models';
import { EmojiViewportComponent } from './emoji-viewport.component';

if (typeof PointerEvent === 'undefined') {
    (global as any).PointerEvent = class PointerEvent extends MouseEvent {
        pointerType: string;

        constructor(type: string, params: any = {}) {
            super(type, params);
            this.pointerType = params.pointerType || 'mouse';
        }
    };
}

@Component({
    template: `<ch-emoji-viewport
        [emojis]="emojis"
        [suggestionEmojis]="suggestionEmojis"
        [filteredEmojis]="filteredEmojis"
        [emojiCategories]="emojiCategories"
        [emojiSize]="emojiSize"
        [height]="height"
        [width]="width"
        [scrollbarVisible]="scrollbarVisible"
        [scrollWheelStep]="scrollWheelStep"
        [showSkintoneIndicator]="showSkintoneIndicator"
        (onClick)="handleClick($event)"
        (onScroll)="handleScroll()"
        (onTouchHold)="handleTouchHold($event)"
        (onEmojiSizeCalculated)="handleEmojiSizeCalculated($event)"
    ></ch-emoji-viewport>`,
    standalone: true,
    imports: [
        EmojiViewportComponent // Import the standalone EmojiViewportComponent
    ]
})
class TestEmojiViewportComponent {
    emojis: Emoji[] = [...emojis];

    suggestionEmojis: SuggestionEmojis | null = null;
    filteredEmojis: FilteredEmojis = {
        filterActive: false,
        emojis: []
    };
    emojiCategories: EmojiCategory[] = ['smileys-people', 'animals-nature'];
    emojiSize: 'default' | 'small' | 'large' = 'default';
    height = 400;
    width = 350;
    scrollbarVisible = true;
    scrollWheelStep = 40;
    showSkintoneIndicator = true;

    handleClick = jest.fn();
    handleScroll = jest.fn();
    handleTouchHold = jest.fn();
    handleEmojiSizeCalculated = jest.fn();
}

describe('EmojiViewportComponent', () => {
    let fixture: ComponentFixture<TestEmojiViewportComponent>;
    let component: EmojiViewportComponent;
    let viewportDebugElement: any;
    let cdkViewport: CdkVirtualScrollViewport;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestEmojiViewportComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TestEmojiViewportComponent);
        fixture.detectChanges();

        component = fixture.debugElement.query(By.directive(EmojiViewportComponent))?.componentInstance;
        viewportDebugElement = fixture.debugElement.query(By.directive(CdkVirtualScrollViewport));
        cdkViewport = viewportDebugElement?.componentInstance;
    });

    it('should render the emoji viewport element', () => {
        expect(component).toBeTruthy();
    });

    it('should scroll to the specified emoji category', () => {
        const calculateIndexOfCategorySpy = jest.spyOn(component as any, 'calculateIndexOfCategory');
        const handleNavigationSpy = jest.spyOn(component as any, 'handleNavigation');
        const testCategory: EmojiCategory = 'smileys-people';

        component.navigateToCategory(testCategory);

        expect(calculateIndexOfCategorySpy).toHaveBeenCalledWith(testCategory);
        expect(handleNavigationSpy).toHaveBeenCalled();
    });

    it('should emit onClick event when an emoji button is clicked', () => {
        const viewportDebugElement = fixture.debugElement.query(By.directive(CdkVirtualScrollViewport));
        expect(viewportDebugElement).not.toBeNull();

        const pointerDownEvent = new PointerEvent('pointerdown', {
            button: 0,
            pointerType: 'mouse'
        });

        const pointerUpEvent = new PointerEvent('pointerup', {
            button: 0,
            pointerType: 'mouse'
        });

        viewportDebugElement.nativeElement.dispatchEvent(pointerDownEvent);
        fixture.detectChanges();

        viewportDebugElement.nativeElement.dispatchEvent(pointerUpEvent);
        fixture.detectChanges();

        jest.useFakeTimers();

        expect(fixture.componentInstance.handleClick).toHaveBeenCalled();
    });
});
