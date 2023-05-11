"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlatformResolver = void 0;
const platforms_1 = require("../platforms");
let platformResolver;
function createPlatformResolver() {
    if (!platformResolver) {
        platformResolver = new platforms_1.PlatformResolver();
    }
    return platformResolver;
}
exports.createPlatformResolver = createPlatformResolver;
