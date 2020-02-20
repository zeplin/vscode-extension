import * as fs from "fs";
import * as path from "path";

function doesComponentExist(rootPath: string, relativePath: string): boolean {
    return fs.existsSync(path.join(rootPath, relativePath));
}

export {
    doesComponentExist
};
