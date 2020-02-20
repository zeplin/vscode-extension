import BaseError from "../error/BaseError";

export default interface Result<T, E extends BaseError = BaseError> {
    data?: T;
    errors?: E[];
}
