import localization from "../../../localization";

/**
 * Error data for api and store usage.
 */
export default class BaseError {
    public constructor(
        public message: string = localization.common.defaultError,
        public code?: number
    ) {
    }
}
