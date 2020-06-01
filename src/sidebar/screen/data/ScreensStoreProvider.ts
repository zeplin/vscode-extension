import CacheHolder from "../../../common/domain/store/CacheHolder";
import ScreensStore from "./ScreensStore";
import { updateSidebarScreens } from "../../refresh/util/refreshUtil";

class ScreensStoreProvider implements CacheHolder {
    private cache: { [id: string]: ScreensStore } = {};

    public get(id: string): ScreensStore {
        if (!this.cache[id]) {
            this.cache[id] = new ScreensStore(id);
            this.cache[id].onDataReceived(screens => updateSidebarScreens(id, screens));
        }

        return this.cache[id];
    }

    public clearCache() {
        Object.keys(this.cache).forEach(key => this.cache[key].dispose());
        this.cache = {};
    }

    public clearCacheFor(id: string) {
        this.cache[id]?.dispose();
        delete this.cache[id];
    }
}

export default new ScreensStoreProvider();
