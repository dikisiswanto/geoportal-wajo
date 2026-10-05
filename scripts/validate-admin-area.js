async function main() {
const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "geo-data");
const ADMIN_FILES = [
  "batas-kabupaten.geojson",
  "batas-kecamatan.geojson",
  "batas-desa-kelurahan.geojson",
];

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

for (const filename of ADMIN_FILES) {
  const file = path.join(DATA_DIR, filename);
  const data = JSON.parse(await fs.readFile(file, "utf8"));
  const features = Array.isArray(data.features) ? data.features : [];
  if (!features.length) throw new Error(`${filename}: FeatureCollection kosong.`);

  let areaSum = 0;
  for (const [index, feature] of features.entries()) {
    const props = feature?.properties ?? {};
    if (Object.prototype.hasOwnProperty.call(props, "luas_wilayah_ha")) {
      throw new Error(`${filename} feature ${index + 1}: field luas_wilayah_ha masih ada; gunakan luas_wilayah_km2.`);
    }

    const areaKm2 = number(props.luas_wilayah_km2);
    if (areaKm2 == null || areaKm2 <= 0) {
      throw new Error(`${filename} feature ${index + 1}: luas_wilayah_km2 tidak valid.`);
    }

    const sourceArea = number(props.LUASWH);
    if (filename !== "batas-kabupaten.geojson" && sourceArea != null && Math.abs(sourceArea - areaKm2) > 1e-9) {
      throw new Error(`${filename} feature ${index + 1}: LUASWH (${sourceArea}) berbeda dari luas_wilayah_km2 (${areaKm2}).`);
    }

    areaSum += areaKm2;
  }

  console.log(`${filename}: ${features.length} feature · ${areaSum.toFixed(6)} km²`);
}

const district = JSON.parse(await fs.readFile(path.join(DATA_DIR, "batas-kecamatan.geojson"), "utf8"));
const county = JSON.parse(await fs.readFile(path.join(DATA_DIR, "batas-kabupaten.geojson"), "utf8"));
const districtTotal = district.features.reduce((sum, feature) => sum + Number(feature.properties.luas_wilayah_km2), 0);
const countyArea = Number(county.features[0]?.properties?.luas_wilayah_km2);

if (!Number.isFinite(countyArea) || Math.abs(districtTotal - countyArea) > 1e-5) {
  throw new Error(`Total kabupaten tidak konsisten: kecamatan=${districtTotal}, kabupaten=${countyArea}.`);
}

console.log(`Konsistensi total: ${countyArea.toFixed(6)} km².`);

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
