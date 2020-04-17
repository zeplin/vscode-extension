import JiraAttachable from "../../../common/domain/jira/model/JiraAttachable";

export default interface Screen extends JiraAttachable {
    _id: string;
    description?: string;
    name: string;
    thumbnail: string;
}
