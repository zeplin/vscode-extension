export default interface Screen {
    _id: string;
    description?: string;
    name: string;
    latestVersion: {
        snapshot: {
            url: string;
        };
    };
}
