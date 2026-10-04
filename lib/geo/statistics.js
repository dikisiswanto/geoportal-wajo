export function getFeatureCount(data) {
  return Array.isArray(data?.features) ? data.features.length : 0;
}

function normalize(value) {
  return String(value ?? "").trim();
}

function getGeometryType(feature) {
  return feature?.geometry?.type || "Koordinat tidak tersedia";
}

function getCandidateField(layer) {
  return layer?.categoricalField || (
    layer?.id === "satuan-pendidikan" ? "bentuk_pendidikan" :
    layer?.id === "puskesmas" ? "KECAMATAN" :
    layer?.id === "opd" ? "NAMA_OPD" : null
  );
}

const EDUCATION_TYPE_LABELS = {
  TK: "Taman Kanak-Kanak",
  KB: "Kelompok Bermain",
  TPA: "Taman Pendidikan Al-Qur'an",
  PAUDQ: "PAUD Al-Qur'an",
  RA: "Raudhatul Athfal",
  SD: "Sekolah Dasar",
  MI: "Madrasah Ibtidaiyah",
  SMP: "Sekolah Menengah Pertama",
  MTs: "Madrasah Tsanawiyah",
  SMA: "Sekolah Menengah Atas",
  SMK: "Sekolah Menengah Kejuruan",
  MA: "Madrasah Aliyah",
  SLB: "Sekolah Luar Biasa",
  PKBM: "Pusat Kegiatan Belajar Masyarakat",
  SKB: "Sanggar Kegiatan Belajar",
  Kursus: "Kursus",
  "PDF Ulya": "Pendidikan Diniyah Formal Ulya"
};

const EDUCATION_GROUPS = [
  { label: "Pendidikan anak usia dini", values: ["TK", "KB", "TPA", "PAUDQ", "RA"] },
  { label: "Pendidikan dasar", values: ["SD", "MI", "SMP", "MTs"] },
  { label: "Pendidikan menengah", values: ["SMA", "SMK", "MA"] },
  { label: "Pendidikan khusus", values: ["SLB"] },
  { label: "Pendidikan masyarakat", values: ["PKBM", "SKB", "Kursus"] },
  { label: "Pendidikan keagamaan", values: ["PDF Ulya"] }
];

function makeEducationTypeDistribution(features) {
  const counts = new Map();
  for (const feature of features) {
    const value = normalize(feature?.properties?.bentuk_pendidikan);
    if (!value) continue;
    const label = EDUCATION_TYPE_LABELS[value] ?? value;
    counts.set(label, (counts.get(label) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"))
    .map(([label, count]) => ({ label, count }));
}

function makeEducationGroupDistribution(features) {
  return EDUCATION_GROUPS
    .map(({ label, values }) => {
      const count = features.reduce((total, feature) => {
        const value = normalize(feature?.properties?.bentuk_pendidikan);
        return total + (values.includes(value) ? 1 : 0);
      }, 0);
      return { label, count };
    })
    .filter((item) => item.count > 0);
}

function makeEducationStatusDistribution(features) {
  return makeDistribution(features, "status_sekolah", 4).map((item) => ({
    ...item,
    label: normalize(item.label) === "NEGERI" ? "Negeri" :
      normalize(item.label) === "SWASTA" ? "Swasta" : item.label
  }));
}

function makeEducationAccreditationDistribution(features) {
  const counts = new Map();
  for (const feature of features) {
    const value = normalize(feature?.properties?.akreditasi);
    const label = value || "Belum diisi";
    counts.set(label, (counts.get(label) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"))
    .map(([label, count]) => ({ label: label === "Tidak Terakreditasi" ? "Tidak terakreditasi" : label, count }));
}

function makeDistribution(features, field, limit = 6) {
  if (!field) return [];
  const counts = new Map();
  for (const feature of features) {
    const value = normalize(feature?.properties?.[field]);
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  if (counts.size > 20) return [];
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export function getLayerStatistics(layer, data, summary = null) {
  const features = Array.isArray(data?.features) ? data.features : [];
  const geometryCounts = new Map();
  for (const feature of features) {
    const type = getGeometryType(feature);
    geometryCounts.set(type, (geometryCounts.get(type) || 0) + 1);
  }

  const field = layer?.group === "Jaringan" ? null : getCandidateField(layer);
  const isEducation = layer?.id === "satuan-pendidikan";
  const distribution = isEducation
    ? makeEducationTypeDistribution(features)
    : makeDistribution(features, field, layer?.group === "Administrasi" ? 14 : 6);
  const kecamatanField = ["KECAMATAN", "kecamatan", "NAMA_KECAMATAN", "nama_kecamatan"].find((key) =>
    features.some((feature) => normalize(feature?.properties?.[key]))
  );
  const kecamatanDistribution = kecamatanField && kecamatanField !== field
    ? makeDistribution(features, kecamatanField, 14)
    : [];

  const total = features.length || summary?.total || 0;
  const mappedCount = features.length
    ? features.filter((feature) => Boolean(feature?.geometry)).length
    : (summary?.mappedCount ?? total);
  const unmappedCount = features.length
    ? total - mappedCount
    : (summary?.unmappedCount ?? 0);

  return {
    total,
    mappedCount,
    unmappedCount,
    geometryCounts: features.length
      ? [...geometryCounts.entries()].map(([label, count]) => ({ label, count }))
      : Object.entries(summary?.geometryCounts || {}).map(([label, count]) => ({ label, count })),
    primaryField: field,
    distribution,
    kecamatanField,
    kecamatanDistribution,
    kecamatanCount: kecamatanDistribution.length || summary?.kecamatanCount || 0,
    educationTypeDistribution: isEducation ? distribution : [],
    educationGroupDistribution: isEducation ? makeEducationGroupDistribution(features) : [],
    educationStatusDistribution: isEducation ? makeEducationStatusDistribution(features) : [],
    educationAccreditationDistribution: isEducation ? makeEducationAccreditationDistribution(features) : [],
    loaded: Boolean(data)
  };
}

export function getLayerInsight(layer, data, stats = getLayerStatistics(layer, data)) {
  if (stats.total === 0) return "Belum ada data.";

  const objectLabel = layer?.id?.startsWith("adm-") ? "wilayah" : layer?.geometry?.includes("Point") ? "lokasi" : layer?.geometry?.includes("LineString") ? "jalur" : "area";
  if (stats.mappedCount !== stats.total && stats.unmappedCount > 0) {
    return `${stats.mappedCount.toLocaleString("id-ID")} ${objectLabel} tampil dari ${stats.total.toLocaleString("id-ID")} data; ${stats.unmappedCount.toLocaleString("id-ID")} belum memiliki lokasi.`;
  }

  if (stats.kecamatanDistribution?.length > 0) {
    return `${stats.total.toLocaleString("id-ID")} ${objectLabel} tersebar di ${stats.kecamatanDistribution.length.toLocaleString("id-ID")} kecamatan.`;
  }

  if (stats.distribution?.length > 0) {
    const top = stats.distribution[0];
    return `${stats.total.toLocaleString("id-ID")} ${objectLabel}. Kategori terbanyak: ${top.label} (${top.count.toLocaleString("id-ID")}).`;
  }

  return `${stats.total.toLocaleString("id-ID")} ${objectLabel} tersedia.`;
}
