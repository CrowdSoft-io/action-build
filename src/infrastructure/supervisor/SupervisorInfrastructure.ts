import { Injectable } from "@tsed/di";
import { Context, ReleaseStage } from "../../models";
import { InfrastructureBuildResult } from "../InfrastructureBuildResult";
import { InfrastructureInterface } from "../InfrastructureInterface";

@Injectable()
export class SupervisorInfrastructure implements InfrastructureInterface {
  async build(context: Context): Promise<InfrastructureBuildResult> {
    return {
      preRelease: await this.preRelease(context),
      postRelease: await this.postRelease(context)
    };
  }

  async preRelease(context: Context): Promise<Array<ReleaseStage>> {
    return [
      {
        name: "Supervisor stop",
        actions: [`sudo supervisorctl stop ${context.remote.supervisorGroup}:*`]
      },
      {
        name: "Supervisor config update",
        actions: []
      }
    ];
  }

  async postRelease(context: Context): Promise<Array<ReleaseStage>> {
    return [
      {
        name: "Supervisor start",
        actions: [`sudo supervisorctl start ${context.remote.supervisorGroup}:*`]
      }
    ];
  }
}
