import OrganizationProjectsStore from "./OrganizationProjectsStore";
import OrganizationStyleguidesStore from "./OrganizationStyleguidesStore";
import PersonalProjectsStore from "./PersonalProjectsStore";
import PersonalStyleguidesStore from "./PersonalStyleguidesStore";
import Barrel from "../model/Barrel";
import BarrelType from "../model/BarrelType";
import Store from "../../../common/domain/store/Store";

class BarrelsStoreProvider {
    private personalProjectsStore = new PersonalProjectsStore();
    private personalStyleguidesStore = new PersonalStyleguidesStore();
    private projectsStoreCache: { [organizationId: string]: Store<Barrel[]> } = {};
    private styleguidesStoreCache: { [organizationId: string]: Store<Barrel[]> } = {};

    public get(type: BarrelType, organizationId?: string): Store<Barrel[]> {
        return type === BarrelType.Project
            ? this.getProjectsStore(organizationId)
            : this.getStyleguidesStore(organizationId);
    }

    private getProjectsStore(organizationId?: string): Store<Barrel[]> {
        if (!organizationId) {
            return this.personalProjectsStore;
        } else {
            if (!this.projectsStoreCache[organizationId]) {
                this.projectsStoreCache[organizationId] = new OrganizationProjectsStore(organizationId);
            }

            return this.projectsStoreCache[organizationId];
        }
    }

    private getStyleguidesStore(organizationId?: string): Store<Barrel[]> {
        if (!organizationId) {
            return this.personalStyleguidesStore;
        } else {
            if (!this.styleguidesStoreCache[organizationId]) {
                this.styleguidesStoreCache[organizationId] = new OrganizationStyleguidesStore(organizationId);
            }

            return this.styleguidesStoreCache[organizationId];
        }
    }

    public clearCache() {
        this.personalProjectsStore.clearCache();
        this.personalStyleguidesStore.clearCache();
        this.projectsStoreCache = {};
        this.styleguidesStoreCache = {};
    }
}

export default new BarrelsStoreProvider();
