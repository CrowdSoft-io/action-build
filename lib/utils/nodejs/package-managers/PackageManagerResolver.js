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
exports.PackageManagerResolver = void 0;
const di_1 = require("@tsed/di");
const fs_1 = __importDefault(require("fs"));
const npm_1 = require("./npm");
const PackageManagerName_1 = require("./PackageManagerName");
const yarn_1 = require("./yarn");
const dictionary = {
    [PackageManagerName_1.PackageManagerName.Npm]: npm_1.NpmPackageManager,
    [PackageManagerName_1.PackageManagerName.Yarn]: yarn_1.YarnPackageManager
};
let PackageManagerResolver = class PackageManagerResolver {
    injectorService;
    constructor(injectorService) {
        this.injectorService = injectorService;
    }
    resolve(name) {
        name ??= fs_1.default.existsSync("yarn.lock") ? PackageManagerName_1.PackageManagerName.Yarn : PackageManagerName_1.PackageManagerName.Npm;
        const service = this.injectorService.get(dictionary[name]);
        if (!service) {
            throw new Error(`Unknown package manager "${name}"`);
        }
        return service;
    }
};
PackageManagerResolver = __decorate([
    (0, di_1.Injectable)(),
    __param(0, (0, di_1.Inject)())
], PackageManagerResolver);
exports.PackageManagerResolver = PackageManagerResolver;
