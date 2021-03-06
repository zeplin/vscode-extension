import * as vscode from "vscode";
import { isConfigValid } from "../util/configUtil";
import { isFileDirty } from "../../../common/vscode/editor/textDocumentUtil";
import { flatten } from "../../../common/general/arrayUtil";
import DiagnosticCreator from "../../../common/vscode/diagnostic/DiagnosticCreator";
import BarrelDiagnosticCreator from "../../barrel/diagnostic/BarrelDiagnosticCreator";
import ComponentDiagnosticCreator from "../../component/diagnostic/ComponentDiagnosticCreator";
import ZeplinComponentDiagnosticCreator from "../../zeplinComponent/diagnostic/ZeplinComponentDiagnosticCreator";
import Refresher from "../../../session/util/Refresher";
import ConfigPaths from "../util/ConfigPaths";

const KEY = "zeplinConfig";
const SOURCE = "Zeplin";

class ConfigDiagnosticsProvider {
    private readonly diagnosticCollection = vscode.languages.createDiagnosticCollection(KEY);

    public register(): vscode.Disposable {
        this.updateForOpenDocuments();
        return vscode.Disposable.from(
            this.diagnosticCollection,
            vscode.workspace.onDidOpenTextDocument(this.updateDiagnostics, this),
            vscode.workspace.onDidSaveTextDocument(this.updateDiagnostics, this),
            vscode.workspace.onDidChangeTextDocument(event => this.clearDiagnostics(event.document), this),
            vscode.workspace.onDidCloseTextDocument(this.clearDiagnostics, this)
        );
    }

    public updateForOpenDocuments() {
        vscode.window.visibleTextEditors.forEach(editor => this.updateDiagnostics(editor.document), this);
    }

    private clearDiagnostics(document: vscode.TextDocument) {
        this.diagnosticCollection.delete(document.uri);
    }

    private async updateDiagnostics(document: vscode.TextDocument) {
        const uri = document.uri;
        const path = uri.fsPath;
        this.diagnosticCollection.delete(uri);

        if (!ConfigPaths.include(path) || isFileDirty(path) || !isConfigValid(path)) {
            return;
        }

        Refresher.requestRefresh();

        const creators: DiagnosticCreator[] = [
            BarrelDiagnosticCreator,
            ComponentDiagnosticCreator,
            ZeplinComponentDiagnosticCreator
        ];

        const diagnostics = flatten(await Promise.all(creators.map(creator => creator.create(document))));
        for (const diagnostic of diagnostics) {
            diagnostic.source = SOURCE;
        }

        this.diagnosticCollection.set(uri, diagnostics);
    }
}

export default new ConfigDiagnosticsProvider();
