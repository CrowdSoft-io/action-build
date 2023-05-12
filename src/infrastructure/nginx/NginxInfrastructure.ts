import { Inject, Injectable } from "@tsed/di";
import fs from "fs";
import { Context, ReleaseStage } from "../../models";
import { InfrastructureBuildResult } from "../InfrastructureBuildResult";
import { InfrastructureInterface } from "../InfrastructureInterface";
import { NginxConfig } from "./NginxConfig";
import { NginxConfigRenderer } from "./NginxConfigRenderer";

@Injectable()
export class NginxInfrastructure implements InfrastructureInterface {
  constructor(@Inject() private readonly renderer: NginxConfigRenderer) {}

  async build(context: Context, config: NginxConfig, parameters: Record<string, any>): Promise<InfrastructureBuildResult> {
    const localDir = `${context.local.buildDir}/nginx`;

    fs.mkdirSync(localDir, 0o755);

    if (config.external) {
      fs.writeFileSync(
        `${localDir}/${context.repositoryName}.external`,
        this.renderer.renderServer(context, config.external, true, parameters.domain)
      );
    }

    if (config.internal) {
      fs.writeFileSync(
        `${localDir}/${context.repositoryName}.internal`,
        this.renderer.renderServer(context, config.internal, false, `${context.repositoryName}.internal`)
      );
    }

    return {
      preRelease: this.preRelease(),
      postRelease: this.postRelease()
    };
  }

  private preRelease(): Array<ReleaseStage> {
    return [];
  }

  private postRelease(): Array<ReleaseStage> {
    return [];
  }
}
