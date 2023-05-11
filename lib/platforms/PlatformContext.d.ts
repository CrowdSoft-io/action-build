import { Context } from "@actions/github/lib/context";
export interface PlatformContext {
    readonly version: string;
    readonly buildDir: string;
    readonly github: Context;
}
