import { Runner } from "../../../shell";
import { PackageManagerInstallOptions } from "../PackageManagerInstallOptions";
import { PackageManagerInterface } from "../PackageManagerInterface";
export declare class YarnPackageManager implements PackageManagerInterface {
    private readonly runner;
    constructor(runner: Runner);
    install(options?: PackageManagerInstallOptions): Promise<void>;
    run(command: string, ...args: Array<string>): Promise<void>;
}
