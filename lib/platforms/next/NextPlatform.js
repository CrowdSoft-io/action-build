"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextPlatform = void 0;
const di_1 = require("@tsed/di");
const nodejs_1 = require("../../utils/nodejs");
const shell_1 = require("../../utils/shell");
let NextPlatform = class NextPlatform {
    packageManagerResolver;
    runner;
    constructor(packageManagerResolver, runner) {
        this.packageManagerResolver = packageManagerResolver;
        this.runner = runner;
    }
    async build(context) {
        const packageManager = this.packageManagerResolver.resolve();
        process.env.CI = "true";
        process.env.SENTRY_RELEASE = context.version;
        await packageManager.install({ frozenLockfile: true });
        await packageManager.run("build");
        await this.runner.run("rm", "-rf", "node_modules");
        await packageManager.install({ production: true, ignoreScripts: true, frozenLockfile: true });
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
    __param(1, (0, di_1.Inject)()),
    __metadata("design:paramtypes", [nodejs_1.PackageManagerResolver, shell_1.Runner])
], NextPlatform);
exports.NextPlatform = NextPlatform;
