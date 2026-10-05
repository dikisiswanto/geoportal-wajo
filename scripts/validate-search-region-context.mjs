import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const regionPath = path.join(root, "lib", "geo", "region.js");
const geoPortalPath = path.join(root, "components", "GeoPortal.jsx");
const mapCanvasPath = path.join(root, "components", "geoportal", "MapCanvas.jsx");

const [region, geoPortal, mapCanvas] = await Promise.all([
  fs.readFile(regionPath, "utf8"),
  fs.readFile(geoPortalPath, "utf8"),
  fs.readFile(mapCanvasPath, "utf8")
]);

const checks = [
  ["spatial region resolver", region.includes("export function featureSearchRegionContext")],
  ["geometry sampling", region.includes("sampledGeometryPoints")],
  ["multi-region handling", geoPortal.includes("context.ambiguous ? \"\" : context.region")],
  ["old region cleared before feature search", geoPortal.includes("setRegionFilter(\"\")")],
  ["search query stores resolved region", geoPortal.includes("region: contextRegion || null")],
  ["deep-link resolves feature context", geoPortal.includes("featureSearchRegionContext(")],
  ["programmatic click carries latlng", mapCanvas.includes('target.fire?.("click", latlng ? { latlng } : {})')]
];

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) {
  console.log(`${ok ? "✓" : "✗"} ${label}`);
}

if (failed.length) process.exit(1);
console.log(`Search region context validation passed: ${checks.length} checks.`);
