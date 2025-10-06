import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import fs from "fs";
import path from "path";
import { glob } from "glob";
import type { FeatureUsage } from "baseline-guard-core";
import { features } from "web-features";

const JS_TS_EXT = [".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs"];
const CSS_EXT = [".css", ".scss", ".less"];
const HTML_EXT = [".html", ".htm"];

function getRegexesForKey(key: string, kind: "css" | "html"): RegExp[] {
  const parts = key.split("-");
  const last = parts[parts.length - 1];
  const joiner = kind === "css" ? "[\\-\\s]" : "[\\-\\s]";
  const patterns: RegExp[] = [];
  patterns.push(new RegExp(`\\b${last}\\b`, "gi"));
  patterns.push(new RegExp(parts.join(joiner), "gi"));
  if (kind === "css") {
    if (last === "has") patterns.push(/\:has\(/gi);
    if (key.includes("property")) patterns.push(/@property\b/gi);
    if (key.includes("scope")) patterns.push(/@scope\b/gi);
    if (key.includes("container")) patterns.push(/@container\b/gi);
    if (key.includes("layer")) patterns.push(/@layer\b/gi);
  }
  if (kind === "html") {
    if (last === "dialog") patterns.push(/<dialog\b/gi);
    if (last === "popover") patterns.push(/\bpopover\b/gi);
    if (last === "inert") patterns.push(/\binert\b/gi);
  }
  return patterns;
}

function listFiles(patterns: string[], ignoreGlobs: string[] = []): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const files = new Set<string>();
      for (const p of patterns) {
        let toGlob = p;
        try {
          if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
            toGlob = path.join(p, "**/*.{js,ts,jsx,tsx,css,scss,less,html,htm}");
          }
        } catch (_) {}
        const matches = await glob(toGlob, { nodir: true, ignore: ["**/node_modules/**", "**/dist/**", ...ignoreGlobs] });
        matches.forEach((m: string) => files.add(m));
      }
      resolve(Array.from(files));
    } catch (e) {
      reject(e);
    }
  });
}

export async function scanPaths(patterns: string[], ignoreGlobs: string[] = []): Promise<FeatureUsage[]> {
  const files = await listFiles(patterns.map((p) => p), ignoreGlobs);
  const usages: FeatureUsage[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (JS_TS_EXT.includes(ext)) {
      const text = fs.readFileSync(file, "utf8");
      const ast = parse(text, { sourceType: "unambiguous", plugins: ["typescript", "jsx"] });
      traverse(ast, {
        MemberExpression(pathNode: any) {
          const objectName = (pathNode.node as any).object?.name;
          const property: any = (pathNode.node as any).property;
          const propName = property?.name ?? property?.value;
          const combined = objectName && propName ? `${objectName}.${propName}` : undefined;
          const loc = pathNode.node.loc;
          if (combined) {
            usages.push({ file, line: loc?.start.line || 1, column: loc?.start.column || 0, name: combined, kind: "member" });
          }
        },
        NewExpression(pathNode: any) {
          const callee: any = pathNode.node.callee;
          const loc = pathNode.node.loc;
          if (callee?.type === "Identifier" && typeof callee.name === "string") {
            usages.push({ file, line: loc?.start.line || 1, column: loc?.start.column || 0, name: callee.name, kind: "identifier" });
          } else if (callee?.type === "MemberExpression") {
            const objectName = (callee as any).object?.name;
            const property: any = (callee as any).property;
            const propName = property?.name ?? property?.value;
            const combined = objectName && propName ? `${objectName}.${propName}` : undefined;
            if (combined) {
              usages.push({ file, line: loc?.start.line || 1, column: loc?.start.column || 0, name: combined, kind: "member" });
            }
          }
        },
        JSXOpeningElement(pathNode: any) {
          const nameNode: any = pathNode.node.name;
          const name = nameNode?.name;
          const loc = pathNode.node.loc;
          if (typeof name === "string") {
            usages.push({ file, line: loc?.start.line || 1, column: loc?.start.column || 0, name, kind: "identifier" });
          }
        },
        JSXAttribute(pathNode: any) {
          const nameNode: any = pathNode.node.name;
          const name = nameNode?.name;
          const loc = pathNode.node.loc;
          if (typeof name === "string") {
            usages.push({ file, line: loc?.start.line || 1, column: loc?.start.column || 0, name, kind: "identifier" });
          }
        },
      });
      const importAttrRegex = /import\s*\([^)]*\{[^}]*with\s*:/g;
      let iaMatch: RegExpExecArray | null;
      while ((iaMatch = importAttrRegex.exec(text))) {
        const line = text.substring(0, iaMatch.index).split("\n").length;
        const col = iaMatch.index - text.lastIndexOf("\n", iaMatch.index) - 1;
        usages.push({ file, line, column: col, name: "css-import-attributes", kind: "identifier" });
      }
    } else if (CSS_EXT.includes(ext)) {
      const text = fs.readFileSync(file, "utf8");
      const cssRegexes = [/\:has\(/g, /@property\b/g, /@scope\b/g, /@container\b/g, /@layer\b/g, /color-mix\(/g, /\:is\(/g, /\:where\(/g];
      for (const regex of cssRegexes) {
        let match: RegExpExecArray | null;
        while ((match = regex.exec(text))) {
          const line = text.substring(0, match.index).split("\n").length;
          const col = match.index - text.lastIndexOf("\n", match.index) - 1;
          usages.push({ file, line, column: col, name: match[0], kind: "css" });
        }
      }
    } else if (HTML_EXT.includes(ext)) {
      const text = fs.readFileSync(file, "utf8");
      const htmlRegexes = [/\bdialog\b/g, /\bpopover\b/g, /\binert\b/g];
      for (const regex of htmlRegexes) {
        let match: RegExpExecArray | null;
        while ((match = regex.exec(text))) {
          const line = text.substring(0, match.index).split("\n").length;
          const col = match.index - text.lastIndexOf("\n", match.index) - 1;
          usages.push({ file, line, column: col, name: match[0], kind: "html" });
        }
      }
    }
  }

  const deduped: FeatureUsage[] = [];
  const seen = new Set<string>();
  for (const u of usages) {
    const key = `${u.file}:${u.line}:${u.column}:${u.name}:${u.kind}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(u);
    }
  }

  return deduped;
}