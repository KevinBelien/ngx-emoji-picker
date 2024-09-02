import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { emojiCategories, EmojiCategory } from '../../models';
import { EmojiTabsComponent } from './emoji-tabs.component';

@Component({
	imports: [EmojiTabsComponent],
	standalone: true,
	template: `<ch-emoji-tabs
		[emojiCategories]="emojiCategories"
		[(selectedTab)]="selectedTab"
		(onTabClicked)="handleTabClicked($event)"
	></ch-emoji-tabs>`,
})
class TestEmojiTabsComponent {
	emojiCategories: EmojiCategory[] = [...emojiCategories];
	selectedTab: EmojiCategory = emojiCategories[0];
	handleTabClicked = jest.fn();
}

describe('EmojiTabsComponent', () => {
	let fixture: ComponentFixture<TestEmojiTabsComponent>;
	let component: TestEmojiTabsComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestEmojiTabsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TestEmojiTabsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should render the correct number of category tabs', () => {
		const categoryButtons = fixture.debugElement.queryAll(
			By.css('ch-button')
		);
		expect(categoryButtons.length).toBe(emojiCategories.length);
	});

	it('should update selected category on click and emit event', () => {
		const category = emojiCategories[2];
		const categoryButton = fixture.debugElement.queryAll(
			By.css('.ch-button')
		)[2];

		categoryButton.triggerEventHandler(
			'click',
			new MouseEvent('click')
		);
		fixture.detectChanges();

		expect(component.handleTabClicked).toHaveBeenCalledWith(category);

		// Ensure the selected category button has the active class
		expect(categoryButton.nativeElement.classList).toContain(
			'ch-button-active'
		);
	});
});
