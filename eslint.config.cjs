const path = require("path");
const baselineGuard = require(path.resolve(__dirname, "packages/eslint-plugin/dist/index.js"));
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  {
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
  {
    files: [
        "packages/cli/src/**/*.js"
      ],
    languageOptions: { ecmaVersion: 2022, sourceType: "module", parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { "baseline-guard": baselineGuard },
    rules: {
      "baseline-guard/no-non-baseline": ["warn", { baseline: 2025 }],
    },
  },
  {
    files: [
      "example/src/**/*.{js,jsx,ts,tsx}"
    ],
    languageOptions: { ecmaVersion: 2022, sourceType: "module", parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { "baseline-guard": baselineGuard },
    rules: {
      "baseline-guard/no-non-baseline": ["warn", { baseline: 2025 }],
    },
  },
  {
    files: [
      "packages/cli/src/**/*.{ts,tsx}",
      "packages/core/src/**/*.{ts,tsx}",
      "packages/eslint-plugin/src/**/*.{ts,tsx}"
    ],
    languageOptions: { ecmaVersion: 2022, sourceType: "module", parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { "baseline-guard": baselineGuard },
    rules: {
      "baseline-guard/no-non-baseline": ["warn", { baseline: 2025 }],
    },
  },
];