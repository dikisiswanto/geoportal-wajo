"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";

import {
  markerIconMarkup,
  pointKind
} from "../../lib/geo/markers";

import {
  featureKey,
  featureLabel
} from "../../lib/geo/format";

import {
  styleFor,
  kecamatanColor
} from "../../lib/geo/styles";
import { withAssetVersion } from "../../lib/assetVersion";
import { featurePassesLayerFilter } from "../../lib/geo/dataFilter";

import {
  featureMatchesRegion,
  featureMatchesAdministrativeFeature,
  featureAdministrativeCodes,
  administrativeFeatureCode,
  regionCodeFromBoundaryName,
  featureRegionName,
  normalizeRegionName
} from "../../lib/geo/region";

const DEFAULT_VIEW = [-4.13, 120.03];

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

function fitWajoBounds(map, L, data) {
  if (!map || !data) return false;

  const bounds = L.geoJSON(data).getBounds();

  if (!bounds.isValid()) return false;

  map.invalidateSize({ pan: false, debounceMoveend: true });
  map.fitBounds(bounds, getResponsiveHomeFitOptions(map));
  return true;
}

function getFeatureBounds(L, feature) {
  if (!feature) return null;
  const bounds = L.geoJSON(feature).getBounds();
  return bounds.isValid() ? bounds : null;
}

function getAdminContextKey(regionFilter, focusAdmin) {
  const type = String(focusAdmin?.type ?? "").trim();
  const feature = focusAdmin?.feature;
  const code = feature
    ? administrativeFeatureCode(
        feature,
        type === "desa" ? "desa" : type === "kecamatan" ? "kecamatan" : "kabupaten"
      )
    : "";
  const name = feature
    ? administrativeName(feature, type === "desa" ? "desa" : "kecamatan")
    : "";

  return [
    normalizeRegionName(regionFilter),
    type,
    code,
    normalizeRegionName(name)
  ].join("|");
}

function getPrintScope(L, { regionFilter, focusAdmin, countyData, districtData, villageData }) {
  if (focusAdmin?.feature) {
    const bounds = getFeatureBounds(L, focusAdmin.feature);
    if (bounds) {
      return {
        type: focusAdmin.type || "wilayah",
        feature: focusAdmin.feature,
        bounds
      };
    }
  }

  const target = normalizeRegionName(regionFilter);
  if (target && districtData?.features?.length) {
    const feature = districtData.features.find((item) => {
      const properties = item?.properties ?? {};
      const name = String(
        properties.Kecamatan ?? properties.WADMKC ?? properties.nama_kecamatan ?? properties.NAMOBJ ?? ""
      ).trim();
      return normalizeRegionName(name) === target;
    });
    const bounds = getFeatureBounds(L, feature);
    if (bounds) {
      return { type: "kecamatan", feature, bounds };
    }
  }

  const villageTarget = String(focusAdmin?.feature?.properties?.Desa ?? "").trim();
  if (villageTarget && villageData?.features?.length) {
    const feature = villageData.features.find((item) =>
      String(item?.properties?.Desa ?? item?.properties?.WADMKD ?? item?.properties?.nama_desa ?? "").trim().toLowerCase() === villageTarget.toLowerCase()
    );
    const bounds = getFeatureBounds(L, feature);
    if (bounds) return { type: "desa", feature, bounds };
  }

  if (countyData?.features?.length) {
    const bounds = L.geoJSON(countyData).getBounds();
    if (bounds.isValid()) return { type: "kabupaten", feature: countyData.features[0], bounds };
  }

  return null;
}

function lockPrintViewport(map, printLayoutRef) {
  const mapContainer = map?.getContainer?.();
  const printRoot = mapContainer?.closest?.("#map") || mapContainer?.parentElement;
  if (!printRoot || !mapContainer) return null;

  if (!printLayoutRef.current) {
    printLayoutRef.current = {
      root: printRoot,
      rootStyle: printRoot.getAttribute("style"),
      mapStyle: mapContainer.getAttribute("style")
    };
  }

  printRoot.style.position = "fixed";
  printRoot.style.inset = "0";
  printRoot.style.width = "100vw";
  printRoot.style.height = "100vh";
  printRoot.style.margin = "0";
  printRoot.style.padding = "0";
  printRoot.style.overflow = "hidden";

  mapContainer.style.width = "100%";
  mapContainer.style.height = "100%";
  mapContainer.style.position = "absolute";
  mapContainer.style.inset = "0";

  return { printRoot, mapContainer };
}

function restorePrintViewport(map, printLayoutRef) {
  const snapshot = printLayoutRef.current;
  if (!snapshot) return;

  if (snapshot.rootStyle == null) snapshot.root.removeAttribute("style");
  else snapshot.root.setAttribute("style", snapshot.rootStyle);

  const mapContainer = map?.getContainer?.();
  if (mapContainer) {
    if (snapshot.mapStyle == null) mapContainer.removeAttribute("style");
    else mapContainer.setAttribute("style", snapshot.mapStyle);
  }

  printLayoutRef.current = null;
}

function districtMatchesPrintScope(feature, scope) {
  if (!feature || !scope) return false;
  if (scope.type === "kecamatan") {
    return administrationFeatureMatchesTarget(feature, scope.feature, "kecamatan");
  }
  if (scope.type === "desa") {
    const villageDistrictCode = featureAdministrativeCodes(scope.feature, "kecamatan")[0];
    const districtCodes = featureAdministrativeCodes(feature, "kecamatan");
    if (villageDistrictCode && districtCodes.includes(villageDistrictCode)) return true;
    return normalizeRegionName(administrativeName(feature, "kecamatan")) === normalizeRegionName(administrativeName(scope.feature, "kecamatan"));
  }
  return scope.type === "kabupaten";
}

function villageMatchesPrintScope(feature, scope) {
  if (!feature || !scope || scope.type !== "desa") return false;
  return administrationFeatureMatchesTarget(feature, scope.feature, "desa");
}

function applyPrintAdministrationStyles(layerRefs, loadedData, scope) {
  const countyGroup = layerRefs?.["adm-kabupaten"];
  const countyData = loadedData?.["adm-kabupaten"];
  if (countyGroup && countyData?.features?.length) {
    countyGroup.eachLayer?.((featureLayer) => {
      const feature = featureLayer?.__wajoFeature;
      if (!feature) return;
      const base = featureLayer.__wajoBaseStyle || styleFor({ styleMode: "admin-county-outline" }, feature);
      featureLayer.__wajoPrintStyleSnapshot = base;
      featureLayer.setStyle?.({
        ...base,
        color: "#1e293b",
        weight: 2.35,
        opacity: 0.98,
        fillOpacity: 0
      });
    });
  }

  const districtGroup = layerRefs?.["adm-kecamatan"];
  const districtData = loadedData?.["adm-kecamatan"];
  if (districtGroup && districtData?.features?.length) {
    districtGroup.eachLayer?.((featureLayer) => {
      const feature = featureLayer?.__wajoFeature;
      if (!feature) return;
      const base = featureLayer.__wajoBaseStyle || styleFor({ styleMode: "admin" }, feature);
      const selected = districtMatchesPrintScope(feature, scope);
      featureLayer.__wajoPrintStyleSnapshot = base;
      featureLayer.setStyle?.({
        ...base,
        fillColor: selected
          ? kecamatanColor(
              feature?.properties?.KDCPUM ??
              feature?.properties?.kode_kecamatan ??
              feature?.properties?.Kecamatan ??
              feature?.properties?.WADMKC ??
              feature?.properties?.NAMOBJ
            )
          : "#cbd5e1",
        fillOpacity: selected ? 0.36 : 0,
        weight: selected ? 2.15 : 1.15,
        color: selected ? "#1e293b" : "#64748b",
        opacity: selected ? 0.98 : 0.88
      });
    });
  }

  const villageGroup = layerRefs?.["adm-desa"];
  const villageData = loadedData?.["adm-desa"];
  if (villageGroup && villageData?.features?.length) {
    villageGroup.eachLayer?.((featureLayer) => {
      const feature = featureLayer?.__wajoFeature;
      if (!feature) return;
      const base = featureLayer.__wajoBaseStyle || styleFor({ styleMode: "admin-village" }, feature);
      const selected = villageMatchesPrintScope(feature, scope);
      featureLayer.__wajoPrintStyleSnapshot = base;
      featureLayer.setStyle?.({
        ...base,
        fillColor: selected ? "#64748b" : "#cbd5e1",
        fillOpacity: selected ? 0.24 : 0,
        weight: selected ? 1.55 : 0.9,
        color: selected ? "#334155" : "#94a3b8",
        opacity: selected ? 0.96 : 0.8
      });
    });
  }
}

function restorePrintAdministrationStyles(layerRefs) {
  ["adm-kabupaten", "adm-kecamatan", "adm-desa"].forEach((id) => {
    layerRefs?.[id]?.eachLayer?.((featureLayer) => {
      const snapshot = featureLayer?.__wajoPrintStyleSnapshot;
      if (!snapshot) return;
      featureLayer.setStyle?.(snapshot);
      delete featureLayer.__wajoPrintStyleSnapshot;
    });
  });
}

function fitMapForPrint(map, scope, printLayoutRef) {
  if (!map || !scope?.bounds) return false;
  lockPrintViewport(map, printLayoutRef);
  map.invalidateSize({ pan: false, debounceMoveend: false });

  const size = map.getSize();
  const shortest = Math.max(1, Math.min(size.x, size.y));
  const edgePadding = Math.round(Math.min(84, Math.max(42, shortest * 0.065)));
  const padding = [edgePadding, edgePadding];
  const maxZoom = scope.type === "desa" ? 17 : scope.type === "kecamatan" ? 15 : 13;
  const zoom = map.getBoundsZoom(scope.bounds, false, padding);
  const safeZoom = Number.isFinite(zoom) ? Math.min(zoom, maxZoom) : 12;

  map.setView(scope.bounds.getCenter(), safeZoom, { animate: false });
  map.invalidateSize({ pan: false, debounceMoveend: false });
  return true;
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

function pointInFeature(feature, latlng) {
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

function findFeatureLayerAtLatLng(group, latlng) {
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

const REGION_MEMBERSHIP_CACHE = new WeakMap();

function getRegionMembership(data) {
  if (!data?.features?.length) return null;

  const cached = REGION_MEMBERSHIP_CACHE.get(data);
  if (cached?.length === data.features.length) return cached;

  const membership = data.features.map((feature) => featureAdministrativeCodes(feature, "kecamatan"));
  REGION_MEMBERSHIP_CACHE.set(data, membership);
  return membership;
}

const FILTERED_DATA_CACHE = new WeakMap();

function filterGeoJsonForLayer(layer, data, regionFilter, boundaryData, focusAdmin) {
  const hasRegionFilter = Boolean(regionFilter);

  if (!hasRegionFilter && !focusAdmin && !layer?.featureFilter) return data;
  if (!Array.isArray(data?.features)) return data;

  const focusCode = focusAdmin?.feature
    ? featureAdministrativeCodes(focusAdmin.feature, focusAdmin.type === "desa" ? "desa" : "kecamatan")[0] || ""
    : "";
  const targetRegionCode = hasRegionFilter
    ? regionCodeFromBoundaryName(regionFilter, boundaryData)
    : "";
  const cacheKey = `${layer?.id ?? "layer"}|${targetRegionCode}|${focusAdmin?.type ?? ""}|${focusCode}`;
  let layerCache = FILTERED_DATA_CACHE.get(data);
  if (!layerCache) {
    layerCache = new Map();
    FILTERED_DATA_CACHE.set(data, layerCache);
  }
  if (layerCache.has(cacheKey)) return layerCache.get(cacheKey);
  const membership = hasRegionFilter && !["adm-kecamatan", "adm-kabupaten", "adm-desa"].includes(layer?.id)
    ? getRegionMembership(data)
    : null;

  const filtered = data.features.filter((feature, index) => {
    if (!featurePassesLayerFilter(layer, feature)) return false;

    if (focusAdmin?.feature && (focusAdmin.type === "desa" || focusAdmin.type === "kecamatan")) {
      return featureMatchesAdministrativeFeature(feature, focusAdmin.feature);
    }

    if (!hasRegionFilter || ["adm-kecamatan", "adm-kabupaten", "adm-desa"].includes(layer?.id)) {
      return true;
    }

    const regionCodes = membership?.[index] ?? featureAdministrativeCodes(feature, "kecamatan");
    if (targetRegionCode && regionCodes.length) return regionCodes.includes(targetRegionCode);

    return featureMatchesRegion(feature, regionFilter, boundaryData);
  });

  const result = filtered.length === data.features.length ? data : { ...data, features: filtered };
  layerCache.set(cacheKey, result);
  return result;
}

function layerPaneName(layer) {
  if (layer?.styleMode === "admin-county-outline") return "adminCounty";
  if (layer?.styleMode === "admin") return "adminDistrict";
  if (layer?.styleMode === "admin-village") return "adminVillage";
  return `wajoData-${String(layer?.id ?? "layer").replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function dataPaneZIndex(layer, index) {
  const geometry = String(layer?.geometry ?? "").toLowerCase();

  // Semua data tematik berada di atas batas administrasi. Di dalam data tematik,
  // titik berada paling atas, kemudian jaringan, lalu area/polygon.
  const base = geometry.includes("point")
    ? 700
    : geometry.includes("line")
      ? 600
      : 500;

  return String(base + Math.min(index, 99));
}

function ensureLayerPane(map, layer, index) {
  const paneName = layerPaneName(layer);
  const existing = map.getPane?.(paneName);

  if (existing) return paneName;

  const pane = map.createPane(paneName);
  pane.classList.add("leaflet-wajo-data-pane");
  pane.style.zIndex = dataPaneZIndex(layer, index);
  pane.style.pointerEvents = "auto";
  return paneName;
}

function selectedStyleFor(layer, baseStyle, isPolygon) {
  if (!isPolygon) {
    return {
      ...baseStyle,
      weight: 2.8,
      color: "#0f172a"
    };
  }

  if (layer?.styleMode === "admin-county-outline") {
    return {
      ...baseStyle,
      weight: 3,
      color: "#0f172a",
      fillOpacity: 0
    };
  }

  if (layer?.styleMode === "admin") {
    return {
      ...baseStyle,
      weight: 2.5,
      color: "#1e293b",
      fillOpacity: 0.46
    };
  }

  if (layer?.styleMode === "admin-village") {
    return {
      ...baseStyle,
      weight: 2.2,
      color: "#334155",
      fillOpacity: 0.18
    };
  }

  return {
    ...baseStyle,
    weight: 2.6,
    color: "#0f172a",
    fillOpacity: 0.82
  };
}

function isAdministrativeLayerId(layerId) {
  return layerId === "adm-kabupaten" || layerId === "adm-kecamatan" || layerId === "adm-desa";
}

function administrativeName(feature, type) {
  const properties = feature?.properties ?? {};
  if (type === "desa") {
    return String(
      properties.Desa ??
      properties.WADMKD ??
      properties.nama_desa ??
      properties.NAMOBJ ??
      ""
    ).trim();
  }

  if (type === "kabupaten") {
    return String(
      properties.Kabupaten ??
      properties.WADMKK ??
      properties.nama_kabupaten ??
      properties.NAMOBJ ??
      ""
    ).trim();
  }

  return String(
    properties.Kecamatan ??
    properties.WADMKC ??
    properties.nama_kecamatan ??
    properties.kecamatan ??
    properties.NAMOBJ ??
    ""
  ).trim();
}

function administrationFeatureMatchesTarget(feature, targetFeature, type) {
  if (!feature || !targetFeature || !type) return false;

  const targetCode = administrativeFeatureCode(targetFeature, type);
  const featureCode = administrativeFeatureCode(feature, type);

  if (targetCode && featureCode) {
    return targetCode === featureCode;
  }

  const targetCodes = featureAdministrativeCodes(targetFeature, type);
  const featureCodes = featureAdministrativeCodes(feature, type);
  if (targetCodes.length && featureCodes.length) {
    return featureCodes.some((code) => targetCodes.includes(code));
  }

  const targetName = administrativeName(targetFeature, type);
  const featureName = administrativeName(feature, type);
  return Boolean(targetName && featureName) &&
    normalizeRegionName(targetName) === normalizeRegionName(featureName);
}

function applyActiveAdministrationStyles(layerRefs, loadedData, { focusAdmin, regionFilter } = {}) {
  const districtGroup = layerRefs?.["adm-kecamatan"];
  const districtData = loadedData?.["adm-kecamatan"];
  const districtTarget = focusAdmin?.type === "kecamatan"
    ? focusAdmin.feature
    : null;
  const activeRegion = String(regionFilter ?? "").trim();

  if (districtGroup && districtData?.features?.length) {
    districtGroup.eachLayer?.((featureLayer) => {
      const feature = featureLayer?.__wajoFeature;
      if (!feature) return;
      const base = featureLayer.__wajoBaseStyle || styleFor({ styleMode: "admin" }, feature);
      const selectedByFeature = districtTarget
        ? administrationFeatureMatchesTarget(feature, districtTarget, "kecamatan")
        : false;
      const selectedByRegion = !selectedByFeature && activeRegion
        ? normalizeRegionName(administrativeName(feature, "kecamatan")) === normalizeRegionName(activeRegion)
        : false;
      const selected = selectedByFeature || selectedByRegion;
      featureLayer.__wajoActiveAdmin = selected;

      featureLayer.setStyle?.(selected
        ? selectedStyleFor({ styleMode: "admin" }, base, true)
        : base
      );
    });
  }

  const villageGroup = layerRefs?.["adm-desa"];
  const villageData = loadedData?.["adm-desa"];
  if (villageGroup && villageData?.features?.length) {
    villageGroup.eachLayer?.((featureLayer) => {
      const feature = featureLayer?.__wajoFeature;
      if (!feature) return;
      const base = featureLayer.__wajoBaseStyle || styleFor({ styleMode: "admin-village" }, feature);
      const selected = focusAdmin?.type === "desa"
        ? administrationFeatureMatchesTarget(feature, focusAdmin.feature, "desa")
        : false;
      featureLayer.__wajoActiveAdmin = selected;
      featureLayer.setStyle?.(selected
        ? selectedStyleFor({ styleMode: "admin-village" }, base, true)
        : base
      );
    });
  }
}

function setFeatureSelectedVisual(featureLayer, layer, baseStyle, isPolygon, selected) {
  if (!featureLayer) return;

  featureLayer.__wajoSelected = selected;

  if (typeof featureLayer.setStyle === "function") {
    featureLayer.setStyle(
      selected
        ? selectedStyleFor(layer, baseStyle, isPolygon)
        : baseStyle
    );
  }

  if (typeof featureLayer.setZIndexOffset === "function") {
    const baseOffset = featureLayer.__wajoBaseZIndexOffset ?? 0;
    featureLayer.setZIndexOffset(selected ? baseOffset + 500 : baseOffset);
  }
}

function applyFeatureHoverVisual(featureLayer, layer, baseStyle) {
  if (!featureLayer || featureLayer.__wajoSelected || featureLayer.__wajoActiveAdmin) return;

  if (typeof featureLayer.setStyle === "function") {
    featureLayer.setStyle(hoverStyleFor(layer, baseStyle));
  }

  if (typeof featureLayer.setZIndexOffset === "function") {
    const baseOffset = featureLayer.__wajoBaseZIndexOffset ?? 0;
    featureLayer.setZIndexOffset(baseOffset + 250);
  }
}

function restoreFeatureHoverVisual(featureLayer, baseStyle) {
  if (!featureLayer || featureLayer.__wajoSelected) return;

  if (typeof featureLayer.setStyle === "function") {
    featureLayer.setStyle(
      featureLayer.__wajoActiveAdmin
        ? selectedStyleFor(
            { styleMode: featureLayer.__wajoLayerStyleMode },
            baseStyle,
            true
          )
        : baseStyle
    );
  }

  if (typeof featureLayer.setZIndexOffset === "function") {
    featureLayer.setZIndexOffset(featureLayer.__wajoBaseZIndexOffset ?? 0);
  }
}

function hoverStyleFor(layer, baseStyle) {
  if (layer?.styleMode === "admin-county-outline") {
    return {
      ...baseStyle,
      weight: 2.5,
      color: "#0f172a",
      fillOpacity: 0
    };
  }

  if (layer?.styleMode === "admin") {
    return {
      ...baseStyle,
      weight: 2.1,
      color: "#334155",
      fillOpacity: 0.38
    };
  }

  if (layer?.styleMode === "admin-village") {
    return {
      ...baseStyle,
      weight: 1.4,
      color: "#64748b",
      fillOpacity: 0.05
    };
  }

  return {
    ...baseStyle,
    weight: 2.05,
    color: "#334155",
    fillOpacity: Math.min(0.82, (baseStyle.fillOpacity ?? 0.7) + 0.12)
  };
}

const MapCanvas = forwardRef(function MapCanvas(
  {
    visible,
    layers,
    onFeatureSelect,
    onLayerDataLoaded,
    onLayerLoading,
    onLayerError,
    onStatus,
    onCoords,
    onViewChange,
    regionFilter,
    focusAdmin = null,
    retryTokens = {}
  },
  ref
) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);

  const layerRefs = useRef({});
  const loadedData = useRef({});
  const requestCache = useRef({});

  const tileRef = useRef(null);
  const selectedRef = useRef(null);
  const printViewRef = useRef(null);
  const printLayoutRef = useRef(null);
  const markerIconCacheRef = useRef(new Map());
  const vectorRenderersRef = useRef(new Map());
  const leafletRef = useRef(null);
  const printStyleRef = useRef(false);
  const printScopeRef = useRef(null);
  const visibleRef = useRef(visible);
  const layersRefForImperative = useRef(layers);
  const regionFilterRef = useRef(regionFilter);
  const focusAdminRef = useRef(focusAdmin);
  const handledDomEventsRef = useRef(new WeakSet());

  const [errors, setErrors] = useState({});
  const [renderVersion, setRenderVersion] = useState(0);
  const retryTokensRef = useRef({});

  const onStatusRef = useRef(onStatus);
  const onCoordsRef = useRef(onCoords);
  const onLayerLoadingRef = useRef(onLayerLoading);
  const onLayerErrorRef = useRef(onLayerError);
  const onLayerDataLoadedRef =
    useRef(onLayerDataLoaded);
  const onFeatureSelectRef =
    useRef(onFeatureSelect);
  const onViewChangeRef = useRef(onViewChange);

  useEffect(() => {
    onStatusRef.current = onStatus;
  }, [onStatus]);

  useEffect(() => {
    onCoordsRef.current = onCoords;
  }, [onCoords]);

  useEffect(() => {
    onLayerLoadingRef.current = onLayerLoading;
  }, [onLayerLoading]);

  useEffect(() => {
    onLayerErrorRef.current = onLayerError;
  }, [onLayerError]);

  useEffect(() => {
    onLayerDataLoadedRef.current =
      onLayerDataLoaded;
  }, [onLayerDataLoaded]);

  useEffect(() => {
    onFeatureSelectRef.current =
      onFeatureSelect;
  }, [onFeatureSelect]);

  useEffect(() => {
    onViewChangeRef.current = onViewChange;
  }, [onViewChange]);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    layersRefForImperative.current = layers;
    regionFilterRef.current = regionFilter;
    focusAdminRef.current = focusAdmin;
  }, [layers, regionFilter, focusAdmin]);

  const loadLayerData = useCallback(
    async (layer) => {
      if (loadedData.current[layer.id]) {
        return loadedData.current[layer.id];
      }

      if (requestCache.current[layer.id]) {
        return requestCache.current[layer.id];
      }

      onLayerLoadingRef.current?.(
        layer.id,
        true
      );

      const request = fetch(
        withAssetVersion(`/geo-data/${encodeURIComponent(layer.file)}`),
        {
          cache: "force-cache"
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `HTTP ${response.status}`
            );
          }

          return response.json();
        })
        .then((data) => {
          loadedData.current[layer.id] = data;

          setErrors((previous) => {
            if (!previous[layer.id]) {
              return previous;
            }

            const next = {
              ...previous
            };

            delete next[layer.id];

            return next;
          });

          onLayerDataLoadedRef.current?.(
            layer,
            data
          );

          return data;
        })
        .catch((error) => {
          const message =
            error.message ||
            "Data belum dapat ditampilkan";

          setErrors((previous) => ({
            ...previous,
            [layer.id]: message
          }));

          onLayerErrorRef.current?.(
            layer.id,
            message
          );

          return null;
        })
        .finally(() => {
          onLayerLoadingRef.current?.(
            layer.id,
            false
          );

          delete requestCache.current[
            layer.id
          ];
        });

      requestCache.current[layer.id] =
        request;

      return request;
    },
    []
  );

  /*
   * Leaflet initialization.
   * Hanya berjalan sekali.
   */
  useEffect(() => {
    let disposed = false;
    const layerRefsSnapshot = layerRefs.current;
    const vectorRenderersSnapshot = vectorRenderersRef.current;
    const markerIconCacheSnapshot = markerIconCacheRef.current;

    import("leaflet").then((L) => {
      if (
        disposed ||
        !mapNode.current ||
        mapRef.current
      ) {
        return;
      }

      const map = L.map(
        mapNode.current,
        {
          zoomControl: false,
          preferCanvas: true,
          attributionControl: true,
          minZoom: 7,
          maxZoom: 19,
          zoomSnap: 1,
          zoomDelta: 1
        }
      ).setView(
        DEFAULT_VIEW,
        11
      );

      const tintPane =
        map.createPane(
          "basemapTint"
        );

      tintPane.style.zIndex =
        "250";

      tintPane.style.pointerEvents =
        "none";

      const adminCountyPane = map.createPane("adminCounty");
      adminCountyPane.style.zIndex = "320";

      const adminDistrictPane = map.createPane("adminDistrict");
      adminDistrictPane.style.zIndex = "330";

      const adminVillagePane = map.createPane("adminVillage");
      adminVillagePane.style.zIndex = "340";

      const adminLabelPane = map.createPane("adminLabel");
      adminLabelPane.style.zIndex = "350";
      adminLabelPane.style.pointerEvents = "none";

      const featureTooltipPane = map.createPane("featureTooltip");
      featureTooltipPane.style.zIndex = "1200";
      featureTooltipPane.style.pointerEvents = "none";

      L.DomUtil.create(
        "div",
        "leaflet-basemap-tint",
        tintPane
      );

      const osm =
        L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            maxNativeZoom: 19,
            tileSize: 256,
            updateWhenIdle: true,
            keepBuffer: 2,
            crossOrigin: true,
            attribution:
              "&copy; OpenStreetMap contributors"
          }
        );

      osm.on(
        "loading",
        () =>
          onStatusRef.current?.(
            "Menyiapkan peta dasar…"
          )
      );

      osm.on(
        "load",
        () =>
          onStatusRef.current?.(
            "Peta dasar siap"
          )
      );

      osm.on(
        "tileerror",
        () =>
          onStatusRef.current?.(
            "Peta dasar tidak dapat dimuat"
          )
      );

      osm.addTo(map);

      tileRef.current = osm;

      let coordsTimer = 0;
      let latestCoords = null;
      let lastCoordsUpdate = 0;
      const coordsThrottle = 120;

      const flushCoords = () => {
        coordsTimer = 0;
        if (!latestCoords) return;

        lastCoordsUpdate = performance.now();
        onCoordsRef.current?.(
          `${latestCoords.lat.toFixed(5)}, ${latestCoords.lng.toFixed(5)}`
        );
      };

      const handleMapMouseMove = (event) => {
        latestCoords = event.latlng;
        const elapsed = performance.now() - lastCoordsUpdate;
        if (coordsTimer || elapsed < coordsThrottle) return;
        coordsTimer = window.setTimeout(flushCoords, coordsThrottle);
      };

      map.on("mousemove", handleMapMouseMove);

      map.on("click", (event) => {
        const originalEvent = event?.originalEvent;
        const latlng = event?.latlng;
        if (!originalEvent || !latlng) return;

        const visibleNow = visibleRef.current || {};
        const handled = handledDomEventsRef.current.has(originalEvent);
        const currentFocus = focusAdminRef.current;
        const selectedLayerId = selectedRef.current?.__wajoLayerId;

        // A direct administrative click has already selected the correct
        // feature. Do not replay it through the map-level hit test.
        if (handled && isAdministrativeLayerId(selectedLayerId)) return;

        const navigationType = currentFocus?.type === "desa" ? "desa" : "kecamatan";
        const priority = navigationType === "desa"
          ? [
              { layerId: "adm-desa", type: "desa" },
              { layerId: "adm-kecamatan", type: "kecamatan" },
              { layerId: "adm-kabupaten", type: "kabupaten" }
            ]
          : [
              { layerId: "adm-kecamatan", type: "kecamatan" },
              { layerId: "adm-kabupaten", type: "kabupaten" },
              { layerId: "adm-desa", type: "desa" }
            ];

        for (const candidate of priority) {
          if (!visibleNow[candidate.layerId]) continue;

          const target = findFeatureLayerAtLatLng(
            layerRefs.current[candidate.layerId],
            latlng
          );
          if (!target) continue;

          const feature = target.__wajoFeature;
          const currentFeature = currentFocus?.feature;
          const sameFeature = currentFeature
            ? administrationFeatureMatchesTarget(
                feature,
                currentFeature,
                candidate.type
              )
            : false;

          // With a thematic feature on top, keep that feature's click when
          // it belongs to the current administrative context. When the user
          // is already inside another context, promote a click landing in a
          // different administrative region so navigation remains available.
          const canPromoteHandled = handled && Boolean(currentFocus) && !sameFeature;
          if (!handled || canPromoteHandled) {
            target.fire("click", { originalEvent, latlng });
            return;
          }
        }
      });

      map.on(
        "zoomend",
        () =>
          onStatusRef.current?.(
            `Zoom ${map.getZoom()} · WGS84`
          )
      );

      map.on("moveend", () => {
        const center = map.getCenter();
        onViewChangeRef.current?.({
          lat: Number(center.lat.toFixed(5)),
          lng: Number(center.lng.toFixed(5)),
          zoom: map.getZoom()
        });
      });

      mapRef.current = map;
      leafletRef.current = L;
      setRenderVersion((value) => value + 1);

      map.whenReady(() => {
        window.requestAnimationFrame(
          () =>
            map.invalidateSize({
              pan: false
            })
        );
      });

      const beforePrint = () => {
        if (!mapRef.current) return;

        if (!printViewRef.current) {
          const center = map.getCenter();
          printViewRef.current = {
            lat: center.lat,
            lng: center.lng,
            zoom: map.getZoom()
          };
        }

        const scope = printScopeRef.current || getPrintScope(L, {
          regionFilter: regionFilterRef.current,
          focusAdmin: focusAdminRef.current,
          countyData: loadedData.current["adm-kabupaten"],
          districtData: loadedData.current["adm-kecamatan"],
          villageData: loadedData.current["adm-desa"]
        });

        if (scope) {
          applyPrintAdministrationStyles(layerRefs.current, loadedData.current, scope);
          printStyleRef.current = true;
          fitMapForPrint(map, scope, printLayoutRef);
        }
      };

      const afterPrint = () => {
        if (!mapRef.current || !printViewRef.current) {
          restorePrintAdministrationStyles(layerRefs.current);
          printStyleRef.current = false;
          printScopeRef.current = null;
          restorePrintViewport(map, printLayoutRef);
          return;
        }

        const view = printViewRef.current;

        window.requestAnimationFrame(() => {
          const printedScope = printScopeRef.current;
          restorePrintAdministrationStyles(layerRefs.current);
          if (printedScope?.type === "kecamatan" || printedScope?.type === "desa") {
            applyActiveAdministrationStyles(
              layerRefs.current,
              loadedData.current,
              {
                focusAdmin: { type: printedScope.type, feature: printedScope.feature },
                regionFilter: printedScope.type === "kecamatan" ? administrativeName(printedScope.feature, "kecamatan") : ""
              }
            );
          }
          printStyleRef.current = false;
          printScopeRef.current = null;
          restorePrintViewport(map, printLayoutRef);
          map.invalidateSize({ pan: false, debounceMoveend: false });

          map.setView([view.lat, view.lng], view.zoom, { animate: false });

          window.requestAnimationFrame(() => {
            map.invalidateSize({ pan: false });
            printViewRef.current = null;
          });
        });
      };

      window.addEventListener(
        "beforeprint",
        beforePrint
      );

      window.addEventListener(
        "afterprint",
        afterPrint
      );

      map._wajoPrintHandlers = {
        beforePrint,
        afterPrint
      };

      mapRef.current = map;
      map._wajoCoordsTimer = () => {
        if (coordsTimer) {
          window.clearTimeout(coordsTimer);
          coordsTimer = 0;
        }
      };

      onStatusRef.current?.(
        "Peta siap"
      );
    });

    return () => {
      disposed = true;

      const map =
        mapRef.current;

      if (
        map?._wajoPrintHandlers
      ) {
        window.removeEventListener(
          "beforeprint",
          map._wajoPrintHandlers
            .beforePrint
        );

        window.removeEventListener(
          "afterprint",
          map._wajoPrintHandlers
            .afterPrint
        );
      }

      map?._wajoCoordsTimer?.();
      map?.remove();

      mapRef.current = null;
      leafletRef.current = null;
      tileRef.current = null;
      printViewRef.current = null;
      restorePrintAdministrationStyles(layerRefsSnapshot);
      printStyleRef.current = false;
      printScopeRef.current = null;
      restorePrintViewport(map, printLayoutRef);
      vectorRenderersSnapshot.clear();
      markerIconCacheSnapshot.clear();
      Object.values(layerRefsSnapshot).forEach((layerGroup) => layerGroup?.remove?.());
    };
  }, []);

  useEffect(() => {
    const changedIds = layers
      .map((layer) => layer.id)
      .filter((id) => (retryTokens[id] || 0) !== (retryTokensRef.current[id] || 0));

    if (!changedIds.length) return;

    retryTokensRef.current = { ...retryTokens };
    setErrors((previous) => {
      const next = { ...previous };
      changedIds.forEach((id) => delete next[id]);
      return next;
    });
  }, [layers, retryTokens]);

  /*
   * Load data hanya ketika layer aktif.
   */
  useEffect(() => {
    const active =
      layers.filter(
        (layer) =>
          visible[layer.id] &&
          !loadedData.current[
            layer.id
          ] &&
          !errors[layer.id]
      );

    if (!active.length) {
      return;
    }

    Promise.all(
      active.map(loadLayerData)
    ).then(() =>
      setRenderVersion(
        (value) => value + 1
      )
    );
  }, [
    layers,
    loadLayerData,
    visible,
    errors
  ]);

  /*
   * Render vector layers.
   * Administrative layers remain mounted so their interaction never
   * disappears under thematic data. Thematic/vector layers reuse their
   * existing GeoJSON container and only replace feature children when the
   * administrative context changes.
   */
  const previousMapContextKeyRef = useRef(null);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    const contextKey = getAdminContextKey(regionFilter, focusAdmin);
    const contextChanged =
      previousMapContextKeyRef.current !== null &&
      previousMapContextKeyRef.current !== contextKey;

    if (contextChanged) {
      selectedRef.current?.setStyle?.(
        selectedRef.current?.__wajoBaseStyle || {}
      );
      selectedRef.current?.setZIndexOffset?.(
        selectedRef.current?.__wajoBaseZIndexOffset ?? 0
      );
      selectedRef.current = null;
    }

    previousMapContextKeyRef.current = contextKey;

    layers.forEach((layer, layerIndex) => {
      const existing = layerRefs.current[layer.id];
      const sourceData = loadedData.current[layer.id];

      if (!visible[layer.id] || !sourceData) {
        if (existing) {
          existing.remove();
          delete layerRefs.current[layer.id];
        }
        return;
      }

      // Administrative boundaries do not need to be rebuilt when context
      // changes. Their active style is synchronized below.
      const renderKey = isAdministrativeLayerId(layer.id)
        ? `admin:${layer.id}`
        : `${layer.id}:${contextKey}`;

      if (existing) {
        if (existing.__wajoRenderKey !== renderKey) {
          const renderData = filterGeoJsonForLayer(
            layer,
            sourceData,
            regionFilter,
            loadedData.current["adm-kecamatan"],
            focusAdmin
          );

          existing.clearLayers();
          existing.addData(renderData);
          existing.__wajoRenderKey = renderKey;
        }
        return;
      }

      const renderData = filterGeoJsonForLayer(
        layer,
        sourceData,
        regionFilter,
        loadedData.current["adm-kecamatan"],
        focusAdmin
      );

      const paneName = ensureLayerPane(map, layer, layerIndex);

      let vectorRenderer = vectorRenderersRef.current.get(paneName);
      if (!vectorRenderer) {
        vectorRenderer = isAdministrativeLayerId(layer.id)
          ? L.svg({ pane: paneName })
          : L.canvas({ pane: paneName, padding: 0.45 });
        vectorRenderersRef.current.set(paneName, vectorRenderer);
      }

      const createGeoLayer = () => L.geoJSON(renderData, {
        renderer: vectorRenderer,
        pane: paneName,
        interactive: true,
        bubblingMouseEvents: true,
        style: (feature) => styleFor(layer, feature),

        pointToLayer: (feature, latlng) => {
          const isPointLayer = layer.geometry === "Point";
          if (isPointLayer) {
            const kind = pointKind(layer, feature);

            if (kind === "place") {
              return L.circleMarker(latlng, {
                radius: 3.5,
                color: "#fff",
                weight: 1,
                fillColor: layer.color,
                fillOpacity: 0.85
              });
            }

            const iconKey = `${kind}:${layer.color}`;
            let icon = markerIconCacheRef.current.get(iconKey);
            if (!icon) {
              icon = L.divIcon({
                className: "",
                html: markerIconMarkup(kind, layer.color),
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              });
              markerIconCacheRef.current.set(iconKey, icon);
            }

            return L.marker(latlng, {
              icon,
              pane: paneName,
              keyboard: true
            });
          }

          return L.circleMarker(latlng, {
            radius: 4,
            color: "#fff",
            weight: 1,
            fillColor: layer.color,
            fillOpacity: 0.82
          });
        },

        onEachFeature: (feature, featureLayer) => {
          const baseStyle = styleFor(layer, feature);
          const isPolygon =
            ["Polygon", "MultiPolygon"].includes(feature?.geometry?.type) ||
            featureLayer instanceof L.Polygon;

          featureLayer.__wajoFeatureKey = featureKey(layer, feature);
          featureLayer.__wajoFeature = feature;
          featureLayer.__wajoLayerId = layer.id;
          featureLayer.__wajoLayerStyleMode = layer.styleMode;
          featureLayer.__wajoBaseStyle = baseStyle;
          featureLayer.__wajoBaseZIndexOffset =
            featureLayer.options?.zIndexOffset ?? 0;
          featureLayer.__wajoSelected = false;

          featureLayer.on("click", (event) => {
            if (event?.originalEvent) {
              handledDomEventsRef.current.add(event.originalEvent);
            }

            const previousSelected = selectedRef.current;
            if (previousSelected && previousSelected !== featureLayer) {
              restoreFeatureHoverVisual(
                previousSelected,
                previousSelected.__wajoBaseStyle || {}
              );
            }

            selectedRef.current = featureLayer;
            setFeatureSelectedVisual(featureLayer, layer, baseStyle, isPolygon, true);

            onFeatureSelectRef.current?.({
              layer,
              feature,
              featureKey: featureKey(layer, feature),
              regionName: featureRegionName(
                feature,
                loadedData.current["adm-kecamatan"]
              )
            });
          });

          featureLayer.on("mouseover", () => {
            map.getContainer().style.cursor = "pointer";
            applyFeatureHoverVisual(featureLayer, layer, baseStyle);
          });

          featureLayer.on("mouseout", () => {
            map.getContainer().style.cursor = "";
            restoreFeatureHoverVisual(featureLayer, baseStyle);
          });

          if (layer.styleMode === "admin" && (
            feature.properties?.Kecamatan ??
            feature.properties?.WADMKC ??
            feature.properties?.NAMOBJ
          )) {
            featureLayer.bindTooltip(
              String(
                feature.properties.Kecamatan ??
                feature.properties.WADMKC ??
                feature.properties.NAMOBJ
              ),
              {
                permanent: true,
                direction: "center",
                className: "leaflet-kecamatan-label",
                opacity: 1,
                interactive: false,
                pane: "adminLabel"
              }
            );
          } else {
            const label = featureLabel(layer, feature);
            const tooltipOptions = {
              sticky: true,
              direction: "auto",
              opacity: 0.96,
              offset: [10, 0],
              className: "leaflet-smart-tooltip",
              pane: "featureTooltip"
            };

            const bindSmartTooltip = (content) => {
              featureLayer.bindTooltip(String(content), tooltipOptions);
              featureLayer.on("tooltipopen", (event) => {
                const activeMap = mapRef.current;
                const tooltip = event.tooltip;
                const element = tooltip?.getElement?.();
                if (!activeMap || !tooltip || !element) return;

                const size = activeMap.getSize();
                const latLng =
                  event?.latlng ||
                  tooltip?.getLatLng?.() ||
                  featureLayer.getLatLng?.() ||
                  featureLayer.getBounds?.().getCenter?.();
                if (!latLng) return;

                const point = activeMap.latLngToContainerPoint(latLng);
                const width = Math.min(element.offsetWidth || 220, 320);
                const height = Math.min(element.offsetHeight || 40, 140);
                const gap = 12;
                const available = {
                  right: size.x - point.x,
                  left: point.x,
                  bottom: size.y - point.y,
                  top: point.y
                };

                let direction = "top";
                if (available.right >= width + gap) {
                  direction = "right";
                } else if (available.left >= width + gap) {
                  direction = "left";
                } else if (available.bottom >= height + gap) {
                  direction = "bottom";
                }

                const offsets = {
                  right: [10, 0],
                  left: [-10, 0],
                  bottom: [0, 10],
                  top: [0, -10]
                };

                tooltip.options.direction = direction;
                tooltip.options.offset = offsets[direction];
                tooltip.update();
              });
            };

            if (layer.styleMode === "admin-village") {
              if (label) {
                featureLayer.bindTooltip(String(label), {
                  permanent: true,
                  direction: "center",
                  className: "leaflet-desa-label",
                  opacity: 0.9,
                  interactive: false,
                  pane: "adminLabel"
                });
              }
            } else if (layer.styleMode === "admin-county-outline") {
              bindSmartTooltip(
                feature.properties?.nama_kabupaten ??
                  feature.properties?.WADMKK ??
                  feature.properties?.NAMOBJ ??
                  "Kabupaten Wajo"
              );
            } else if ((
              layer.group === "Infrastruktur" ||
              layer.group === "Pendidikan"
            ) && (
              feature.properties?.NAMOBJ ||
              feature.properties?.nama_sekolah
            )) {
              bindSmartTooltip(
                feature.properties?.NAMOBJ ||
                  feature.properties?.nama_sekolah
              );
            } else if (
              layer.styleMode === "toponym" ||
              (label && layer.labelField && layer.geometry === "Point")
            ) {
              bindSmartTooltip(label);
            }
          }
        }
      });

      const geoLayer = createGeoLayer().addTo(map);
      geoLayer.__wajoRenderKey = renderKey;
      layerRefs.current[layer.id] = geoLayer;
    });

    applyActiveAdministrationStyles(
      layerRefs.current,
      loadedData.current,
      { focusAdmin, regionFilter }
    );

    const adminLayer = layerRefs.current["adm-kecamatan"];
    if (
      adminLayer &&
      visible["adm-kecamatan"] &&
      !map._wajoInitialFit
    ) {
      if (adminLayer.getBounds().isValid()) {
        fitWajoBounds(map, L, adminLayer.toGeoJSON());
      }
      map._wajoInitialFit = true;
    }
  }, [layers, visible, renderVersion, regionFilter, focusAdmin]);

  useImperativeHandle(
    ref,
    () => ({
      isReady: () =>
        !!mapRef.current,

      zoomIn: () =>
        mapRef.current?.zoomIn(),

      zoomOut: () =>
        mapRef.current?.zoomOut(),

      zoomHome: () => {
        if (!mapRef.current) {
          return;
        }

        import("leaflet").then(
          (L) => {
            const countyData = loadedData.current["adm-kabupaten"];
            if (countyData && fitWajoBounds(mapRef.current, L, countyData)) {
              return;
            }

            const districtData = loadedData.current["adm-kecamatan"];
            if (districtData && fitWajoBounds(mapRef.current, L, districtData)) {
              return;
            }

            mapRef.current.setView(
              DEFAULT_VIEW,
              11
            );
          }
        );
      },

      setView: ({ lat, lng, zoom } = {}) => {
        if (!mapRef.current || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
        mapRef.current.setView([lat, lng], Number.isFinite(zoom) ? zoom : mapRef.current.getZoom(), { animate: false });
      },

      zoomToRegion: (regionName) => {
        if (!mapRef.current || !regionName) return;
        const adminData = loadedData.current["adm-kecamatan"];
        if (!adminData?.features?.length) return;
        import("leaflet").then((L) => {
          const feature = adminData.features.find((item) =>
            String(item?.properties?.Kecamatan ?? item?.properties?.WADMKC ?? item?.properties?.NAMOBJ ?? "").trim().toLowerCase() === String(regionName).trim().toLowerCase()
          );
          if (!feature) return;
          const bounds = L.geoJSON(feature).getBounds();
          if (bounds.isValid()) {
            mapRef.current.fitBounds(bounds, { padding: [56, 56], maxZoom: 13, animate: true });
          }
        });
      },

      selectFeature: (layerId, key) => {
        const group = layerRefs.current[layerId];
        if (!group || key == null) return false;
        let target = null;
        group.eachLayer?.((candidate) => {
          if (target) return;
          if (candidate?.__wajoFeatureKey != null && String(candidate.__wajoFeatureKey) === String(key)) {
            target = candidate;
          }
        });
        if (!target) return false;
        target.fire?.("click");
        return true;
      },

      shareView: () => {
        if (!mapRef.current) return null;
        const center = mapRef.current.getCenter();
        return {
          lat: Number(center.lat.toFixed(5)),
          lng: Number(center.lng.toFixed(5)),
          zoom: mapRef.current.getZoom()
        };
      },

      locateMe: () => {
        if (
          !navigator.geolocation ||
          !mapRef.current
        ) {
          onStatus?.(
            "Lokasi perangkat tidak tersedia"
          );

          return;
        }

        onStatus?.(
          "Mencari lokasi…"
        );

        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            mapRef.current.setView(
              [
                coords.latitude,
                coords.longitude
              ],
              15
            );

            onStatus?.(
              "Lokasi ditemukan"
            );
          },

          () =>
            onStatus?.(
              "Lokasi tidak tersedia"
            ),

          {
            enableHighAccuracy:
              true,
            timeout: 10000
          }
        );
      },

      preparePrint: async () => {
        const map = mapRef.current;
        if (!map) return false;

        const L = await import("leaflet");

        if (!printViewRef.current) {
          const center = map.getCenter();
          printViewRef.current = { lat: center.lat, lng: center.lng, zoom: map.getZoom() };
        }

        const activeIds = layers.filter((layer) => visible[layer.id]).map((layer) => layer.id);
        const startedAt = performance.now();
        while (activeIds.some((id) => !loadedData.current[id] && !errors[id]) && performance.now() - startedAt < 5000) {
          await new Promise((resolve) => window.setTimeout(resolve, 80));
        }

        const scope = getPrintScope(L, {
          regionFilter,
          focusAdmin,
          countyData: loadedData.current["adm-kabupaten"],
          districtData: loadedData.current["adm-kecamatan"],
          villageData: loadedData.current["adm-desa"]
        });

        if (!scope) return false;

        restorePrintAdministrationStyles(layerRefs.current);
        printScopeRef.current = scope;
        applyPrintAdministrationStyles(layerRefs.current, loadedData.current, scope);
        printStyleRef.current = true;
        fitMapForPrint(map, scope, printLayoutRef);

        await new Promise((resolve) => {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              fitMapForPrint(map, scope, printLayoutRef);
              map.invalidateSize({ pan: false, debounceMoveend: false });
              resolve();
            });
          });
        });

        return true;
      },

      zoomToLayer: (layerId) => {
        if (!mapRef.current) return;

        const renderedLayer = layerRefs.current[layerId];
        const renderedBounds = renderedLayer?.getBounds?.();
        if (renderedBounds?.isValid?.()) {
          mapRef.current.fitBounds(renderedBounds, {
            padding: [44, 44],
            maxZoom: regionFilterRef.current ? 15 : 14,
            animate: true
          });
          return;
        }

        const data = loadedData.current[layerId];
        const layerConfig = layersRefForImperative.current.find((item) => item.id === layerId);
        if (!data || !layerConfig) return;

        import("leaflet").then((L) => {
          const scoped = filterGeoJsonForLayer(
            layerConfig,
            data,
            regionFilterRef.current,
            loadedData.current["adm-kecamatan"],
            focusAdminRef.current
          );
          const bounds = L.geoJSON(scoped).getBounds();
          if (bounds.isValid()) {
            mapRef.current.fitBounds(bounds, {
              padding: [44, 44],
              maxZoom: regionFilterRef.current ? 15 : 14,
              animate: true
            });
          }
        });
      },

      zoomToFeature: (
        selection
      ) => {
        if (
          !selection ||
          !mapRef.current
        ) {
          return;
        }

        import("leaflet").then(
          (L) => {
            const bounds =
              L.geoJSON(
                selection.feature
              ).getBounds();

            if (
              bounds.isValid()
            ) {
              mapRef.current.fitBounds(
                bounds,
                {
                  padding: [
                    44,
                    44
                  ],
                  maxZoom: 17
                }
              );
            }
          }
        );
      },

      clearSelection: () => {
        if (
          !selectedRef.current
        ) {
          return;
        }

        const layer =
          Object.values(
            layerRefs.current
          ).find(
            (candidate) =>
              candidate?.hasLayer?.(
                selectedRef.current
              )
          );

        void layer;

        selectedRef.current?.setStyle?.(
          selectedRef.current
            .__wajoBaseStyle || {
            weight: 1.05
          }
        );

        selectedRef.current =
          null;
      }
    }),
    [onStatus, regionFilter, focusAdmin, layers, visible, errors]
  );

  return (
    <>
      <p
        id="map-instructions"
        className="sr-only"
      >
        Gunakan daftar data untuk menampilkan informasi pada peta.
        Pilih wilayah atau lokasi pada peta untuk melihat informasinya.
      </p>

      <div
        ref={mapNode}
        className="absolute inset-0"
        role="region"
        aria-label="Peta Interaktif Kabupaten Wajo"
        aria-describedby="map-instructions"
      />
    </>
  );
});

export default MapCanvas;
