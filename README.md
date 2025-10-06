# Baseline Guard Monorepo

Baseline Guard is a professional-grade developer tool that scans JS/TS/CSS/HTML code and flags usage of web platform features that are not part of the Baseline standard. It includes:
- CLI for scanning codebases
- ESLint plugin for inline warnings
- GitHub Action for CI enforcement

Monorepo packages:
- packages/cli — npm: baseline-guard-cli, binary: baseline-guard — CLI tool to scan for non-Baseline features
- packages/eslint-plugin — npm: eslint-plugin-baseline-guard — ESLint plugin providing inline warnings
- packages/core — npm: baseline-guard-core — Shared core logic

Setup
- Install dependencies: npm install
- Build all packages: npm run build

CLI Usage
- Install globally (after publish): npm i -g baseline-guard-cli
- Run scan: baseline-guard "./src" --baseline 2025 --format text
- Local dev (without global install): node packages/cli/dist/index.js "./src"
- Run without global install: npx -p baseline-guard-cli baseline-guard "./src"
- Options:
  - --format text|json (default: text)
  - --baseline <year> (default: 2025)
  - --ignore <glob...> globs to exclude from scanning
- Exit codes: 0 when all safe, 1 when unsupported features found

ESLint Plugin
- Install: npm i -D eslint-plugin-baseline-guard
- Package: eslint-plugin-baseline-guard
- Example .eslintrc:
  {
    "plugins": ["baseline-guard"],
    "rules": { "baseline-guard/no-non-baseline": ["warn", { "baseline": 2025 }] }
  }

Quick Start
- Install deps: npm install
- Build all: npm run build

ESLint — Instant Inline Warnings
- Install: npm i -D eslint-plugin-baseline-guard
- Configure:
  {
    "plugins": ["baseline-guard"],
    "rules": { "baseline-guard/no-non-baseline": ["warn", { "baseline": 2025 }] }
  }
- Run: npx eslint ./src

CLI — Scan in Terminal
- Global (after publish): npm i -g baseline-guard-cli
- Local dev: node packages/cli/dist/index.js "./src"
- Run without global install: npx -p baseline-guard-cli baseline-guard "./src"
- Run scan: baseline-guard "./src" --baseline 2025 --format text
- Or show help: baseline-guard -h
- Help output:
  - Usage: baseline-guard [options] <paths...>
  - Scan codebase for non-Baseline web features
  - Arguments:
    - paths                    Paths or globs to scan
  - Options:
    - -V, --version            output the version number
    - -f, --format <format>    output format: text|json (default: "text")
    - -b, --baseline <year>    Baseline year threshold (default: "2025")
    - -i, --ignore <globs...>  Globs to ignore from scanning (default: [])
    - -h, --help               display help for command
- Supported files auto-detected across JS/TS/CSS/HTML and common frameworks

GitHub Action — CI Enforcement
- Workflow: .github/workflows/baseline.yml
- It installs, builds, and runs the CLI:
  npx -p baseline-guard-cli baseline-guard ./src --baseline=2025 --format=text
- Customize paths and ignores as needed

Troubleshooting
- Ensure you opened files that match supported extensions above
- Rebuild if something seems stale: npm run build --workspaces

GitHub Action
- Workflow: .github/workflows/baseline.yml
- It installs, builds, and runs the CLI against your repo with Baseline 2025
- Customize the run command to your repo:
  - npx -p baseline-guard-cli baseline-guard ./src --baseline=2025 --format=text
  - Add multiple paths or use --ignore globs as needed

Publish Guide
Author & Contact
- Author: Raiyan Siddique
- Email: raiyansiddique1801@gmail.com
- Repo: https://github.com/raiyansiddz/baseline-guard

Publish
- npm (CLI): cd packages/cli && npm publish --access public
- npm (ESLint): cd packages/eslint-plugin && npm publish --access public
- npm (Core): cd packages/core && npm publish --access public

Notes
- Uses libraries: web-features, @babel/parser, @babel/traverse, chalk, glob, commander
- Written in TypeScript with modular architecture

License: MIT