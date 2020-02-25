import fetch from "node-fetch";
import AbortController from "abort-controller";
import imageSize from "image-size";

/**
 * Return width and height of an image by retriving its data until metadata is received.
 * @param url An image url.
 */
async function getImageSize(url: string): Promise<{ width: number; height: number }> {
    const abortController = new AbortController();
    let imageDataBuffer: Buffer | undefined;
    const response = await fetch(url, { signal: abortController.signal });
    return new Promise(resolve => {
        response.body.on("data", (buffer: Buffer) => {
            imageDataBuffer = imageDataBuffer ? Buffer.concat([imageDataBuffer, buffer]) : buffer;
            try {
                const size = imageSize(imageDataBuffer);
                resolve(size);
                abortController.abort();
            } catch {
                // Do nothing, continue receiving data
            }
        });
        response.body.on("finish", () => resolve({ width: 0, height: 0 }));
        response.body.on("error", () => resolve({ width: 0, height: 0 }));
    });
}

export {
    getImageSize
};
