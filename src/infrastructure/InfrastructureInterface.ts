import { Context } from "../models";
import { InfrastructureBuildResult } from "./InfrastructureBuildResult";

export interface InfrastructureInterface {
  build(context: Context, parameters: Record<string, any>): Promise<InfrastructureBuildResult>;
}
