export default interface ResponseScreen {
    _id: string;
    description?: string;
    name: string;
    latestVersion: {
        snapshot: {
            url: string;
        };
    };
}
