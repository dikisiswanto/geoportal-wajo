const fs = require("node:fs/promises");
const path = require("node:path");

const { layers } = require("../lib/layers.js");
const { featureKey } = require("../lib/geo/format.js");

const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "public", "geo-data");
const outputPath = path.join(root, "public", "search-index.json");

const GENERIC = new Set(["", "tidak ada", "tidak tersedia", "belum ada", "n/a", "na", "none", "null", "undefined", "-", "—", "/"]);
const PRIORITY_FIELDS = [
  "NAMA_RUAS", "NAMA_OPD", "PUSKESMAS", "nama_sekolah", "NAMOBJ", "POTENSI", "PETERNAKAN",
  "Desa", "Kecamatan", "DESA", "KECAMATAN", "REMARK"
];
const SEARCH_FIELDS = [
  ...PRIORITY_FIELDS,
  "npsn", "bentuk_pendidikan", "status_sekolah", "alamat_jalan", "nama_dusun", "kode_pos",
  "NO", "Alamat", "ALAMAT", "TITIK_KOOR", "KLASIFIKAS", "KATEGORI", "JENIS", "TYPE",
  "NAMA_JALAN", "NAMA_RUAS", "NAMA_OPD", "website"
];

function meaningful(value) {
  const text = String(value ?? "").trim();
  return Boolean(text) && !GENERIC.has(text.toLowerCase());
}

function firstMeaningful(properties, keys) {
  for (const key of keys) {
    const value = properties?.[key];
    if (meaningful(value)) return String(value).trim();
  }
  return "";
}

function listValue(value) {
  if (Array.isArray(value)) return value.map((item) => String(item ?? "").trim()).filter(Boolean);
  const text = String(value ?? "").trim();
  return text ? [text] : [];
}

function contextCodes(properties, type) {
  if (type === "desa") return listValue(properties?.wilayah_desa_kode ?? properties?.kode_desa ?? properties?.kode_desa_kemendagri ?? properties?.KDEPUM);
  return listValue(properties?.wilayah_kecamatan_kode ?? properties?.kode_kecamatan_kemendagri ?? properties?.kode_kecamatan ?? properties?.KDCPUM);
}

function contextNames(properties, type) {
  if (type === "desa") return listValue(properties?.Desa ?? properties?.WADMKD ?? properties?.nama_desa ?? properties?.desa ?? properties?.DESA);
  return listValue(properties?.Kecamatan ?? properties?.WADMKC ?? properties?.nama_kecamatan ?? properties?.kecamatan ?? properties?.KECAMATAN);
}

function featureType(layer) {
  const geometry = String(layer?.geometry ?? "").toLowerCase();
  if (geometry.includes("point")) return "point";
  if (geometry.includes("line")) return "line";
  if (geometry.includes("polygon")) return "polygon";
  return "other";
}

function canonicalRegionName(value) {
  return String(value ?? "").trim().replace(/^kec\.?\s*/i, "");
}

function unique(values) {
  const result = [];
  const seen = new Set();
  for (const rawValue of values.filter(Boolean)) {
    const value = String(rawValue).trim();
    if (!value) continue;
    const canonical = canonicalRegionName(value);
    const key = canonical.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(canonical);
  }
  return result;
}

function buildAdminLookup(data, type) {
  const codeToName = new Map();
  for (const feature of data?.features || []) {
    const properties = feature?.properties || {};
    const codes = contextCodes(properties, type);
    const names = contextNames(properties, type);
    const fallback = names[0] || "";
    codes.forEach((code, index) => {
      if (!codeToName.has(code)) codeToName.set(code, names[index] || fallback);
    });
  }
  return codeToName;
}

const searchableLayers = new Map(layers.map((layer) => [layer.file, layer]));
const items = [];

async function main() {
  const boundaryCache = new Map();
  for (const file of ["batas-kecamatan.geojson", "batas-desa-kelurahan.geojson"]) {
    try {
      boundaryCache.set(file, JSON.parse(await fs.readFile(path.join(dataDir, file), "utf8")));
    } catch {
      boundaryCache.set(file, { features: [] });
    }
  }

  const kecamatanByCode = buildAdminLookup(boundaryCache.get("batas-kecamatan.geojson"), "kecamatan");
  const desaByCode = buildAdminLookup(boundaryCache.get("batas-desa-kelurahan.geojson"), "desa");
  const seen = new Set();

  for (const [file, layer] of searchableLayers) {
    const filePath = path.join(dataDir, file);
    let data;
    try {
      data = JSON.parse(await fs.readFile(filePath, "utf8"));
    } catch {
      continue;
    }

    const type = featureType(layer);
    for (let index = 0; index < (data.features?.length ?? 0); index += 1) {
      const feature = data.features[index];
      const properties = feature?.properties ?? {};
      const label = firstMeaningful(properties, PRIORITY_FIELDS);
      if (!label) continue;

      const specificForSearch = firstMeaningful(properties, [
        "NAMA_RUAS", "NAMA_OPD", "PUSKESMAS", "nama_sekolah", "NAMOBJ", "POTENSI", "PETERNAKAN"
      ]);
      const admin = type === "polygon" && layer.id?.startsWith("adm-")
        ? firstMeaningful(properties, ["Kecamatan", "Desa", "nama_kecamatan", "nama_desa", "NAMOBJ"])
        : "";

      const key = featureKey(layer, feature);
      if (key == null) continue;

      const dedupeKey = `${layer.id}|${String(key).toLowerCase()}|${label.toLowerCase()}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      const includeGenericPolygon = type === "polygon" && !layer.id?.startsWith("adm-")
        ? meaningful(specificForSearch) && !["tidak ada", "belum ada"].includes(label.toLowerCase())
        : true;
      if (!includeGenericPolygon) continue;

      const kecamatanCodes = contextCodes(properties, "kecamatan");
      const desaCodes = contextCodes(properties, "desa");
      const propertyKecamatanNames = contextNames(properties, "kecamatan");
      const propertyDesaNames = contextNames(properties, "desa");

      const regionNames = unique([
        ...propertyKecamatanNames,
        ...kecamatanCodes.map((code) => kecamatanByCode.get(code) || "")
      ]);
      const villageNames = unique([
        ...propertyDesaNames,
        ...desaCodes.map((code) => desaByCode.get(code) || "")
      ]);

      const region = regionNames[0] || "";
      const contextSummary = regionNames.length > 1
        ? `${regionNames.length} kecamatan`
        : villageNames.length && region
          ? `${villageNames[0]} · ${region}`
          : region || villageNames[0] || "Kabupaten Wajo";

      const searchText = [
        layer.title,
        layer.group,
        label,
        specificForSearch,
        contextSummary,
        regionNames.join(" "),
        villageNames.join(" "),
        ...SEARCH_FIELDS.map((field) => properties[field])
      ].filter(meaningful).join(" ");

      items.push({
        id: `${layer.id}:${String(key)}:${index}`,
        layerId: layer.id,
        layerTitle: layer.title,
        group: layer.group,
        type,
        key: String(key),
        label: admin || label,
        subtitle: contextSummary === "Kabupaten Wajo" ? `${layer.group} · Kabupaten Wajo` : `${contextSummary} · ${layer.group}`,
        region,
        regions: regionNames,
        regionCodes: unique(kecamatanCodes),
        village: villageNames[0] || "",
        villages: villageNames,
        villageCodes: unique(desaCodes),
        contextSummary,
        coverageCount: Math.max(1, regionNames.length),
        text: searchText
      });
    }
  }

  const payload = {
    version: 2,
    items
  };
  await fs.writeFile(outputPath, `${JSON.stringify(payload)}\n`);
  console.log(`Search index: ${items.length.toLocaleString("id-ID")} entries → ${path.relative(root, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
