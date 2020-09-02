import * as fs from "fs";
import { getRootFolderPaths } from "../../../common/vscode/workspace/workspaceUtil";
import ConfigPaths from "./ConfigPaths";
import CustomConfigs from "./CustomConfigs";
import { isFirstOccurence } from "../../../common/general/arrayUtil";
import { compareLength } from "../../../common/general/stringUtil";
import { toUnixPath, removeLeadingPathSeparator } from "../../../common/general/pathUtil";

class ConfigFolderPaths {
    private getAll(): string[] {
        return CustomConfigs
            .getAll()
            .map(({ rootPath }) => rootPath)
            .concat(getRootFolderPaths())
            .filter(isFirstOccurence);
    }

    public getAllWithConfig(): string[] {
        return CustomConfigs
            .getAll()
            .map(({ rootPath }) => rootPath)
            .concat(getRootFolderPaths().filter(rootPath => fs.existsSync(this.getConfigOf(rootPath))))
            .filter(isFirstOccurence);
    }

    public getAllWithNoConfig(): string[] {
        return getRootFolderPaths().filter(rootPath => !fs.existsSync(this.getConfigOf(rootPath)));
    }

    public exactlyOneWithNoConfig(): boolean {
        return this.getAllWithNoConfig().length === 1;
    }

    public allHaveConfig(): boolean {
        return getRootFolderPaths().map(this.getConfigOf).every(fs.existsSync);
    }

    public get(itemPath: string): string {
        return this.getAll().sort(compareLength).find(folderPath => itemPath.startsWith(folderPath))!;
    }

    public getRelativePathOf(itemPath: string): string {
        const rootPath = this.get(itemPath);
        const relativePath = toUnixPath(removeLeadingPathSeparator(itemPath.replace(rootPath, "")));
        return relativePath;
    }

    public getConfigOf(rootPath: string): string {
        return CustomConfigs.getAll().find(descriptor => rootPath === descriptor.rootPath)?.path ??
            ConfigPaths.getDefault(rootPath);
    }
}

export default new ConfigFolderPaths();
