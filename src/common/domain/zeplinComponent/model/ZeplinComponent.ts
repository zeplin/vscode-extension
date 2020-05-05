import ResponseZeplinComponent from "./ResponseZeplinComponent";

export default interface ZeplinComponent extends ResponseZeplinComponent {
    barrelId: string;
    barrelName: string;
    sectionIds: string[];
    sectionNames: string[];
}
