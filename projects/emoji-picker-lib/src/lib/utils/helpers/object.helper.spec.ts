import { ObjectHelper } from './object.helper';

describe('ObjectHelper', () => {
	describe('objectEquals', () => {
		it('should return true for two equal objects', () => {
			const obj1 = { a: 1, b: 2, c: 'test' };
			const obj2 = { a: 1, b: 2, c: 'test' };

			const result = ObjectHelper.objectEquals(obj1, obj2);

			expect(result).toBe(true);
		});

		it('should return false for two objects with different keys', () => {
			const obj1 = { a: 1, b: 2 };
			const obj2 = { a: 1, b: 2, c: 'extra' };

			const result = ObjectHelper.objectEquals(obj1, obj2);

			expect(result).toBe(false);
		});

		it('should return false for two objects with the same keys but different values', () => {
			const obj1 = { a: 1, b: 2, c: 'test' };
			const obj2 = { a: 1, b: 3, c: 'test' };

			const result = ObjectHelper.objectEquals(obj1, obj2);

			expect(result).toBe(false);
		});
	});

	describe('arrayOfObjectsEquals', () => {
		it('should return true for two arrays of equal objects', () => {
			const arr1 = [
				{ a: 1, b: 2 },
				{ a: 3, b: 4 },
			];
			const arr2 = [
				{ a: 1, b: 2 },
				{ a: 3, b: 4 },
			];

			const result = ObjectHelper.arrayOfObjectsEquals(arr1, arr2);

			expect(result).toBe(true);
		});

		it('should return false for two arrays with different lengths', () => {
			const arr1 = [
				{ a: 1, b: 2 },
				{ a: 3, b: 4 },
			];
			const arr2 = [{ a: 1, b: 2 }];

			const result = ObjectHelper.arrayOfObjectsEquals(arr1, arr2);

			expect(result).toBe(false);
		});

		it('should return false for two arrays with different objects', () => {
			const arr1 = [
				{ a: 1, b: 2 },
				{ a: 3, b: 4 },
			];
			const arr2 = [
				{ a: 1, b: 2 },
				{ a: 3, b: 5 },
			];

			const result = ObjectHelper.arrayOfObjectsEquals(arr1, arr2);

			expect(result).toBe(false);
		});

		it('should return false for two arrays where one object differs', () => {
			const arr1 = [
				{ a: 1, b: 2 },
				{ a: 3, b: 4 },
			];
			const arr2 = [
				{ a: 1, b: 2 },
				{ a: 3, b: 4, c: 5 },
			];

			const result = ObjectHelper.arrayOfObjectsEquals(arr1, arr2);

			expect(result).toBe(false);
		});
	});
});
