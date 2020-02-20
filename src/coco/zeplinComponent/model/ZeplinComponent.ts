import ResponseZeplinComponent from "./ResponseZeplinComponent";

export default interface ZeplinComponent extends ResponseZeplinComponent {
    barrelName: string;
    sectionNames: string[];
}
