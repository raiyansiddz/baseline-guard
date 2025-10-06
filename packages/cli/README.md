# baseline-guard-cli

Scan your codebase for non-Baseline web features using the official web-features dataset.

Install
- npm i -g baseline-guard-cli
- Or per-project: npm i -D baseline-guard-cli

Quick start
- baseline-guard "src" --baseline 2025
- baseline-guard "src/**/*.ts" --format json | jq

Usage
- baseline-guard <paths...> [options]
- Options:
  - -f, --format <format>    output format: text|json (default: text)
  - -b, --baseline <year>    Baseline year threshold (default: 2025)
  - -i, --ignore <globs...>  Globs to ignore from scanning

Examples
- Text output:
  - baseline-guard "src" -b 2024
- JSON for CI:
  - baseline-guard "src" --format json > baseline-report.json
- Multiple globs:
  - baseline-guard "src" "lib" -i "**/dist/**" "**/*.test.ts"
- CSS/HTML scanning:
  - baseline-guard "public" "styles" -b 2025

Exit codes
- 0: All features are Baseline-compatible
- 1: Unsupported features found

What’s included
- Scans JS/TS/JSX/TSX, CSS, and HTML
- Deduplicated findings, human-readable output
- Built for CI and local workflows

Related packages
- baseline-guard-core: shared logic and feature checking APIs
- eslint-plugin-baseline-guard: ESLint rule to warn while coding

Contributing
- Issues and PRs welcome on GitHub

License
- MIT