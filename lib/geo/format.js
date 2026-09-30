export function formatValue(value) {
  if (value == null || value === "") return "—";
  if (typeof value === "number") {
    return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 3 }).format(value);
  }
  return String(value);
}

export function featureLabel(layer, feature) {
  const properties = feature?.properties ?? {};
  return properties[layer.labelField] ?? properties[layer.categoricalField ?? "NAMOBJ"] ?? layer.title;
}

export function buildKecamatanLegend(data, colorFor) {
  return data?.features?.map((feature) => ({
    id: `${feature.properties?.FID ?? ""}-${feature.properties?.Kecamatan ?? ""}`,
    name: feature.properties?.Kecamatan || "Kecamatan",
    color: colorFor(feature.properties?.Kecamatan)
  })).sort((a, b) => a.name.localeCompare(b.name, "id")) ?? [];
}
