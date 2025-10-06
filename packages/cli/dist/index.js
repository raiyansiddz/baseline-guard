#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const scanner_1 = require("./scanner");
const checker_1 = require("./checker");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name("baseline-guard")
    .description("Scan codebase for non-Baseline web features")
    .version("1.0.1")
    .argument("<paths...>", "Paths or globs to scan")
    .option("-f, --format <format>", "output format: text|json", "text")
    .option("-b, --baseline <year>", "Baseline year threshold", "2025")
    .option("-i, --ignore <globs...>", "Globs to ignore from scanning", [])
    .action(async (paths, options) => {
    const year = parseInt(options.baseline, 10) || 2025;
    const ignores = Array.isArray(options.ignore) ? options.ignore : [];
    const usages = await (0, scanner_1.scanPaths)(paths, ignores);
    const result = (0, checker_1.checkFeatures)(usages, year);
    if (options.format === "json") {
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.unsupported.length ? 1 : 0);
    }
    if (result.unsupported.length === 0) {
        console.log(chalk_1.default.green("✅ All features are Baseline compatible."));
        console.log(chalk_1.default.gray(`Checked ${result.checkedCount} feature references.`));
        process.exit(0);
    }
    else {
        console.log(chalk_1.default.red("❌ Unsupported features found:"));
        for (const item of result.unsupported) {
            console.log(`${chalk_1.default.yellow("- ")}${chalk_1.default.bold(item.featureName)} ${chalk_1.default.gray("(Baseline:")} ${chalk_1.default.cyan(String(item.baseline ?? "none"))}${chalk_1.default.gray(")")} ${chalk_1.default.gray("→ ")} ${item.file}:${item.line}`);
        }
        console.log(chalk_1.default.gray(`✅ ${result.supportedCount} references verified as Baseline ${year} compatible.`));
        process.exit(1);
    }
});
program.parse(process.argv);
