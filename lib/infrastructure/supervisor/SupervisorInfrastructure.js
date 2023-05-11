"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupervisorInfrastructure = void 0;
const di_1 = require("@tsed/di");
let SupervisorInfrastructure = class SupervisorInfrastructure {
    async build(context) {
        return {
            preRelease: await this.preRelease(context),
            postRelease: await this.postRelease(context)
        };
    }
    async preRelease(context) {
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
    async postRelease(context) {
        return [
            {
                name: "Supervisor start",
                actions: [`sudo supervisorctl start ${context.remote.supervisorGroup}:*`]
            }
        ];
    }
};
SupervisorInfrastructure = __decorate([
    (0, di_1.Injectable)()
], SupervisorInfrastructure);
exports.SupervisorInfrastructure = SupervisorInfrastructure;
