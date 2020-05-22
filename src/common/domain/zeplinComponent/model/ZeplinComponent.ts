import ResponseZeplinComponent from "./ResponseZeplinComponent";
import BarrelType from "../../barrel/BarrelType";

export default interface ZeplinComponent extends ResponseZeplinComponent {
    barrelId: string;
    barrelType: BarrelType;
    barrelName: string;
    sectionIds: string[];
    sectionNames: string[];
}
