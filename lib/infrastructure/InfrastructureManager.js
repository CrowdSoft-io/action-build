"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureManager = void 0;
const di_1 = require("@tsed/di");
const fs_1 = __importDefault(require("fs"));
const glob_1 = require("glob");
const yaml_1 = __importDefault(require("yaml"));
let InfrastructureManager = class InfrastructureManager {
    infrastructureResolver;
    constructor(infrastructureResolver) {
        this.infrastructureResolver = infrastructureResolver;
    }
    async build(context) {
        const { parameters, ...configs } = this.loadConfigs(context.local.infrastructureDir);
        const mergedParameters = { ...parameters?.base, ...parameters?.[context.branch] };
        const result = {
            preRelease: [],
            postRelease: []
        };
        for (const name in configs) {
            const service = this.infrastructureResolver.resolve(name);
            const { preRelease, postRelease } = await service.build(context, mergedParameters);
            result.preRelease.push(...preRelease);
            result.postRelease.push(...postRelease);
        }
        return result;
    }
    loadConfigs(dir) {
        return (0, glob_1.globSync)(`${dir}/*.yaml`)
            .map((filename) => yaml_1.default.parse(fs_1.default.readFileSync(filename, "utf8")))
            .reduce((prev, config) => ({ ...prev, ...config }), {});
    }
};
InfrastructureManager = __decorate([
    (0, di_1.Injectable)(),
    __param(0, (0, di_1.Inject)())
], InfrastructureManager);
exports.InfrastructureManager = InfrastructureManager;
