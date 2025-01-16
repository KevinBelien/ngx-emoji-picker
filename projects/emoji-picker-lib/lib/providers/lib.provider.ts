import { DOCUMENT } from '@angular/common';
import { EnvironmentProviders, NgModule, inject, provideAppInitializer } from '@angular/core';
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
export function provideEmojiPicker(): EnvironmentProviders[] {
    return [
        provideAppInitializer(() => {
            const initializerFn = initializeDocument(inject(DOCUMENT), inject(ScreenService));
            return initializerFn();
        })
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
        provideAppInitializer(() => {
            const initializerFn = initializeDocument(inject(DOCUMENT), inject(ScreenService));
            return initializerFn();
        })
    ]
})
export class EmojiPickerModule {}
