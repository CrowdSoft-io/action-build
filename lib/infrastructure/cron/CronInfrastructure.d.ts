import { InfrastructureBuildResult } from "../InfrastructureBuildResult";
import { InfrastructureInterface } from "../InfrastructureInterface";
export declare class CronInfrastructure implements InfrastructureInterface {
    build(): Promise<InfrastructureBuildResult>;
}
