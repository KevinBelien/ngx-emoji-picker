import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

import { CategoryBarPosition, emojiCategories, EmojiCategory, EmojiPickerComponent, EmojiSizeOption, EmojiSuggestionMode, SkintoneSetting } from '@chit-chat/ngx-emoji-picker/src/lib/components/emoji-picker';
import { BehaviorSubject, combineLatest, debounceTime, of, switchMap } from 'rxjs';

@Component({
    selector: 'ch-emoji-picker-demo',
    standalone: true,
    imports: [CommonModule, EmojiPickerComponent, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatSliderModule],
    templateUrl: './emoji-picker-demo.component.html',
    styleUrl: './emoji-picker-demo.component.scss'
})
export class EmojiPickerDemoComponent implements AfterViewInit {
    categories = [...emojiCategories];

    form: {
        height: number;
        width: number;
        emojiSize: EmojiSizeOption;
        categories: EmojiCategory[];
        categoryBarPosition: CategoryBarPosition;
        suggestionMode: EmojiSuggestionMode;
        skintoneSettings: SkintoneSetting;
    } = {
        height: 450,
        width: 350,
        emojiSize: 'default',
        categories: [...emojiCategories],
        categoryBarPosition: 'top',
        suggestionMode: 'recent',
        skintoneSettings: 'both'
    };

    width$ = new BehaviorSubject<number>(this.form.width);
    height$ = new BehaviorSubject<number>(this.form.height);

    debounceTime = 300;
    isInitialized = false;

    size$ = combineLatest([this.width$, this.height$]).pipe(
        switchMap(([width, height]) => {
            if (!this.isInitialized) {
                return of({ width, height });
            }
            return of({ width, height }).pipe(debounceTime(this.debounceTime));
        })
    );

    emojiSizes: EmojiSizeOption[] = ['default', 'xs', 'sm', 'lg', 'xl'];

    ngAfterViewInit() {
        // Mark the component as initialized to allow debouncing after this point
        this.isInitialized = true;
    }

    handleWidthChange = () => {
        this.width$.next(this.form.width);
    };

    handleHeightChange = () => {
        this.height$.next(this.form.height);
    };
}
