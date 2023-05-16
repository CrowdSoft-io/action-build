import { Inject, Injectable } from "@tsed/di";
import fs from "fs";
import { globSync } from "glob";
import YAML from "yaml";
import { Context } from "../models";
import { InfrastructureBuildResult } from "./InfrastructureBuildResult";
import { InfrastructureName } from "./InfrastructureName";
import { InfrastructureResolver } from "./InfrastructureResolver";

@Injectable()
export class InfrastructureManager {
  constructor(@Inject() private readonly infrastructureResolver: InfrastructureResolver) {}

  async build(context: Context): Promise<InfrastructureBuildResult & { environment: Record<string, string> }> {
    const { environments, parameters, ...configs } = this.loadConfigs(context.infrastructureDir);

    let environment: Record<string, string> = { SENTRY_RELEASE: context.version };
    if (environments?.base) {
      environment = { ...environment, ...environments.base };
    }
    if (environments?.[context.branch]) {
      environment = { ...environment, ...environments[context.branch] };
    }

    let mergedParameters: Record<string, any> = {};
    if (parameters?.base) {
      mergedParameters = { ...mergedParameters, ...parameters.base };
    }
    if (parameters?.[context.branch]) {
      mergedParameters = { ...mergedParameters, ...parameters[context.branch] };
    }

    const result: InfrastructureBuildResult & { environment: Record<string, string> } = {
      environment,
      preRelease: [],
      postRelease: []
    };

    for (const name in configs) {
      const service = this.infrastructureResolver.resolve(name as InfrastructureName);
      const { preRelease, postRelease } = await service.build(context, configs[name], mergedParameters);
      result.preRelease.push(...preRelease);
      result.postRelease.push(...postRelease);
    }

    return result;
  }

  private loadConfigs(dir: string): Record<string, any> {
    return globSync(`${dir}/*.yaml`)
      .map<Record<string, object>>((filename) => YAML.parse(fs.readFileSync(filename, "utf8")))
      .reduce((prev, config) => ({ ...prev, ...config }), {});
  }
}
