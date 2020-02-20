export default interface Plugin {
    name: string;
    config?: {
        [key: string]: unknown;
    };
}
