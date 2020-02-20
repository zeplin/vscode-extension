/**
 * Creates a Promise that is
 * - resolved when original promise is rejected,
 * - rejected when original promise is resolved,
 * @param {Promise<T>} promise Promise to be reversed
 * @returns {Promise<T>} A new Promise.
 */
async function reverse<T>(promise: Promise<T>): Promise<unknown> {
    let result;
    try {
        result = await promise;
    } catch (error) {
        return error;
    }
    throw result;
}

/**
 * Creates a Promise that is
 * - resolved when any of the provided Promises are resolved,
 * - rejects when all of the provided Promises are rejected
 * @param {Promise<T>} promises Promise An array of Promises.
 * @returns {Promise<T>} A new Promise.
 */
function promiseAny<T>(promises: Promise<T>[]): Promise<T> {
    /*
    All promises are reversed before being supplied to Promise.all method. Thus, Promise.all will be:
    - resolved when all promises are rejected,
    - rejected when one of promises is resolved. (Will not wait all promises to settle because a rejection make
    Promise.all to reject)

    Then, the result is reversed again and resulting promise will be:
    - rejected when all promises are rejected
    - resolved when one of promises is resolved.
    */
    return reverse(Promise.all(promises.map(reverse))) as Promise<T>;
}

export {
    promiseAny
};
