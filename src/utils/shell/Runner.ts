import { Injectable } from "@tsed/di";
import { spawn } from "child_process";

@Injectable()
export class Runner {
  run(command: string, ...args: Array<string>): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let hasError = false;
      let data = "";
      const handler = spawn(command, args);
      handler.stdout.on("data", (chunk) => {
        data += chunk;
        console.log(chunk.toString());
      });
      handler.stderr.on("data", (data) => {
        hasError = true;
        console.error(data.toString());
      });
      handler.on("close", () => (hasError ? reject() : resolve(data)));
    });
  }
}
