import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import CustomConfigs from "./CustomConfigs";
import { getActiveItem } from "../../../common/general/arrayUtil";
import { getRootFolderPaths, isInWorkspace, getRootFolderPathForFile } from "../../../common/vscode/workspace/workspaceUtil";
import ConfigFolderPaths from "./ConfigFolderPaths";

const DEFAULT_RELATIVE_PATH = ".zeplin/components.json";

class ConfigPaths {
    public getAll(): string[] {
        return [
            ...getRootFolderPaths().map(this.getDefault).filter(fs.existsSync),
            ...CustomConfigs.getAll().map(descriptor => descriptor.path)
        ].sort();
    }

    public getCount(): number {
        return this.getAll().length;
    }

    public any(): boolean {
        return this.getCount() > 0;
    }

    public exactlyOne(): boolean {
        return this.getCount() === 1;
    }

    public getActive(): string | undefined {
        if (this.exactlyOne()) {
            return this.getAll()[0];
        }

        const activeTextEditor = vscode.window.activeTextEditor;
        const activeFilePath = activeTextEditor?.document.uri.fsPath;
        if (activeFilePath && this.include(activeFilePath)) {
            return activeFilePath;
        }

        const visibleConfigPaths = vscode.window.visibleTextEditors
            .map(textEditor => textEditor.document.uri.fsPath)
            .filter(documentPath => this.include(documentPath));

        return getActiveItem(visibleConfigPaths);
    }

    public include(filePath: string): boolean {
        return this.isDefault(filePath) || CustomConfigs.include(filePath);
    }

    public isDefault(filePath: string): boolean {
        return getRootFolderPaths().some(folderPath => filePath === this.getDefault(folderPath));
    }

    public getDefault(rootFolderPath: string): string {
        return path.join(rootFolderPath, DEFAULT_RELATIVE_PATH);
    }

    public getForItem(itemPath: string): string {
        const rootPath = ConfigFolderPaths.get(itemPath);
        const customConfig = CustomConfigs.getAll().find(descriptor => descriptor.rootPath === rootPath);
        if (customConfig) {
            return customConfig.path;
        }

        return this.getDefault(rootPath);
    }

    public hasForItem(itemPath: string): boolean {
        return isInWorkspace(itemPath) && fs.existsSync(this.getForItem(itemPath));
    }

    public getRootOf(configPath: string): string {
        return CustomConfigs.getAll().find(descriptor => configPath === descriptor.path)?.rootPath ??
            getRootFolderPathForFile(configPath);
    }
}

export default new ConfigPaths();
