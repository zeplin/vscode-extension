import PinData from "./PinData";
import Barrel from "../../../common/domain/barrel/Barrel";
import ResponseZeplinComponent from "../../../common/domain/zeplinComponent/model/ResponseZeplinComponent";

export default interface ComponentPinData extends PinData {
    component: ResponseZeplinComponent;
    barrel: Barrel;
}
