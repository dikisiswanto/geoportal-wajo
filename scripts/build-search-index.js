const fs = require("node:fs/promises");
const path = require("node:path");

const { layers } = require("../lib/layers.js");
const { featureKey, featureSearchId } = require("../lib/geo/format.js");

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

const INTENT_RULES = {
  administration: [
    "kecamatan", "kec", "desa", "kelurahan", "wilayah", "administrasi", "batas"
  ],
  education: [
    "sekolah", "sd", "sdn", "smp", "smpn", "sma", "sman", "smk", "smkn",
    "madrasah", "mi", "mts", "ma", "tk", "paud", "pendidikan"
  ],
  health: [
    "puskesmas", "pkm", "kesehatan", "rumah sakit", "rs", "klinik", "posyandu", "apotik", "apotek"
  ],
  government: [
    "pemerintah", "pemkab", "opd", "dinas", "kantor", "badan", "sekretariat", "camat"
  ],
  transport: [
    "jalan", "ruas", "jembatan", "kereta", "rel", "transportasi", "terminal", "pelabuhan", "pelayaran"
  ],
  water: [
    "sungai", "danau", "waduk", "irigasi", "drainase", "saluran", "air", "tanggul", "tambak"
  ],
  terrain: [
    "kontur", "topografi", "elevasi", "ketinggian", "tinggi", "medan"
  ],
  agriculture: [
    "pertanian", "sawah", "ladang", "perkebunan", "peternakan", "tambak"
  ],
  landuse: [
    "tutupan lahan", "penggunaan lahan", "permukiman", "perumahan", "hutan", "semak", "belukar",
    "alang", "padang rumput", "lahan terbuka", "sawah", "ladang", "perkebunan", "tambak"
  ],
  infrastructure: [
    "infrastruktur", "prasarana", "telekomunikasi", "energi", "listrik", "jaringan", "menara", "fasilitas"
  ]
};

function normalizeSearchText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeSearch(value) {
  return normalizeSearchText(value).split(" ").filter(Boolean);
}

function uniqueStrings(values) {
  return [...new Set(values.map(normalizeSearchText).flatMap((value) => value.split(" ")).filter(Boolean))];
}

const LAYER_INTENT_OVERRIDES = {
  "jalan": ["transport"],
  "jaringan-transportasi": ["transport"],
  "jaringan-prasarana-lainnya": ["infrastructure"],
  "jaringan-sumber-daya-air": ["water", "infrastructure"],
  "jaringan-telekomunikasi": ["infrastructure"],
  "jaringan-energi": ["infrastructure"],
  "kontur": ["terrain"],
  "sungai": ["water"],
  "danau": ["water", "landuse"],
  "tambak": ["water", "agriculture", "landuse"],
  "pemukiman": ["landuse"],
  "agri-kebun": ["agriculture", "landuse"],
  "agri-ladang": ["agriculture", "landuse"],
  "agri-sawah": ["agriculture", "landuse"],
  "non-agri-hutan-kering": ["landuse"],
  "non-agri-hutan-basah": ["landuse"],
  "non-agri-semak-belukar": ["landuse"],
  "non-agri-alang": ["landuse"],
  "infra-transportasi": ["transport", "infrastructure"],
  "infra-prasarana-lainnya": ["infrastructure"],
  "infra-sumber-daya-air": ["water", "infrastructure"],
  "infra-telekomunikasi": ["infrastructure"],
  "infra-energi": ["infrastructure"]
};

function inferIntentTags(layer, properties) {
  const haystack = normalizeSearchText([
    layer?.id, layer?.title, layer?.group,
    properties?.KATEGORI, properties?.KLASIFIKAS, properties?.JENIS,
    properties?.TYPE, properties?.bentuk_pendidikan, properties?.status_sekolah,
    properties?.NAMA_RUAS, properties?.NAMA_JALAN, properties?.NAMOBJ, properties?.NAME,
    properties?.nama, properties?.PUSKESMAS, properties?.POTENSI, properties?.PETERNAKAN
  ].filter(meaningful).join(" "));
  const haystackTokens = new Set(haystack.split(" ").filter(Boolean));
  const isAdministrativeLayer = String(layer?.id || "").startsWith("adm-") || normalizeSearchText(layer?.group) === "administrasi";

  const inferred = Object.entries(INTENT_RULES)
    .filter(([intent, terms]) => {
      if (intent === "administration" && !isAdministrativeLayer) return false;
      return terms.some((term) => {
        const normalizedTerm = normalizeSearchText(term);
        if (!normalizedTerm) return false;
        if (normalizedTerm.includes(" ")) return ` ${haystack} `.includes(` ${normalizedTerm} `);
        return haystackTokens.has(normalizedTerm);
      });
    })
    .map(([intent]) => intent);

  return [...new Set([...(LAYER_INTENT_OVERRIDES[layer?.id] || []), ...inferred])];
}


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

function displayLabel(layer, properties, fallbackLabel, regionNames, villageNames, index) {
  const normalizedLayer = normalizeSearchText(layer?.title || layer?.id || "data peta");
  const fid = properties?.FID ?? properties?.OBJECTID ?? properties?.NO ?? index;

  if (layer?.id === "kontur") {
    const value = Number(properties?.VALKNT);
    const elevation = Number.isFinite(value) ? `${value.toLocaleString("id-ID")} meter` : "Topografi";
    const place = villageNames[0] ? `${villageNames[0]}${regionNames[0] ? ` · ${regionNames[0]}` : ""}` : (regionNames[0] || `Garis ${Number(fid) + 1}`);
    return `Kontur ${elevation} — ${place}`;
  }

  const repeatedLabels = new Set([
    "danau/situ", "permukiman dan tempat kegiatan", "sawah", "semak belukar",
    "tanah kosong/gundul", "hutan lahan kering", "hutan lahan basah",
    "perkebunan", "pertanian lahan kering", "tambak"
  ]);
  const normalizedFallback = normalizeSearchText(fallbackLabel);
  const place = villageNames[0] ? `${villageNames[0]}${regionNames[0] ? ` · ${regionNames[0]}` : ""}` : regionNames[0];

  if (!fallbackLabel) {
    if (place) return `${layer?.title || normalizedLayer} — ${place}`;
    return `${layer?.title || "Data peta"} #${String(fid)}`;
  }

  if (repeatedLabels.has(normalizedFallback)) {
    if (place) return `${fallbackLabel} — ${place}`;
    return `${fallbackLabel} #${String(fid)}`;
  }

  return fallbackLabel;
}


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

      const specificForSearch = firstMeaningful(properties, [
        "NAMA_RUAS", "NAMA_OPD", "PUSKESMAS", "nama_sekolah", "NAMOBJ", "POTENSI", "PETERNAKAN"
      ]);
      const admin = layer.id === "adm-kecamatan"
        ? firstMeaningful(properties, ["Kecamatan", "WADMKC", "nama_kecamatan", "NAMOBJ"])
        : layer.id === "adm-desa"
          ? firstMeaningful(properties, ["Desa", "WADMKD", "nama_desa", "WADMKD", "NAMOBJ"])
          : "";

      const key = featureKey(layer, feature);
      const selectionKey = featureSearchId(layer, feature);
      if (selectionKey == null) continue;

      const dedupeKey = `${layer.id}|${String(selectionKey).toLowerCase()}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

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

      const display = displayLabel(layer, properties, admin || label, regionNames, villageNames, index);
      const valueSearchTerms = layer.id === "kontur" && meaningful(properties?.VALKNT)
        ? [`${properties.VALKNT}`, `${properties.VALKNT} meter`, "meter", "m"]
        : [];

      const searchableValues = [
        layer.title, layer.group, label, specificForSearch, contextSummary,
        regionNames.join(" "), villageNames.join(" "),
        ...SEARCH_FIELDS.map((field) => properties[field])
      ];
      const intentTags = inferIntentTags(layer, properties);
      const searchTokens = uniqueStrings(searchableValues);

      items.push({
        id: `${layer.id}:${String(key)}:${index}`,
        layerId: layer.id,
        layerTitle: layer.title,
        group: layer.group,
        type,
        key: String(key ?? selectionKey),
        selectionKey: String(selectionKey),
        label: display,
        subtitle: contextSummary === "Kabupaten Wajo" ? `${layer.group} · Kabupaten Wajo` : `${contextSummary} · ${layer.group}`,
        region,
        regions: regionNames,
        regionCodes: unique(kecamatanCodes),
        village: villageNames[0] || "",
        villages: villageNames,
        villageCodes: unique(desaCodes),
        contextSummary,
        coverageCount: Math.max(1, regionNames.length),
        intentTags,
        searchTokens
      });
    }
  }

  const payload = {
    version: 4,
    items
  };
  await fs.writeFile(outputPath, `${JSON.stringify(payload)}\n`);
  console.log(`Search index: ${items.length.toLocaleString("id-ID")} entries → ${path.relative(root, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
