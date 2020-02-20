import { isKeychainTokenStorageAvailable, KeychainTokenStorage, VscodeTokenStorage } from "../tokenStorage";
import Session from "../Session";

async function initializeSession() {
    Session.initialize(await isKeychainTokenStorageAvailable() ? new KeychainTokenStorage() : new VscodeTokenStorage());
}

export {
    initializeSession
};
