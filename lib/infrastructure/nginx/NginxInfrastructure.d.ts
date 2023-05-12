import { Context } from "../../models";
import { InfrastructureBuildResult } from "../InfrastructureBuildResult";
import { InfrastructureInterface } from "../InfrastructureInterface";
import { NginxConfig } from "./NginxConfig";
import { NginxConfigRenderer } from "./NginxConfigRenderer";
export declare class NginxInfrastructure implements InfrastructureInterface {
    private readonly renderer;
    constructor(renderer: NginxConfigRenderer);
    build(context: Context, config: NginxConfig, parameters: Record<string, any>): Promise<InfrastructureBuildResult>;
    private preRelease;
    private postRelease;
}
