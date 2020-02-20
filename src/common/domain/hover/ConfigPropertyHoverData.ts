import ConfigProperty from "./ConfigProperty";

export default interface ConfigPropertyHoverData extends ConfigProperty {
    command?: { name: string; text: string };
}
