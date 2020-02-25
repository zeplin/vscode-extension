type empty = undefined | null;

/**
 * Determines whether a value and an index mark the first occurence in an array.
 * @param value A value to check index of.
 * @param index An index of value.
 * @param array An array to search in.
 */
function isFirstOccurence<T>(value: T, index: number, array: T[]): boolean {
    return array.indexOf(value) === index;
}

/**
 * Creates a new array with concatenating all sub-array elements.
 * @param arrayOfArrays An array which contains arrays of items.
 */
function flatten<T>(arrayOfArrays: ((T | empty)[] | empty)[]): T[] {
    return arrayOfArrays.reduce(
        (accumulator: T[], array) => {
            const nonEmptyItems = array?.filter(isNonEmpty) ?? [];
            accumulator.push(...nonEmptyItems);
            return accumulator;
        },
        []
    );
}

/**
 * Determines whether an object is not undefined or null.
 * @param object An object to check emptyness of.
 */
function isNonEmpty<T>(object: T | empty): object is T {
    return object !== undefined && object !== null;
}

/**
 * Returns sum of all elements in an array.
 * @param array An array of numbers.
 */
function sum(array: number[]) {
    return array.reduce((accumulator, current) => accumulator + current, 0);
}

/**
 * Returns a lowercase string array depending on an object. Strings are selected in the following way:
 * 1. If the object is an array, only string elements of the objects are selected.
 * 2. Else If the object is a string, the object is selected.
 * 3. Otherwise, none.
 * @param object An object to convert to lowercase string array.
 */
function unknownToLowercaseStringArray(object: unknown): string[] {
    if (object instanceof Array) {
        return object.filter(item => typeof item === "string").map((item: string) => item.toLowerCase());
    } else if (typeof object === "string") {
        return [object];
    } else {
        return [];
    }
}

export {
    isFirstOccurence,
    flatten,
    sum,
    unknownToLowercaseStringArray
};
