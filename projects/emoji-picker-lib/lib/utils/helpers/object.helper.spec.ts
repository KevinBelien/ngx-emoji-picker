import { ObjectHelper } from '.';

describe('ObjectHelper', () => {
    describe('objectEquals', () => {
        it('should return true for two identical objects', () => {
            const obj1 = { a: 1, b: 'test' };
            const obj2 = { a: 1, b: 'test' };
            expect(ObjectHelper.objectEquals(obj1, obj2)).toBe(true);
        });

        it('should return false for objects with different keys', () => {
            const obj1 = { a: 1, b: 'test' };
            const obj2 = { a: 1, c: 'test' };
            expect(ObjectHelper.objectEquals(obj1, obj2)).toBe(false);
        });

        it('should return false for objects with different values', () => {
            const obj1 = { a: 1, b: 'test' };
            const obj2 = { a: 2, b: 'test' };
            expect(ObjectHelper.objectEquals(obj1, obj2)).toBe(false);
        });
    });

    describe('arrayOfObjectsEquals', () => {
        it('should return true for two identical arrays of objects', () => {
            const arr1 = [{ a: 1 }, { b: 2 }];
            const arr2 = [{ a: 1 }, { b: 2 }];
            expect(ObjectHelper.arrayOfObjectsEquals(arr1, arr2)).toBe(true);
        });

        it('should return false for arrays with different objects', () => {
            const arr1 = [{ a: 1 }, { b: 2 }];
            const arr2 = [{ a: 1 }, { b: 3 }];
            expect(ObjectHelper.arrayOfObjectsEquals(arr1, arr2)).toBe(false);
        });

        it('should return false for arrays with different lengths', () => {
            const arr1 = [{ a: 1 }, { b: 2 }];
            const arr2 = [{ a: 1 }];
            expect(ObjectHelper.arrayOfObjectsEquals(arr1, arr2)).toBe(false);
        });
    });

    describe('combineArrayMap', () => {
        it('should combine two maps and remove duplicates', () => {
            const map1 = new Map<string, number[]>([
                ['key1', [1, 2]],
                ['key2', [3]]
            ]);
            const map2 = new Map<string, number[]>([
                ['key1', [2, 3]],
                ['key3', [4]]
            ]);
            const result = ObjectHelper.combineArrayMap(map1, map2);

            expect(result.get('key1')).toEqual([1, 2, 3]);
            expect(result.get('key2')).toEqual([3]);
            expect(result.get('key3')).toEqual([4]);
        });

        it('should return a combined map with no overlapping keys', () => {
            const map1 = new Map<string, number[]>([['key1', [1, 2]]]);
            const map2 = new Map<string, number[]>([['key2', [3, 4]]]);
            const result = ObjectHelper.combineArrayMap(map1, map2);

            expect(result.get('key1')).toEqual([1, 2]);
            expect(result.get('key2')).toEqual([3, 4]);
        });

        it('should return the first map if the second map is empty', () => {
            const map1 = new Map<string, number[]>([['key1', [1, 2]]]);
            const map2 = new Map<string, number[]>([]);
            const result = ObjectHelper.combineArrayMap(map1, map2);

            expect(result).toEqual(map1);
        });
    });
});
