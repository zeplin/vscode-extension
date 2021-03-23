import BaseError from "../../../common/domain/error/BaseError";
import Store from "../../../common/domain/store/Store";
import ZeplinComponent from "../../../common/domain/zeplinComponent/model/ZeplinComponent";
import Result from "../../../common/domain/store/Result";
import BarrelDetailsStoreProvider from "../../../common/domain/zeplinComponent/data/BarrelDetailsStoreProvider";
import { getConfig } from "../../config/util/configUtil";
import BarrelType from "../../../common/domain/barrel/BarrelType";
import BarrelDetails from "../../../common/domain/zeplinComponent/model/BarrelDetails";
import { flatten } from "../../../common/general/arrayUtil";
import { replaceAll } from "../../../common/general/stringUtil";

const WILDCARD = "*";

export type ZeplinComponentData = { component: ZeplinComponent; providerId: string; providerType: BarrelType };

export default class ZeplinComponentStore implements Store<ZeplinComponentData[], BaseError> {
    private readonly matcher?: RegExp;

    private constructor(private id: string | undefined, private name: string | undefined, private configPath: string) {
        this.matcher = name ? this.getMatcher(name) : undefined;
    }

    public static byName(name: string, configPath: string) {
        return new ZeplinComponentStore(undefined, name, configPath);
    }

    public static byId(id: string, configPath: string) {
        return new ZeplinComponentStore(id, undefined, configPath);
    }

    private getMatcher(name: string): RegExp {
        const escapedName = name.replace(/[.+?^${}()|[\]\\]/g, "\\$&"); // Escape special chars for regex except "*"
        const wilcardReadyName = `^${escapedName.replace(/\*/g, ".*")}$`; // Replace "*" to match any number of chars
        return new RegExp(wilcardReadyName);
    }

    private getMatcherLength(matcher: string): number {
        return replaceAll(matcher, WILDCARD, "").length;
    }

    private filterMoreSpecificMatchers(names: string[]): RegExp[] {
        if (!this.name?.includes(WILDCARD)) {
            return [];
        }

        let toCompareReached = false;
        const moreSpecificNames = [];
        const toCompareLength = this.getMatcherLength(this.name);

        for (const name of names) {
            if (name === this.name) {
                toCompareReached = true;
            } else if (name.includes(WILDCARD)) {
                const nameLength = this.getMatcherLength(name);
                if (nameLength > toCompareLength || (nameLength === toCompareLength && !toCompareReached)) {
                    moreSpecificNames.push(name);
                }
            } else if (this.matcher!.test(name)) {
                moreSpecificNames.push(name);
            }
        }

        return moreSpecificNames.map(this.getMatcher);
    }

    private isTheMostSpecificMatcher(component: ZeplinComponent, moreSpecificMatchers: RegExp[], zeplinIds: string[]) {
        if (component._id === this.id || component.name === this.name) {
            return true;
        }

        return this.matcher?.test(component.name) &&
            !moreSpecificMatchers.some(matcher => matcher.test(component.name)) &&
            !zeplinIds.some(zeplinId => zeplinId === component._id);
    }

    public get = async (): Promise<Result<ZeplinComponentData[], BaseError>> => {
        const config = getConfig(this.configPath);
        const barrels = config.getValidBarrelsWithTypes();
        const { zeplinIds, zeplinNames } = config.getAllZeplinComponentDescriptors();
        const moreSpecificMatchers = this.filterMoreSpecificMatchers(zeplinNames);

        const allSearches = Promise.all(barrels.map(async ({ id, type }): Promise<ZeplinComponentData[]> => {
            const leafId = id;
            const leafType = type;
            let currentId: string | undefined = leafId;
            let currentType = leafType;
            const componentDatas: ZeplinComponentData[] = [];

            while (currentId) {
                const childId: string | undefined = currentId === leafId ? undefined : leafId;
                const childType: BarrelType | undefined = currentId === leafId ? undefined : leafType;

                const { data }: Result<BarrelDetails, BaseError> =
                    await BarrelDetailsStoreProvider.get(currentId, currentType, childId, childType).get();

                const components = data?.components.filter(
                    current => this.isTheMostSpecificMatcher(current, moreSpecificMatchers, zeplinIds)
                ) ?? [];
                componentDatas.push(...components.map(component => ({
                    component,
                    providerId: leafId,
                    providerType: leafType
                } as ZeplinComponentData)));

                currentId = data?.parentId;
                currentType = BarrelType.Styleguide;
            }

            return componentDatas;
        }));

        const allMatches = flatten(await allSearches);
        const exactMatches = allMatches.filter(({ component: { name, _id } }) => _id === this.id || name === this.name);
        return {
            data: exactMatches.length ? exactMatches : allMatches,
            errors: allMatches.length ? undefined : [new BaseError()]
        };
    };

    public refresh = (): Promise<Result<ZeplinComponentData[], BaseError>> => {
        BarrelDetailsStoreProvider.clearCache();
        return this.get();
    };
}
