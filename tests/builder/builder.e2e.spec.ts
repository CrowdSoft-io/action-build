import { Context } from "@actions/github/lib/context";
import { InjectorService } from "@tsed/di";
import fs from "fs";
import { Builder, BuilderOptions } from "../../src/builder";
import { Runner } from "../../src/utils/shell";

jest.mock("fs");
jest.mock("../../src/utils/shell");

describe("Build e2e", () => {
  const githubContext: Context = {
    action: "",
    actor: "",
    apiUrl: "",
    eventName: "",
    graphqlUrl: "",
    job: "",
    payload: {
      repository: {
        name: "test-repo",
        owner: {
          login: "test"
        }
      }
    },
    ref: "",
    runId: 0,
    runNumber: 10,
    serverUrl: "",
    sha: "",
    workflow: "",
    get issue(): { owner: string; repo: string; number: number } {
      return { number: 0, owner: "", repo: "" };
    },
    get repo(): { owner: string; repo: string } {
      return { owner: "", repo: "" };
    }
  };
  const options: BuilderOptions = {
    platform: "next",
    user: "tester",
    maxReleases: 5,
    infrastructureDir: "infrastructure"
  };

  let injector: InjectorService;
  let builder: Builder;

  beforeAll(async () => {
    (Runner as any).mockImplementation(() => ({
      run: async (command: string, ...args: Array<string>) => {
        console.log(`[RUN] ${command} ${args.join(" ")}`);
        return "test";
      }
    }));

    (fs as any).mkdirSync = jest.fn().mockImplementation((path, options) => console.log(["[MKDIR]", path, options]));
    (fs as any).writeFileSync = jest.fn().mockImplementation((file, content) => console.log(["[WRITE]", file, content]));

    injector = new InjectorService();
    await injector.load();
  });

  afterAll(async () => {
    await injector.destroy();
  });

  beforeEach(() => {
    builder = injector.get(Builder) as any;
  });

  it("should be defined correctly", () => {
    expect(builder).toBeDefined();
    expect(builder).toBeInstanceOf(Builder);
  });

  it("action build works", async () => {
    const result = await builder.build(githubContext, options);
    expect(result.version).toEqual("000010");
  });
});
