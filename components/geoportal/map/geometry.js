export const DEFAULT_VIEW = [-4.13, 120.03];

function getInteractiveMapOcclusion(map) {
  const container = map?.getContainer?.();
  const root = container?.closest?.("#map");
  if (!container || !root) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const mapRect = container.getBoundingClientRect?.();
  if (!mapRect || mapRect.width <= 0 || mapRect.height <= 0) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const occlusion = { top: 0, right: 0, bottom: 0, left: 0 };
  const panels = root.querySelectorAll?.(
    ".sheet-panel-left.sheet-panel-visible, .sheet-panel-right.sheet-panel-visible"
  );

  panels?.forEach?.((panel) => {
    const rect = panel.getBoundingClientRect?.();
    if (!rect) return;

    const horizontalOverlap = Math.max(
      0,
      Math.min(mapRect.right, rect.right) - Math.max(mapRect.left, rect.left)
    );
    const verticalOverlap = Math.max(
      0,
      Math.min(mapRect.bottom, rect.bottom) - Math.max(mapRect.top, rect.top)
    );
    const hasHorizontalOverlap = horizontalOverlap > 1;
    const hasVerticalOverlap = verticalOverlap > 1;
    const sidePanel =
      hasHorizontalOverlap &&
      hasVerticalOverlap &&
      verticalOverlap >= mapRect.height * 0.8;
    const horizontalPanel =
      hasHorizontalOverlap &&
      hasVerticalOverlap &&
      horizontalOverlap >= mapRect.width * 0.8;

    if (sidePanel && rect.left <= mapRect.left + 2) {
      occlusion.left = Math.max(
        occlusion.left,
        Math.min(mapRect.width, horizontalOverlap)
      );
    }

    if (sidePanel && rect.right >= mapRect.right - 2) {
      occlusion.right = Math.max(
        occlusion.right,
        Math.min(mapRect.width, horizontalOverlap)
      );
    }

    if (horizontalPanel && rect.top <= mapRect.top + 2) {
      occlusion.top = Math.max(
        occlusion.top,
        Math.min(mapRect.height, verticalOverlap)
      );
    }

    if (horizontalPanel && rect.bottom >= mapRect.bottom - 2) {
      occlusion.bottom = Math.max(
        occlusion.bottom,
        Math.min(mapRect.height, verticalOverlap)
      );
    }
  });

  return occlusion;
}

function getResponsiveHomeFitOptions(map) {
  const size = map.getSize();
  const width = Math.max(size.x || 0, 1);
  const height = Math.max(size.y || 0, 1);
  const compact = width < 768 || height < 560;
  const occlusion = getInteractiveMapOcclusion(map);

  const horizontal = Math.round(
    Math.min(64, Math.max(20, width * 0.035))
  );
  const vertical = Math.round(
    Math.min(56, Math.max(20, height * 0.035))
  );

  return {
    paddingTopLeft: [horizontal + occlusion.left, vertical + occlusion.top],
    paddingBottomRight: [
      horizontal + occlusion.right,
      compact ? Math.max(64, vertical) + occlusion.bottom : vertical + occlusion.bottom
    ],
    maxZoom: compact ? 11 : 12,
    animate: false
  };
}

export function getInteractiveMapFitOptions(map, {
  horizontal = 44,
  vertical = 44,
  maxZoom,
  animate = false
} = {}) {
  const occlusion = getInteractiveMapOcclusion(map);
  const resolvedMaxZoom = Number.isFinite(maxZoom) ? maxZoom : 19;

  return {
    paddingTopLeft: [horizontal + occlusion.left, vertical + occlusion.top],
    paddingBottomRight: [horizontal + occlusion.right, vertical + occlusion.bottom],
    maxZoom: resolvedMaxZoom,
    animate
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
