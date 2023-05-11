import { Context as GithubContext } from "@actions/github/lib/context";
export interface Context {
    readonly version: string;
    readonly branch: string;
    readonly local: {
        readonly buildDir: string;
        readonly buildBinDir: string;
        readonly infrastructureDir: string;
    };
    readonly remote: {
        readonly user: string;
        readonly wwwRoot: string;
        readonly projectRoot: string;
        readonly releasesRoot: string;
        readonly releaseDir: string;
        readonly buildDir: string;
        readonly supervisorGroup: string;
        readonly maxReleases: number;
    };
    readonly github: GithubContext;
}
