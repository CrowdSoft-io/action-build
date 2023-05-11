import { Context as GithubContext } from "@actions/github/lib/context";
import { InfrastructureManager } from "../infrastructure";
import { Result } from "../models";
import { PlatformResolver } from "../platforms";
import { Runner } from "../utils/shell";
import { BuilderOptions } from "./BuilderOptions";
export declare class Builder {
    private readonly infrastructureManager;
    private readonly platformResolver;
    private readonly runner;
    constructor(infrastructureManager: InfrastructureManager, platformResolver: PlatformResolver, runner: Runner);
    build(githubContext: GithubContext, options: BuilderOptions): Promise<Result>;
    private createPlatformContext;
}
