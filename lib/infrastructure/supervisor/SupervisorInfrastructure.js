"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupervisorInfrastructure = void 0;
const di_1 = require("@tsed/di");
const fs_1 = __importDefault(require("fs"));
let SupervisorInfrastructure = class SupervisorInfrastructure {
    async build(context, config) {
        const localDir = `${context.local.buildDir}/supervisor`;
        fs_1.default.mkdirSync(localDir, 0o755);
        fs_1.default.writeFileSync(`${localDir}/${context.serviceName}.conf`, this.renderConfig(context, config));
        return {
            preRelease: this.preRelease(context),
            postRelease: this.postRelease(context)
        };
    }
    renderConfig(context, config) {
        const lines = [
            `[group:${context.serviceName}]`,
            `programs=${config.programs.map((program) => `${context.serviceName}_${program.name}`).join(",")}`,
            ""
        ];
        for (const program of config.programs) {
            lines.push(`[program:${context.serviceName}_${program.name}]`);
            lines.push(`command=${program.command}`);
            lines.push(`directory=${context.remote.projectRoot}`);
            lines.push("autostart=true");
            lines.push("autorestart=true");
            lines.push(`stdout_logfile=${context.remote.logsDir}/supervisor.${program.name}.stdout.log`);
            lines.push(`stderr_logfile=${context.remote.logsDir}/supervisor.${program.name}.stderr.log`);
            lines.push(`user=${context.remote.user}`);
            lines.push(`group=${context.remote.user}`);
            lines.push("");
        }
        return lines.join("\n");
    }
    preRelease(context) {
        const configSrc = `${context.remote.buildDir}/supervisor/${context.serviceName}.conf`;
        const configDist = `${context.remote.supervisorDir}/${context.serviceName}.conf`;
        return [
            {
                name: "Supervisor stop",
                actions: [`sudo supervisorctl stop ${context.serviceName}:*`]
            },
            {
                name: "Supervisor config update",
                actions: [
                    `if [[ ! -f '${configDist}' || \`diff '${configSrc}' '${configDist}'\` ]]`,
                    "then",
                    `    cat '${configSrc}' > '${configDist}' \\`,
                    "        && sudo service supervisor reload \\",
                    "        && echo 'Supervisor config updated'",
                    "fi"
                ]
            }
        ];
    }
    postRelease(context) {
        return [
            {
                name: "Supervisor start",
                actions: [`sudo supervisorctl start ${context.serviceName}:*`]
            }
        ];
    }
};
SupervisorInfrastructure = __decorate([
    (0, di_1.Injectable)()
], SupervisorInfrastructure);
exports.SupervisorInfrastructure = SupervisorInfrastructure;
