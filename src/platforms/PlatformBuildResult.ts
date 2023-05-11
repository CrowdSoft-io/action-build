import { ReleaseStage } from "../models";

export interface PlatformBuildResult {
  readonly files: Array<string>;
  readonly preRelease: Array<ReleaseStage>;
  readonly postRelease: Array<ReleaseStage>;
}
