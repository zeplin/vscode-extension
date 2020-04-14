const WORD_SEPARATOR = "/";

export default class TreeItemContextProvider {
    private readonly contextValues: string[];
    private readonly context: string;

    public constructor(...contextValues: string[]) {
        this.contextValues = contextValues;
        this.context = contextValues.join(WORD_SEPARATOR);
    }

    public contains(contextValue: string): boolean {
        return this.contextValues.includes(contextValue);
    }

    public get(): string {
        return this.context;
    }
}
