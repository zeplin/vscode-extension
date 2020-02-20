import * as keytarType from "keytar";
import { TokenStorage } from ".";
import Logger from "../../log/Logger";

const SERVICE_NAME = "zeplinTokenService";
const ACCOUNT_NAME = "zeplinTokenAccount";
const SERVICE_NAME_FOR_AVAILABILITY = "zeplinTokenServiceForAvailability";
const ACCOUNT_NAME_FOR_AVAILABILITY = "zeplinTokenAccountForAvailability";

class KeychainTokenStorage implements TokenStorage {
    public get(): Promise<string | null> {
        return keytar!.getPassword(SERVICE_NAME, ACCOUNT_NAME);
    }

    public set(token: string): Promise<void> {
        return keytar!.setPassword(SERVICE_NAME, ACCOUNT_NAME, token);
    }

    public async remove(): Promise<void> {
        await keytar!.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
    }
}

type Keytar = {
    getPassword: typeof keytarType["getPassword"];
    setPassword: typeof keytarType["setPassword"];
    deletePassword: typeof keytarType["deletePassword"];
};

const keytar = getKeytar();

function getKeytar(): Keytar | undefined {
    try {
        const vscodeRequire = eval("require"); // eslint-disable-line no-eval
        return vscodeRequire("keytar");
    } catch (err) {
        return undefined;
    }
}

async function isKeychainTokenStorageAvailable() {
    try {
        // Check if keytar is working
        if (!keytar) {
            Logger.log("Keychain is not available");
            return false;
        }
        await keytar.getPassword(SERVICE_NAME_FOR_AVAILABILITY, ACCOUNT_NAME_FOR_AVAILABILITY);
        Logger.log("Keychain is available");
        return true;
    } catch (error) {
        Logger.error("Keychain is not available", error);
        return false;
    }
}

export {
    KeychainTokenStorage,
    isKeychainTokenStorageAvailable
};
