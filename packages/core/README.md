# baseline-guard-core

Shared core logic for Baseline Guard: types and feature checking utilities built on top of the official web-features dataset.

Install
- npm i baseline-guard-core

APIs
- Types: FeatureUsage, UnsupportedFeature, CheckResult
- Helpers: normalizeName(name), findFeatureKey(name), isBaselineSupported(baseline, year)
- checkFeatures(usages, baselineYear): returns support/unsupported report

Use cases
- Powering CLI scanners and IDE integrations
- ESLint rule implementation to flag non-Baseline features

Related packages
- baseline-guard-cli: command-line scanner for CI and local
- eslint-plugin-baseline-guard: ESLint rule to warn while coding

License
- MIT