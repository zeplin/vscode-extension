export default interface ConfigProperty {
    key?: string;
    title?: string;
    info?: string;
    extraInfo?: string;
    optional: boolean;
    properties?: ConfigProperty[];
}
