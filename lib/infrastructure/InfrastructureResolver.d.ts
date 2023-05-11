import { InjectorService } from "@tsed/di";
import { InfrastructureInterface } from "./InfrastructureInterface";
import { InfrastructureName } from "./InfrastructureName";
export declare class InfrastructureResolver {
    private readonly injectorService;
    constructor(injectorService: InjectorService);
    resolve(name: InfrastructureName): InfrastructureInterface;
}
