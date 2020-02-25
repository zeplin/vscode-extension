const MARKDOWN_SPACE = "&nbsp;";
const MAX_IMAGE_HEIGHT = 480;
const MAX_IMAGE_WIDTH = 480;

/**
 * Returns markdown for an image url. Restricts width and height wrt maxWidth and maxHeight if provided.
 * @param url Url of an image.
 * @param width Width of an image.
 * @param height Height of an image.
 * @param maxWidth Max width of an image.
 * @param maxHeigth Max height of an image.
 */
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

/**
 * Returns a markdown link.
 * @param url Url of a link.
 * @param text Text of a link.
 * @param info Information to be shown when hovered on a link.
 */
function getMarkdownLink(url: string, text: string, info: string = url): string {
    return `[${text}](${url} "${info}")`;
}

/**
 * Returns a markdown command.
 * @param command Name of command.
 * @param text A text to be shown on the link of the command.
 */
function getMarkdownCommand(command: string, text: string): string {
    return `[${text}](command:${command})`;
}

/**
 * Returns a boldened markdown text.
 * @param text A text to be boldened.
 */
function boldenForMarkdown(text: string): string {
    return `**${text}**`;
}

/**
 * Returns an indented markdown text.
 * @param text A text to be indented.
 */
function indentForMarkdown(text: string): string {
    return `    ${text}`;
}

/**
 * Returns a text as a markdown bullet. Used for list items.
 * @param text A text to be used with bullet.
 */
function toBulletForMarkdown(text: string): string {
    return `  * ${text}`;
}

/**
 * Returns a text as a markdown code.
 * @param text A text to be used as code.
 */
function toCodeForMarkdown(text: string): string {
    return `\`${text}\``;
}

/**
 * Return an italicized markdown text.
 * @param text A text to be italicized.
 */
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
