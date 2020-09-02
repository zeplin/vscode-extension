import * as vscode from "vscode";

export default interface FileChanges {
    oldUri: vscode.Uri;
    newUri: vscode.Uri;
}
