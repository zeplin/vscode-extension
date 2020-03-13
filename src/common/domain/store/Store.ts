import Result from "./Result";
import BaseError from "../error/BaseError";

/**
 * Store for getting and refreshing data from any source.
 */
export default interface Store<T, E extends BaseError = BaseError> {
    get: () => Promise<Result<T, E>>;
    refresh: () => Promise<Result<T, E>>;
}
