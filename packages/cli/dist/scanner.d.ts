import type { FeatureUsage } from "baseline-guard-core";
export declare function scanPaths(patterns: string[], ignoreGlobs?: string[]): Promise<FeatureUsage[]>;
