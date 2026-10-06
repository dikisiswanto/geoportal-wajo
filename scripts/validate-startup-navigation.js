const cases = [
  ["default", "", "default"],
  ["share view", "?lat=-3.96586&lng=120.16121&zoom=10", "view"],
  ["share region", "?region=Tempe", "region"],
  ["feature", "?layer=puskesmas&feature=PUSKESMAS-01&lat=-3.9&lng=120.1&zoom=14", "feature"],
  ["feature wins region", "?layer=puskesmas&feature=PUSKESMAS-01&region=Tempe", "feature"],
  ["region wins view", "?region=Tempe&lat=-3.9&lng=120.1&zoom=14", "region"],
  ["feature wins view", "?layer=adm-desa&feature=DESA-01&lat=-3.9&lng=120.1&zoom=14", "feature"],
  ["invalid numeric view is default", "?lat=bad&lng=120.1&zoom=14", "default"],
  ["view without zoom is still view", "?lat=-3.9&lng=120.1", "view"],
  ["region whitespace", "?region=%20Tempe%20", "region"]
];

function getStartupNavigationState(search = "") {
  const params = new URLSearchParams(search || "");
  const layerId = String(params.get("layer") || "").trim();
  const feature = String(params.get("feature") || "").trim();
  const region = String(params.get("region") || "").trim();
  const latParam = String(params.get("lat") || "").trim();
  const lngParam = String(params.get("lng") || "").trim();
  const lat = latParam === "" ? NaN : Number(latParam);
  const lng = lngParam === "" ? NaN : Number(lngParam);
  const hasFeature = Boolean(layerId && feature);
  const hasRegion = Boolean(region);
  const hasView = latParam !== "" && lngParam !== "" && Number.isFinite(lat) && Number.isFinite(lng);
  return hasFeature ? "feature" : hasRegion ? "region" : hasView ? "view" : "default";
}

let failed = 0;
for (const [label, search, expected] of cases) {
  const actual = getStartupNavigationState(search);
  const ok = actual === expected;
  console.log(`${ok ? "PASS" : "FAIL"} · ${label} · ${actual}`);
  if (!ok) failed += 1;
}

if (failed) {
  console.error(`\nStartup navigation validation failed: ${failed} case(s).`);
  process.exit(1);
}

console.log(`\nStartup navigation validation passed: ${cases.length} cases.`);
