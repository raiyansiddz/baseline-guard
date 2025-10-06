import { features } from "web-features";

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

export function normalizeName(name: string): string {
  let n = name.toLowerCase();
  n = n.replace(/[<>()]/g, "");
  n = n.replace(/[:.]/g, "-");
  n = n.replace(/^-+/, "");
  n = n.replace(/\s+/g, "-");
  if (n.includes("-has") || n.startsWith("has")) n = "has";
  n = n.replace(/^@/, "");
  return n;
}

export function findFeatureKey(name: string): string | undefined {
  const n = normalizeName(name);
  const keys = Object.keys(features);
  return keys.find((k) => k === n);
}

export function isBaselineSupported(baseline: any, year: number): boolean {
  if (baseline === true || baseline === "high") return true;
  if (baseline === false) return false;
  if (baseline === "low") return false;
  if (typeof baseline === "number") return baseline <= year;
  return false;
}

export function checkFeatures(usages: FeatureUsage[], baselineYear: number): CheckResult {
  const unsupported: UnsupportedFeature[] = [];
  let supportedCount = 0;

  const unsupportedSeen = new Set<string>();
  const supportedSeen = new Set<string>();

  for (const u of usages) {
    const key = findFeatureKey(u.name);
    if (!key) continue;
    const feature: any = (features as any)[key];
    const baseline = feature?.status?.baseline;
    const isSupported = isBaselineSupported(baseline, baselineYear);
    const uniqueKey = `${u.file}:${u.line}:${key}`;

    if (isSupported) {
      if (!supportedSeen.has(uniqueKey)) {
        supportedSeen.add(uniqueKey);
        supportedCount++;
      }
    } else {
      if (!unsupportedSeen.has(uniqueKey)) {
        unsupportedSeen.add(uniqueKey);
        unsupported.push({
          featureKey: key,
          featureName: feature?.name || key,
          baseline: baseline,
          file: u.file,
          line: u.line,
          column: u.column,
        });
      }
    }
  }

  return {
    checkedCount: usages.length,
    supportedCount,
    unsupported,
  };
}