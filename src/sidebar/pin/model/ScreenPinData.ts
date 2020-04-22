import PinData from "./PinData";
import Screen from "../../screen/model/Screen";
import Barrel from "../../../common/domain/barrel/Barrel";

export default interface ScreenPinData extends PinData {
    screen: Screen;
    project: Barrel;
}
