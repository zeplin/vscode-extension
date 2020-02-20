export default interface Command {
    name: string;

    execute(...args: unknown[]): Promise<unknown>;
}
