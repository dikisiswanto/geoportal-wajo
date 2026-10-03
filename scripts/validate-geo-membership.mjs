import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "geo-data");
const ADMIN_FILES = new Set(["batas-kabupaten.geojson", "batas-kecamatan.geojson", "batas-desa-kelurahan.geojson"]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8"));
}

function listCodes(file, field) {
  return new Set(
    readJson(file).features.map((feature) => String(feature?.properties?.[field] ?? "").trim()).filter(Boolean)
  );
}

const kecamatanCodes = listCodes("batas-kecamatan.geojson", "KDCPUM");
const desaCodes = listCodes("batas-desa-kelurahan.geojson", "KDEPUM");

const files = fs.readdirSync(DATA_DIR).filter((file) => file.endsWith(".geojson") && !ADMIN_FILES.has(file)).sort();
let total = 0;
let mappedKecamatan = 0;
let mappedDesa = 0;
const problems = [];

for (const file of files) {
  const data = readJson(file);
  for (let index = 0; index < data.features.length; index += 1) {
    total += 1;
    const feature = data.features[index];
    const properties = feature?.properties ?? {};
    const kec = Array.isArray(properties.wilayah_kecamatan_kode)
      ? properties.wilayah_kecamatan_kode.map(String).map((value) => value.trim()).filter(Boolean)
      : [];
    const desa = Array.isArray(properties.wilayah_desa_kode)
      ? properties.wilayah_desa_kode.map(String).map((value) => value.trim()).filter(Boolean)
      : [];

    if (kec.length) mappedKecamatan += 1;
    if (desa.length) mappedDesa += 1;

    for (const code of kec) {
      if (!kecamatanCodes.has(code)) problems.push(`${file}#${index}: kode kecamatan tidak dikenal ${code}`);
    }
    for (const code of desa) {
      if (!desaCodes.has(code)) problems.push(`${file}#${index}: kode desa tidak dikenal ${code}`);
    }
  }
}

console.log(`Validasi pemetaan wilayah: ${files.length} dataset, ${total.toLocaleString("id-ID")} feature`);
console.log(`Kecamatan: ${mappedKecamatan.toLocaleString("id-ID")} feature memiliki kode wilayah`);
console.log(`Desa: ${mappedDesa.toLocaleString("id-ID")} feature memiliki kode wilayah`);
console.log(`Batas resmi: ${kecamatanCodes.size} kecamatan, ${desaCodes.size} desa/kelurahan`);

if (problems.length) {
  console.error(`Ditemukan ${problems.length} masalah.`);
  console.error(problems.slice(0, 30).join("\n"));
  process.exit(1);
}

console.log("VALIDASI BERHASIL: seluruh kode pemetaan merujuk ke batas administrasi yang tersedia.");
