import { Inject, Injectable, InjectorService, TokenProvider } from "@tsed/di";
import { CronInfrastructure } from "./cron";
import { InfrastructureInterface } from "./InfrastructureInterface";
import { InfrastructureName } from "./InfrastructureName";
import { NginxInfrastructure } from "./nginx";
import { RabbitmqInfrastructure } from "./rabbitmq";
import { SupervisorInfrastructure } from "./supervisor";

const dictionary: Record<InfrastructureName, TokenProvider<InfrastructureInterface>> = {
  [InfrastructureName.Cron]: CronInfrastructure,
  [InfrastructureName.Nginx]: NginxInfrastructure,
  [InfrastructureName.Rabbitmq]: RabbitmqInfrastructure,
  [InfrastructureName.Supervisor]: SupervisorInfrastructure
};

@Injectable()
export class InfrastructureResolver {
  constructor(@Inject() private readonly injectorService: InjectorService) {}

  resolve(name: InfrastructureName): InfrastructureInterface {
    const service = this.injectorService.get<InfrastructureInterface>(dictionary[name]);
    if (!service) {
      throw new Error(`Unknown infrastructure "${name}"`);
    }
    return service;
  }
}
