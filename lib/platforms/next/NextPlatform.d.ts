import { Context } from "../../models";
import { PackageManagerInterface } from "../../utils/nodejs";
import { Runner } from "../../utils/shell";
import { PlatformBuildResult } from "../PlatformBuildResult";
import { PlatformInterface } from "../PlatformInterface";
export declare class NextPlatform implements PlatformInterface {
    private readonly packageManager;
    private readonly runner;
    constructor(packageManager: PackageManagerInterface, runner: Runner);
    build(context: Context): Promise<PlatformBuildResult>;
}
