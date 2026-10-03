export function featureHasRenderableGeometry(feature) {
  const geometry = feature?.geometry;
  if (!geometry?.type) return false;
  if (geometry.type === "GeometryCollection") {
    return Array.isArray(geometry.geometries) && geometry.geometries.length > 0;
  }
  return Array.isArray(geometry.coordinates) && geometry.coordinates.length > 0;
}

export function featurePassesLayerFilter(layer, feature) {
  const filter = layer?.featureFilter;
  if (!filter) return true;

  const value = feature?.properties?.[filter.field];
  const normalized = String(value ?? "").trim().toLowerCase();
  if (filter.excludeEmpty && normalized === "") return false;

  const excluded = new Set(
    (filter.excludeValues ?? []).map((item) => String(item ?? "").trim().toLowerCase())
  );
  return !excluded.has(normalized);
}
