import * as vscode from "vscode";
import CodeLensCreator from "./CodeLensCreator";
import { wrapWithLogs } from "../../../log/util/logUtil";
import { flatten, isFirstOccurence } from "../../general/arrayUtil";
import Logger from "../../../log/Logger";

export default abstract class CodeLensProvider implements vscode.CodeLensProvider {
    private eventEmitter = new vscode.EventEmitter<void>();

    public get onDidChangeCodeLenses(): vscode.Event<void> {
        return this.eventEmitter.event;
    }

    public refresh() {
        this.eventEmitter.fire();
    }

    public abstract getDocumentSelector(): vscode.DocumentSelector;

    protected abstract getCodeLensCreators(): CodeLensCreator[];

    public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
        const codeLensArrays: vscode.CodeLens[][] = this.getCodeLensCreators().map(
            creator => wrapWithLogs(
                () => creator.create(document),
                `Code Lens "${creator.constructor.name}"`,
                true
            )
        );
        const codeLenses = flatten(codeLensArrays);
        const distinctCommandTitles = codeLenses
            .filter(codeLens => codeLens.command)
            .map(codeLens => codeLens.command!.title)
            .filter(isFirstOccurence);
        if (distinctCommandTitles.length) {
            Logger.log(`Shown Code Lenses: ${distinctCommandTitles.join(", ")}`);
        }
        return codeLenses;
    }
}
