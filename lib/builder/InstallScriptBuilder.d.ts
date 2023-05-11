import { Context, ReleaseStage } from "../models";
export declare class InstallScriptBuilder {
    private readonly context;
    private readonly stages;
    constructor(context: Context);
    addStages(...stages: Array<ReleaseStage>): InstallScriptBuilder;
    extractReleaseArchive(): InstallScriptBuilder;
    switchReleases(): InstallScriptBuilder;
    removeOldReleases(): InstallScriptBuilder;
    removeBuildArtifacts(): InstallScriptBuilder;
    build(buildBinDir: string, filename?: string): Promise<void>;
}
