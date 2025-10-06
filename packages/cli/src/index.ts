#!/usr/bin/env node
import { Command } from "commander";
import { scanPaths } from "./scanner";
import { checkFeatures } from "./checker";
import chalk from "chalk";

const program = new Command();

program
  .name("baseline-guard")
  .description("Scan codebase for non-Baseline web features")
  .version("1.0.1")
  .argument("<paths...>", "Paths or globs to scan")
  .option("-f, --format <format>", "output format: text|json", "text")
  .option("-b, --baseline <year>", "Baseline year threshold", "2025")
  .option("-i, --ignore <globs...>", "Globs to ignore from scanning", [])
  .action(async (paths: string[], options: { format: "text" | "json"; baseline: string; ignore?: string[] }) => {
    const year = parseInt(options.baseline, 10) || 2025;
    const ignores = Array.isArray(options.ignore) ? options.ignore : [];
    const usages = await scanPaths(paths, ignores);
    const result = checkFeatures(usages, year);

    if (options.format === "json") {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.unsupported.length ? 1 : 0);
    }

    if (result.unsupported.length === 0) {
      console.log(chalk.green("✅ All features are Baseline compatible."));
      console.log(chalk.gray(`Checked ${result.checkedCount} feature references.`));
      process.exit(0);
    } else {
      console.log(chalk.red("❌ Unsupported features found:"));
      for (const item of result.unsupported) {
        console.log(
          `${chalk.yellow("- ")}${chalk.bold(item.featureName)} ${chalk.gray("(Baseline:")} ${chalk.cyan(String(item.baseline ?? "none"))}${chalk.gray(")")} ${chalk.gray("→ ")} ${item.file}:${item.line}`
        );
      }
      console.log(chalk.gray(`✅ ${result.supportedCount} references verified as Baseline ${year} compatible.`));
      process.exit(1);
    }
  });

program.parse(process.argv);