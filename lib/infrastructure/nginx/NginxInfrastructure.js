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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NginxInfrastructure = void 0;
const di_1 = require("@tsed/di");
const fs_1 = __importDefault(require("fs"));
const NginxConfigRenderer_1 = require("./NginxConfigRenderer");
let NginxInfrastructure = class NginxInfrastructure {
    renderer;
    constructor(renderer) {
        this.renderer = renderer;
    }
    async build(context, config, parameters) {
        const localDir = `${context.local.buildDir}/nginx`;
        fs_1.default.mkdirSync(localDir, 0o755);
        if (config.external) {
            fs_1.default.writeFileSync(`${localDir}/${context.repositoryName}.external`, this.renderer.renderServer(context, config.external, true, parameters.domain));
        }
        if (config.internal) {
            fs_1.default.writeFileSync(`${localDir}/${context.repositoryName}.internal`, this.renderer.renderServer(context, config.internal, false, `${context.repositoryName}.internal`));
        }
        return {
            preRelease: this.preRelease(),
            postRelease: this.postRelease()
        };
    }
    preRelease() {
        return [];
    }
    postRelease() {
        return [];
    }
};
NginxInfrastructure = __decorate([
    (0, di_1.Injectable)(),
    __param(0, (0, di_1.Inject)()),
    __metadata("design:paramtypes", [NginxConfigRenderer_1.NginxConfigRenderer])
], NginxInfrastructure);
exports.NginxInfrastructure = NginxInfrastructure;
