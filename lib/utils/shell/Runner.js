"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
const di_1 = require("@tsed/di");
const child_process_1 = require("child_process");
let Runner = class Runner {
    run(command, ...args) {
        return new Promise((resolve, reject) => {
            let hasError = false;
            let data = "";
            const handler = (0, child_process_1.spawn)(command, args);
            handler.stdout.on("data", (chunk) => {
                data += chunk;
                console.log(chunk);
            });
            handler.stderr.on("data", (data) => {
                hasError = true;
                console.error(data);
            });
            handler.on("close", () => (hasError ? reject() : resolve(data)));
        });
    }
};
Runner = __decorate([
    (0, di_1.Injectable)()
], Runner);
exports.Runner = Runner;
