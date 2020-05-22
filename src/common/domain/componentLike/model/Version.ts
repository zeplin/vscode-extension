import User from "./User";

export default interface Version {
    created: string;
    creator?: User;
    snapshot: {
        url: string;
    };
}
