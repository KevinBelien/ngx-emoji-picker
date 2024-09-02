/**
 * Represents the different settings available for handling skintones in the emoji picker.
 *
 * - `global`: Apply a single skintone globally to all applicable emojis.
 * - `individual`: Allow individual emojis to have their own skintone settings.
 * - `both`: Support both global and individual skintone settings.
 * - `none`: Disable skintones.
 *
 * @group Types
 */
export type SkintoneSetting =
	| 'global'
	| 'individual'
	| 'both'
	| 'none';
