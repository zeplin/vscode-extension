import * as vscode from "vscode";
import { MARKDOWN_SPACE, getMarkdownImage, getMarkdownLink, getMarkdownCommand } from "./hoverUtil";

const LINE_DECEPTOR = MARKDOWN_SPACE;
const LINE_BREAK = `${MARKDOWN_SPACE}  \r\n`;
const LINE_BREAK_WITH_MARGIN = "\n\n";
const HORIZONTAL_LINE = "  \n___\n";

/**
 * Builder for VS Code Hover Markdown.
 */
export default class HoverBuilder {
    private content = "";

    /**
     * Appends a text to current markdown.
     * @param text A text to append.
     */
    public append(text: string): HoverBuilder {
        this.content += text;
        return this;
    }

    /**
     * Appends a line break to current markdown.
     * @param extraMargin Whether the appended line break should have vertical margin.
     */
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

    /**
     * Appends a horizontal line to current markdown.
     */
    public appendHorizontalLine(): HoverBuilder {
        return this.append(HORIZONTAL_LINE);
    }

    /**
     * Appends a link to current markdown.
     * @param url Url of a link.
     * @param text Text of a link.
     */
    public appendLink(url: string, text: string): HoverBuilder {
        return this.append(getMarkdownLink(url, text));
    }

    /**
     * Appends an image to current markdown. Restricts width and height wrt. maxWidth and maxHeight if provided.
     * @param url Url of an image.
     * @param width Width of an image.
     * @param height Height of an image.
     * @param maxWidth Max width of an image.
     * @param maxHeigth Max height of an image.
     */
    public appendImage( // eslint-disable-line max-params
        url: string, width?: number, height?: number, maxWidth?: number, maxHeigth?: number
    ): HoverBuilder {
        return this.append(getMarkdownImage(url, width, height, maxWidth, maxHeigth));
    }

    /**
     * Appends a command to current markdown.
     * @param command Name of a command.
     * @param text A text to be shown on the link of a command.
     */
    public appendCommand(command: string, text: string): HoverBuilder {
        return this.append(getMarkdownCommand(command, text));
    }

    /**
     * Return built markdown.
     */
    public build() {
        const markdown = new vscode.MarkdownString(this.content);
        markdown.isTrusted = true;
        return new vscode.Hover(markdown);
    }
}
