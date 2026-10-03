const REGION_ALIASES = {
  sabbangparu: "sabangparu"
};

const REGION_DISPLAY_NAMES = {
  sabangparu: "Sabbang Paru",
  maniangpajo: "Maniang Pajo"
};

export function normalizeRegionName(value) {
  const normalized = String(value || "")
    .toLowerCase()
    .replace(/^\s*kec\.?\s*/i, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();

  return REGION_ALIASES[normalized] ?? normalized;
}

export function regionDisplayName(value) {
  const raw = String(value || "").trim();
  const cleaned = raw.replace(/^kec\.?\s*/i, "").trim();
  const canonical = REGION_DISPLAY_NAMES[normalizeRegionName(cleaned)] ?? cleaned;
  return canonical ? `Kecamatan ${canonical}` : "Kecamatan";
}

function pointInRing(point, ring) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / ((yj - yi) || Number.EPSILON) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInPolygon(point, coordinates) {
  if (!coordinates?.length) return false;
  if (!pointInRing(point, coordinates[0])) return false;
  for (let i = 1; i < coordinates.length; i += 1) {
    if (pointInRing(point, coordinates[i])) return false;
  }
  return true;
}

function pointInMultiPolygon(point, coordinates) {
  return coordinates?.some((polygon) => pointInPolygon(point, polygon)) ?? false;
}

function geometryPoint(geometry) {
  const type = geometry?.type;
  const coordinates = geometry?.coordinates;
  if (type === "Point") return coordinates;
  return null;
}

function regionFromProperties(properties) {
  for (const key of ["KECAMATAN", "Kecamatan", "kecamatan", "WADMKC", "nama_kecamatan"]) {
    const value = properties?.[key];
    if (value) return String(value).trim();
  }
  return null;
}

export function featureRegionName(feature, boundaryData) {
  const fromProperties = regionFromProperties(feature?.properties);
  if (fromProperties) return fromProperties;

  const point = geometryPoint(feature?.geometry);
  if (!point || !boundaryData?.features?.length) return null;

  for (const boundary of boundaryData.features) {
    const name = boundary?.properties?.Kecamatan ?? boundary?.properties?.WADMKC ?? boundary?.properties?.NAMOBJ;
    const geometry = boundary?.geometry;
    if (!name || !geometry) continue;
    if (geometry.type === "Polygon" && pointInPolygon(point, geometry.coordinates)) return String(name).trim();
    if (geometry.type === "MultiPolygon" && pointInMultiPolygon(point, geometry.coordinates)) return String(name).trim();
  }
  return null;
}

export function featureMatchesRegion(feature, regionName, boundaryData) {
  if (!regionName) return true;
  const featureRegion = featureRegionName(feature, boundaryData);
  return featureRegion ? normalizeRegionName(featureRegion) === normalizeRegionName(regionName) : true;
}

function geometryContainsPoint(geometry, point) {
  if (!geometry || !point) return false;
  if (geometry.type === "Polygon") return pointInPolygon(point, geometry.coordinates);
  if (geometry.type === "MultiPolygon") return pointInMultiPolygon(point, geometry.coordinates);
  return false;
}

export function featureMatchesAdministrativeFeature(feature, administrativeFeature) {
  if (!feature || !administrativeFeature) return true;

  const adminProperties = administrativeFeature.properties ?? {};
  const featureProperties = feature.properties ?? {};
  const adminVillage = String(
    adminProperties.Desa ?? adminProperties.WADMKD ?? adminProperties.nama_desa ?? adminProperties.nama_desa_kemendagri ?? ""
  ).trim();
  const adminKecamatan = String(
    adminProperties.Kecamatan ?? adminProperties.WADMKC ?? adminProperties.nama_kecamatan ?? ""
  ).trim();
  const featureVillage = String(
    featureProperties.Desa ?? featureProperties.WADMKD ?? featureProperties.desa ?? featureProperties.nama_desa ?? ""
  ).trim();
  const featureKecamatan = String(
    featureProperties.Kecamatan ?? featureProperties.WADMKC ?? featureProperties.kecamatan ?? featureProperties.nama_kecamatan ?? ""
  ).trim();

  if (adminVillage && featureVillage) {
    const villageMatch = normalizeRegionName(featureVillage) === normalizeRegionName(adminVillage);
    const kecamatanMatch = !adminKecamatan || !featureKecamatan || normalizeRegionName(featureKecamatan) === normalizeRegionName(adminKecamatan);
    if (villageMatch && kecamatanMatch) return true;
  }

  const geometry = feature.geometry;
  const point = geometryPoint(geometry);
  if (point && geometryContainsPoint(administrativeFeature.geometry, point)) return true;

  return !point && !featureVillage;
}
