import ZeplinComponentSection from "../../../common/domain/zeplinComponent/model/ZeplinComponentSection";
import ResponseBarrel from "../../barrel/model/ResponseBarrel";
import ResponseScreenSection from "../../../sidebar/screen/model/ResponseScreenSection";

export default interface BarrelDetailsResponse extends ResponseBarrel {
    description?: string;
    componentSections: ZeplinComponentSection[];
    sections?: ResponseScreenSection[];
}
