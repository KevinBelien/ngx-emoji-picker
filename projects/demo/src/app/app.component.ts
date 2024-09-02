import { CommonModule } from '@angular/common';
import { Component, effect, inject, Renderer2 } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/src/lib/components/button';
import { frTranslations, nlTranslations, TranslationService } from '@chit-chat/ngx-emoji-picker/src/lib/localization';
import { BreakpointState, ScreenService } from '@chit-chat/ngx-emoji-picker/src/lib/utils';
import { NavigationItem, navigationItems } from './app-navigation';

@Component({
    selector: 'ch-root',
    standalone: true,
    imports: [RouterOutlet, RouterModule, CommonModule, MatSidenavModule, MatListModule, ButtonComponent, MatToolbarModule, MatSlideToggleModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    private renderer = inject(Renderer2);
    private screenService = inject(ScreenService);
    private translationsService = inject(TranslationService);

    readonly navigationItems = [...navigationItems];

    selectedNavItem: NavigationItem = navigationItems[0];
    sideNavMode: 'over' | 'push' | 'side';

    isMenuOpened: boolean = ['lg', 'xl'].includes(this.screenService.breakpointState()?.current);

    isDarkTheme: boolean = false;

    contentHeight: number;
    constructor() {
        this.sideNavMode = this.calcSideNavMode(this.screenService.breakpointState());
        this.contentHeight = this.calculatePageHeight();

        effect(() => {
            const breakpoint = this.screenService.breakpointState();

            this.sideNavMode = this.calcSideNavMode(breakpoint);
            this.contentHeight = this.calculatePageHeight();
        });

        this.enableLightTheme();

        this.translationsService.loadTranslations('nl', nlTranslations);
        this.translationsService.loadTranslations('fr', frTranslations);
        this.translationsService.setLanguage('nl');
    }

    calcSideNavMode = (breakpointState: BreakpointState): 'over' | 'push' | 'side' => (['lg', 'xl'].includes(breakpointState.current) ? 'side' : 'over');

    calculatePageHeight = () => window.innerHeight - 50;

    selectNavItem(item: NavigationItem) {
        this.selectedNavItem = item;
    }

    handleMenuBtnClick = (evt: Event) => {
        evt.stopPropagation();
        this.isMenuOpened = !this.isMenuOpened;
    };

    enableDarkTheme() {
        this.renderer.removeClass(document.body, 'ch-light-theme');
        this.renderer.addClass(document.body, 'ch-dark-theme');
    }

    enableLightTheme() {
        this.renderer.removeClass(document.body, 'ch-dark-theme');
        this.renderer.addClass(document.body, 'ch-light-theme');
    }

    handleThemeChange = () => {
        this.isDarkTheme = !this.isDarkTheme;
        if (this.isDarkTheme) this.enableDarkTheme();
        else this.enableLightTheme();
    };
}
