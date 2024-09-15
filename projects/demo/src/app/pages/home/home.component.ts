import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '@chit-chat/ngx-emoji-picker/lib/components/button';
import { navigationItems } from '../../app-navigation';

@Component({
    selector: 'ch-home',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    private router = inject(Router);

    navigationItems = [...navigationItems];

    handleNavigationItemClick = (path: string) => {
        this.router.navigate([path]);
    };
}
