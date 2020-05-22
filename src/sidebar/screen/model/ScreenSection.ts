import Screen from "./Screen";
import JiraAttachable from "../../../common/domain/jira/model/JiraAttachable";

export default interface ScreenSection extends JiraAttachable {
    id: string;
    name: string;
    description?: string;
    screens: Screen[];
}
