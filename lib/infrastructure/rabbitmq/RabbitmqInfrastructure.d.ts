import { InfrastructureBuildResult } from "../InfrastructureBuildResult";
import { InfrastructureInterface } from "../InfrastructureInterface";
export declare class RabbitmqInfrastructure implements InfrastructureInterface {
    build(): Promise<InfrastructureBuildResult>;
}
