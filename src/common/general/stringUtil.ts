function replaceAll(originalString: string, searchValue: string, replaceValue: string): string {
    return originalString.split(searchValue).join(replaceValue);
}

function allIndicesOf(originalString: string, searchString: string): number[] {
    const searchLength = searchString.length;
    if (searchLength === 0) {
        return [];
    }

    const foundIndices: number[] = [];
    let foundIndex;
    let searchIndex = 0;
    while ((foundIndex = originalString.indexOf(searchString, searchIndex)) >= 0) {
        foundIndices.push(foundIndex);
        searchIndex = foundIndex + searchLength;
    }

    return foundIndices;
}

export {
    replaceAll,
    allIndicesOf
};
