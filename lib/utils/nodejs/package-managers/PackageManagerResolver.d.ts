import { InjectorService } from "@tsed/di";
import { PackageManagerInterface } from "./PackageManagerInterface";
import { PackageManagerName } from "./PackageManagerName";
export declare class PackageManagerResolver {
    private readonly injectorService;
    constructor(injectorService: InjectorService);
    resolve(name?: PackageManagerName): PackageManagerInterface;
}
