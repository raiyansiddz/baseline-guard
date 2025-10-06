"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeName = normalizeName;
exports.findFeatureKey = findFeatureKey;
exports.isBaselineSupported = isBaselineSupported;
exports.checkFeatures = checkFeatures;
const web_features_1 = require("web-features");
function normalizeName(name) {
    let n = name.toLowerCase();
    n = n.replace(/[<>()]/g, "");
    n = n.replace(/[:.]/g, "-");
    n = n.replace(/^-+/, "");
    n = n.replace(/\s+/g, "-");
    if (n.includes("-has") || n.startsWith("has"))
        n = "has";
    n = n.replace(/^@/, "");
    return n;
}
function findFeatureKey(name) {
    const n = normalizeName(name);
    const keys = Object.keys(web_features_1.features);
    return keys.find((k) => k === n);
}
function isBaselineSupported(baseline, year) {
    if (baseline === true || baseline === "high")
        return true;
    if (baseline === false)
        return false;
    if (baseline === "low")
        return false;
    if (typeof baseline === "number")
        return baseline <= year;
    return false;
}
function checkFeatures(usages, baselineYear) {
    const unsupported = [];
    let supportedCount = 0;
    const unsupportedSeen = new Set();
    const supportedSeen = new Set();
    for (const u of usages) {
        const key = findFeatureKey(u.name);
        if (!key)
            continue;
        const feature = web_features_1.features[key];
        const baseline = feature?.status?.baseline;
        const isSupported = isBaselineSupported(baseline, baselineYear);
        const uniqueKey = `${u.file}:${u.line}:${key}`;
        if (isSupported) {
            if (!supportedSeen.has(uniqueKey)) {
                supportedSeen.add(uniqueKey);
                supportedCount++;
            }
        }
        else {
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
