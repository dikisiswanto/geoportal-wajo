const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const checks = [];
const check = (label, condition) => checks.push([label, Boolean(condition)]);

const clientFiles = [
  "components/GeoPortal.jsx",
  "components/geoportal/FeatureInspector.jsx",
  "components/geoportal/RegionComparisonPanel.jsx",
  "components/geoportal/search/MapSearchResults.jsx",
  "components/geoportal/LayerCatalog.jsx",
];
const staticSummaryImport = /from\s+["'][^"']*\/regionSummary(?:\.js)?["']/;
check(
  "Full region summary is not statically imported by client components",
  clientFiles.every((file) => !staticSummaryImport.test(read(file)))
);
check(
  "Region summary uses a deferred JSON loader",
  read("lib/geo/regionSummaryClient.js").includes('withAssetVersion("/region-summary.json")')
);
check(
  "Region name list stays small and separate",
  read("components/GeoPortal.jsx").includes('from "../lib/geo/regions"')
);
const searchResults = read("components/geoportal/search/MapSearchResults.jsx");
check(
  "Search index downloads/parsing are shared across query changes",
  searchResults.includes("let searchIndexPromise;") &&
    searchResults.includes("let regionSearchIndexPromise;") &&
    searchResults.includes("}, [shouldLoadIndexes]);")
);

const summaryPath = path.join(root, "public", "region-summary.json");
const searchRegionPath = path.join(root, "public", "region-search-index.json");
let summary = null;
let regionSearch = null;
try { summary = JSON.parse(fs.readFileSync(summaryPath, "utf8")); } catch {}
try { regionSearch = JSON.parse(fs.readFileSync(searchRegionPath, "utf8")); } catch {}
check("Deferred summary JSON contains 32 datasets", summary && Object.keys(summary).length === 32);
check("Compact region index contains 14 districts", regionSearch && regionSearch.regions?.length === 14);
check("Compact region index contains 190 villages", regionSearch && regionSearch.villages?.length === 190);
check(
  "Compact region index is under 20 KB",
  fs.existsSync(searchRegionPath) && fs.statSync(searchRegionPath).size < 20 * 1024
);

const geoPortal = read("components/GeoPortal.jsx");
const intro = read("components/GeoPortalIntro.jsx");
const sceneRuntime = read("components/geoportal/GeoPortalCinematicScene.js");
check(
  "Heavy cinematic scene is separated from lightweight intro component",
  intro.length < 12000 && !intro.includes("function buildScene(") &&
    intro.includes('import("./geoportal/GeoPortalCinematicScene")') &&
    sceneRuntime.includes("export { buildScene }")
);
check(
  "Detail panels are dynamically imported",
  geoPortal.includes('dynamic(() => import("./geoportal/FeatureInspector")') &&
    geoPortal.includes('dynamic(() => import("./geoportal/LayerInfoPanel")') &&
    geoPortal.includes('dynamic(() => import("./geoportal/RegionComparisonPanel")')
);
check(
  "Print legend is statically available before opening print preview",
  geoPortal.includes('import PrintLegend from "./geoportal/PrintLegend";') &&
    !geoPortal.includes('dynamic(() => import("./geoportal/PrintLegend")')
);
check(
  "Print legend stays mounted so print CSS can reveal it reliably",
  /<PrintLegend\s+[\s\S]*?printScale={printScale}\s*\/>/.test(geoPortal) &&
    !geoPortal.includes("printLegendMounted")
);
check(
  "Print waits for map preparation and two animation frames",
  geoPortal.includes("await mapApi.current?.preparePrint?.()") &&
    geoPortal.includes("window.requestAnimationFrame(() => {\n      window.requestAnimationFrame(() => window.print());")
);
check(
  "Startup navigation ref is accessed only after mount, not during render",
  geoPortal.includes("const startupNavigationRef = useRef(null);") &&
    geoPortal.includes("startupNavigationRef.current = getStartupNavigationState(window.location.search);") &&
    !geoPortal.includes("if (startupNavigationRef.current === null")
);
check(
  "Deep-link priority and camera effects remain in place",
  geoPortal.includes("getStartupNavigationState(window.location.search)") &&
    geoPortal.includes('navigation.priority !== "view"') &&
    geoPortal.includes('if (navigation.priority === "feature") return;') &&
    geoPortal.includes("setRequestedFeature(requestedFeatureParam)")
);
check(
  "Feature deep-link selection mounts its inspector panel",
  geoPortal.includes("setInspectorPanelMounted(true);") &&
    geoPortal.includes("startupVectorReady") &&
    geoPortal.includes("requestedFeature")
);
check(
  "Desktop map reserves catalog space before hydration settles",
  geoPortal.includes("!desktopLayoutReady") && geoPortal.includes("lg:grid-cols-[340px_minmax(0,1fr)]")
);
check(
  "Desktop catalog layout can release the reserved column when closed",
  geoPortal.includes('sidebarOpen || !desktopLayoutReady')
);

const sw = read("public/sw.js");
const shellBlock = sw.split("const APP_SHELL = [")[1]?.split("];", 1)[0] || "";
check("Cinematic textures do not block service-worker install", !shellBlock.includes("/intro/earth/"));
check("Cinematic textures are cached on demand", sw.includes('url.pathname.startsWith("/intro/earth/")'));
check("Legacy Three.js CDN loader file is absent", !fs.existsSync(path.join(root, "public", "vendor", "geoportal-three-loader.js")));

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} · ${label}`);
  if (!ok) failed += 1;
}
if (failed) {
  console.error(`\nPerformance validation failed: ${failed}/${checks.length} check(s).`);
  process.exit(1);
}
console.log(`\nPerformance validation passed: ${checks.length} checks.`);
