import { normalizeRegionName } from "./region";

const RELATED_BY_LAYER = {
  "adm-kabupaten": [
    "satuan-pendidikan",
    "puskesmas",
    "opd",
    "infra-transportasi",
    "infra-telekomunikasi",
    "potensi-pertanian",
    "potensi-peternakan"
  ],
  "adm-kecamatan": [
    "satuan-pendidikan",
    "puskesmas",
    "opd",
    "infra-transportasi",
    "infra-telekomunikasi",
    "potensi-pertanian",
    "potensi-peternakan"
  ],
  "adm-desa": [
    "satuan-pendidikan",
    "puskesmas",
    "infra-transportasi",
    "infra-telekomunikasi",
    "potensi-pertanian",
    "potensi-peternakan"
  ],
  "satuan-pendidikan": [
    "puskesmas",
    "infra-transportasi",
    "infra-telekomunikasi",
    "potensi-pertanian",
    "potensi-peternakan"
  ],
  "puskesmas": [
    "satuan-pendidikan",
    "opd",
    "infra-transportasi",
    "infra-sumber-daya-air",
    "potensi-pertanian"
  ],
  "opd": [
    "puskesmas",
    "satuan-pendidikan",
    "infra-transportasi",
    "infra-telekomunikasi"
  ],
  "potensi-pertanian": [
    "potensi-peternakan",
    "satuan-pendidikan",
    "puskesmas",
    "infra-transportasi"
  ],
  "potensi-peternakan": [
    "potensi-pertanian",
    "satuan-pendidikan",
    "puskesmas",
    "infra-transportasi"
  ],
  "infra-transportasi": [
    "satuan-pendidikan",
    "puskesmas",
    "opd",
    "infra-telekomunikasi"
  ],
  "toponimi": [
    "adm-kecamatan",
    "satuan-pendidikan",
    "puskesmas"
  ]
};

export function getRelatedLayerIds(layerId) {
  return RELATED_BY_LAYER[layerId] ?? [
    "satuan-pendidikan",
    "puskesmas",
    "infra-transportasi",
    "potensi-pertanian"
  ];
}

export function getRegionCount(summary, file, regionName) {
  if (!summary || !file || !regionName) return 0;
  const target = normalizeRegionName(regionName);
  const item = summary[file];
  return item?.regions?.find(
    (entry) => normalizeRegionName(entry.name) === target
  )?.count ?? 0;
}
