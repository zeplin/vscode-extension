import BaseError from "../../error/BaseError";
import BarrelType from "../../barrel/BarrelType";

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
