const RELATED_BY_LAYER = {
  "adm-kecamatan": [
    "satuan-pendidikan",
    "puskesmas",
    "opd",
    "sarana-transportasi",
    "sarana-telekomunikasi",
    "potensi-pertanian",
    "potensi-peternakan"
  ],
  "satuan-pendidikan": [
    "puskesmas",
    "sarana-transportasi",
    "sarana-telekomunikasi",
    "potensi-pertanian",
    "potensi-peternakan"
  ],
  "puskesmas": [
    "satuan-pendidikan",
    "opd",
    "sarana-transportasi",
    "sarana-sumber-daya-air",
    "potensi-pertanian"
  ],
  "opd": [
    "puskesmas",
    "satuan-pendidikan",
    "sarana-transportasi",
    "sarana-telekomunikasi"
  ],
  "potensi-pertanian": [
    "potensi-peternakan",
    "satuan-pendidikan",
    "puskesmas",
    "sarana-transportasi"
  ],
  "potensi-peternakan": [
    "potensi-pertanian",
    "satuan-pendidikan",
    "puskesmas",
    "sarana-transportasi"
  ],
  "infra-transportasi": [
    "satuan-pendidikan",
    "puskesmas",
    "opd",
    "sarana-telekomunikasi"
  ],
  "toponimi": [
    "adm-kecamatan",
    "satuan-pendidikan",
    "puskesmas"
  ]
};

export function regionDisplayName(name) {
  return String(name || "")
    .replace(/^\s*Kec\.?\s*/i, "Kecamatan ")
    .trim();
}

export function getRelatedLayerIds(layerId) {
  return RELATED_BY_LAYER[layerId] ?? [
    "satuan-pendidikan",
    "puskesmas",
    "sarana-transportasi",
    "potensi-pertanian"
  ];
}

export function getRegionCount(summary, file, regionName) {
  if (!summary || !file || !regionName) return 0;
  const target = String(regionName).trim().toLowerCase();
  const item = summary[file];
  return item?.regions?.find(
    (entry) => String(entry.name).trim().toLowerCase() === target
  )?.count ?? 0;
}
