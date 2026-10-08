import { layers } from "../layers.js";
import { getWajoKecamatanByKemendagri, getWajoVillageByKemendagriCode } from "./adminMaster.js";

const ADMIN_LAYER_IDS = new Set(["adm-kabupaten", "adm-kecamatan", "adm-desa"]);

function normalizeCode(value) {
  return String(value ?? "").trim();
}

function keyPart(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function findRegionEntry(codeOrName, regionSummary = {}) {
  const value = normalizeCode(codeOrName);
  if (!value) return null;
  const regions = regionSummary["batas-kecamatan.geojson"]?.regions ?? [];
  return regions.find((entry) => entry.code === value || keyPart(entry.name) === keyPart(value)) ?? null;
}

function findVillageEntry(codeOrName, kecamatanCode = "", regionSummary = {}) {
  const villages = regionSummary["batas-desa-kelurahan.geojson"]?.villages ?? [];
  const value = normalizeCode(codeOrName);
  if (!value) return null;

  const sameKecamatan = villages.filter((entry) => !kecamatanCode || entry.kecamatanCode === kecamatanCode);
  return sameKecamatan.find((entry) => entry.code === value || keyPart(entry.name) === keyPart(value)) ?? null;
}

function layerLabel(layer, file, regionSummary = {}) {
  return layer?.title || regionSummary[file]?.layerTitle || file.replace(/\.geojson$/i, "");
}

function districtCount(file, code, regionSummary = {}) {
  return regionSummary[file]?.regions?.find((entry) => entry.code === code)?.count ?? 0;
}

function villageCount(file, code, regionSummary = {}) {
  return regionSummary[file]?.villages?.find((entry) => entry.code === code)?.count ?? 0;
}

function availableLayersForRegion(level, code, regionSummary = {}) {
  const result = [];
  for (const layer of layers) {
    if (ADMIN_LAYER_IDS.has(layer.id)) continue;
    const file = layer.file;
    const count = level === "desa" ? villageCount(file, code, regionSummary) : districtCount(file, code, regionSummary);
    if (count <= 0) continue;
    result.push({ layerId: layer.id, label: layerLabel(layer, file, regionSummary), count });
  }
  return result;
}

function addKecamatanMetrics(target, kecCode, regionSummary = {}) {
  const master = getWajoKecamatanByKemendagri(kecCode);
  const villageCountValue = master ? Object.keys(master.desa).length : (
    regionSummary["batas-desa-kelurahan.geojson"]?.regions?.find((entry) => entry.code === kecCode)?.count ?? 0
  );

  target.metrics = [
    { label: "Desa / Kelurahan", value: villageCountValue },
    { label: "Jenis data", value: target.layers.length },
  ];
}

function buildNotes(level, code, regionSummary = {}) {
  const notes = [];
  const schoolSummary = regionSummary["satuan-pendidikan.geojson"];
  const schoolTotal = schoolSummary?.total ?? 0;
  const schoolMapped = schoolSummary?.mapped ?? schoolSummary?.total ?? 0;
  if (schoolTotal > schoolMapped) {
    notes.push(`${(schoolTotal - schoolMapped).toLocaleString("id-ID")} data satuan pendidikan belum memiliki lokasi di peta.`);
  }

  if (level === "desa") {
    const village = findVillageEntry(code, "", regionSummary);
    if (village && !village.count) return notes;
  }
  return notes;
}

export function getAdministrativeType(layerId) {
  if (layerId === "adm-kabupaten") return "kabupaten";
  if (layerId === "adm-kecamatan") return "kecamatan";
  if (layerId === "adm-desa") return "desa";
  return null;
}

export function getAdministrativeStats(layer, feature, regionSummary = {}) {
  const type = getAdministrativeType(layer?.id);
  if (!type) return null;

  const p = feature?.properties ?? {};

  if (type === "kabupaten") {
    const countyCode = normalizeCode(p.kode_kabupaten ?? p.KDPKAB ?? p.KDBBPS ?? "73.13");
    const layersForCounty = [];
    for (const item of layers) {
      if (ADMIN_LAYER_IDS.has(item.id)) continue;
      const summary = regionSummary[item.file];
      const count = summary?.regions?.reduce((total, entry) => total + (entry.count || 0), 0) ?? 0;
      if (count > 0) layersForCounty.push({ layerId: item.id, label: layerLabel(item, item.file, regionSummary), count });
    }

    const countyArea = Number(p.luas_wilayah_km2 ?? 0);

    return {
      name: "Wajo",
      code: countyCode,
      metrics: [
        ...(Number.isFinite(countyArea) && countyArea > 0 ? [{ label: "Luas wilayah (km²)", value: countyArea }] : []),
        { label: "Kecamatan", value: regionSummary["batas-kecamatan.geojson"]?.total ?? 14 },
        { label: "Desa / Kelurahan", value: regionSummary["batas-desa-kelurahan.geojson"]?.total ?? 190 },
        { label: "Jenis data", value: layersForCounty.length },
      ],
      layers: layersForCounty,
      notes: buildNotes("kabupaten", countyCode, regionSummary),
    };
  }

  if (type === "kecamatan") {
    const code = normalizeCode(p.kode_kecamatan_kemendagri ?? p.kode_kecamatan ?? p.KDCPUM ?? "");
    const entry = findRegionEntry(code || p.Kecamatan || p.WADMKC || p.nama_kecamatan, regionSummary);
    if (!entry) return null;
    const result = {
      name: entry.name,
      code: entry.code,
      metrics: [],
      layers: availableLayersForRegion("kecamatan", entry.code, regionSummary),
      notes: buildNotes("kecamatan", entry.code, regionSummary),
    };
    addKecamatanMetrics(result, entry.code, regionSummary);
    return result;
  }

  const villageCode = normalizeCode(p.kode_desa ?? p.kode_desa_kemendagri ?? p.KDEPUM ?? "");
  const village = findVillageEntry(villageCode || p.Desa || p.WADMKD || p.nama_desa, normalizeCode(p.kode_kecamatan_kemendagri ?? p.KDCPUM ?? ""), regionSummary);
  if (!village) {
    const master = getWajoVillageByKemendagriCode(villageCode, p.nama_desa_kemendagri ?? p.nama_kemendagri ?? p.Desa ?? p.WADMKD ?? p.nama_desa);
    if (!master) return null;
  }

  const code = village?.code || villageCode;
  const entry = village || findVillageEntry(code, "", regionSummary);
  return {
    name: entry?.name || p.Desa || p.WADMKD || p.nama_desa || "Desa / Kelurahan",
    code,
    metrics: [],
    layers: availableLayersForRegion("desa", code, regionSummary),
    notes: buildNotes("desa", code, regionSummary),
  };
}
