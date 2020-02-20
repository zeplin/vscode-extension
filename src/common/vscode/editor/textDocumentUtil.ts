import * as vscode from "vscode";
import { allIndicesOf } from "../../general/stringUtil";

function toProperty(name: string): string {
    return `"${name}"`;
}

function getPositionsOf(name: string, document: vscode.TextDocument): vscode.Position[] {
    return allIndicesOf(document.getText(), name).map(document.positionAt);
}

function getPositionsOfProperty(propertyName: string, document: vscode.TextDocument): vscode.Position[] {
    return getPositionsOf(toProperty(propertyName), document);
}

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

function getRangeOfProperty(
    propertyName: string,
    document: vscode.TextDocument,
    changes?: readonly vscode.TextDocumentContentChangeEvent[]
): vscode.Range | undefined {
    return getRangeOf(toProperty(propertyName), document, changes);
}

function getRangesOf(name: string, document: vscode.TextDocument): vscode.Range[] {
    return getPositionsOf(name, document).map(
        startPosition => new vscode.Range(
            startPosition,
            document.positionAt(document.offsetAt(startPosition) + name.length)
        )
    );
}

function getRangesOfProperty(propertyName: string, document: vscode.TextDocument): vscode.Range[] {
    return getRangesOf(toProperty(propertyName), document);
}

function narrowRangeForProperty(range: vscode.Range | undefined): vscode.Range | undefined {
    return !range ? undefined : new vscode.Range(
        range.start.translate({ characterDelta: 1 }),
        range.end.translate({ characterDelta: -1 })
    );
}

export {
    toProperty,
    getRangeOf,
    getRangeOfProperty,
    getRangesOf,
    getRangesOfProperty,
    getPositionsOf,
    getPositionsOfProperty,
    narrowRangeForProperty
};
