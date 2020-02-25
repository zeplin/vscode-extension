/**
 * Storage for session token.
 */
export default interface TokenStorage {
    get(): Promise<string | null>;
    set(token: string): Promise<void>;
    remove(): Promise<void>;
}
