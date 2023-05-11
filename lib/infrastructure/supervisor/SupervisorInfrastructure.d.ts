import { Context, ReleaseStage } from "../../models";
import { InfrastructureBuildResult } from "../InfrastructureBuildResult";
import { InfrastructureInterface } from "../InfrastructureInterface";
export declare class SupervisorInfrastructure implements InfrastructureInterface {
    build(context: Context): Promise<InfrastructureBuildResult>;
    preRelease(context: Context): Promise<Array<ReleaseStage>>;
    postRelease(context: Context): Promise<Array<ReleaseStage>>;
}
