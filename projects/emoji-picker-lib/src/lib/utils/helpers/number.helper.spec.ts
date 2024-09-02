import { NumberHelper } from './number.helper';

describe('NumberHelper', () => {
	describe('toFixedAndFloor', () => {
		it('should floor the number to the specified decimals', () => {
			const value = 5.6789;
			const decimals = 2;

			const result = NumberHelper.toFixedAndFloor(value, decimals);

			expect(result).toBe(5.67);
		});

		it('should return the number with no decimal if decimals is 0', () => {
			const value = 5.6789;
			const decimals = 0;

			const result = NumberHelper.toFixedAndFloor(value, decimals);

			expect(result).toBe(5);
		});

		it('should handle rounding down correctly', () => {
			const value = 9.9999;
			const decimals = 2;

			const result = NumberHelper.toFixedAndFloor(value, decimals);

			expect(result).toBe(9.99);
		});

		it('should handle small numbers correctly', () => {
			const value = 0.004567;
			const decimals = 3;

			const result = NumberHelper.toFixedAndFloor(value, decimals);

			expect(result).toBe(0.004);
		});

		it('should handle large numbers correctly', () => {
			const value = 123456789.987654;
			const decimals = 4;

			const result = NumberHelper.toFixedAndFloor(value, decimals);

			expect(result).toBe(123456789.9876);
		});
	});
});
