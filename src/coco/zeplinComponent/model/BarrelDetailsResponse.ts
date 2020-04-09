import ZeplinComponentSection from "../../../common/domain/zeplinComponent/model/ZeplinComponentSection";
import ResponseBarrel from "../../barrel/model/ResponseBarrel";

export default interface BarrelDetailsResponse extends ResponseBarrel {
    description?: string;
    componentSections: ZeplinComponentSection[];
}
