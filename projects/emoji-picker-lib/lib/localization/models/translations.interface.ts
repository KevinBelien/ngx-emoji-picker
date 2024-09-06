import { Language } from './languages.type';

/**
 * A type representing a map of translations for different languages.
 * Each language key maps to a `Translations` map containing key-value pairs of translated strings.
 * @group Types
 */
export type LocaleTranslations = Map<Language, Translations>;

/**
 * A type representing a map of translation key-value pairs.
 * The key is the translation key, and the value is the translated string.
 * @group Types
 */
export type Translations = Map<string, string>;
