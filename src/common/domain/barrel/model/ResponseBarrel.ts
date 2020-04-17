import Jira from "../../jira/model/Jira";

export default interface ResponseBarrel {
    _id: string;
    name: string;
    type: string;
    densityScale?: number;
    thumbnail?: string;
    integration?: {
        jira?: {
            attachments?: Jira[];
        };
    };
}
