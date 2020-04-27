import fetch from "node-fetch";
import configuration from "../extension/configuration";
import { snakeCaseToPascalCase } from "../../general/stringUtil";

async function getCroppedImageUrl(url: string, width: number, height: number): Promise<string | undefined> {
    try {
        return (await fetch(
            `${configuration.imageServerUrl}/${encodeURIComponent(url)}` +
            `?w=${width}&cropTop=0&cropLeft=0&cropWidth=${width}&cropHeight=${height}`
        )).url;
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
    getCroppedImageUrl,
    getEmotarUrl
};
