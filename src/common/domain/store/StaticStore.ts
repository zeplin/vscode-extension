import Store from "./Store";
import Result from "./Result";
import BaseError from "../error/BaseError";

export default class StaticStore<T> implements Store<T> {
    public constructor(private data: T) { }

    public get = (): Promise<Result<T, BaseError>> => Promise.resolve({
        data: this.data
    });

    public refresh = this.get;
}
