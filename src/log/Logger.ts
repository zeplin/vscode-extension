import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import configuration from "../common/domain/extension/configuration";
import { showInEditor } from "../common/vscode/editor/editorUtil";
import { getRootFolderCount, getRootFolderPathForFile } from "../common/vscode/workspace/workspaceUtil";
import { getExtensionVersion } from "../common/vscode/extension/extensionUtil";
import {
    getConfigPaths, isConfigValid, isConfigDirty, getConfig, getConfigCount
} from "../coco/config/util/configUtil";
import ContextProvider from "../common/vscode/extension/ContextProvider";
import { isBarrelIdFormatValid } from "../coco/barrel/util/barrelUtil";
import { doesComponentExist } from "../coco/component/util/componentUtil";
import RepositoryType from "../coco/repository/model/RepositoryType";

const KEY_STATE = "zeplinLogs";
const HEADER_SEPARATOR = "___________";
const MAX_LOG_SIZE = 100000; // 100 kb
const LINE_BREAK = "\n";
const RELATIVE_FILE_PATH = "zeplin_vsce.log";
const DEFAULT_DATE_ITEM_LENGTH = 2;
const MILLISECONDS_LENGTH = 3;
const DATE_ITEM_PAD_FILLER = "0";

class Logger {
    public toConsole(message: string) {
        if (configuration.consoleLogsEnabled) {
            console.log(message);
        }
    }

    private getLogs(): string[] {
        return ContextProvider.get().globalState.get(KEY_STATE) || [];
    }

    private toState(message: string) {
        const logs = this.getLogs();
        logs.unshift(message);
        while (logs.join().length > MAX_LOG_SIZE) {
            logs.pop();
        }
        ContextProvider.get().globalState.update(KEY_STATE, logs);
    }

    private padDateItem(number: number, maxLength = DEFAULT_DATE_ITEM_LENGTH): string {
        return number.toString().padStart(maxLength, DATE_ITEM_PAD_FILLER);
    }

    public log(message: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        const date = new Date();
        const day = this.padDateItem(date.getDate());
        const month = this.padDateItem(date.getMonth() + 1);
        const hours = this.padDateItem(date.getHours());
        const minutes = this.padDateItem(date.getMinutes());
        const seconds = this.padDateItem(date.getSeconds());
        const milliseconds = this.padDateItem(date.getMilliseconds(), MILLISECONDS_LENGTH);

        const toLog = `${day}/${month} ${hours}:${minutes}:${seconds}:${milliseconds}: ${message.toString()}`;
        this.toConsole(toLog);
        this.toState(toLog);
    }

    public error(message: string, error: Error) {
        this.log(`${message}: ${error.stack}`);
    }

    public saveToFile() {
        const storagePath = ContextProvider.get().globalStoragePath;
        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath);
        }
        const logHeaders: unknown[] = [
            `Date: ${new Date().toString()}`,
            `OS Platform: ${os.platform()}, Release: ${os.release()}, Type: ${os.type()}`,
            `VS Code version: ${vscode.version}`,
            `App version: ${getExtensionVersion()}`,
            `Api url: ${configuration.apiUrl}`,
            `Config/Root folder count: ${getConfigCount()}/${getRootFolderCount()}`
        ];

        const configPaths = getConfigPaths();
        for (let configIndex = 0; configIndex < configPaths.length; configIndex++) {
            logHeaders.push(HEADER_SEPARATOR);
            const configPath = configPaths[configIndex];
            const saved = !isConfigDirty(configPath);
            const valid = isConfigValid(configPath);
            logHeaders.push(`Config #${configIndex + 1}, Saved: ${saved}, Valid: ${valid}`);

            if (valid) {
                const rootFolderPath = getRootFolderPathForFile(configPath);
                const config = getConfig(configPath);

                const projectCount = config.getProjects().length;
                const validProjectCount = config.getProjects().filter(isBarrelIdFormatValid).length;
                const styleguideCount = config.getStyleguides().length;
                const validStyleguideCount = config.getStyleguides().filter(isBarrelIdFormatValid).length;
                const componentCount = config.getComponents().length;
                const validComponentCount =
                    config.getComponents().filter(current => doesComponentExist(rootFolderPath, current.path)).length;
                logHeaders.push(
                    `Project count: ${validProjectCount}/${projectCount}`,
                    `Styleguide count: ${validStyleguideCount}/${styleguideCount}`,
                    `Component count: ${validComponentCount}/${componentCount}`,
                    `Zeplin Component count: ${config.getAllZeplinComponentNames().length}`,
                    `Has GitHub: ${config.hasRepository(RepositoryType.Github)}`,
                    `Has GitLab: ${config.hasRepository(RepositoryType.Gitlab)}`,
                    `Has Bitbucket: ${config.hasRepository(RepositoryType.Bitbucket)}`,
                    `Link count: ${config.getLinks().length}`,
                    `Plugin count: ${config.getPlugins().length}`
                );
            }
        }

        logHeaders.push(HEADER_SEPARATOR);

        this.log("Saving logs");
        const filePath = path.join(storagePath, RELATIVE_FILE_PATH);
        fs.writeFileSync(filePath, logHeaders.concat(this.getLogs()).join(LINE_BREAK));
        showInEditor(filePath);
    }
}

export default new Logger();
