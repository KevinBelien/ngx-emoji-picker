export class NumberHelper {
	static toFixedAndFloor = (
		value: number,
		decimals: number
	): number => {
		const multiplier = Math.pow(10, decimals);
		const flooredValue = Math.floor(value * multiplier) / multiplier;
		return Number(flooredValue.toFixed(decimals));
	};
}
