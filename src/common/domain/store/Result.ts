import BaseError from "../error/BaseError";

/**
 * Result data for api and store usage.
 */
export default interface Result<T, E extends BaseError = BaseError> {
    data?: T;
    errors?: E[];
}
