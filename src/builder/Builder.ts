import { Context as GithubContext } from "@actions/github/lib/context";
import { Inject, Injectable } from "@tsed/di";
import fs from "fs";
import { InfrastructureManager } from "../infrastructure";
import { Context, Result } from "../models";
import { PlatformName, PlatformResolver } from "../platforms";
import { Runner } from "../utils/shell";
import { BuilderOptions } from "./BuilderOptions";
import { InstallScriptBuilder } from "./InstallScriptBuilder";

const runNumberMax = 1000000;

@Injectable()
export class Builder {
  constructor(
    @Inject() private readonly infrastructureManager: InfrastructureManager,
    @Inject() private readonly platformResolver: PlatformResolver,
    @Inject() private readonly runner: Runner
  ) {}

  async build(githubContext: GithubContext, options: BuilderOptions): Promise<Result> {
    const repository = githubContext.payload.repository?.name;
    if (!repository) {
      throw new Error("Repository not set");
    }

    const context = await this.createPlatformContext(githubContext, options);

    fs.mkdirSync(context.local.buildDir, 0o755);
    fs.mkdirSync(context.local.buildBinDir, 0o755);

    const infrastructureResult = await this.infrastructureManager.build(context);

    const platform = this.platformResolver.resolve(options.platform as PlatformName);
    const platformResult = await platform.build(context);

    await this.runner.run("tar", "-czf", `${context.local.buildDir}/release.tar.gz`, ...platformResult.files);

    await new InstallScriptBuilder(context)
      .extractReleaseArchive()
      .addStages(...infrastructureResult.preRelease)
      .addStages(...platformResult.preRelease)
      .switchReleases()
      .addStages(...platformResult.postRelease)
      .addStages(...infrastructureResult.postRelease)
      .removeOldReleases()
      .removeBuildArtifacts()
      .build();

    return {
      version: context.version,
      buildDir: context.local.buildDir
    };
  }

  private async createPlatformContext(githubContext: GithubContext, options: BuilderOptions): Promise<Context> {
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
    const remoteBuildDir = `${remoteReleasesRoot}/build-${version}`;

    return {
      repositoryName: repository,
      projectName: repository.replace(/^(\w+)-.*$/g, "$1"),
      serviceName: repository.replace(/-/g, "_"),
      version,
      branch,
      infrastructureDir: options.infrastructureDir,
      local: {
        buildDir: localBuildDir,
        buildBinDir: `${localBuildDir}/bin`
      },
      remote: {
        user: options.user,
        wwwRoot: remoteWwwRoot,
        projectRoot: `${remoteWwwRoot}/${repository}`,
        releasesRoot: remoteReleasesRoot,
        releaseDir: `${remoteReleasesRoot}/${version}`,
        logsDir: `${remoteHomeDir}/logs/${repository}`,
        buildDir: remoteBuildDir,
        buildBinDir: `${remoteBuildDir}/bin`,
        supervisorDir: `${remoteHomeDir}/supervisor`,
        maxReleases: options.maxReleases
      },
      github: githubContext
    };
  }
}
