import type { CheckResult, FeatureUsage } from "baseline-guard-core";
import { checkFeatures as coreCheckFeatures } from "baseline-guard-core";

export function checkFeatures(usages: FeatureUsage[], baselineYear: number): CheckResult {
  return coreCheckFeatures(usages, baselineYear);
}