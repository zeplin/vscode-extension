import Store from "./Store";
import BaseError from "../error/BaseError";
import Result from "./Result";
import Logger from "../../../log/Logger";
import CacheHolder from "./CacheHolder";

/**
 * Helper base for getting, refreshing data from a source and extracting useful data from it.
 */
export default abstract class BasicStore<TResponse, TData, TError extends BaseError = BaseError>
implements Store<TData, TError>, CacheHolder {
    private cache?: Result<TData, TError>;
    private fetchPromise?: Promise<TResponse | BaseError>;

    public get = async (): Promise<Result<TData, TError>> => {
        if (this.fetchPromise) {
            Logger.log(`Already Loading Data from ${this.constructor.name}`);
            return this.getResultFromFetchPromise();
        } else if (this.cache?.data) {
            Logger.log(`Loaded from cache of ${this.constructor.name}`);
            return this.cache;
        } else {
            this.fetchPromise = this.fetchData();
            this.cache = await this.getResultFromFetchPromise();
            this.fetchPromise = undefined;
            return this.cache;
        }
    };

    private async getResultFromFetchPromise(): Promise<Result<TData, TError>> {
        const result = await this.fetchPromise!;
        if (result instanceof BaseError) {
            return {
                errors: [result as TError]
            };
        } else {
            return {
                data: this.extractData(result)
            };
        }
    }

    public refresh = (): Promise<Result<TData, TError>> => {
        Logger.log(`Refreshing ${this.constructor.name}`);
        this.clearCache();
        return this.get();
    };

    public clearCache() {
        this.cache = undefined;
    }

    protected abstract fetchData(): Promise<TResponse | BaseError>;

    protected abstract extractData(response: TResponse): TData;
}
