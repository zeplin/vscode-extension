import fetch from "node-fetch";
import configuration from "../extension/configuration";
import { snakeCaseToPascalCase } from "../../general/stringUtil";

let cache: { [key: string]: string | undefined } = {};

async function getCroppedImageUrl(url: string, width: number, height: number): Promise<string | undefined> {
    try {
        if (cache[url]) {
            return cache[url];
        }

        const response = (await fetch(
            `${configuration.imageServerUrl}/${encodeURIComponent(url)}` +
            `?w=${width}&cropTop=0&cropLeft=0&cropWidth=${width}&cropHeight=${height}`
        ));

        cache[url] = response.ok ? response.url : undefined;
        return cache[url];
    } catch {
        return undefined;
    }
}

function resetCroppedImageUrlCache() {
    cache = {};
}

function getEmotarUrl(emotar: string) {
    const emotarFileName = emotar === "random"
        ? "icRandom.svg"
        : `emotar${snakeCaseToPascalCase(emotar)}.png`;
    return `${configuration.webUrl}/img/emotars/${emotarFileName}`;
}

export {
    getCroppedImageUrl,
    resetCroppedImageUrlCache,
    getEmotarUrl
};
