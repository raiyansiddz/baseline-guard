# eslint-plugin-baseline-guard

ESLint plugin that warns when code uses web platform features that aren’t part of the Baseline by your chosen year.

Install
- npm i -D eslint eslint-plugin-baseline-guard

Configure
- .eslintrc.js:
  - module.exports = {
    - plugins: ["baseline-guard"],
    - rules: {
      - "baseline-guard/no-non-baseline": ["warn", { baseline: 2025 }]
    - }
  - }

Examples
- Warn when using pre-Baseline features:
  - document.body.style.has
  - :has(
  - <dialog>
  - inert
- Adjust the year to match your target support: { baseline: 2024 }

How it works
- Uses web-features data to map identifiers/members/tags/attrs to features
- Compares Baseline status to your configured year

Related packages
- baseline-guard-core: shared logic and APIs
- baseline-guard-cli: command-line scanner for CI and local

License
- MIT