import BarrelType from "../../barrel/BarrelType";
import ProjectDetailsStore from "../../barrel/data/ProjectDetailsStore";
import StyleguideDetailsStore from "../../barrel/data/StyleguideDetailsStore";
import CacheHolder from "../../store/CacheHolder";
import BarrelDetailsStore from "../../barrel/data/BarrelDetailsStore";
import BarrelDetailsResponse from "../../barrel/model/BarrelDetailsResponse";
import { updateSidebarItems } from "../../../../sidebar/refresh/util/refreshUtil";

class BarrelDetailsStoreProvider implements CacheHolder {
    private cache: { [id: string]: BarrelDetailsStore<BarrelDetailsResponse> } = {};

    public get(id: string, type: BarrelType, childId?: string, childType?: BarrelType):
        BarrelDetailsStore<BarrelDetailsResponse> {
        if (!this.cache[id]) {
            this.cache[id] = type === BarrelType.Project ? new ProjectDetailsStore(id) : new StyleguideDetailsStore(id);
            this.cache[id].onDataReceived(updateSidebarItems);
        }

        if (type === BarrelType.Styleguide && childId) {
            (this.cache[id] as StyleguideDetailsStore).setChild(childId, childType!);
        }

        return this.cache[id];
    }

    public clearCache() {
        Object.keys(this.cache).forEach(key => this.cache[key].dispose());
        this.cache = {};
    }

    public clearCacheFor(id: string) {
        let currentId: string | undefined = id;
        while (currentId && this.cache[currentId]) {
            const nextId: string | undefined = this.cache[currentId].getCache()?.data?.parentId;
            this.cache[currentId].dispose();
            delete this.cache[currentId];
            currentId = nextId;
        }
    }
}

export default new BarrelDetailsStoreProvider();
