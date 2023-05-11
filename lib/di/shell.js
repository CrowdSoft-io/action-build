"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRunner = void 0;
const shell_1 = require("../utils/shell");
let runner;
function createRunner() {
    if (!runner) {
        runner = new shell_1.Runner();
    }
    return runner;
}
exports.createRunner = createRunner;
