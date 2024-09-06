import { DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, NgModule, Provider } from '@angular/core';
import { ScreenService } from '@chit-chat/ngx-emoji-picker/lib/utils';

function initializeDocument(document: Document, screenService: ScreenService): () => void {
    return () => {
        if (screenService.isMobile()) {
            document.body.classList.add('ch-mobile');
        }
    };
}

/**
 * Provides the configuration and necessary services for the ChitChat module.
 * This function is used in the module's `forRoot` method to configure the library at the application level.
 *
 * @returns {Provider[]} An array of providers required for the ChitChat module.
 */
export function provideEmojiPicker(): Provider[] {
    return [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeDocument,
            deps: [DOCUMENT, ScreenService],
            multi: true
        }
    ];
}

/**
 * A module that provides all the necessary services and configuration for the ChitChat library.
 * Use the `forRoot` method to configure the module with a custom `LibConfig`.
 *
 * @module EmojiPickerModule
 */
@NgModule({
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeDocument,
            deps: [DOCUMENT, ScreenService],
            multi: true
        }
    ]
})
export class EmojiPickerModule {}
