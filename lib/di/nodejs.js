"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPackageManagerResolver = void 0;
const nodejs_1 = require("../utils/nodejs");
let packageManagerResolver;
function createPackageManagerResolver() {
    if (!packageManagerResolver) {
        packageManagerResolver = new nodejs_1.PackageManagerResolver();
    }
    return packageManagerResolver;
}
exports.createPackageManagerResolver = createPackageManagerResolver;
