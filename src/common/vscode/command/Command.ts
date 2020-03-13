/**
 * Descriptor of a Command with name and action.
 */
export default interface Command {
    /**
     * Name of the command, must be same as the command parameter in package.json.
     */
    name: string;

    /**
     * Executes action of this command with parameters.
     * @param args Parameters of action.
     */
    execute(...args: unknown[]): Promise<unknown>;
}
