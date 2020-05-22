import PinData from "./PinData";
import ResponseZeplinComponent from "../../../common/domain/zeplinComponent/model/ResponseZeplinComponent";

export default interface ComponentPinData extends PinData {
    component: ResponseZeplinComponent;
}
