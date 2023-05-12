import { Context } from "../../models";
import { InfrastructureBuildResult } from "../InfrastructureBuildResult";
import { InfrastructureInterface } from "../InfrastructureInterface";
import { SupervisorConfig } from "./SupervisorConfig";
export declare class SupervisorInfrastructure implements InfrastructureInterface {
    build(context: Context, config: SupervisorConfig): Promise<InfrastructureBuildResult>;
    private renderConfig;
    private preRelease;
    private postRelease;
}
