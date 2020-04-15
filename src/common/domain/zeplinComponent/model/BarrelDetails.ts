import Barrel from "../../barrel/Barrel";
import ZeplinComponent from "./ZeplinComponent";
import ZeplinComponentSection from "./ZeplinComponentSection";
import ResponseScreenSection from "../../../../sidebar/screen/model/ResponseScreenSection";

export default interface BarrelDetails extends Barrel {
    parentId?: string;
    description?: string;
    components: ZeplinComponent[];
    componentSections: ZeplinComponentSection[];
    screenSections?: ResponseScreenSection[];
}
