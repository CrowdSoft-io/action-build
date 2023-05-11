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
exports.NextPlatform = void 0;
const di_1 = require("@tsed/di");
let NextPlatform = class NextPlatform {
    packageManager;
    runner;
    constructor(packageManager, runner) {
        this.packageManager = packageManager;
        this.runner = runner;
    }
    async build(context) {
        process.env.CI = "true";
        process.env.SENTRY_RELEASE = context.version;
        await this.packageManager.install({ frozenLockfile: true });
        await this.packageManager.run("build");
        await this.runner.run("rm", "-rf", "node_modules");
        await this.packageManager.install({ production: true, ignoreScripts: true, frozenLockfile: true });
        return {
            files: ["*", ".??*"],
            preRelease: [],
            postRelease: []
        };
    }
};
NextPlatform = __decorate([
    (0, di_1.Injectable)(),
    __param(0, (0, di_1.Inject)()),
    __param(1, (0, di_1.Inject)())
], NextPlatform);
exports.NextPlatform = NextPlatform;
