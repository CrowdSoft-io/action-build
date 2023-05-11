"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YarnPackageManager = void 0;
const di_1 = require("@tsed/di");
let YarnPackageManager = class YarnPackageManager {
    runner;
    constructor(runner) {
        this.runner = runner;
    }
    async install(options) {
        const args = [];
        if (options?.production) {
            args.push("--only=production");
        }
        if (options?.ignoreScripts) {
            args.push("--ignore-scripts");
        }
        if (options?.frozenLockfile) {
            args.push("--frozen-lockfile");
        }
        await this.runner.run("yarn", "install", ...args);
    }
    async run(command, ...args) {
        await this.runner.run("yarn", command, ...args);
    }
};
YarnPackageManager = __decorate([
    (0, di_1.Injectable)(),
    __param(0, (0, di_1.Inject)())
], YarnPackageManager);
exports.YarnPackageManager = YarnPackageManager;
