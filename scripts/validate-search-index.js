const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const index = JSON.parse(fs.readFileSync(path.join(root, "public", "search-index.json"), "utf8"));

const items = Array.isArray(index.items) ? index.items : [];
const find = (label) => items.find((item) => String(item.label).trim().toLowerCase() === label.toLowerCase());

const checks = [];
const smkn = find("SMKN 1 WAJO");
checks.push(["search index exists", items.length >= 9000]);
checks.push(["SMKN 1 Wajo is indexed", Boolean(smkn)]);
checks.push(["SMKN 1 Wajo has region code", smkn?.regionCodes?.includes("73.13.08")]);
checks.push(["SMKN 1 Wajo resolves to Tanasitolo", smkn?.region === "Tanasitolo"]);
checks.push(["feature entries expose coverage context", items.every((item) => Array.isArray(item.regions) && Array.isArray(item.regionCodes))]);
checks.push(["search index format is v4", index.version === 4]);

const layerMap = new Map();
for (const item of items) layerMap.set(item.layerId, (layerMap.get(item.layerId) || 0) + 1);
for (const layer of require("../lib/layers.js").layers) {
  const data = JSON.parse(fs.readFileSync(path.join(root, "public", "geo-data", layer.file), "utf8"));
  checks.push([`${layer.id} feature coverage`, (layerMap.get(layer.id) || 0) === (data.features || []).length]);
}
checks.push(["all search items have selectable keys", items.every((item) => item.key != null && String(item.key).trim() !== "" && item.selectionKey != null && String(item.selectionKey).trim() !== "")]);
const selectionKeysByLayer = new Map();
for (const item of items) {
  const key = `${item.layerId}|${item.selectionKey}`;
  selectionKeysByLayer.set(key, (selectionKeysByLayer.get(key) || 0) + 1);
}
checks.push(["search selection keys are unique per layer", [...selectionKeysByLayer.values()].every((count) => count === 1)]);

const failed = checks.filter(([, ok]) => !ok);
checks.forEach(([label, ok]) => console.log(`${ok ? "✓" : "✗"} ${label}`));
if (failed.length) process.exit(1);
console.log(`Search index validation passed: ${checks.length} checks.`);
