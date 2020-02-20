export default interface ResponseZeplinComponent {
    _id: string;
    name: string;
    description?: string;
    latestVersion: {
        snapshot: {
            url: string;
        };
    };
}
