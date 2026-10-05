const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const dataDir = path.join(root, "public", "geo-data");
const checks = [
  ["jalan", "jaringan-jalan.geojson", ["NAMA_RUAS", "KLASIFIKAS"]],
  ["jaringan-transportasi", "jaringan-transportasi.geojson", ["NAMOBJ", "REMARK"]],
  ["jaringan-prasarana-lainnya", "jaringan-prasarana-lainnya.geojson", ["NAMOBJ", "REMARK"]],
  ["jaringan-sumber-daya-air", "jaringan-sumber-daya-air.geojson", ["NAMOBJ", "REMARK"]],
  ["jaringan-telekomunikasi", "jaringan-telekomunikasi.geojson", ["NAMOBJ"]],
  ["jaringan-energi", "jaringan-energi.geojson", ["NAMOBJ", "REMARK"]],
  ["kontur", "kontur-topografi.geojson", ["VALKNT"]],
  ["sungai", "sungai.geojson", ["NAMOBJ", "REMARK"]],
  ["potensi-pertanian", "potensi-pertanian.geojson", ["POTENSI", "DESA"]],
  ["potensi-peternakan", "potensi-peternakan.geojson", ["PETERNAKAN", "DESA"]],
  ["agri-kebun", "kawasan-perkebunan.geojson", ["REMARK"]],
  ["agri-ladang", "kawasan-pertanian-lahan-kering.geojson", ["REMARK"]],
  ["agri-sawah", "kawasan-persawahan.geojson", ["REMARK"]],
  ["tambak", "kawasan-tambak.geojson", ["REMARK"]],
  ["danau", "danau.geojson", ["REMARK"]],
  ["pemukiman", "kawasan-permukiman.geojson", ["REMARK"]],
  ["non-agri-hutan-kering", "kawasan-hutan-lahan-kering.geojson", ["REMARK"]],
  ["non-agri-hutan-basah", "kawasan-hutan-lahan-basah.geojson", ["REMARK"]],
  ["non-agri-semak-belukar", "kawasan-semak-belukar.geojson", ["REMARK"]],
  ["non-agri-alang", "kawasan-alang-alang.geojson", ["REMARK"]],
];

let failed = false;
for (const [id, file, requiredFields] of checks) {
  const fullPath = path.join(dataDir, file);
  if (!fs.existsSync(fullPath)) {
    failed = true;
    console.error(`MISSING ${id}: ${file}`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  const features = Array.isArray(data.features) ? data.features : [];
  const keys = new Set(features.flatMap((feature) => Object.keys(feature.properties ?? {})));
  const missing = requiredFields.filter((field) => !keys.has(field));
  const geometryCount = features.filter((feature) => {
    const type = feature.geometry?.type;
    return ["LineString", "MultiLineString", "Polygon", "MultiPolygon"].includes(type);
  }).length;
  if (missing.length || geometryCount !== features.length) failed = true;
  console.log(`${missing.length || geometryCount !== features.length ? "FAIL" : "OK"} ${id}: ${features.length} features, ${geometryCount} line/polygon geometries${missing.length ? `, missing ${missing.join(", ")}` : ""}`);
}

if (failed) process.exit(1);
