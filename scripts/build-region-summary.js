const fs = require("node:fs");
const path = require("node:path");
const { layers } = require("../lib/layers.js");

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "geo-data");
const OUT_FILE = path.join(ROOT, "lib", "geo", "regionSummary.js");
const REGIONS_OUT_FILE = path.join(ROOT, "lib", "geo", "regions.js");
const SUMMARY_JSON_FILE = path.join(ROOT, "public", "region-summary.json");
const SEARCH_REGION_JSON_FILE = path.join(ROOT, "public", "region-search-index.json");
const ADMIN_FILES = new Set([
  "batas-kabupaten.geojson",
  "batas-kecamatan.geojson",
  "batas-desa-kelurahan.geojson"
]);

const kecamatanData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "batas-kecamatan.geojson"), "utf8"));
const desaData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "batas-desa-kelurahan.geojson"), "utf8"));

const regions = kecamatanData.features.map((feature) => {
  const p = feature.properties ?? {};
  return {
    code: String(p.kode_kecamatan_kemendagri ?? p.KDCPUM ?? p.kode_kecamatan ?? "").trim(),
    name: String(p.nama_kecamatan ?? p.Kecamatan ?? p.WADMKC ?? p.NAMOBJ ?? "").trim(),
    bpsName: String(p.nama_kecamatan_bps ?? "").trim() || null,
  };
}).filter((item) => item.code && item.name);

const villages = desaData.features.map((feature) => {
  const p = feature.properties ?? {};
  const code = String(p.kode_desa ?? p.KDEPUM ?? p.kode_desa_kemendagri ?? "").trim();
  const kecCode = code.split(".").slice(0, 3).join(".");
  return {
    code,
    name: String(p.nama_desa_bps ?? p.Desas ?? p.Desa ?? p.WADMKD ?? p.nama_desa ?? p.NAMOBJ ?? "").trim(),
    bpsName: String(p.nama_desa_bps ?? "").trim() || null,
    kecamatanCode: kecCode,
  };
}).filter((item) => item.code && item.name && item.kecamatanCode);

function hasGeometry(feature) {
  const geometry = feature?.geometry;
  if (!geometry || !geometry.type) return false;
  if (geometry.type === "GeometryCollection") return Array.isArray(geometry.geometries) && geometry.geometries.length > 0;
  return Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0;
}

function passesFilter(layer, feature) {
  const filter = layer?.featureFilter;
  if (!filter) return true;
  const value = feature?.properties?.[filter.field];
  const normalized = String(value ?? "").trim().toLowerCase();
  if (filter.excludeEmpty && normalized === "") return false;
  const excluded = (filter.excludeValues ?? []).map((item) => String(item ?? "").trim().toLowerCase());
  return !excluded.includes(normalized);
}

function asCodes(value) {
  if (Array.isArray(value)) return value.map((item) => String(item ?? "").trim()).filter(Boolean);
  const code = String(value ?? "").trim();
  return code ? [code] : [];
}

function statsForFeatures(layer, features) {
  const districts = Object.fromEntries(regions.map((r) => [r.code, 0]));
  const villageCounts = Object.fromEntries(villages.map((v) => [v.code, 0]));

  for (const feature of features) {
    if (!hasGeometry(feature) || !passesFilter(layer, feature)) continue;
    const p = feature.properties ?? {};
    const kecCodes = asCodes(p.wilayah_kecamatan_kode ?? p.kode_kecamatan_kemendagri ?? p.kode_kecamatan ?? p.KDCPUM);
    const desaCodes = asCodes(p.wilayah_desa_kode ?? p.kode_desa ?? p.kode_desa_kemendagri ?? p.KDEPUM);
    for (const code of kecCodes) if (districts[code] !== undefined) districts[code] += 1;
    for (const code of desaCodes) if (villageCounts[code] !== undefined) villageCounts[code] += 1;
  }

  return {
    districts,
    villages: villageCounts,
  };
}

const summary = {};
const layerByFile = new Map(layers.map((layer) => [layer.file, layer]));
const files = fs.readdirSync(DATA_DIR).filter((file) => file.endsWith(".geojson")).sort();

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));
  const layer = layerByFile.get(file) ?? { file, id: file.replace(/\.geojson$/, ""), title: file };
  const features = Array.isArray(data.features) ? data.features : [];
  const renderable = features.filter((feature) => hasGeometry(feature) && passesFilter(layer, feature));
  const allGeometry = features.filter(hasGeometry);
  const stats = statsForFeatures(layer, features);

  summary[file] = {
    total: features.length,
    mapped: allGeometry.length,
    unmapped: features.length - allGeometry.length,
    regions: regions.map((region) => ({
      code: region.code,
      name: region.name,
      ...(region.bpsName ? { bpsName: region.bpsName } : {}),
      count: stats.districts[region.code] ?? 0,
    })),
    villages: villages.map((village) => ({
      code: village.code,
      name: village.name,
      ...(village.bpsName ? { bpsName: village.bpsName } : {}),
      kecamatanCode: village.kecamatanCode,
      count: stats.villages[village.code] ?? 0,
    })),
    renderableGeometryCount: renderable.length,
    filteredOutCount: allGeometry.length - renderable.length,
    layerId: layer.id,
    layerTitle: layer.title,
  };
}

const regionNames = regions.map((item) => item.name);
const regionSearchIndex = {
  regions: (summary["batas-desa-kelurahan.geojson"]?.regions ?? []).map(({ code, name }) => ({ code, name })),
  villages: villages.map(({ code, name, kecamatanCode }) => ({ code, name, kecamatanCode })),
};
const header = `// GENERATED FILE. Jalankan "npm run sync:data:region" atau "npm run build" setelah GeoJSON berubah.\n`;
const body = `const REGIONS = ${JSON.stringify(regionNames, null, 2)};\n\nconst REGION_SUMMARY = ${JSON.stringify(summary, null, 2)};\n\nmodule.exports = { REGIONS, REGION_SUMMARY };\n`;
fs.mkdirSync(path.dirname(SUMMARY_JSON_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, `${header}${body}`);
fs.writeFileSync(REGIONS_OUT_FILE, `// GENERATED FILE. Do not edit manually.\nexport const REGIONS = ${JSON.stringify(regionNames, null, 2)};\n`);
fs.writeFileSync(SUMMARY_JSON_FILE, JSON.stringify(summary));
fs.writeFileSync(SEARCH_REGION_JSON_FILE, JSON.stringify(regionSearchIndex));
console.log(`Ringkasan wilayah dibuat: ${Object.keys(summary).length} dataset, ${regions.length} kecamatan, ${villages.length} desa/kelurahan.`);
console.log(`Aset wilayah deferred dibuat: region-summary.json + region-search-index.json.`);
