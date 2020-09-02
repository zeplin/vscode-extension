import * as fs from "fs";
import ContextProvider from "../../../common/vscode/extension/ContextProvider";
import ConfigCodeLensProvider from "../codeLens/ConfigCodeLensProvider";
import { isInWorkspace, getRootFolderPathForFile, isInSameRootFolder } from "../../../common/vscode/workspace/workspaceUtil";

const KEY_CUSTOM_CONFIGS = "coco.customConfigs";

type CustomConfigDescriptor = {
    path: string;
    rootPath: string;
};

class CustomConfigs {
    public getAll(): CustomConfigDescriptor[] {
        return (ContextProvider.get().workspaceState.get<CustomConfigDescriptor[]>(KEY_CUSTOM_CONFIGS) ?? [])
            .filter(descriptor => fs.existsSync(descriptor.path))
            .filter(descriptor => isInWorkspace(descriptor.path));
    }

    private async setAll(customConfigs: CustomConfigDescriptor[]) {
        await ContextProvider.get().workspaceState.update(KEY_CUSTOM_CONFIGS, customConfigs);
        ConfigCodeLensProvider.refresh();
    }

    public include(filePath: string): boolean {
        return this.getAll().some(descriptor => filePath === descriptor.path);
    }

    public add(configPath: string) {
        const customConfigs = this.getAll();
        customConfigs.push({
            path: configPath,
            rootPath: getRootFolderPathForFile(configPath)
        });
        this.setAll(customConfigs);
    }

    public updateRoot(configPath: string, rootPath: string) {
        const customConfigs = this.getAll();
        const foundDescription = customConfigs.find(customConfig => customConfig.path === configPath);
        if (foundDescription) {
            foundDescription.rootPath = rootPath;
        }
        this.setAll(customConfigs);
    }

    public update(oldConfigPath: string, newConfigPath: string) {
        const customConfigs = this.getAll();
        const foundDescription = customConfigs.find(customConfig => customConfig.path === oldConfigPath);
        if (foundDescription) {
            foundDescription.path = newConfigPath;
            if (!isInSameRootFolder(oldConfigPath, newConfigPath)) {
                foundDescription.rootPath = getRootFolderPathForFile(newConfigPath);
            }
        }
        this.setAll(customConfigs);
    }

    public remove(configPath: string) {
        let customConfigs = this.getAll();
        customConfigs = customConfigs.filter(descriptor => descriptor.path !== configPath);
        this.setAll(customConfigs);
    }
}

export default new CustomConfigs();
