import { Context } from "../../models";
import { PackageManagerResolver } from "../../utils/nodejs";
import { Runner } from "../../utils/shell";
import { PlatformBuildResult } from "../PlatformBuildResult";
import { PlatformInterface } from "../PlatformInterface";
export declare class NextPlatform implements PlatformInterface {
    private readonly packageManagerResolver;
    private readonly runner;
    constructor(packageManagerResolver: PackageManagerResolver, runner: Runner);
    build(context: Context): Promise<PlatformBuildResult>;
}
