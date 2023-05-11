import { InfrastructureBuildResult } from "../InfrastructureBuildResult";
import { InfrastructureInterface } from "../InfrastructureInterface";
export declare class NginxInfrastructure implements InfrastructureInterface {
    build(): Promise<InfrastructureBuildResult>;
}
