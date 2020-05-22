import BarrelType from "../BarrelType";
import BarrelError from "../../zeplinComponent/model/BarrelError";
import Result from "../../store/Result";
import BarrelDetails from "../../zeplinComponent/model/BarrelDetails";

const BARREL_ID_VALIDATION_REGEX = /^[0-9A-Fa-f]{24}$/;

function isBarrelIdFormatValid(barrelId: string): boolean {
    return BARREL_ID_VALIDATION_REGEX.test(barrelId);
}

function convertBarrelResult(
    result: Result<BarrelDetails>, type: BarrelType, id: string
): Result<BarrelDetails, BarrelError> {
    return {
        data: result.data,
        errors: result.errors?.map(error => new BarrelError(type, id, error.message, error.code))
    };
}

export {
    isBarrelIdFormatValid,
    convertBarrelResult
};
