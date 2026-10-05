const fs = require("node:fs");
const path = require("node:path");
const process = require("node:process");
const { layers } = require("../lib/layers.js");
const { REGION_SUMMARY } = require("../lib/geo/regionSummary.js");

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "geo-data");
const ADMIN_FILES = new Set(["batas-kabupaten.geojson", "batas-kecamatan.geojson", "batas-desa-kelurahan.geojson"]);
const adminKecamatan = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "batas-kecamatan.geojson"), "utf8"));
const adminDesa = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "batas-desa-kelurahan.geojson"), "utf8"));

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));
}

function codesFromValue(value) {
  if (Array.isArray(value)) return value.map((item) => String(item ?? "").trim()).filter(Boolean);
  const code = String(value ?? "").trim();
  return code ? [code] : [];
}

function hasGeometry(feature) {
  const geometry = feature?.geometry;
  if (!geometry?.type) return false;
  if (geometry.type === "GeometryCollection") return Array.isArray(geometry.geometries) && geometry.geometries.length > 0;
  return Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0;
}

function passesFilter(layer, feature) {
  const filter = layer?.featureFilter;
  if (!filter) return true;
  const normalized = String(feature?.properties?.[filter.field] ?? "").trim().toLowerCase();
  if (filter.excludeEmpty && normalized === "") return false;
  return !(filter.excludeValues ?? []).some((value) => String(value ?? "").trim().toLowerCase() === normalized);
}

const kecamatanCodes = new Set(adminKecamatan.features.map((feature) => String(feature?.properties?.KDCPUM ?? feature?.properties?.kode_kecamatan ?? "").trim()).filter(Boolean));
const desaCodes = new Set(adminDesa.features.map((feature) => String(feature?.properties?.KDEPUM ?? feature?.properties?.kode_desa ?? "").trim()).filter(Boolean));
const kecamatanRegions = REGION_SUMMARY["batas-kecamatan.geojson"]?.regions ?? [];
const desaRegions = REGION_SUMMARY["batas-desa-kelurahan.geojson"]?.villages ?? [];

const files = fs.readdirSync(DATA_DIR).filter((file) => file.endsWith(".geojson") && !ADMIN_FILES.has(file)).sort();
let total = 0;
let mappedKecamatan = 0;
let mappedDesa = 0;
const problems = [];
const summaryProblems = [];

for (const file of files) {
  const data = readJson(file);
  const layer = layers.find((item) => item.file === file) ?? { id: file, file };
  const summary = REGION_SUMMARY[file];
  if (!summary) summaryProblems.push(`${file}: ringkasan wilayah tidak tersedia`);

  for (let index = 0; index < data.features.length; index += 1) {
    total += 1;
    const feature = data.features[index];
    const properties = feature?.properties ?? {};
    const kec = codesFromValue(properties.wilayah_kecamatan_kode ?? properties.kode_kecamatan_kemendagri ?? properties.kode_kecamatan ?? properties.KDCPUM);
    const desa = codesFromValue(properties.wilayah_desa_kode ?? properties.kode_desa ?? properties.kode_desa_kemendagri ?? properties.KDEPUM);

    if (kec.length) mappedKecamatan += 1;
    if (desa.length) mappedDesa += 1;
    for (const code of kec) if (!kecamatanCodes.has(code)) problems.push(`${file}#${index}: kode kecamatan tidak dikenal ${code}`);
    for (const code of desa) if (!desaCodes.has(code)) problems.push(`${file}#${index}: kode desa tidak dikenal ${code}`);
  }

  if (summary) {
    for (const region of kecamatanRegions) {
      const actual = data.features.filter((feature) => {
        if (!hasGeometry(feature) || !passesFilter(layer, feature)) return false;
        return codesFromValue(feature?.properties?.wilayah_kecamatan_kode ?? feature?.properties?.kode_kecamatan_kemendagri ?? feature?.properties?.kode_kecamatan ?? feature?.properties?.KDCPUM).includes(region.code);
      }).length;
      const expected = summary.regions?.find((entry) => entry.code === region.code)?.count ?? 0;
      if (actual !== expected) summaryProblems.push(`${file}/${region.code}: angka panel ${expected} tidak sama dengan data peta ${actual}`);
    }

    for (const village of desaRegions) {
      const actual = data.features.filter((feature) => {
        if (!hasGeometry(feature) || !passesFilter(layer, feature)) return false;
        return codesFromValue(feature?.properties?.wilayah_desa_kode ?? feature?.properties?.kode_desa ?? feature?.properties?.kode_desa_kemendagri ?? feature?.properties?.KDEPUM).includes(village.code);
      }).length;
      const expected = summary.villages?.find((entry) => entry.code === village.code)?.count ?? 0;
      if (actual !== expected) summaryProblems.push(`${file}/${village.code}: angka desa ${expected} tidak sama dengan data peta ${actual}`);
    }
  }
}

console.log(`Validasi pemetaan wilayah: ${files.length} dataset, ${total.toLocaleString("id-ID")} feature`);
console.log(`Kecamatan: ${mappedKecamatan.toLocaleString("id-ID")} feature memiliki kode wilayah`);
console.log(`Desa: ${mappedDesa.toLocaleString("id-ID")} feature memiliki kode wilayah`);
console.log(`Batas resmi: ${kecamatanCodes.size} kecamatan, ${desaCodes.size} desa/kelurahan`);
console.log(`Validasi sinkronisasi UI: ${summaryProblems.length === 0 ? "LULUS" : `${summaryProblems.length} masalah`}`);

if (problems.length || summaryProblems.length) {
  if (problems.length) {
    console.error(problems.slice(0, 30).join("\n"));
  }
  if (summaryProblems.length) {
    console.error(summaryProblems.slice(0, 30).join("\n"));
  }
  process.exit(1);
}

console.log("VALIDASI BERHASIL: kode wilayah dan angka panel sesuai dengan data yang dapat ditampilkan.");
