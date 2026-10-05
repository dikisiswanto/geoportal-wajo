async function main() {
const fs = require("node:fs/promises");
const path = require("node:path");

const SERVICE = "https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KABKOTA_AR/MapServer/0";
const OUT = path.resolve("public/geo-data/batas-kabupaten.geojson");
const retries = Number(process.env.BIG_RETRIES || 4);
const timeoutMs = Number(process.env.BIG_TIMEOUT_MS || 30000);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, options = {}, label = "BIG") {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastErr = error;
      if (attempt < retries) await sleep(800 * 2 ** (attempt - 1));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

const url = new URL(`${SERVICE}/query`);
url.searchParams.set("where", "WADMKK='Wajo' OR KDBBPS='7313' OR KDPKAB='73.13'");
url.searchParams.set("outFields", "OBJECTID,NAMOBJ,KDBBPS,KDPKAB,LUASWH,WADMKK,WADMPR,REMARK,METADATA,SRS_ID");
url.searchParams.set("returnGeometry", "true");
url.searchParams.set("outSR", "4326");
url.searchParams.set("f", "geojson");

console.log(`BIG Kabupaten sync · ${SERVICE}`);
const data = await fetchJson(url, {}, "BIG kabupaten");
const features = Array.isArray(data.features) ? data.features : [];
const wajo = features.filter((f) => {
  const p = f.properties || {};
  return String(p.WADMKK || "").trim().toLowerCase() === "wajo"
    || String(p.KDBBPS || "").trim() === "7313"
    || String(p.KDPKAB || "").trim() === "73.13";
});
if (wajo.length !== 1) throw new Error(`BIG kabupaten Wajo: expected exactly 1 feature, got ${wajo.length}`);
const p = wajo[0].properties || {};
const geometry = wajo[0].geometry;
if (!geometry) throw new Error("BIG kabupaten Wajo: geometry tidak tersedia");
let derivedArea = null;
try {
  const districtPath = path.resolve("public/geo-data/batas-kecamatan.geojson");
  const districtRaw = await fs.readFile(districtPath, "utf8");
  const districtData = JSON.parse(districtRaw);
  const districtFeatures = Array.isArray(districtData.features) ? districtData.features : [];
  const districtAreas = districtFeatures
    .map((feature) => Number(feature?.properties?.luas_wilayah_km2 ?? feature?.properties?.LUASWH))
    .filter((value) => Number.isFinite(value) && value > 0);
  if (districtAreas.length === districtFeatures.length && districtFeatures.length > 0) {
    const totalKm2 = districtAreas.reduce((sum, value) => sum + value, 0);
    derivedArea = {
      luas_wilayah_km2: Number(totalKm2.toFixed(6)),
      luas_wilayah_metode: `Penjumlahan luas ${districtFeatures.length} kecamatan`,
      jumlah_kecamatan_luas: districtFeatures.length,
    };
    console.log(`Luas Wajo dihitung dari ${districtFeatures.length} kecamatan: ${derivedArea.luas_wilayah_km2.toLocaleString("id-ID", { maximumFractionDigits: 6 })} km²`);
  }
} catch (error) {
  console.warn(`Luas wilayah Wajo tidak dapat dihitung dari batas kecamatan lokal: ${error.message}`);
}

const output = {
  type: "FeatureCollection",
  name: "Batas Kabupaten Wajo — BIG 2026",
  features: [{
    type: "Feature",
    properties: {
      ...p,
      nama_kabupaten: p.WADMKK || "Wajo",
      kode_kabupaten: p.KDPKAB || p.KDBBPS || "73.13",
      wilayah_type: "Kabupaten",
      tahun_data: 2026,
      sumber_data: "Badan Informasi Geospasial (BIG)",
      status_data: "Feature kabupaten BIG edisi Juni 2026",
      ...(derivedArea || {}),
    },
    geometry,
  }],
};
await fs.writeFile(OUT, JSON.stringify(output), "utf8");
console.log(`Wajo kabupaten: 1 feature disimpan → ${OUT}`);

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
