const BARREL_ID_VALIDATION_REGEX = /^[0-9A-Fa-f]{24}$/;

function isBarrelIdFormatValid(barrelId: string): boolean {
    return BARREL_ID_VALIDATION_REGEX.test(barrelId);
}

export {
    isBarrelIdFormatValid
};
