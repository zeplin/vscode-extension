import ResponseZeplinComponent from "./ResponseZeplinComponent";

export default interface ZeplinComponentSection {
    _id: string;
    name: string;
    description?: string;
    components: ResponseZeplinComponent[];
    componentSections: ZeplinComponentSection[];
}
