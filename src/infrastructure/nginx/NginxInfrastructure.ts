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
      preRelease: this.preRelease(context, config),
      postRelease: this.postRelease()
    };
  }

  private preRelease(context: Context, config: NginxConfig): Array<ReleaseStage> {
    const stages: Array<ReleaseStage> = [];

    if (config.external) {
      const configSrc = `${context.remote.buildDir}/nginx/${context.repositoryName}.external`;
      const configDist = `${context.remote.nginxDir}/${context.repositoryName}.external`;
      stages.push({
        name: `Nginx "${context.repositoryName}.external" config update`,
        actions: [`cat '${configSrc}' > '${configDist}'`]
      });
    }

    if (config.internal) {
      const configSrc = `${context.remote.buildDir}/nginx/${context.repositoryName}.internal`;
      const configDist = `${context.remote.nginxDir}/${context.repositoryName}.internal`;
      stages.push({
        name: `Nginx "${context.repositoryName}.internal" config update`,
        actions: [`cat '${configSrc}' > '${configDist}'`]
      });
    }

    return stages;
  }

  private postRelease(): Array<ReleaseStage> {
    return [
      {
        name: "Nginx reload",
        actions: ["sudo service nginx reload"]
      }
    ];
  }
}
