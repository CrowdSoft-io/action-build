import { Inject, Injectable } from "@tsed/di";
import { Context } from "../../models";
import { PackageManagerInterface } from "../../utils/nodejs";
import { Runner } from "../../utils/shell";
import { PlatformBuildResult } from "../PlatformBuildResult";
import { PlatformInterface } from "../PlatformInterface";

@Injectable()
export class NextPlatform implements PlatformInterface {
  constructor(@Inject() private readonly packageManager: PackageManagerInterface, @Inject() private readonly runner: Runner) {}

  async build(context: Context): Promise<PlatformBuildResult> {
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
}
