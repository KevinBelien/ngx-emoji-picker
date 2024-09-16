export class ObjectHelper {
    public static objectEquals = (obj1: Record<string, any>, obj2: Record<string, any>) => Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every((key) => obj1[key] === obj2[key]);

    public static arrayOfObjectsEquals = (arr1: Array<Record<string, any>>, arr2: Array<Record<string, any>>) => arr1.length === arr2.length && arr1.every((item, idx) => ObjectHelper.objectEquals(item, arr2[idx]));

    public static combineArrayMap = <T>(map1: Map<string, T[]>, map2: Map<string, T[]>): Map<string, T[]> => {
        const combinedMap = new Map<string, T[]>(map1); // Start with map1 as the base

        for (const [key, value] of map2) {
            if (combinedMap.has(key)) {
                // If the key exists in map1, merge the arrays and remove duplicates using Set
                combinedMap.set(key, Array.from(new Set([...combinedMap.get(key)!, ...value])));
            } else {
                // Otherwise, simply add the new key-value pair
                combinedMap.set(key, value);
            }
        }

        return combinedMap;
    };
}
