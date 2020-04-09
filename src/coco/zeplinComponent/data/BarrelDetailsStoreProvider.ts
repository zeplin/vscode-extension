import BarrelType from "../../../common/domain/barrel/BarrelType";
import ProjectDetailsStore from "./ProjectDetailsStore";
import StyleguideDetailsStore from "./StyleguideDetailsStore";
import Store from "../../../common/domain/store/Store";
import BarrelDetails from "../model/BarrelDetails";
import CacheHolder from "../../../common/domain/store/CacheHolder";

class BarrelDetailsStoreProvider implements CacheHolder {
    private cache: { [id: string]: Store<BarrelDetails> } = {};

    public get(id: string, type: BarrelType, childId?: string, childType?: BarrelType): Store<BarrelDetails> {
        if (!this.cache[id]) {
            this.cache[id] = type === BarrelType.Project
                ? new ProjectDetailsStore(id)
                : new StyleguideDetailsStore(id);
        }

        if (type === BarrelType.Styleguide && childId) {
            (this.cache[id] as StyleguideDetailsStore).setChild(childId, childType!);
        }

        return this.cache[id];
    }

    public clearCache() {
        this.cache = {};
    }
}

export default new BarrelDetailsStoreProvider();
