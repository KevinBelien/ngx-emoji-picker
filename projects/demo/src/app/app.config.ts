import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEmojiPicker } from '@chit-chat/ngx-emoji-picker/src/lib/providers';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimations(),
        provideEmojiPicker()
        // importProvidersFrom(EmojiPickerModule),
    ]
};
