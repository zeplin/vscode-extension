function isTrue(value: unknown): boolean {
    return typeof value === "boolean" ? value : false;
}

export {
    isTrue
};
