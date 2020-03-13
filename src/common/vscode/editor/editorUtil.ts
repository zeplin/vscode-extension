import * as vscode from "vscode";
import { getRangeOfProperty, narrowRangeForProperty } from "./textDocumentUtil";

const TEXT_WATCHER_TIMEOUT = 2000; // 2 seconds.

/**
 * Shows a file on text editor, and highlights text if provided.
 * @param path A file path to be shown on text editor.
 * @param highlightOptions Options of text to be highlighted and whether highlight should occur after document change.
 */
async function showInEditor(path: string, highlightOptions?: { text: string; onAdd?: boolean }) {
    const document = await vscode.workspace.openTextDocument(path);
    if (!document) {
        return;
    }

    const editor = await vscode.window.showTextDocument(document);

    if (!highlightOptions) {
        return;
    }

    if (highlightOptions.onAdd) {
        highlightTextOnAdd(editor, document, highlightOptions.text);
    } else {
        highlightText(editor, document, highlightOptions.text);
    }
}

/**
 * Returns active text document's file path if that file is on disk or undefined. Active text document is determined in
 * the following way:
 * 1. If there is an active text editor with an open document, that document.
 * 2. Else if there is only one visible text editor and it has an open document, that document.
 * 3. Otherwise, none.
 */
function getActiveFilePath(): string | undefined {
    const activeTextEditor = vscode.window.activeTextEditor;
    let activeDocument = activeTextEditor?.document;

    if (!activeDocument) {
        const visibleTextEditors = vscode.window.visibleTextEditors;
        if (visibleTextEditors.length === 1) {
            activeDocument = visibleTextEditors[0].document;
        }
    }

    return activeDocument && !activeDocument.isUntitled ? activeDocument.uri.fsPath : undefined;
}

/**
 * Highlights a text on a text document. If changes are provided, text is searched in those changes only.
 * @param editor A text editor which text document is open.
 * @param document A text document to highlight text on.
 * @param text A text to highlight.
 * @param changes Document changes to highlight text on.
 */
function highlightText(
    editor: vscode.TextEditor,
    document: vscode.TextDocument,
    text: string,
    changes?: readonly vscode.TextDocumentContentChangeEvent[]
) {
    // Searches range of property, returns range without quotes. This is used instead of direct getRangeOf method
    // To cover empty "text"s
    const textRange = narrowRangeForProperty(getRangeOfProperty(text, document, changes));
    if (textRange) {
        editor.revealRange(textRange);
        editor.selection = new vscode.Selection(textRange.start, textRange.end);
        return true;
    } else {
        return false;
    }
}

/**
 * Highlights a text on a text document. Waits for a change on the document and highlights text on that change.
 * Not: Highlights text once. Disposes the watcher after highlight occurs or after a timeout.
 * @param editor A text editor which text document is open.
 * @param document A text document to highlight text on.
 * @param text A text to highlight.
 */
function highlightTextOnAdd(editor: vscode.TextEditor, document: vscode.TextDocument, text: string) {
    const textChangeWatcher = vscode.workspace.onDidChangeTextDocument(
        ({ document: changedDocument, contentChanges: changes }) => {
            if (changedDocument === document && highlightText(editor, document, text, changes)) {
                textChangeWatcher.dispose();
            }
        }
    );

    // Releases watcher if text can not be highlighted, added for extra safety.
    setTimeout(textChangeWatcher.dispose, TEXT_WATCHER_TIMEOUT);
}

export {
    showInEditor,
    getActiveFilePath
};
