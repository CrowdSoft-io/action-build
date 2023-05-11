"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBuilder = void 0;
const builder_1 = require("../builder");
const platform_1 = require("./platform");
const shell_1 = require("./shell");
let builder;
function createBuilder() {
    if (!builder) {
        builder = new builder_1.Builder((0, platform_1.createPlatformResolver)(), (0, shell_1.createRunner)());
    }
    return builder;
}
exports.createBuilder = createBuilder;
