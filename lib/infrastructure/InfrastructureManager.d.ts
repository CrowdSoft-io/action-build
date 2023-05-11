import { Context } from "../models";
import { InfrastructureBuildResult } from "./InfrastructureBuildResult";
import { InfrastructureResolver } from "./InfrastructureResolver";
export declare class InfrastructureManager {
    private readonly infrastructureResolver;
    constructor(infrastructureResolver: InfrastructureResolver);
    build(context: Context): Promise<InfrastructureBuildResult>;
    private loadConfigs;
}
