import ZeplinComponentSection from "../../zeplinComponent/model/ZeplinComponentSection";
import ResponseBarrel from "./ResponseBarrel";
import ResponseScreenSection from "../../screen/model/ResponseScreenSection";

export default interface BarrelDetailsResponse extends ResponseBarrel {
    description?: string;
    componentSections: ZeplinComponentSection[];
    sections?: ResponseScreenSection[];
}
