import PinData from "./PinData";
import Screen from "../../screen/model/Screen";

export default interface ScreenPinData extends PinData {
    screen: Screen;
}
