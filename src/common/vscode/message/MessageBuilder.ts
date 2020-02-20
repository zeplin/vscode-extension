import * as vscode from "vscode";
import Logger from "../../../log/Logger";
import MessageType from "./MessageType";

type Option = {
    name: string;
    action?: Action;
};

type Action = () => void;

export default class MessageBuilder {
    private type: MessageType = MessageType.Error;
    private options: Option[] = [];

    private constructor(private message: string) { }

    public static with(message: string): MessageBuilder {
        return new MessageBuilder(message);
    }

    private getShowMessageFunction(): (message: string, ...items: string[]) => Thenable<string | undefined> {
        switch (this.type) {
            case MessageType.Warning:
                return vscode.window.showWarningMessage;
            case MessageType.Error:
                return vscode.window.showErrorMessage;
            case MessageType.Info:
            default:
                return vscode.window.showInformationMessage;
        }
    }

    public addOption(name: string, action?: Action): MessageBuilder {
        this.options.push({
            name,
            action
        });

        return this;
    }

    public setType(type: MessageType): MessageBuilder {
        this.type = type;
        return this;
    }

    public async show(): Promise<string | undefined> {
        const showMessage = this.getShowMessageFunction();
        const optionNames = this.options.map(option => option.name);

        Logger.log(`Message shown: ${this.message}`);
        const result = await showMessage(this.message, ...optionNames);

        Logger.log(`Message answered: Answer: ${result}, Message: ${this.message}`);
        this.options.find(option => option.name === result)?.action?.();

        return result;
    }
}
