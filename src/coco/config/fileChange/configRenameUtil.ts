import * as vscode from "vscode";
import { wrapWithLogs } from "../../../log/util/logUtil";
import FileChanges from "../../../common/vscode/fileChange/FileChanges";
import { isInWorkspace } from "../../../common/vscode/workspace/workspaceUtil";
import CustomConfigs from "../util/CustomConfigs";
import MessageBuilder from "../../../common/vscode/message/MessageBuilder";
import MessageType from "../../../common/vscode/message/MessageType";
import localization from "../../../localization";
import ConfigPaths from "../util/ConfigPaths";

function updatePathOnCustomConfigRename(event: vscode.FileRenameEvent) {
    event.files.forEach(
        fileChanges => wrapWithLogs(
            () => updateCustomConfigPaths(fileChanges),
            "Updating path on custom config rename",
            true
        )
    );
}

function updateCustomConfigPaths(fileChanges: FileChanges) {
    const oldPath = fileChanges.oldUri.fsPath;
    const newPath = fileChanges.newUri.fsPath;

    if (!ConfigPaths.include(oldPath) || !isInWorkspace(newPath)) {
        return;
    }

    if (ConfigPaths.isDefault(oldPath) && !ConfigPaths.isDefault(newPath)) {
        CustomConfigs.add(newPath);
    } else if (CustomConfigs.include(oldPath)) {
        if (ConfigPaths.isDefault(newPath)) {
            CustomConfigs.remove(oldPath);
        } else {
            CustomConfigs.update(oldPath, newPath);
        }
    }

    MessageBuilder.with(localization.coco.config.update.moved).setType(MessageType.Info).show();
}

function removePathOnCustomConfigDelete(event: vscode.FileDeleteEvent) {
    event.files.forEach(
        deletedUri => wrapWithLogs(
            () => removeCustomConfigPaths(deletedUri),
            "Removing path on custom config delete",
            true
        )
    );
}

function removeCustomConfigPaths(uri: vscode.Uri) {
    const removedPath = uri.fsPath;

    if (!ConfigPaths.include(removedPath)) {
        return;
    }

    if (CustomConfigs.include(removedPath)) {
        CustomConfigs.remove(removedPath);
    }

    MessageBuilder.with(localization.coco.config.update.removed).setType(MessageType.Info).show();
}

export {
    updatePathOnCustomConfigRename,
    removePathOnCustomConfigDelete
};
