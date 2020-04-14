import Barrel from "../../barrel/Barrel";
import ZeplinComponent from "./ZeplinComponent";
import ZeplinComponentSection from "./ZeplinComponentSection";

export default interface BarrelDetails extends Barrel {
    parentId?: string;
    description?: string;
    components: ZeplinComponent[];
    componentSections: ZeplinComponentSection[];
}
