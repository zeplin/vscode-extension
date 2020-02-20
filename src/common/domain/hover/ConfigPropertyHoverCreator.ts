import * as vscode from "vscode";
import ConfigHoverCreator from "../../../coco/config/hover/ConfigHoverCreator";
import HoverBuilder from "../../vscode/hover/HoverBuilder";
import {
    boldenForMarkdown, toCodeForMarkdown, toBulletForMarkdown, indentForMarkdown, toItalicForMarkdown
} from "../../vscode/hover/hoverUtil";
import ConfigPropertyHoverData from "./ConfigPropertyHoverData";
import ConfigProperty from "./ConfigProperty";
import localization from "../../../localization";

export default class ConfigPropertyHoverCreator implements ConfigHoverCreator {
    public constructor(private data: ConfigPropertyHoverData) { }

    public isApplicable(configPath: string, word: string): boolean {
        return !!this.data.key && this.data.key === word;
    }

    public create(): Promise<vscode.Hover> {
        const builder = new HoverBuilder();
        this.appendData(builder, this.data);

        if (this.data.command) {
            builder.appendCommand(this.data.command.name, this.data.command.text);
        }

        return Promise.resolve(builder.build());
    }

    private appendData(builder: HoverBuilder, property: ConfigProperty, level = 0) {
        const { info, extraInfo, properties } = property;

        if (level !== 0) {
            let title = property.key ? toCodeForMarkdown(property.key) : property.title;
            if (title) {
                if (property.optional) {
                    title += ` ${boldenForMarkdown(`(${localization.common.optional})`)}`;
                }
                builder.append(this.indent(toBulletForMarkdown(title), level - 1)).appendLine(true);
            }
        }

        if (info) {
            builder.append(this.indent(info, level)).appendLine().appendLine();
        }

        if (extraInfo) {
            builder.append(this.indent(`☝️ ${toItalicForMarkdown(extraInfo)}`, level)).appendLine().appendLine(true);
        }

        if (properties) {
            builder
                .append(this.indent(boldenForMarkdown(localization.common.childProperties), level - 1))
                .appendLine(true);
            for (const childProperty of properties) {
                this.appendData(builder, childProperty, level + 1);
            }
        }
    }

    private indent(text: string, level: number): string {
        let indentedText = text;
        for (let currentLevel = 0; currentLevel < level; currentLevel++) {
            indentedText = indentForMarkdown(indentedText);
        }
        return indentedText;
    }
}
