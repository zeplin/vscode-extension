const ZEPLIN_COMPONENT_ID_VALIDATION_REGEX = /^[0-9A-Fa-f]{24}$/;

function isZeplinComponentIdFormatValid(zeplinComponentId: string): boolean {
    return ZEPLIN_COMPONENT_ID_VALIDATION_REGEX.test(zeplinComponentId);
}

export {
    isZeplinComponentIdFormatValid
};
