import * as vscode from "vscode";
import { isConfigPath, isConfigDirty, isConfigValid } from "../util/configUtil";
import { flatten } from "../../../common/general/arrayUtil";
import DiagnosticCreator from "../../../common/vscode/diagnostic/DiagnosticCreator";
import BarrelDiagnosticCreator from "../../barrel/diagnostic/BarrelDiagnosticCreator";
import ComponentDiagnosticCreator from "../../component/diagnostic/ComponentDiagnosticCreator";

const KEY = "zeplinConfig";
const SOURCE = "Zeplin";

class ConfigDiagnosticsProvider {
    private readonly diagnosticCollection = vscode.languages.createDiagnosticCollection(KEY);

    public register(): vscode.Disposable {
        vscode.workspace.textDocuments.forEach(this.updateDiagnostics, this);
        return vscode.Disposable.from(
            this.diagnosticCollection,
            vscode.workspace.onDidOpenTextDocument(this.updateDiagnostics, this),
            vscode.workspace.onDidSaveTextDocument(this.updateDiagnostics, this),
            vscode.workspace.onDidChangeTextDocument(event => this.clearDiagnostics(event.document), this),
            vscode.workspace.onDidCloseTextDocument(this.clearDiagnostics, this)
        );
    }

    private clearDiagnostics(document: vscode.TextDocument) {
        this.diagnosticCollection.delete(document.uri);
    }

    private async updateDiagnostics(document: vscode.TextDocument) {
        const uri = document.uri;
        const path = uri.fsPath;
        this.diagnosticCollection.delete(uri);

        if (!isConfigPath(path) || isConfigDirty(path) || !isConfigValid(path)) {
            return;
        }

        const creators: DiagnosticCreator[] = [
            BarrelDiagnosticCreator,
            ComponentDiagnosticCreator
        ];

        const diagnostics = flatten(await Promise.all(creators.map(creator => creator.create(document))));
        for (const diagnostic of diagnostics) {
            diagnostic.source = SOURCE;
        }

        this.diagnosticCollection.set(uri, diagnostics);
    }
}

export default new ConfigDiagnosticsProvider();
