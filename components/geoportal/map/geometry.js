export const DEFAULT_VIEW = [-4.13, 120.03];

function getResponsiveHomeFitOptions(map) {
  const size = map.getSize();
  const width = Math.max(size.x || 0, 1);
  const height = Math.max(size.y || 0, 1);
  const compact = width < 768 || height < 560;

  const horizontal = Math.round(
    Math.min(64, Math.max(20, width * 0.035))
  );
  const vertical = Math.round(
    Math.min(56, Math.max(20, height * 0.035))
  );

  return {
    paddingTopLeft: [horizontal, vertical],
    paddingBottomRight: [horizontal, compact ? Math.max(64, vertical) : vertical],
    maxZoom: compact ? 11 : 12,
    animate: false
  };
}

export function fitWajoBounds(map, L, data) {
  if (!map || !data) return false;

  const bounds = L.geoJSON(data).getBounds();

  if (!bounds.isValid()) return false;

  map.invalidateSize({ pan: false, debounceMoveend: true });
  map.fitBounds(bounds, getResponsiveHomeFitOptions(map));
  return true;
}

export function getFeatureBounds(L, feature) {
  if (!feature) return null;
  const bounds = L.geoJSON(feature).getBounds();
  return bounds.isValid() ? bounds : null;
}


function pointInRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i += 1) {
    const xi = Number(ring[i]?.[0]);
    const yi = Number(ring[i]?.[1]);
    const xj = Number(ring[j]?.[0]);
    const yj = Number(ring[j]?.[1]);
    if (![xi, yi, xj, yj].every(Number.isFinite)) continue;

    const intersects =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / ((yj - yi) || Number.EPSILON) + xi;

    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInPolygonCoordinates(lng, lat, coordinates) {
  if (!Array.isArray(coordinates)) return false;
  let inside = false;
  for (const ring of coordinates) {
    if (pointInRing(lng, lat, ring)) inside = !inside;
  }
  return inside;
}

export function pointInFeature(feature, latlng) {
  const geometry = feature?.geometry;
  if (!geometry || !latlng) return false;

  const lng = Number(latlng.lng);
  const lat = Number(latlng.lat);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return false;

  if (geometry.type === "Polygon") {
    return pointInPolygonCoordinates(lng, lat, geometry.coordinates);
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates?.some((polygon) =>
      pointInPolygonCoordinates(lng, lat, polygon)
    ) ?? false;
  }

  return false;
}

export function findFeatureLayerAtLatLng(group, latlng) {
  if (!group || !latlng) return null;

  let target = null;
  group.eachLayer?.((candidate) => {
    if (target || !candidate?.__wajoFeature) return;

    const bounds = candidate.getBounds?.();
    if (bounds?.isValid?.() && !bounds.contains(latlng)) return;

    const feature = candidate.__wajoFeature;
    const geometryType = feature?.geometry?.type;
    if (["Polygon", "MultiPolygon"].includes(geometryType) && pointInFeature(feature, latlng)) {
      target = candidate;
    }
  });

  return target;
}
