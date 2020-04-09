import Barrel from "../../../common/domain/barrel/Barrel";
import ZeplinComponent from "./ZeplinComponent";

export default interface BarrelDetails extends Barrel {
    parentId?: string;
    description?: string;
    components: ZeplinComponent[];
}
