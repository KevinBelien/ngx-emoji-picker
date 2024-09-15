/**
 * An array of supported language codes.
 * @group Constants
 * @type {ReadonlyArray<string>}
 */
export const languages = ['ar', 'ca', 'cs', 'de', 'el', 'en', 'es', 'fa', 'fi', 'fr', 'hu', 'it', 'ja', 'lt', 'lv', 'nb', 'nl', 'pl', 'pt', 'ro', 'ru', 'sl', 'sv', 'tr', 'vi', 'zh-tw', 'zh'] as const;

/**
 * A type representing a language code.
 * This can be one of the predefined language codes from the `languages` array or any custom string.
 * @group Types
 */
export type Language = (typeof languages)[number] | string;
