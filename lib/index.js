"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const di_1 = require("@tsed/di");
const builder_1 = require("./builder");
async function main() {
    const injector = new di_1.InjectorService();
    await injector.load();
    const builder = injector.get(builder_1.Builder);
    if (!builder) {
        throw new Error("Builder not configured");
    }
    const platform = core.getInput("platform");
    const user = core.getInput("user");
    const maxReleases = +core.getInput("max_releases");
    const infrastructureDir = core.getInput("infrastructure_dir");
    console.log(`Building "${platform}" started.`);
    const result = await builder.build(github.context, { platform, user, maxReleases, infrastructureDir });
    core.setOutput("version", result.version);
    core.setOutput("build_dir", result.buildDir);
    console.log(`Building "${platform}" version "${result.version}" finished.`);
    await injector.destroy();
}
main().catch((error) => core.setFailed(error.message));
