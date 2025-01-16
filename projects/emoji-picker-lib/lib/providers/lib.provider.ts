import { DOCUMENT } from '@angular/common';
import { EnvironmentProviders, NgModule, inject, provideAppInitializer } from '@angular/core';

function initializeDocument(document: Document): () => void {
    return () => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document)) document.body.classList.add('ch-mobile');
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
            const initializerFn = initializeDocument(inject(DOCUMENT));
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
            const initializerFn = initializeDocument(inject(DOCUMENT));
            return initializerFn();
        })
    ]
})
export class EmojiPickerModule {}
