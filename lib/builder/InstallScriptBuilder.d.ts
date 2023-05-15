import { Context, ReleaseStage } from "../models";
export declare class InstallScriptBuilder {
    private readonly context;
    private readonly stages;
    constructor(context: Context);
    addStages(...stages: Array<ReleaseStage>): InstallScriptBuilder;
    createDirectories(): InstallScriptBuilder;
    extractReleaseArchive(): InstallScriptBuilder;
    switchReleases(): InstallScriptBuilder;
    removeOldReleases(): InstallScriptBuilder;
    removeBuildArtifacts(): InstallScriptBuilder;
    build(installFilename?: string): Promise<void>;
}
