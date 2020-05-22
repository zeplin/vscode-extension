import BarrelType from "./BarrelType";
import Jira from "../jira/model/Jira";
import JiraAttachable from "../jira/model/JiraAttachable";

export default interface Barrel extends JiraAttachable {
    id: string;
    name: string;
    type: BarrelType;
    platform: string;
    densityScale?: number;
    thumbnail?: string;
    itemJiras: {
        ofScreens: Jira[];
        ofScreenSections: Jira[];
    };
}
