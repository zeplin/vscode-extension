import * as vscode from "vscode";
import { getRangeOfProperty, narrowRangeForProperty } from "./textDocumentUtil";

const TEXT_WATCHER_TIMEOUT = 2000; // 2 seconds

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

function highlightTextOnAdd(editor: vscode.TextEditor, document: vscode.TextDocument, text: string) {
    const textChangeWatcher = vscode.workspace.onDidChangeTextDocument(
        ({ document: changedDocument, contentChanges: changes }) => {
            if (changedDocument === document && highlightText(editor, document, text, changes)) {
                textChangeWatcher.dispose();
            }
        }
    );

    // Releases watcher if text can not be highlighted, added for extra safety
    setTimeout(textChangeWatcher.dispose, TEXT_WATCHER_TIMEOUT);
}

export {
    showInEditor,
    getActiveFilePath
};
