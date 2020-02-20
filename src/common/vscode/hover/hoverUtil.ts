const MARKDOWN_SPACE = "&nbsp;";
const MAX_IMAGE_HEIGHT = 480;
const MAX_IMAGE_WIDTH = 480;

function getMarkdownImage( // eslint-disable-line max-params
    url: string,
    width?: number,
    height?: number,
    maxWidth: number = MAX_IMAGE_WIDTH,
    maxHeight: number = MAX_IMAGE_HEIGHT
): string {
    // Normalizes height to compare with width
    if (width && (!height || width > height * maxWidth / maxHeight)) {
        return `![](${url}|width=${Math.min(width, maxWidth)})`;
    } else if (height) {
        return `![](${url}|height=${Math.min(height, maxHeight)})`;
    } else {
        return `![](${url})`;
    }
}

function getMarkdownLink(url: string, content: string, info: string = url): string {
    return `[${content}](${url} "${info}")`;
}

function getMarkdownCommand(command: string, content: string): string {
    return `[${content}](command:${command})`;
}

function boldenForMarkdown(text: string): string {
    return `**${text}**`;
}

function indentForMarkdown(text: string): string {
    return `    ${text}`;
}

function toBulletForMarkdown(text: string): string {
    return `  * ${text}`;
}

function toCodeForMarkdown(text: string): string {
    return `\`${text}\``;
}

function toItalicForMarkdown(text: string): string {
    return `*${text}*`;
}

export {
    MARKDOWN_SPACE,
    getMarkdownImage,
    getMarkdownLink,
    getMarkdownCommand,
    boldenForMarkdown,
    indentForMarkdown,
    toBulletForMarkdown,
    toCodeForMarkdown,
    toItalicForMarkdown
};
