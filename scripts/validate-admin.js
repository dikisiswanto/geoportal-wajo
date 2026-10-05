async function main() {
const fs = require("node:fs/promises");
const path = require("node:path");
const process = require("node:process");
const {
  WAJO_ADMIN_MASTER,
  getWajoKecamatanByKemendagri,
  getWajoVillageByKemendagri,
  getWajoVillageByKemendagriCode,
} = require("../lib/geo/adminMaster.js");

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "geo-data");

function readFeatures(filename) {
  return fs
    .readFile(path.join(OUT, filename), "utf8")
    .then(JSON.parse)
    .then((data) => {
      if (!Array.isArray(data?.features)) throw new Error(`${filename}: FeatureCollection tidak valid.`);
      return data.features;
    });
}

const [kec, desa] = await Promise.all([
  readFeatures("batas-kecamatan.geojson"),
  readFeatures("batas-desa-kelurahan.geojson"),
]);

const errors = [];
const warnings = [];

if (kec.length !== WAJO_ADMIN_MASTER.kecamatan.length) {
  errors.push(`Kecamatan: ${kec.length} data, seharusnya ${WAJO_ADMIN_MASTER.kecamatan.length}.`);
}

const kecByKemendagri = new Map();
const kecByBps = new Map();
for (const feature of kec) {
  const p = feature?.properties || {};
  const codeK = String(p.kode_kecamatan_kemendagri || p.kode_kemendagri || p.kode_kecamatan || "").trim();
  const codeB = String(p.kode_kecamatan_bps || p.kode_bps || "").trim();
  if (codeK) kecByKemendagri.set(codeK, feature);
  if (codeB) kecByBps.set(codeB, feature);

  const master = getWajoKecamatanByKemendagri(codeK);
  if (!master) errors.push(`Kecamatan: kode Kemendagri tidak dikenal: ${codeK}.`);
  else {
    if (String(p.nama_kecamatan_kemendagri || "").trim() !== master.nameKemendagri) {
      warnings.push(`Kecamatan ${codeK}: nama Kemendagri sumber berbeda (${p.nama_kecamatan_kemendagri || "-"} / ${master.nameKemendagri}).`);
    }
    if (String(p.nama_kecamatan_bps || p.nama_bps || p.nama_kecamatan || "").trim() !== master.nameBps) {
      errors.push(`Kecamatan ${codeK}: nama BPS tidak sesuai (${p.nama_kecamatan_bps || p.nama_bps || p.nama_kecamatan || "-"} / ${master.nameBps}).`);
    }
    if (codeB !== master.codeBps) {
      errors.push(`Kecamatan ${codeK}: kode BPS tidak sesuai (${codeB} / ${master.codeBps}).`);
    }
  }
}

for (const master of WAJO_ADMIN_MASTER.kecamatan) {
  if (!kecByKemendagri.has(master.codeKemendagri)) errors.push(`Kecamatan hilang: ${master.codeKemendagri} ${master.nameKemendagri}.`);
  if (!kecByBps.has(master.codeBps)) errors.push(`Kecamatan hilang menurut BPS: ${master.codeBps} ${master.nameBps}.`);
}

const expectedDesa = WAJO_ADMIN_MASTER.kecamatan.reduce((sum, item) => sum + Object.keys(item.desa).length, 0);
if (desa.length !== expectedDesa) {
  errors.push(`Desa/Kelurahan: ${desa.length} data, seharusnya ${expectedDesa}.`);
}

const desaByKemendagri = new Map();
const desaByBps = new Map();
for (const feature of desa) {
  const p = feature?.properties || {};
  const codeK = String(p.kode_kecamatan_kemendagri || p.kode_kecamatan || "").trim();
  const codeD = String(p.kode_desa || p.kode_kemendagri || "").trim();
  const codeB = String(p.kode_desa_bps || p.kode_bps || "").trim();
  desaByKemendagri.set(codeD, feature);
  desaByBps.set(codeB, feature);

  const villageNameK = String(p.nama_desa_kemendagri || p.nama_kemendagri || p.Desa || "").trim();
  const master = getWajoVillageByKemendagriCode(codeD, villageNameK);
  if (!master) {
    errors.push(`Desa: kode Kemendagri tidak cocok ${codeD} pada kecamatan ${codeK} (${villageNameK}).`);
    continue;
  }
  if (master.kecamatan.codeKemendagri !== codeK) {
    errors.push(`Desa ${codeD}: kode kecamatan turunan tidak sesuai (${codeK} / ${master.kecamatan.codeKemendagri}).`);
    continue;
  }
  if (codeB !== master.codeBps) {
    errors.push(`Desa ${codeD}: kode BPS tidak sesuai (${codeB} / ${master.codeBps}).`);
  }
  if (String(p.nama_desa_bps || p.nama_bps || p.Desa || "").trim() !== master.nameBps) {
    errors.push(`Desa ${codeD}: nama BPS tidak sesuai (${p.nama_desa_bps || p.nama_bps || p.Desa || "-"} / ${master.nameBps}).`);
  }
  if (codeD !== codeD.replace(/[^0-9.]/g, "")) {
    errors.push(`Desa ${codeD}: kode Kemendagri tidak dalam format standar.`);
  }
}

if (desaByKemendagri.size !== desa.length) errors.push(`Desa/Kelurahan: kode Kemendagri tidak unik (${desaByKemendagri.size}/${desa.length}).`);
if (desaByBps.size !== desa.length) errors.push(`Desa/Kelurahan: kode BPS tidak unik (${desaByBps.size}/${desa.length}).`);

const duplicateNames = new Map();
for (const feature of desa) {
  const p = feature?.properties || {};
  const name = String(p.nama_desa_kemendagri || p.nama_desa_bps || p.Desa || "").trim().toUpperCase();
  const code = String(p.kode_desa || "").trim();
  if (!name) continue;
  if (!duplicateNames.has(name)) duplicateNames.set(name, new Set());
  duplicateNames.get(name).add(code);
}
const sameNameDifferentCode = [...duplicateNames.entries()].filter(([, codes]) => codes.size > 1);


console.log("Administrasi Kabupaten Wajo — validasi Kemendagri + BPS");
console.log(`Kecamatan: ${kec.length} feature; master ${WAJO_ADMIN_MASTER.kecamatan.length}`);
console.log(`Desa/Kelurahan: ${desa.length} feature; master ${expectedDesa}`);
console.log(`Kode Kemendagri kecamatan unik: ${kecByKemendagri.size}`);
console.log(`Kode BPS kecamatan unik: ${kecByBps.size}`);
console.log(`Kode Kemendagri desa unik: ${desaByKemendagri.size}`);
console.log(`Kode BPS desa unik: ${desaByBps.size}`);
console.log(`Nama desa yang muncul di lebih dari satu lokasi/kode: ${sameNameDifferentCode.length}`);
if (warnings.length) {
  console.log(`Catatan nama sumber BIG/Kemendagri: ${warnings.length}`);
  for (const item of warnings.slice(0, 20)) console.log(`  - ${item}`);
}
if (errors.length) {
  console.error(`VALIDASI GAGAL: ${errors.length} masalah.`);
  for (const item of errors.slice(0, 80)) console.error(`  - ${item}`);
  process.exit(1);
}
console.log("VALIDASI BERHASIL: 14 kecamatan + 190 desa/kelurahan konsisten dengan master BPS dan kode Kemendagri.");

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
