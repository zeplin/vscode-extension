import Barrel from "../Barrel";
import localization from "../../../../localization";

const DETAIL_ITEM_SEPARATOR = ", ";
const PLATFORM_ANDROID = "android";
const PLATFORM_REPRESENTATIONS: { [apiValue: string]: string } = Object.freeze({
    android: "Android",
    base: "Base",
    ios: "iOS",
    osx: "macOS",
    web: "Web"
});
const DENSITY_SCALE_REPRESENTATIONS_ANDROID: { [s: number]: string } = Object.freeze({
    1: "mdpi",
    1.5: "hdpi",
    2: "xhdpi",
    3: "xxhdpi",
    4: "xxxhdpi"
});

function getPlatformRepresentation(platform: string): string | undefined {
    return PLATFORM_REPRESENTATIONS[platform] ?? platform;
}

function getDensityScaleRepresentation(platform: string, densityScale?: number): string | undefined {
    if (densityScale === null || densityScale === undefined) {
        return undefined;
    } else if (platform === PLATFORM_ANDROID) {
        return DENSITY_SCALE_REPRESENTATIONS_ANDROID[densityScale];
    } else {
        return `${densityScale}x`;
    }
}

function getBarrelDetailRepresentation(barrel: Barrel): string {
    return mergeRepresentations(
        getPlatformRepresentation(barrel.platform),
        getDensityScaleRepresentation(barrel.platform, barrel.densityScale)
    );
}

function getBarrelDetailRepresentationWithType(barrel: Barrel): string {
    return mergeRepresentations(
        localization.common.barrel.barrel(barrel.type),
        getPlatformRepresentation(barrel.platform),
        getDensityScaleRepresentation(barrel.platform, barrel.densityScale)
    );
}

function mergeRepresentations(...representations: (string | undefined)[]) {
    return representations
        .filter(representation => representation)
        .join(DETAIL_ITEM_SEPARATOR);
}

export {
    getBarrelDetailRepresentation,
    getBarrelDetailRepresentationWithType
};
