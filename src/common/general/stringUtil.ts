/**
 * Replaces all occurences of a value in a string with another value.
 * @param originalString A string which search value is searched on.
 * @param searchValue A value to search in the original string.
 * @param replaceValue A value to replace the search value with.
 */
function replaceAll(originalString: string, searchValue: string, replaceValue: string): string {
    return originalString.split(searchValue).join(replaceValue);
}

/**
 * Return indices of all occurences of a value in a string.
 * @param originalString A string which search string is searched on.
 * @param searchValue A value to search in original string.
 */
function allIndicesOf(originalString: string, searchValue: string): number[] {
    const searchLength = searchValue.length;
    if (searchLength === 0) {
        return [];
    }

    const foundIndices: number[] = [];
    let foundIndex;
    let searchIndex = 0;
    while ((foundIndex = originalString.indexOf(searchValue, searchIndex)) >= 0) {
        foundIndices.push(foundIndex);
        searchIndex = foundIndex + searchLength;
    }

    return foundIndices;
}

/**
 * Converts given snake_case string to PascalCase
 * @param str A string to be converted
 */
function snakeCaseToPascalCase(str: string): string {
    return uppercaseFirst(str.replace(/_\w/g, word => word.charAt(1).toUpperCase()));
}

/**
 * Returns given string as its first character uppercased
 * @param str A string to be converted
 */
function uppercaseFirst(str: string) {
    return !str.length ? str : str.charAt(0).toUpperCase() + str.substring(1);
}

export {
    replaceAll,
    allIndicesOf,
    snakeCaseToPascalCase
};
