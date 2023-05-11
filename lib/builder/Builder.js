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
exports.Builder = void 0;
const di_1 = require("@tsed/di");
const InstallScriptBuilder_1 = require("./InstallScriptBuilder");
const runNumberMax = 1000000;
let Builder = class Builder {
    infrastructureManager;
    platformResolver;
    runner;
    constructor(infrastructureManager, platformResolver, runner) {
        this.infrastructureManager = infrastructureManager;
        this.platformResolver = platformResolver;
        this.runner = runner;
    }
    async build(githubContext, options) {
        const repository = githubContext.payload.repository?.name;
        if (!repository) {
            throw new Error("Repository not set");
        }
        const context = await this.createPlatformContext(githubContext, options);
        await this.runner.run("mkdir", context.local.buildDir);
        await this.runner.run("mkdir", context.local.buildBinDir);
        const infrastructureResult = await this.infrastructureManager.build(context);
        const platform = this.platformResolver.resolve(options.platform);
        const platformResult = await platform.build(context);
        await this.runner.run("tar", "-czf", `${context.local.buildDir}/release.tar.gz`, ...platformResult.files);
        await new InstallScriptBuilder_1.InstallScriptBuilder(context)
            .extractReleaseArchive()
            .addStages(...infrastructureResult.preRelease)
            .addStages(...platformResult.preRelease)
            .switchReleases()
            .addStages(...platformResult.postRelease)
            .addStages(...infrastructureResult.postRelease)
            .removeOldReleases()
            .removeBuildArtifacts()
            .build(context.local.buildBinDir);
        return {
            version: context.version,
            buildDir: context.local.buildDir
        };
    }
    async createPlatformContext(githubContext, options) {
        const repository = githubContext.payload.repository?.name;
        if (!repository) {
            throw new Error("Repository not set");
        }
        const branch = await this.runner.run("git", "symbolic-ref", "--short", "-q", "HEAD");
        const version = (githubContext.runNumber + runNumberMax).toString().substring(1);
        const localBuildDir = `build-${version}`;
        const remoteHomeDir = `/home/${options.user}`;
        const remoteWwwRoot = `${remoteHomeDir}/www`;
        const remoteReleasesRoot = `${remoteHomeDir}/releases`;
        return {
            version,
            branch,
            local: {
                buildDir: localBuildDir,
                buildBinDir: `${localBuildDir}/bin`,
                infrastructureDir: options.infrastructureDir
            },
            remote: {
                user: options.user,
                wwwRoot: remoteWwwRoot,
                projectRoot: `${remoteWwwRoot}/${repository}`,
                releasesRoot: remoteReleasesRoot,
                releaseDir: `${remoteReleasesRoot}/${version}`,
                buildDir: `${remoteReleasesRoot}/build-${version}`,
                supervisorGroup: repository.replace(/-/g, "_"),
                maxReleases: options.maxReleases
            },
            github: githubContext
        };
    }
};
Builder = __decorate([
    (0, di_1.Injectable)(),
    __param(0, (0, di_1.Inject)()),
    __param(1, (0, di_1.Inject)()),
    __param(2, (0, di_1.Inject)())
], Builder);
exports.Builder = Builder;
