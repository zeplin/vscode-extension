import * as vscode from "vscode";
import Logger from "../../../log/Logger";
import MessageType from "./MessageType";

type Option = {
    name: string;
    action?: Action;
};

type Action = () => void;

/**
 * Builder for showing VS Code Message.
 */
export default class MessageBuilder {
    private type: MessageType = MessageType.Error;
    private options: Option[] = [];
    private modal = false;

    private constructor(private message: string) { }

    /**
     * Initializes a message builder with a message.
     * @param message A message to be shown.
     */
    public static with(message: string): MessageBuilder {
        return new MessageBuilder(message);
    }

    /**
     * Return VS Code's built-in message function.
     */
    private getShowMessageFunction():
        (message: string, options: vscode.MessageOptions, ...items: string[]) => Thenable<string | undefined> {
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

    /**
     * Adds a button to the message.
     * @param name A button text.
     * @param action A button action.
     */
    public addOption(name: string, action?: Action): MessageBuilder {
        this.options.push({
            name,
            action
        });

        return this;
    }

    /**
     * Sets type of message.
     * @param type Message type.
     */
    public setType(type: MessageType): MessageBuilder {
        this.type = type;
        return this;
    }

    /**
     * Sets modality of message.
     * @param modal Modal.
     */
    public setModal(modal: boolean): MessageBuilder {
        this.modal = modal;
        return this;
    }

    /**
     * Shows message with VS Code's built-in message feature.
     */
    public async show(): Promise<string | undefined> {
        const showMessage = this.getShowMessageFunction();
        const optionNames = this.options.map(option => option.name);

        Logger.log(`Message shown: ${this.message}`);
        const result = await showMessage(this.message, { modal: this.modal }, ...optionNames);

        Logger.log(`Message answered: Answer: ${result}, Message: ${this.message}`);
        this.options.find(option => option.name === result)?.action?.();

        return result;
    }
}
