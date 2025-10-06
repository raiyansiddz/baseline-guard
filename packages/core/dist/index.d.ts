export type UsageKind = "identifier" | "member" | "css" | "html";
export interface FeatureUsage {
    file: string;
    line: number;
    column: number;
    name: string;
    kind: UsageKind;
}
export interface UnsupportedFeature {
    featureKey: string;
    featureName: string;
    baseline?: string | boolean | number;
    file: string;
    line: number;
    column: number;
}
export interface CheckResult {
    checkedCount: number;
    supportedCount: number;
    unsupported: UnsupportedFeature[];
}
export declare function normalizeName(name: string): string;
export declare function findFeatureKey(name: string): string | undefined;
export declare function isBaselineSupported(baseline: any, year: number): boolean;
export declare function checkFeatures(usages: FeatureUsage[], baselineYear: number): CheckResult;
