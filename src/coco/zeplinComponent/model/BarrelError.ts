import BaseError from "../../../common/domain/error/BaseError";
import BarrelType from "../../barrel/model/BarrelType";

export default class BarrelError extends BaseError {
    public constructor(
        public type: BarrelType,
        public id: string,
        message?: string,
        code?: number
    ) {
        super(message, code);
    }
}
