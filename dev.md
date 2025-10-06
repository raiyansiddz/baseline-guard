⚙️ PART 1: What to Build (Full Roadmap + Folder Plan)

Here’s your complete architecture (all components):

baseline-guard/
├── src/                      # Core CLI logic
│   ├── index.ts              # CLI entry
│   ├── scanner.ts            # Detect feature usage
│   ├── checker.ts            # Check Baseline support
│   └── utils.ts              # Helpers
│
├── eslint-plugin-baseline-guard/
│   └── index.js              # ESLint plugin (real-time feedback)
│
├── .github/
│   └── workflows/
│       └── baseline.yml      # CI/CD integration
│
├── README.md
├── package.json
└── tsconfig.json

🧠 1️⃣ Core CLI Tool

Scans code → detects unsupported APIs → warns in terminal.
You already have the blueprint (scanner.ts + checker.ts + index.ts).

💡 2️⃣ ESLint Plugin

Instant warnings in editor or CI.
eslint-plugin-baseline-guard/index.js:

const { features } = require("web-features");

module.exports.rules = {
  "no-non-baseline": {
    meta: { type: "problem" },
    create(context) {
      return {
        Identifier(node) {
          const name = node.name.toLowerCase();
          const key = Object.keys(features).find(k => k.includes(name));
          if (key && (!features[key].status.baseline || features[key].status.baseline > 2024)) {
            context.report({
              node,
              message: `⚠️ '${name}' not in Baseline 2024 (baseline: ${features[key].status.baseline})`,
            });
          }
        }
      }
    }
  }
};

☁️ 3️⃣ GitHub Action

.github/workflows/baseline.yml:

name: Baseline Guard
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx baseline-guard ./src

🧭 PART 2: Prompt for Developer (for AI or teammate)

If you want a developer or AI teammate to build this cleanly,
copy-paste this prompt 👇

🧑‍💻 PRO DEV PROMPT

Prompt:

You are a senior TypeScript + Node.js developer.
Build a full project named Baseline Guard, a professional-grade developer tool that:

Scans JS/TS/CSS/HTML code and detects usage of unsupported web platform features using the official web-features dataset.

Has a CLI tool (baseline-guard) that can be run in terminal to check for unsupported features and output colorized reports.

Has an ESLint plugin that shows inline warnings during code editing.

Includes a GitHub Action for CI/CD to automatically fail builds with unsupported features.

Requirements:

Codebase in TypeScript.

Use libraries: web-features, @babel/parser, @babel/traverse, chalk, glob, commander.

Modular, clean architecture with comments and type definitions.

Include tests for core logic.

Prepare a README.md explaining setup, CLI usage, ESLint setup.

Add logo & icons for branding.

Optimize performance for scanning large codebases.

Deliverables:

Full folder structure

Working TypeScript code for CLI and ESLint plugin

GitHub Action YAML

README.md and demo instructions

Example project for testing

The goal is to make this hackathon-winning quality — clean, modern, innovative, and easy to demo live.
Assume judges will test it visually, so ensure outputs are clear and visually appealing.

🏆 Final Tips for 100% Selection Probability

Theme Fit: Pitch it as “AI/DevTools for Web Reliability” — perfect for dev-focused hackathons.

Demo Flow:

Show CLI

Show ESLint warning

Show CI fail → fix → pass

Design & Branding:

Use minimal logo (maybe a shield 🛡️ or guard icon).

Add dark terminal theme in demo for style.

Bonus:
Add a small dashboard report (like HTML or Markdown summary) — judges love visuals.

Pitch Line:
“Baseline Guard eliminates the guesswork in web compatibility — ensuring every feature you ship is safe, everywhere.”

# 🛡️ Baseline Guard — Product Requirements Document (PRD)

## 📘 Overview

**Baseline Guard** is a developer tool that automatically detects when web developers use features (HTML/CSS/JS APIs) that are **not yet supported in the Baseline standard** — ensuring production reliability and forward compatibility.

The project provides:
1. A **CLI tool** for quick codebase scans.
2. An **ESLint plugin** for live linting feedback.
3. A **GitHub Action** for CI/CD enforcement.

---

## 🎯 Product Vision

Enable every web developer to write **future-proof**, **cross-browser-safe** code without having to manually check compatibility charts.

Baseline Guard acts as an **intelligent layer of defense** between experimental web APIs and production deployment.

---

## 💡 Key Objectives

| Objective | Description | KPI |
|------------|--------------|-----|
| Prevent unsupported feature usage | Detect when a developer uses features not part of Baseline 2024+ | 95% detection accuracy |
| Improve developer confidence | Warn in IDE and CLI | Reduce compatibility bugs by 80% |
| Automate compatibility checks | Integrate into CI/CD | 100% automated enforcement |
| Enhance developer experience | Provide easy CLI + ESLint plugin | < 5 min setup time |

---

## 🧭 User Flow Overview

### 1️⃣ Developer Setup Flow

**Actors:** Web Developer  
**Goal:** Set up Baseline Guard and ensure project uses Baseline-supported features only.

**Steps:**
1. Developer installs Baseline Guard:
   ```bash
   npm install -g baseline-guard
   ```

Runs first scan:

baseline-guard ./src

CLI outputs:

✅ All features safe, or

❌ List of unsupported APIs with details.

Developer integrates ESLint plugin:

{
  "plugins": ["baseline-guard"],
  "rules": { "baseline-guard/no-non-baseline": "warn" }
}

Optional: Enable GitHub Action for automatic PR checks.

2️⃣ CLI Tool Flow

Trigger: Developer runs CLI manually or via CI
Process Flow:

Codebase Scan → Extract Feature Usage → Map to web-features Data → Check Baseline Status → Output Report

Expected Output Example:

❌ Unsupported features found:
 - CSS.hasSelector (Baseline: 2025)
 - Intl.Segmenter (Baseline: 2025)

✅ 94 features verified as Baseline 2024 compatible.

3️⃣ ESLint Plugin Flow

Trigger: Developer writes or saves file in editor.
Behavior:

Plugin scans syntax tree for identifiers and web APIs.

Matches them with Baseline data from web-features.

Displays inline warning:

⚠️ Intl.Segmenter not part of Baseline 2024 (Baseline: 2025)

Result: Instant awareness while coding.

4️⃣ CI/CD Flow

Trigger: PR or commit pushed to repo.
Behavior:

GitHub Action executes:

- run: npx baseline-guard ./src

If unsupported features found → CI fails with red ❌.

Otherwise, green ✅ "Baseline check passed."

Result:
Automatic gatekeeper before merging non-compliant code.

🧩 System Architecture
            ┌────────────────────────┐
            │    web-features API    │
            └──────────┬─────────────┘
                       │
            ┌──────────▼───────────┐
            │  Baseline Guard CLI  │
            │  (scanner + checker) │
            └──────────┬───────────┘
                       │
         ┌─────────────┼────────────────┐
         │              │                │
┌────────▼───────┐ ┌────▼─────────┐ ┌────▼────────────┐
│ ESLint Plugin  │ │              │ │ GitHub Action   │
│ (Inline warn)  │ │              │ │ (CI Validation) │
└────────────────┘ └──────────────┘ └─────────────────┘

👤 User Stories
ID	As a...	I want to...	So that...	Acceptance Criteria
US-01	Developer	Scan my code for unsupported web features	I can fix compatibility issues early	CLI detects unsupported features with Baseline version
US-02	Developer	See real-time warnings in my editor	I don’t use unsupported APIs unknowingly	ESLint plugin highlights unsupported APIs
US-03	Developer	Integrate a Baseline check in my CI/CD	My builds fail if unsupported features are used	GitHub Action fails PRs using unsupported APIs
US-04	Tech Lead	Get a summary report of compliance	I can monitor readiness across teams	CLI outputs summary + counts of violations
US-05	Beginner	Quickly understand warnings	I can learn why something is unsupported	ESLint messages include explanation & version info
⚙️ Functional Requirements
#	Feature	Description	Priority
FR-1	Code Scanner	Parse JS/TS/HTML/CSS using Babel/PostCSS	High
FR-2	Baseline Checker	Compare extracted features with web-features dataset	High
FR-3	CLI Interface	Simple terminal command with color-coded output	High
FR-4	ESLint Integration	Real-time lint warnings	Medium
FR-6	CI/CD Integration	GitHub Action for automation	Medium
FR-7	Report Generator	Generate Markdown or JSON summary	Low
FR-8	Config File Support	.baselineguardrc for customization	Low
🧪 Expected Results
Scenario	Input	Expected Result
CLI Scan Success	All features supported	✅ “All features are Baseline 2024 compatible.”
CLI Scan Warning	One unsupported API	❌ “Intl.Segmenter (Baseline: 2025)”
ESLint Run	Code with CSS.has()	Editor shows inline warning
CI/CD Run	PR includes unsupported feature	Action fails with red ❌
CI/CD Run	All safe	CI passes with ✅
📊 Metrics for Success
Metric	Target
CLI Accuracy	≥ 95% correct feature detection
Setup Time	≤ 5 minutes
Lint Latency	< 100ms
CI Integration Success	100% automated run
User Satisfaction (survey)	≥ 8/10
🔮 Future Enhancements

AI-powered fallback suggestions.

Browser-based visualization dashboard.

Support for framework-specific feature detection (React/Vue/Svelte).

Integration with Can I Use API for deeper insights.

Configurable Baseline year threshold.

🏁 Outcome

By implementing Baseline Guard, developers can:

Ship safer web apps without compatibility risks.

Automate compatibility validation at every stage.

Boost confidence in production readiness.

“Stop guessing. Start shipping.”

📎 Versioning & Delivery Milestones
Phase	Deliverable	ETA
Phase 1	Core CLI & Checker	Week 1
Phase 2	ESLint Plugin	Week 2
Phase 3	CI/CD Integration + Demo	Week 4
Phase 5	Hackathon Presentation	Week 5

Author: Raiyan
Project: Baseline Guard
Category: DevTools / Web Compatibility
Version: 1.0.0
License: MIT