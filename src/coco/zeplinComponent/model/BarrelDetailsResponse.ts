import ZeplinComponentSection from "./ZeplinComponentSection";
import ResponseBarrel from "../../barrel/model/ResponseBarrel";

export default interface BarrelDetailsResponse extends ResponseBarrel {
    description?: string;
    componentSections: ZeplinComponentSection[];
}
