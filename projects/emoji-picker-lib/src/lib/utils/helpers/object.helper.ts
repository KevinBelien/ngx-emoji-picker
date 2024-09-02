import { ArrayMap } from '../models';

export class ObjectHelper {
	public static objectEquals = (
		obj1: Record<string, any>,
		obj2: Record<string, any>
	) => {
		return (
			Object.keys(obj1).length === Object.keys(obj2).length &&
			Object.keys(obj1).every((key) => obj1[key] === obj2[key])
		);
	};

	public static arrayOfObjectsEquals = (
		arr1: Array<Record<string, any>>,
		arr2: Array<Record<string, any>>
	) => {
		return (
			arr1.length === arr2.length &&
			arr1.every((item, idx) =>
				ObjectHelper.objectEquals(item, arr2[idx])
			)
		);
	};

	public static omit = <T, K extends keyof T>(
		obj: T,
		keyToRemove: K
	): Omit<T, K> => {
		const { [keyToRemove]: _, ...rest } = obj;
		return rest;
	};

	public static combineArrayMap = <T>(
		obj1: ArrayMap<T>,
		obj2: ArrayMap<T>
	): ArrayMap<T> => {
		const combinedObj: ArrayMap<T> = { ...obj1 };

		for (const key in obj2) {
			if (combinedObj[key]) {
				combinedObj[key] = Array.from(
					new Set([...combinedObj[key], ...obj2[key]])
				);
			} else {
				combinedObj[key] = obj2[key];
			}
		}

		return combinedObj;
	};
}
