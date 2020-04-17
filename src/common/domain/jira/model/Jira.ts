import JiraType from "./JiraType";

export default interface Jira {
    _id: string;
    issueKey: string;
    issueUrl: string;
    itemId: string;
    type: JiraType;
}
