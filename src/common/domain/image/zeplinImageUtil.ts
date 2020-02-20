import fetch from "node-fetch";
import configuration from "../extension/configuration";

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

export {
    getCroppedImageUrl
};
