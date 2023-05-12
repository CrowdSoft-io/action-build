"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureResolver = void 0;
const di_1 = require("@tsed/di");
const cron_1 = require("./cron");
const InfrastructureName_1 = require("./InfrastructureName");
const nginx_1 = require("./nginx");
const rabbitmq_1 = require("./rabbitmq");
const supervisor_1 = require("./supervisor");
const dictionary = {
    [InfrastructureName_1.InfrastructureName.Cron]: cron_1.CronInfrastructure,
    [InfrastructureName_1.InfrastructureName.Nginx]: nginx_1.NginxInfrastructure,
    [InfrastructureName_1.InfrastructureName.Rabbitmq]: rabbitmq_1.RabbitmqInfrastructure,
    [InfrastructureName_1.InfrastructureName.Supervisor]: supervisor_1.SupervisorInfrastructure
};
let InfrastructureResolver = class InfrastructureResolver {
    injectorService;
    constructor(injectorService) {
        this.injectorService = injectorService;
    }
    resolve(name) {
        const service = this.injectorService.get(dictionary[name]);
        if (!service) {
            throw new Error(`Unknown infrastructure "${name}"`);
        }
        return service;
    }
};
InfrastructureResolver = __decorate([
    (0, di_1.Injectable)(),
    __param(0, (0, di_1.Inject)()),
    __metadata("design:paramtypes", [di_1.InjectorService])
], InfrastructureResolver);
exports.InfrastructureResolver = InfrastructureResolver;
