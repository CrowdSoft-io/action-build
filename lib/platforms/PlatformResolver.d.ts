import { InjectorService } from "@tsed/di";
import { PlatformInterface } from "./PlatformInterface";
import { PlatformName } from "./PlatformName";
export declare class PlatformResolver {
    private readonly injectorService;
    constructor(injectorService: InjectorService);
    resolve(name: PlatformName): PlatformInterface;
}
