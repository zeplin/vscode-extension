type empty = undefined | null;

function isFirstOccurence<T>(value: T, index: number, array: T[]) {
    return array.indexOf(value) === index;
}

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

function isNonEmpty<T>(object: T | empty): object is T {
    return object !== undefined && object !== null;
}

function sum(array: number[]) {
    return array.reduce((accumulator, current) => accumulator + current, 0);
}

function unknownToLowercaseStringArray(value: unknown): string[] {
    if (value instanceof Array) {
        return value.filter(item => typeof item === "string").map((item: string) => item.toLowerCase());
    } else if (typeof value === "string") {
        return [value];
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
