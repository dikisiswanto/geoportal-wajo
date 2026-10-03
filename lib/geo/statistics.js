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
  const distribution = makeDistribution(features, field);
  const kecamatanField = ["KECAMATAN", "kecamatan", "NAMA_KECAMATAN", "nama_kecamatan"].find((key) =>
    features.some((feature) => normalize(feature?.properties?.[key]))
  );
  const kecamatanDistribution = kecamatanField && kecamatanField !== field
    ? makeDistribution(features, kecamatanField)
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
    loaded: Boolean(data)
  };
}

export function getLayerInsight(layer, data, stats = getLayerStatistics(layer, data)) {
  if (stats.total === 0) return "Data layer belum tersedia.";

  const objectLabel = layer?.geometry?.includes("Point") ? "lokasi" : "objek";
  if (stats.mappedCount !== stats.total && stats.unmappedCount > 0) {
    return `${stats.mappedCount.toLocaleString("id-ID")} ${objectLabel} dapat dipetakan dari ${stats.total.toLocaleString("id-ID")} rekaman; ${stats.unmappedCount.toLocaleString("id-ID")} tanpa koordinat valid.`;
  }

  if (stats.kecamatanDistribution?.length > 0) {
    return `${stats.total.toLocaleString("id-ID")} ${objectLabel} terpetakan pada ${stats.kecamatanDistribution.length.toLocaleString("id-ID")} kecamatan.`;
  }

  if (stats.distribution?.length > 0) {
    const top = stats.distribution[0];
    return `${stats.total.toLocaleString("id-ID")} ${objectLabel}. Kategori terbanyak: ${top.label} (${top.count.toLocaleString("id-ID")}).`;
  }

  return `${stats.total.toLocaleString("id-ID")} ${objectLabel} tersedia pada dataset ini.`;
}
