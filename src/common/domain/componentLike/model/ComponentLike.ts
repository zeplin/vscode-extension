import Version from "./Version";

export default interface ComponentLike {
    _id: string;
    name: string;
    description?: string;
    latestVersion: Version;
}
