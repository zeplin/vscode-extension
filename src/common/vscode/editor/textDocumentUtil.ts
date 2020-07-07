import * as vscode from "vscode";
import { allIndicesOf } from "../../general/stringUtil";

/**
 * Converts a text to JSON property. i.e wraps the text with quotes.
 * @param text A text to be converted.
 */
function toProperty(text: string): string {
    return `"${text}"`;
}

/**
 * Returns positions of a text on a text document.
 * @param text A text to get positions of.
 * @param document A text document to search on.
 */
function getPositionsOf(text: string, document: vscode.TextDocument): vscode.Position[] {
    return allIndicesOf(document.getText(), text).map(document.positionAt);
}

/**
 * Returns positions of a property on a text document.
 * @param propertyName Name of a property to get positions of.
 * @param document A text document to search on.
 */
function getPositionsOfProperty(propertyName: string, document: vscode.TextDocument): vscode.Position[] {
    return getPositionsOf(toProperty(propertyName), document);
}

/**
 * Returns range of a text on a text document. If changes are provided, the text is searched in given changes only.
 * @param text A text to get range of.
 * @param document A text document to search on.
 * @param changes Text document changes to search on.
 */
function getRangeOf(
    text: string,
    document: vscode.TextDocument,
    changes?: readonly vscode.TextDocumentContentChangeEvent[]):
    vscode.Range | undefined {
    const searchAreas = changes ?? [{ rangeOffset: 0, text: document.getText() }];
    for (const { rangeOffset, text: areaText } of searchAreas) {
        const relativeTextStartIndex = areaText.indexOf(text);
        if (relativeTextStartIndex > 0) {
            return new vscode.Range(
                document.positionAt(relativeTextStartIndex + rangeOffset),
                document.positionAt(relativeTextStartIndex + rangeOffset + text.length)
            );
        }
    }

    return undefined;
}

/**
 * Returns range of a property on a text document. If changes are provided, the property is searched in given changes
 * only.
 * @param propertyName Name of a property to get range of.
 * @param document A text document to search on.
 * @param changes Text document changes to search on.
 */
function getRangeOfProperty(
    propertyName: string,
    document: vscode.TextDocument,
    changes?: readonly vscode.TextDocumentContentChangeEvent[]
): vscode.Range | undefined {
    return getRangeOf(toProperty(propertyName), document, changes);
}

/**
 * Returns ranges of a text on a text document.
 * @param text A text to get ranges of.
 * @param document A text document to search on.
 */
function getRangesOf(text: string, document: vscode.TextDocument): vscode.Range[] {
    return getPositionsOf(text, document).map(
        startPosition => new vscode.Range(
            startPosition,
            document.positionAt(document.offsetAt(startPosition) + text.length)
        )
    );
}

/**
 * Returns ranges of a property on a text document.
 * @param propertyName Name of a property to get ranges of.
 * @param document A text document to search on.
 */
function getRangesOfProperty(propertyName: string, document: vscode.TextDocument): vscode.Range[] {
    return getRangesOf(toProperty(propertyName), document);
}

/**
 * Narrows a range by one char from both start and end. This works as removing quotes around a JSON property.
 * @param range A range to narrow.
 */
function narrowRangeForProperty(range: vscode.Range | undefined): vscode.Range | undefined {
    return !range ? undefined : new vscode.Range(
        range.start.translate({ characterDelta: 1 }),
        range.end.translate({ characterDelta: -1 })
    );
}

function isFileDirty(filePath: string): boolean {
    return vscode.workspace.textDocuments.some(document => document.uri.fsPath === filePath && document.isDirty);
}

export {
    toProperty,
    getRangeOf,
    getRangeOfProperty,
    getRangesOf,
    getRangesOfProperty,
    getPositionsOf,
    getPositionsOfProperty,
    narrowRangeForProperty,
    isFileDirty
};
