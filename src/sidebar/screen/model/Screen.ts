import JiraAttachable from "../../../common/domain/jira/model/JiraAttachable";
import ResponseScreen from "./ResponseScreen";

export default interface Screen extends ResponseScreen, JiraAttachable {
    barrelId: string;
    barrelName: string;
    sectionId?: string;
    sectionName?: string;
}
