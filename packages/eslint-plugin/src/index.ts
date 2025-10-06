import type { Rule } from "eslint";
import { features } from "web-features";

import { normalizeName, findFeatureKey, isBaselineSupported } from "baseline-guard-core";

const rule: Rule.RuleModule = {
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
  create(context: Rule.RuleContext) {
    const options = (context.options && context.options[0]) || {};
    const baselineYear = typeof (options as any).baseline === "number" ? (options as any).baseline : 2025;

    const reported = new Set<string>();

    function reportIfNonBaseline(rawName: string, node: any) {
      const key = findFeatureKey(rawName);
      if (!key) return;
      const feature: any = (features as any)[key];
      const baseline = feature?.status?.baseline;
      if (isBaselineSupported(baseline, baselineYear)) return;
      const line = node.loc?.start?.line || 0;
      const unique = `${context.getFilename()}:${line}:${key}`;
      if (reported.has(unique)) return;
      reported.add(unique);
      context.report({ node, message: `⚠️ '${feature?.name || rawName}' not in Baseline ${baselineYear}` });
    }

    function isLowercaseHtmlTag(name: string): boolean {
      return !!name && name === name.toLowerCase() && /^[a-z][a-z0-9-]*$/.test(name);
    }

    return {
      MemberExpression(node: any) {
        const objectName = node.object?.name;
        const property: any = node.property;
        const propName = property?.name ?? property?.value;
        const combined = objectName && propName ? `${objectName}.${propName}` : undefined;
        if (combined) reportIfNonBaseline(combined, node);
      },
      NewExpression(node: any) {
        const callee: any = node.callee;
        if (callee?.type === "Identifier" && typeof callee.name === "string") {
          reportIfNonBaseline(callee.name, node);
        } else if (callee?.type === "MemberExpression") {
          const objectName = (callee as any).object?.name;
          const property: any = (callee as any).property;
          const propName = property?.name ?? property?.value;
          const combined = objectName && propName ? `${objectName}.${propName}` : undefined;
          if (combined) reportIfNonBaseline(combined, node);
        }
      },
      JSXOpeningElement(node: any) {
        const nameNode: any = node.name;
        const name = nameNode?.name;
        if (typeof name === "string" && isLowercaseHtmlTag(name)) {
          reportIfNonBaseline(name, node);
        }
      },
      JSXAttribute(node: any) {
        const nameNode: any = node.name;
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

export const rules = {
  "no-non-baseline": rule,
};