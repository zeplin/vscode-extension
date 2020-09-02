import * as vscode from "vscode";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import configuration from "../common/domain/extension/configuration";
import { showInEditor } from "../common/vscode/editor/editorUtil";
import { getRootFolderCount } from "../common/vscode/workspace/workspaceUtil";
import { getExtensionVersion } from "../common/vscode/extension/extensionUtil";
import { isConfigValid, getConfig } from "../coco/config/util/configUtil";
import { isFileDirty } from "../common/vscode/editor/textDocumentUtil";
import ContextProvider from "../common/vscode/extension/ContextProvider";
import { isBarrelIdFormatValid } from "../common/domain/barrel/util/barrelUtil";
import { doesComponentExist } from "../coco/component/util/componentUtil";
import RepositoryType from "../coco/repository/model/RepositoryType";
import ConfigPaths from "../coco/config/util/ConfigPaths";

const KEY_STATE = "zeplinLogs";
const HEADER_SEPARATOR = "___________";
const MAX_LOG_SIZE = 100000; // 100 kb
const LINE_BREAK = "\n";
const RELATIVE_FILE_PATH = "zeplin_vsce.log";
const DEFAULT_DATE_ITEM_LENGTH = 2;
const MILLISECONDS_LENGTH = 3;
const DATE_ITEM_PAD_FILLER = "0";

class Logger {
    /**
     * Prints a message to console if console logs are enabled.
     * @param message A message to log.
     */
    public toConsole(message: string) {
        if (configuration.consoleLogsEnabled) {
            console.log(message);
        }
    }

    /**
     * Returns most recent logs.
     */
    private getLogs(): string[] {
        return ContextProvider.get().globalState.get(KEY_STATE) || [];
    }

    /**
     * Logs a message to state. Has an LRU cache limited by maximum size.
     * @param message A message to log.
     */
    private toState(message: string) {
        const logs = this.getLogs();
        logs.unshift(message);
        while (logs.join().length > MAX_LOG_SIZE) {
            logs.pop();
        }
        ContextProvider.get().globalState.update(KEY_STATE, logs);
    }

    /**
     * Adds padding to a number to be used as a date item.
     * @param number A number to be padded.
     * @param maxLength Max length of a number.
     */
    private padDateItem(number: number, maxLength = DEFAULT_DATE_ITEM_LENGTH): string {
        return number.toString().padStart(maxLength, DATE_ITEM_PAD_FILLER);
    }

    /**
     * Logs a message to state. Also prints a message to console if enabled.
     * @param message A message to log.
     */
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

    /**
     * Logs error data to state. Also prints a message to console if enabled.
     * @param message A message to log.
     * @param error Error data to log.
     */
    public error(message: string, error: Error) {
        this.log(`${message}: ${error.stack}`);
    }

    /**
     * Saves logs to file.
     */
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
            `Config/Root folder count: ${ConfigPaths.getCount()}/${getRootFolderCount()}`
        ];

        const configPaths = ConfigPaths.getAll();
        for (let configIndex = 0; configIndex < configPaths.length; configIndex++) {
            logHeaders.push(HEADER_SEPARATOR);
            const configPath = configPaths[configIndex];
            const saved = !isFileDirty(configPath);
            const valid = isConfigValid(configPath);
            logHeaders.push(`Config #${configIndex + 1}, Saved: ${saved}, Valid: ${valid}`);

            if (valid) {
                const rootFolderPath = ConfigPaths.getRootOf(configPath);
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
