// @ts-check

"use strict"; // eslint-disable-line strict

const path = require("path"); // eslint-disable-line @typescript-eslint/no-var-requires
const webpack = require("webpack"); // eslint-disable-line @typescript-eslint/no-var-requires
const TerserPlugin = require("terser-webpack-plugin"); // eslint-disable-line @typescript-eslint/no-var-requires

const WEBPACK_CONSTANTS = {};
WEBPACK_CONSTANTS.WPC__API_URL = '"https://api.zeplin.io"';
WEBPACK_CONSTANTS.WPC__APP_URI = '"zpl://"';
WEBPACK_CONSTANTS.WPC__WEB_URL = '"https://app.zeplin.io"';
WEBPACK_CONSTANTS.WPC__IMAGE_SERVER_URL = '"https://img.zeplin.io"';
WEBPACK_CONSTANTS.WPC__OAUTH_CLIENT_ID = '"5dc51cd876f8bf00163de1e5"';
WEBPACK_CONSTANTS.WPC__CONSOLE_LOGS_ENABLED = "false";

const plugins = [
    new webpack.DefinePlugin(WEBPACK_CONSTANTS)
];

/** @type {import('webpack').Configuration} */
const config = {
    target: "node", // Vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
    entry: "./src/common/domain/extension/extension.ts", // The entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    output: {
        // The bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
        path: path.resolve(__dirname, "dist"),
        filename: "extension.js",
        libraryTarget: "commonjs2",
        devtoolModuleFilenameTemplate: "../[resource-path]"
    },
    devtool: "source-map",
    externals: {
        vscode: "commonjs vscode" // The vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    },
    plugins,
    resolve: {
        // Support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [{
                loader: "ts-loader"
            }]
        }]
    },
    optimization: {
        minimizer: [new TerserPlugin({
            terserOptions: {
                keep_classnames: true
            }
        })]
    }
};

module.exports = config;