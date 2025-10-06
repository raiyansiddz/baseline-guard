"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const web_features_1 = require("web-features");
const baseline_guard_core_1 = require("baseline-guard-core");
const rule = {
    meta: {
        type: "problem",
        docs: {
            description: "Warn if a feature is not part of Baseline by year",
            recommended: false,
        },
        schema: [
            {
                type: "object",
                properties: {
                    baseline: { type: "number" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = (context.options && context.options[0]) || {};
        const baselineYear = typeof options.baseline === "number" ? options.baseline : 2025;
        const reported = new Set();
        function reportIfNonBaseline(rawName, node) {
            const key = (0, baseline_guard_core_1.findFeatureKey)(rawName);
            if (!key)
                return;
            const feature = web_features_1.features[key];
            const baseline = feature?.status?.baseline;
            if ((0, baseline_guard_core_1.isBaselineSupported)(baseline, baselineYear))
                return;
            const line = node.loc?.start?.line || 0;
            const unique = `${context.getFilename()}:${line}:${key}`;
            if (reported.has(unique))
                return;
            reported.add(unique);
            context.report({ node, message: `⚠️ '${feature?.name || rawName}' not in Baseline ${baselineYear}` });
        }
        function isLowercaseHtmlTag(name) {
            return !!name && name === name.toLowerCase() && /^[a-z][a-z0-9-]*$/.test(name);
        }
        return {
            MemberExpression(node) {
                const objectName = node.object?.name;
                const property = node.property;
                const propName = property?.name ?? property?.value;
                const combined = objectName && propName ? `${objectName}.${propName}` : undefined;
                if (combined)
                    reportIfNonBaseline(combined, node);
            },
            NewExpression(node) {
                const callee = node.callee;
                if (callee?.type === "Identifier" && typeof callee.name === "string") {
                    reportIfNonBaseline(callee.name, node);
                }
                else if (callee?.type === "MemberExpression") {
                    const objectName = callee.object?.name;
                    const property = callee.property;
                    const propName = property?.name ?? property?.value;
                    const combined = objectName && propName ? `${objectName}.${propName}` : undefined;
                    if (combined)
                        reportIfNonBaseline(combined, node);
                }
            },
            JSXOpeningElement(node) {
                const nameNode = node.name;
                const name = nameNode?.name;
                if (typeof name === "string" && isLowercaseHtmlTag(name)) {
                    reportIfNonBaseline(name, node);
                }
            },
            JSXAttribute(node) {
                const nameNode = node.name;
                const name = nameNode?.name;
                if (typeof name === "string") {
                    // Only check known HTML attributes that map to features to reduce noise
                    if (name === "inert" || name === "popover") {
                        reportIfNonBaseline(name, node);
                    }
                }
            },
            // Removed generic Identifier reporting to avoid false positives like array 'push'
        };
    },
};
exports.rules = {
    "no-non-baseline": rule,
};
