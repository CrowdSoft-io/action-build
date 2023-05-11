import { Inject, Injectable } from "@tsed/di";
import { Context } from "../../models";
import { PackageManagerResolver } from "../../utils/nodejs";
import { Runner } from "../../utils/shell";
import { PlatformBuildResult } from "../PlatformBuildResult";
import { PlatformInterface } from "../PlatformInterface";

@Injectable()
export class NextPlatform implements PlatformInterface {
  constructor(@Inject() private readonly packageManagerResolver: PackageManagerResolver, @Inject() private readonly runner: Runner) {}

  async build(context: Context): Promise<PlatformBuildResult> {
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
}
