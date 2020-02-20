import * as vscode from "vscode";
import { MARKDOWN_SPACE, getMarkdownImage, getMarkdownLink, getMarkdownCommand } from "./hoverUtil";

const LINE_DECEPTOR = MARKDOWN_SPACE;
const LINE_BREAK = `${MARKDOWN_SPACE}  \r\n`;
const LINE_BREAK_WITH_MARGIN = "\n\n";
const HORIZONTAL_LINE = "  \n___\n";

export default class HoverBuilder {
    private content = "";

    public append(text: string): HoverBuilder {
        this.content += text;
        return this;
    }

    public appendLine(extraMargin = false): HoverBuilder {
        if (!this.content.length || this.content.endsWith(LINE_BREAK) ||
            this.content.endsWith(LINE_BREAK_WITH_MARGIN) || this.content.endsWith(HORIZONTAL_LINE)) {
            return this.append(LINE_DECEPTOR + LINE_BREAK);
        } else if (extraMargin) {
            return this.append(LINE_BREAK_WITH_MARGIN);
        } else {
            return this.append(LINE_BREAK);
        }
    }

    public appendHorizontalLine(): HoverBuilder {
        return this.append(HORIZONTAL_LINE);
    }

    public appendLink(url: string, text: string): HoverBuilder {
        return this.append(getMarkdownLink(url, text));
    }

    // eslint-disable-next-line max-params
    public appendImage(url: string, width?: number, height?: number, maxWidth?: number, maxHeigth?: number):
        HoverBuilder {
        return this.append(getMarkdownImage(url, width, height, maxWidth, maxHeigth));
    }

    public appendCommand(command: string, text: string): HoverBuilder {
        return this.append(getMarkdownCommand(command, text));
    }

    public build() {
        const markdown = new vscode.MarkdownString(this.content);
        markdown.isTrusted = true;
        return new vscode.Hover(markdown);
    }
}
