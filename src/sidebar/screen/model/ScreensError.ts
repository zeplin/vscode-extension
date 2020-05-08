import BaseError from "../../../common/domain/error/BaseError";

export default class ScreensError extends BaseError {
    public constructor(public barrelId: string, message?: string, code?: number) {
        super(message, code);
    }
}
