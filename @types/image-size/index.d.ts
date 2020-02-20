declare module "image-size" {
    function imageSize(buffer: Buffer): Promise<{ width: number; height: number }>;

    export = imageSize;
}
