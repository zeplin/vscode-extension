import CacheHolder from "../../../common/domain/store/CacheHolder";
import ScreensStore from "./ScreensStore";

class ScreensStoreProvider implements CacheHolder {
    private cache: { [id: string]: ScreensStore } = {};

    public get(id: string): ScreensStore {
        if (!this.cache[id]) {
            this.cache[id] = new ScreensStore(id);
        }

        return this.cache[id];
    }

    public clearCache() {
        this.cache = {};
    }
}

export default new ScreensStoreProvider();
