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

const boundarySpatialIndexCache = new WeakMap();

function geometryBounds(geometry) {
  const points = geometryCoordinatePoints(geometry);
  if (!points.length) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return { minX, minY, maxX, maxY };
}

function boundsContainPoint(bounds, point) {
  return Boolean(
    bounds &&
    point[0] >= bounds.minX &&
    point[0] <= bounds.maxX &&
    point[1] >= bounds.minY &&
    point[1] <= bounds.maxY
  );
}

function getBoundarySpatialIndex(boundaryData) {
  if (!boundaryData || typeof boundaryData !== "object") return [];

  const cached = boundarySpatialIndexCache.get(boundaryData);
  if (cached) return cached;

  const index = (boundaryData.features ?? [])
    .map((boundary) => {
      const name =
        boundary?.properties?.Kecamatan ??
        boundary?.properties?.WADMKC ??
        boundary?.properties?.nama_kecamatan ??
        boundary?.properties?.NAMOBJ;
      if (!name || !boundary?.geometry) return null;

      const bounds = geometryBounds(boundary.geometry);
      return bounds ? { boundary, name: String(name).trim(), bounds } : null;
    })
    .filter(Boolean);

  boundarySpatialIndexCache.set(boundaryData, index);
  return index;
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



function geometryCoordinatePoints(geometry) {
  if (!geometry?.coordinates) return [];

  const points = [];
  const visit = (value) => {
    if (!Array.isArray(value) || !value.length) return;
    if (typeof value[0] === "number" && typeof value[1] === "number") {
      points.push([Number(value[0]), Number(value[1])]);
      return;
    }
    value.forEach(visit);
  };

  visit(geometry.coordinates);
  return points;
}

function sampledGeometryPoints(geometry, maxPoints = 1200) {
  const vertices = geometryCoordinatePoints(geometry);
  if (!vertices.length) return [];

  const samples = [];
  const add = (point) => {
    if (
      Array.isArray(point) &&
      Number.isFinite(point[0]) &&
      Number.isFinite(point[1])
    ) {
      samples.push(point);
    }
  };

  if (vertices.length <= maxPoints) {
    vertices.forEach(add);
  } else {
    const step = (vertices.length - 1) / Math.max(1, maxPoints - 1);
    for (let index = 0; index < maxPoints; index += 1) {
      add(vertices[Math.min(vertices.length - 1, Math.round(index * step))]);
    }
  }

  // Add midpoints between sampled vertices. This catches a line/polygon
  // crossing an administrative boundary between two stored vertices.
  const sampled = samples.slice();
  for (let index = 1; index < sampled.length && samples.length < maxPoints * 1.5; index += 1) {
    const previous = sampled[index - 1];
    const current = sampled[index];
    add([
      (previous[0] + current[0]) / 2,
      (previous[1] + current[1]) / 2
    ]);
  }

  return samples;
}

/**
 * Resolve the administrative kecamatan touched by a thematic feature.
 *
 * This is intentionally evaluated on-demand for a selected/search result,
 * rather than during the search-index build. It keeps builds fast while
 * making Point, LineString and Polygon searches spatially aware.
 *
 * Returns:
 * - []                  feature could not be located
 * - [one region]        feature is spatially attributable to one kecamatan
 * - [multiple regions]  feature crosses/touches multiple kecamatan
 */
function resolveRegionNamesFromPoints(points, spatialIndex) {
  const names = new Map();

  for (const point of points) {
    for (const entry of spatialIndex) {
      if (!boundsContainPoint(entry.bounds, point)) continue;

      const geometry = entry.boundary.geometry;
      const inside =
        geometry.type === "Polygon"
          ? pointInPolygon(point, geometry.coordinates)
          : geometry.type === "MultiPolygon"
            ? pointInMultiPolygon(point, geometry.coordinates)
            : false;

      if (inside) {
        const normalized = normalizeRegionName(entry.name);
        if (normalized && !names.has(normalized)) {
          names.set(normalized, entry.name);
        }
      }
    }
  }

  return names;
}

function boundsOverlap(first, second) {
  if (!first || !second) return false;
  return !(
    first.maxX < second.minX ||
    first.minX > second.maxX ||
    first.maxY < second.minY ||
    first.minY > second.maxY
  );
}

export function featureRegionNames(feature, boundaryData) {
  if (!feature?.geometry || !boundaryData?.features?.length) return [];

  const spatialIndex = getBoundarySpatialIndex(boundaryData);
  if (!spatialIndex.length) return [];

  const geometryType = feature.geometry.type;
  const fastPoints = sampledGeometryPoints(
    feature.geometry,
    geometryType === "Point" ? 1 : 64
  );
  const fastNames = resolveRegionNamesFromPoints(fastPoints, spatialIndex);

  // Points are exact after one containment test. For lines/polygons, first
  // use a small sample set. Most local features sit wholly inside one
  // kecamatan, so this avoids scanning thousands of vertices on every search.
  if (geometryType === "Point") {
    return [...fastNames.values()];
  }

  const featureBounds = geometryBounds(feature.geometry);
  const overlappingBoundaries = featureBounds
    ? spatialIndex.filter((entry) => boundsOverlap(featureBounds, entry.bounds))
    : spatialIndex;

  if (fastNames.size === 1 && overlappingBoundaries.length <= 1) {
    return [...fastNames.values()];
  }

  if (fastNames.size > 1) {
    return [...fastNames.values()];
  }

  // A larger second pass is only needed when the fast pass is inconclusive
  // or the feature envelope could span multiple kecamatan.
  const deepPoints = sampledGeometryPoints(feature.geometry, 480);
  const deepNames = resolveRegionNamesFromPoints(deepPoints, spatialIndex);
  if (deepNames.size) return [...deepNames.values()];

  // If spatial sampling cannot resolve the feature, retain explicit source
  // metadata as a fallback. Geometry always wins when it produces a result.
  const propertyRegion = regionFromProperties(feature.properties);
  if (propertyRegion) return [propertyRegion];

  return [];
}

const featureRegionContextCache = new WeakMap();

export function featureSearchRegionContext(feature, boundaryData) {
  if (feature && boundaryData) {
    const byBoundary = featureRegionContextCache.get(feature);
    const cached = byBoundary?.get(boundaryData);
    if (cached) return cached;
  }

  const regions = featureRegionNames(feature, boundaryData);
  const context = regions.length !== 1
    ? {
      regions,
      region: "",
      ambiguous: regions.length > 1
    }
    : {
      regions,
      region: regions[0],
      ambiguous: false
    };

  if (feature && boundaryData) {
    let byBoundary = featureRegionContextCache.get(feature);
    if (!byBoundary) {
      byBoundary = new WeakMap();
      featureRegionContextCache.set(feature, byBoundary);
    }
    byBoundary.set(boundaryData, context);
  }

  return context;
}
