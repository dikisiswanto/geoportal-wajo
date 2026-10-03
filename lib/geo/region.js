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


function normalizeCode(value) {
  return String(value ?? "").trim();
}

function asCodeList(value) {
  if (Array.isArray(value)) return value.map(normalizeCode).filter(Boolean);
  const code = normalizeCode(value);
  return code ? [code] : [];
}

export function administrativeFeatureCode(feature, type) {
  const properties = feature?.properties ?? {};
  if (type === "kecamatan") {
    return normalizeCode(
      properties.kode_kecamatan_kemendagri ??
      properties.kode_kecamatan ??
      properties.KDCPUM ??
      properties.KDCBPS
    );
  }
  if (type === "desa") {
    return normalizeCode(
      properties.kode_desa ??
      properties.kode_desa_kemendagri ??
      properties.KDEPUM ??
      properties.KDEBPS
    );
  }
  return normalizeCode(properties.kode_kabupaten ?? properties.KDPKAB ?? properties.KDBBPS);
}

export function featureAdministrativeCodes(feature, type) {
  const properties = feature?.properties ?? {};
  if (type === "kecamatan") {
    return asCodeList(
      properties.wilayah_kecamatan_kode ??
      properties.kode_kecamatan_kemendagri ??
      properties.kode_kecamatan ??
      properties.KDCPUM
    );
  }
  if (type === "desa") {
    return asCodeList(
      properties.wilayah_desa_kode ??
      properties.kode_desa ??
      properties.kode_desa_kemendagri ??
      properties.KDEPUM
    );
  }
  return [];
}

export function regionCodeFromBoundaryName(regionName, boundaryData) {
  const target = normalizeRegionName(regionName);
  if (!target || !boundaryData?.features?.length) return "";

  for (const boundary of boundaryData.features) {
    const properties = boundary?.properties ?? {};
    const name = properties.Kecamatan ?? properties.WADMKC ?? properties.nama_kecamatan ?? properties.NAMOBJ;
    if (!name || normalizeRegionName(name) !== target) continue;
    return administrativeFeatureCode(boundary, "kecamatan");
  }
  return "";
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

  const targetCode = regionCodeFromBoundaryName(regionName, boundaryData);
  if (targetCode) {
    const codes = featureAdministrativeCodes(feature, "kecamatan");
    if (codes.length) return codes.includes(targetCode);
  }

  const featureRegion = featureRegionName(feature, boundaryData);
  return featureRegion
    ? normalizeRegionName(featureRegion) === normalizeRegionName(regionName)
    : false;
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
  const adminVillageCode = administrativeFeatureCode(administrativeFeature, "desa");
  const adminKecamatanCode = administrativeFeatureCode(administrativeFeature, "kecamatan");

  if (adminVillageCode) {
    const villageCodes = featureAdministrativeCodes(feature, "desa");
    if (villageCodes.length) return villageCodes.includes(adminVillageCode);

    // Untuk pilihan desa, kode kecamatan saja belum cukup untuk menyatakan
    // bahwa feature berada di desa tersebut. Lanjutkan ke pencocokan nama
    // atau geometri agar seluruh kecamatan tidak ikut tampil.
  } else if (adminKecamatanCode) {
    const kecamatanCodes = featureAdministrativeCodes(feature, "kecamatan");
    if (kecamatanCodes.length) return kecamatanCodes.includes(adminKecamatanCode);
  }

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

  return !point && !featureVillage && !featureAdministrativeCodes(feature, "desa").length && !featureAdministrativeCodes(feature, "kecamatan").length;
}

