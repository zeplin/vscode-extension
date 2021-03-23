import * as vscode from "vscode";
import CodeLensCreator from "./CodeLensCreator";
import { wrapWithLogs } from "../../../log/util/logUtil";
import { flatten, isFirstOccurence } from "../../general/arrayUtil";
import Logger from "../../../log/Logger";

/**
 * A code lens provider adds commands to source text. The commands will be shown as dedicated horizontal lines in
 * between the source text.
 */
export default abstract class CodeLensProvider implements vscode.CodeLensProvider {
    private eventEmitter = new vscode.EventEmitter<void>();

    public get onDidChangeCodeLenses(): vscode.Event<void> {
        return this.eventEmitter.event;
    }

    /**
     * Re-provides code lenses.
     */
    public refresh() {
        this.eventEmitter.fire();
    }

    /**
     * Returns a selector that defines the documents this provider is applicable to.
     */
    public abstract getDocumentSelector(): vscode.DocumentSelector;

    /**
     * Returns Code Lens creators that this provider provides.
     */
    protected abstract getCodeLensCreators(document: vscode.TextDocument): CodeLensCreator[];

    /**
     * Returns Code Lenses that are this provider create via its Code Lens creators.
     * @param document A text document to create Code Lenses on.
     */
    public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
        const codeLensArrays: vscode.CodeLens[][] = this.getCodeLensCreators(document).map(
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
