module.exports = {
    env: {
        node: true,
        jest: true
    },
    extends: [
        "@zeplin/eslint-config/node",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    plugins: ["@typescript-eslint"],
    settings: {
        "import/resolver": {
            typescript: { directory: "./tsconfig.json" },
        }
    },
    rules: {
        "capitalized-comments": "error",
        "arrow-body-style": ["error", "as-needed"],
        "@typescript-eslint/explicit-member-accessibility": "error",
        "no-sync": "off",
        "no-process-exit": "off",
        "no-process-env": "off",
        "@typescript-eslint/no-explicit-any": ["error", { "ignoreRestArgs": true }],
        "@typescript-eslint/camelcase": ["error", { "properties": "never", "ignoreDestructuring": true }],
        "class-methods-use-this": "off",
        "no-else-return": "off",
        "prefer-destructuring": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "import/no-unresolved": "off",
        "no-undefined": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "semi": "off", // On by next line for ts
        "@typescript-eslint/semi": "error",
        "no-await-in-loop": "off",
        "no-invalid-this": "off",
        "no-magic-numbers": "off", // On by next line for ts
        "@typescript-eslint/no-magic-numbers": ["error", { "ignore": [0, 1], "ignoreEnums": true }],
        "valid-jsdoc": "off" // This rule is disabled because "requireReturn: false" results in false positives
    }
}
