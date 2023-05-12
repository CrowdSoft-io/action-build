import fs from "fs";
import { Context, ReleaseStage } from "../models";

export class InstallScriptBuilder {
  private readonly stages: Array<{
    readonly name: string;
    readonly filename: string;
    readonly actions: Array<string>;
  }> = [];

  constructor(private readonly context: Context) {}

  addStages(...stages: Array<ReleaseStage>): InstallScriptBuilder {
    stages.forEach(({ name, actions }) => {
      const slug = name.replace(/\s+/g, "_").replace(/\W+/g, "").toLowerCase() || Date.now();
      const filename = `${slug}.sh`;
      this.stages.push({ name, filename, actions });
    });
    return this;
  }

  extractReleaseArchive(): InstallScriptBuilder {
    return this.addStages({
      name: "Extract release archive",
      actions: [`tar -xzf '${this.context.remote.buildDir}/release.tar.gz' -C '${this.context.remote.releaseDir}'`]
    });
  }

  switchReleases(): InstallScriptBuilder {
    return this.addStages({
      name: "Switch release",
      actions: [
        `[[ ! -d '${this.context.remote.wwwRoot}' ]] && mkdir -p '${this.context.remote.wwwRoot}'`,
        `[[ -e '${this.context.remote.projectRoot}' ]] && rm '${this.context.remote.projectRoot}'`,
        `ln -s '${this.context.remote.releaseDir}' '${this.context.remote.projectRoot}'`
      ]
    });
  }

  removeOldReleases(): InstallScriptBuilder {
    return this.addStages({
      name: "Remove old releases",
      actions: [
        `releases=(\`find '${this.context.remote.releasesRoot}' -maxdepth 1 -type d | egrep -i '/[0-9]{6}-[0-9]{3}$' | sort\`)`,
        `n=$(expr \${#releases[@]} - ${this.context.remote.maxReleases})`,
        "for (( i=0; i<$n; i++ ))",
        "do",
        '    rm -rf "${releases[$i]}" && echo "Removed ${releases[$i]}"',
        "done"
      ]
    });
  }

  removeBuildArtifacts(): InstallScriptBuilder {
    return this.addStages({
      name: "Remove build artifacts",
      actions: [`rm -rf '${this.context.remote.buildDir}'`]
    });
  }

  async build(installFilename = "install.sh"): Promise<void> {
    this.stages.forEach((stage) =>
      fs.writeFileSync(`${this.context.local.buildBinDir}/${stage.filename}`, [`echo '${stage.name}'`, ...stage.actions].join("\n"))
    );

    fs.writeFileSync(
      `${this.context.local.buildBinDir}/${installFilename}`,
      ["set -e", "set -o pipefail", ...this.stages.map((stage) => `bash ${this.context.remote.buildBinDir}/${stage.filename}`)].join("\n")
    );
  }
}
