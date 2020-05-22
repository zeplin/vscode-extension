import PinType from "./PinType";
import Barrel from "../../../common/domain/barrel/Barrel";

export default interface PinData {
    type: PinType;
    barrel: Barrel;
}
