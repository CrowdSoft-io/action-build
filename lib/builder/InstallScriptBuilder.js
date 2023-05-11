"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallScriptBuilder = void 0;
const fs_1 = __importDefault(require("fs"));
class InstallScriptBuilder {
    context;
    stages = [];
    constructor(context) {
        this.context = context;
    }
    addStages(...stages) {
        stages.forEach(({ name, actions }) => {
            const slug = name.replace(/s+/g, "_").replace(/\W+/g, "").toLowerCase() || Date.now();
            const filename = `${slug}.sh`;
            this.stages.push({ name, filename, actions });
        });
        return this;
    }
    extractReleaseArchive() {
        return this.addStages({
            name: "Extract release archive",
            actions: [`tar -xzf '${this.context.remote.buildDir}/release.tar.gz' -C '${this.context.remote.releaseDir}'`]
        });
    }
    switchReleases() {
        return this.addStages({
            name: "Switch release",
            actions: [
                `[[ ! -d '${this.context.remote.wwwRoot}' ]] && mkdir -p '${this.context.remote.wwwRoot}'`,
                `[[ -e '${this.context.remote.projectRoot}' ]] && rm '${this.context.remote.projectRoot}'`,
                `ln -s '${this.context.remote.releaseDir}' '${this.context.remote.projectRoot}'`
            ]
        });
    }
    removeOldReleases() {
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
    removeBuildArtifacts() {
        return this.addStages({
            name: "Remove build artifacts",
            actions: [`rm -rf '${this.context.remote.buildDir}'`]
        });
    }
    async build(buildBinDir, filename = "install.sh") {
        this.stages.forEach((stage) => fs_1.default.writeFileSync(`${buildBinDir}/${stage.filename}.sh`, [`echo '${stage.name}'`, ...stage.actions].join("\n")));
        fs_1.default.writeFileSync(`${buildBinDir}/${filename}`, ["set -e", "set -o pipefail", ...this.stages.map(({ filename }) => `bash ${buildBinDir}/${filename}.sh`)].join("\n"));
    }
}
exports.InstallScriptBuilder = InstallScriptBuilder;
