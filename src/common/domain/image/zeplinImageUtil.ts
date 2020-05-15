import fetch from "node-fetch";
import configuration from "../extension/configuration";
import { snakeCaseToPascalCase } from "../../general/stringUtil";

const cache: { [key: string]: string | undefined } = {};

function getCachedCroppedImageUrl(url: string): string | undefined {
    return cache[url];
}

async function getCroppedImageUrl(url: string, width: number, height: number): Promise<string | undefined> {
    try {
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

function getEmotarUrl(emotar: string) {
    const emotarFileName = emotar === "random"
        ? "icRandom.svg"
        : `emotar${snakeCaseToPascalCase(emotar)}.png`;
    return `${configuration.webUrl}/img/emotars/${emotarFileName}`;
}

export {
    getCachedCroppedImageUrl,
    getCroppedImageUrl,
    getEmotarUrl
};
