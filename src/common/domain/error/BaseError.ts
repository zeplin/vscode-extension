import localization from "../../../localization";

export default class BaseError {
    public constructor(
        public message: string = localization.common.defaultError,
        public code?: number
    ) {
    }
}
