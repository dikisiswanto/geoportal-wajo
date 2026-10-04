import {
  featureAdministrativeCodes,
  normalizeRegionName
} from "../../../lib/geo/region";
import {
  administrationFeatureMatchesTarget,
  administrativeName,
  filterGeoJsonForLayer,
  isAdministrativeLayerId
} from "./context";
import { getFeatureBounds } from "./geometry";
import { styleFor, kecamatanColor } from "../../../lib/geo/styles";
import { layerPaneName, ensureLayerPane } from "./layerStyles";

export function getPrintScope(L, { regionFilter, focusAdmin, countyData, districtData, villageData }) {
  if (focusAdmin?.feature) {
    const bounds = getUsableFeatureBounds(L, focusAdmin.feature);
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
    const bounds = getUsableFeatureBounds(L, feature);
    if (bounds) {
      return { type: "kecamatan", feature, bounds };
    }
  }

  const villageTarget = String(focusAdmin?.feature?.properties?.Desa ?? "").trim();
  if (villageTarget && villageData?.features?.length) {
    const feature = villageData.features.find((item) =>
      String(item?.properties?.Desa ?? item?.properties?.WADMKD ?? item?.properties?.nama_desa ?? "").trim().toLowerCase() === villageTarget.toLowerCase()
    );
    const bounds = getUsableFeatureBounds(L, feature);
    if (bounds) return { type: "desa", feature, bounds };
  }

  if (countyData?.features?.length) {
    const bounds = L.geoJSON(countyData).getBounds();
    if (isUsableBounds(bounds)) return { type: "kabupaten", feature: countyData.features[0], bounds };
  }

  return null;
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


function isThematicVectorLayer(layer) {
  if (!layer || isAdministrativeLayerId(layer.id)) return false;
  const geometry = String(layer.geometry ?? "").toLowerCase();
  return geometry.includes("line") || geometry.includes("polygon");
}

export const MAX_PRINT_VECTOR_LAYERS = 8;
export const MAX_PRINT_VECTOR_FEATURES = 10000;

export function getActivePrintVectorLayers(layers = [], visible = {}) {
  return (Array.isArray(layers) ? layers : []).filter(
    (layer) => visible?.[layer.id] && isThematicVectorLayer(layer)
  );
}

export function getPrintPreflight(layers = [], visible = {}) {
  const activeVectorLayers = getActivePrintVectorLayers(layers, visible);
  return {
    activeVectorLayers,
    activeVectorLayerCount: activeVectorLayers.length,
    maxVectorLayers: MAX_PRINT_VECTOR_LAYERS,
    tooManyLayers: activeVectorLayers.length > MAX_PRINT_VECTOR_LAYERS
  };
}

function getPrintThematicStyle(layer, feature, { polygonLayerCount = 1 } = {}) {
  const base = styleFor(layer, feature) || {};
  const geometryType = String(feature?.geometry?.type ?? "").toLowerCase();

  if (geometryType.includes("polygon")) {
    const fillOpacity = Number(base.fillOpacity);
    const opacity = Number(base.opacity);
    // Multiple thematic areas may overlap. Keep every fill readable instead of
    // allowing a later polygon to visually erase the one underneath it.
    const fillCap = polygonLayerCount > 1 ? 0.18 : 0.3;
    return {
      ...base,
      fillOpacity: Number.isFinite(fillOpacity)
        ? Math.min(fillCap, Math.max(0.08, fillOpacity))
        : Math.min(fillCap, 0.18),
      opacity: Number.isFinite(opacity) ? Math.min(0.86, opacity) : 0.82,
      weight: Math.min(1.55, Math.max(0.75, Number(base.weight) || 1))
    };
  }

  if (geometryType.includes("line")) {
    const opacity = Number(base.opacity);
    return {
      ...base,
      opacity: Number.isFinite(opacity) ? Math.min(0.82, opacity) : 0.8,
      weight: Math.min(2.0, Math.max(0.95, Number(base.weight) || 1.25))
    };
  }

  return base;
}

export function getPrintLayerPlan({
  L,
  layers,
  visible,
  loadedData,
  errors = {},
  regionFilter,
  focusAdmin,
  boundaryData
} = {}) {
  if (!L) {
    return {
      ok: false,
      vectorLayers: [],
      activeVectorLayers: [],
      activeVectorLayerCount: 0,
      filteredFeatureCount: 0,
      notReady: [],
      failed: [],
      empty: [],
      tooManyLayers: false,
      tooManyFeatures: false,
      reason: "Peta belum siap"
    };
  }

  // Preflight layer count before touching any feature data. This avoids the
  // expensive filtering step when the user has already exceeded the print cap.
  const {
    activeVectorLayers,
    activeVectorLayerCount,
    tooManyLayers: preflightTooManyLayers
  } = getPrintPreflight(layers, visible);

  if (preflightTooManyLayers) {
    const activeTitles = activeVectorLayers.map((layer) => layer.title).filter(Boolean);
    const disableCount = Math.max(0, activeVectorLayerCount - MAX_PRINT_VECTOR_LAYERS);
    const disableTitles = activeTitles.slice(0, 4);
    const disableSummary = disableTitles.length
      ? ` Nonaktifkan: ${disableTitles.join(", ")}${disableCount > disableTitles.length ? ", dan layer lainnya." : "."}`
      : "";

    return {
      ok: false,
      vectorLayers: [],
      activeVectorLayers,
      activeVectorLayerCount,
      filteredFeatureCount: 0,
      notReady: [],
      failed: [],
      empty: [],
      tooManyLayers: true,
      tooManyFeatures: false,
      reason: `Cetak dibatasi maksimal ${MAX_PRINT_VECTOR_LAYERS} layer garis/area. Saat ini ${activeVectorLayerCount} layer aktif.${disableSummary}`
    };
  }

  const vectorLayers = [];
  const notReady = [];
  const failed = [];
  const empty = [];
  let filteredFeatureCount = 0;

  activeVectorLayers.forEach((layer) => {
    if (errors?.[layer.id]) {
      failed.push({ id: layer.id, title: layer.title, message: errors[layer.id] });
      return;
    }

    const data = loadedData?.[layer.id];
    if (!Array.isArray(data?.features)) {
      notReady.push({ id: layer.id, title: layer.title });
      return;
    }

    const renderData = filterGeoJsonForLayer(
      layer,
      data,
      regionFilter,
      boundaryData,
      focusAdmin
    );
    const features = Array.isArray(renderData?.features) ? renderData.features : [];

    if (!features.length) {
      empty.push({ id: layer.id, title: layer.title });
      return;
    }

    filteredFeatureCount += features.length;
    vectorLayers.push({ layer, renderData, featureCount: features.length });
  });

  const tooManyFeatures = filteredFeatureCount > MAX_PRINT_VECTOR_FEATURES;
  const ok = !tooManyFeatures && !notReady.length && !failed.length;

  let reason = "";
  if (tooManyFeatures) {
    reason = `Data tematik terlalu banyak untuk sekali cetak (lebih dari ${MAX_PRINT_VECTOR_FEATURES.toLocaleString("id-ID")} fitur).`;
  } else if (notReady.length) {
    reason = `Data belum siap: ${notReady.map((item) => item.title).join(", ")}.`;
  } else if (failed.length) {
    reason = `Data bermasalah: ${failed.map((item) => item.title).join(", ")}.`;
  }

  return {
    ok,
    vectorLayers,
    activeVectorLayers,
    activeVectorLayerCount,
    filteredFeatureCount,
    notReady,
    failed,
    empty,
    tooManyLayers: false,
    tooManyFeatures,
    reason
  };
}

export function preparePrintThematicLayers({
  L,
  map,
  plan
} = {}) {
  if (!L || !map || !plan?.ok) return null;

  const records = [];
  const canvasSnapshots = new Map();
  const polygonLayerCount = plan.vectorLayers.filter(({ layer }) =>
    String(layer.geometry ?? "").toLowerCase().includes("polygon")
  ).length;

  const familyBuckets = new Map();
  plan.vectorLayers.forEach(({ layer, renderData, featureCount }) => {
    const paneName = layerPaneName(layer);
    const bucket = familyBuckets.get(paneName);
    const entry = { layer, renderData, featureCount };
    if (bucket) bucket.push(entry);
    else familyBuckets.set(paneName, [entry]);
  });

  try {
    familyBuckets.forEach((entries, paneName) => {
      const representativeLayer = entries[0]?.layer;
      const pane = map.getPane?.(paneName) || (
        representativeLayer ? ensureLayerPane(map, representativeLayer) : null
      );
      if (!pane) {
        throw new Error(`Pane thematic tidak tersedia: ${representativeLayer?.title ?? paneName}`);
      }

      if (!canvasSnapshots.has(paneName)) {
        const canvasNodes = Array.from(pane.querySelectorAll?.("canvas") ?? []);
        const snapshot = canvasNodes.map((canvas) => ({
          canvas,
          visibility: canvas.style.visibility,
          display: canvas.style.display
        }));
        canvasNodes.forEach((canvas) => {
          canvas.style.visibility = "hidden";
        });
        canvasSnapshots.set(paneName, snapshot);
      }

      const featureCollection = {
        type: "FeatureCollection",
        features: []
      };
      const layerById = new Map();

      entries.forEach(({ layer, renderData }) => {
        layerById.set(layer.id, layer);
        const features = Array.isArray(renderData?.features) ? renderData.features : [];
        features.forEach((feature) => {
          // Temporary metadata is attached only to this in-memory print copy.
          featureCollection.features.push({
            ...feature,
            __wajoPrintLayerId: layer.id
          });
        });
      });

      const renderer = L.svg({ pane: paneName, padding: 0.45 });
      const printLayer = L.geoJSON(featureCollection, {
        renderer,
        pane: paneName,
        interactive: false,
        bubblingMouseEvents: false,
        style: (feature) => {
          const layer = layerById.get(feature?.__wajoPrintLayerId) || representativeLayer;
          return {
            ...getPrintThematicStyle(layer, feature, { polygonLayerCount }),
            className: "print-thematic-vector"
          };
        }
      }).addTo(map);

      records.push({
        layer: printLayer,
        renderer,
        canvasVisibility: canvasSnapshots.get(paneName),
        paneName,
        featureCount: featureCollection.features.length
      });
    });
  } catch (error) {
    restorePrintThematicLayers(records);
    canvasSnapshots.forEach((snapshot) => {
      snapshot?.forEach?.(({ canvas, visibility, display }) => {
        if (!canvas) return;
        canvas.style.visibility = visibility || "";
        canvas.style.display = display || "";
      });
    });
    throw error;
  }

  return records;
}

export function restorePrintThematicLayers(records) {
  if (!Array.isArray(records) || !records.length) return;

  const renderers = new Set();
  const canvases = new Map();

  // Remove feature groups first while their shared SVG renderer still exists.
  records.forEach(({ layer, renderer, canvasVisibility }) => {
    layer?.remove?.();
    if (renderer) renderers.add(renderer);
    canvasVisibility?.forEach((snapshot) => {
      if (snapshot?.canvas && !canvases.has(snapshot.canvas)) {
        canvases.set(snapshot.canvas, snapshot);
      }
    });
  });

  // A renderer is shared by all thematic layers in the same geometry family.
  // Remove it once, after all feature groups have been detached.
  renderers.forEach((renderer) => renderer.remove?.());

  canvases.forEach(({ canvas, visibility, display }) => {
    canvas.style.visibility = visibility || "";
    canvas.style.display = display || "";
  });
}

/**
 * Restore interactive Canvas renderers after the print viewport has been
 * restored. This function is intentionally synchronous: only the existing
 * Canvas renderers are shown and redrawn once; no layer is rebuilt.
 */
export function restoreInteractiveThematicRenderers(map, vectorRenderers) {
  if (!map || !vectorRenderers?.forEach) return;

  const renderers = [];
  const seen = new Set();

  vectorRenderers.forEach((renderer) => {
    if (!renderer || seen.has(renderer)) return;
    seen.add(renderer);

    const canvas = renderer.getContainer?.();
    if (!canvas || String(canvas.tagName).toLowerCase() !== "canvas") return;

    canvas.style.visibility = "";
    canvas.style.display = "";
    renderers.push(renderer);
  });

  if (!map._loaded) return;
  renderers.forEach((renderer) => renderer._redraw?.());
}

export function applyPrintAdministrationStyles(layerRefs, loadedData, scope) {
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
          : base.fillColor,
        fillOpacity: selected
          ? 0.12
          : 0.02,
        weight: selected ? 2.15 : Math.max(Number(base.weight ?? 1.15), 1.15),
        color: selected ? "#1e293b" : base.color,
        opacity: selected ? 0.98 : Number(base.opacity ?? 0.88)
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
        fillColor: selected ? "#64748b" : base.fillColor,
        fillOpacity: selected
          ? 0.08
          : 0.01,
        weight: selected ? 1.55 : Math.max(Number(base.weight ?? 0.9), 0.9),
        color: selected ? "#334155" : base.color,
        opacity: selected ? 0.96 : Number(base.opacity ?? 0.8)
      });
    });
  }
}

export function restorePrintAdministrationStyles(layerRefs) {
  ["adm-kabupaten", "adm-kecamatan", "adm-desa"].forEach((id) => {
    layerRefs?.[id]?.eachLayer?.((featureLayer) => {
      const snapshot = featureLayer?.__wajoPrintStyleSnapshot;
      if (!snapshot) return;
      featureLayer.setStyle?.(snapshot);
      delete featureLayer.__wajoPrintStyleSnapshot;
    });
  });
}

const PRINT_PAGE_CSS_PX = {
  width: (297 / 25.4) * 96,
  height: (210 / 25.4) * 96
};

const PRINT_MAP_RATIO = 0.75;

function getPrintMapSize() {
  return {
    width: PRINT_PAGE_CSS_PX.width * PRINT_MAP_RATIO,
    height: PRINT_PAGE_CSS_PX.height
  };
}

function getPrintFitPadding(size) {
  const shortest = Math.max(1, Math.min(size.width, size.height));
  const padding = Math.round(Math.min(56, Math.max(34, shortest * 0.045)));
  return {
    topLeft: { x: padding, y: padding },
    bottomRight: { x: padding, y: padding }
  };
}

function isFiniteLatLng(latlng) {
  return Boolean(
    latlng &&
      Number.isFinite(Number(latlng.lat)) &&
      Number.isFinite(Number(latlng.lng)) &&
      Number(latlng.lat) >= -90 &&
      Number(latlng.lat) <= 90 &&
      Number(latlng.lng) >= -180 &&
      Number(latlng.lng) <= 180
  );
}

function isUsableBounds(bounds) {
  return Boolean(
    bounds?.isValid?.() &&
      isFiniteLatLng(bounds.getSouthWest?.()) &&
      isFiniteLatLng(bounds.getNorthEast?.())
  );
}

function getUsableFeatureBounds(L, feature) {
  const bounds = getFeatureBounds(L, feature);
  return isUsableBounds(bounds) ? bounds : null;
}


export function getPrintScaleDenominator(map) {
  if (!map?.getZoom || !map?.getCenter) return null;

  const zoom = Number(map.getZoom());
  const center = map.getCenter();
  const latitude = Number(center?.lat);
  if (!Number.isFinite(zoom) || !Number.isFinite(latitude)) return null;

  // Leaflet uses Web Mercator. Scale denominator is derived from the
  // ground resolution at the map center and the standard 0.28 mm pixel.
  const metersPerPixel =
    (156543.03392804097 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom);
  const denominator = metersPerPixel / 0.00028;

  return Number.isFinite(denominator) && denominator > 0 ? denominator : null;
}

export function formatPrintScale(map) {
  const denominator = getPrintScaleDenominator(map);
  if (!denominator) return null;

  // Keep the displayed value readable while preserving the calculated scale.
  const magnitude = Math.pow(10, Math.floor(Math.log10(denominator)));
  const step = magnitude >= 100000 ? 1000 : magnitude >= 10000 ? 500 : 100;
  const rounded = Math.round(denominator / step) * step;

  return {
    denominator,
    label: `1 : ${Math.max(1, Math.round(rounded)).toLocaleString("id-ID")}`
  };
}

function getMaxPrintZoom(scope) {
  if (scope.type === "desa") return 17;
  if (scope.type === "kecamatan") return 15;
  return 13;
}

function constrainPrintStage(printRoot, mapContainer) {
  const stage = mapContainer?.closest?.(".print-map-stage");
  if (!stage) return null;

  const size = getPrintMapSize();

  stage.style.position = "relative";
  stage.style.width = `${size.width}px`;
  stage.style.height = `${size.height}px`;
  stage.style.minWidth = "0";
  stage.style.minHeight = "0";
  stage.style.maxWidth = `${size.width}px`;
  stage.style.maxHeight = `${size.height}px`;
  stage.style.flex = "0 0 auto";
  stage.style.overflow = "hidden";
  stage.style.gridColumn = "1";
  stage.style.gridRow = "1";

  mapContainer.style.position = "absolute";
  mapContainer.style.inset = "0";
  mapContainer.style.width = `${size.width}px`;
  mapContainer.style.height = `${size.height}px`;

  return { stage, size };
}

export function lockPrintViewport(map, printLayoutRef) {
  const mapContainer = map?.getContainer?.();
  const printRoot = mapContainer?.closest?.("#map");
  if (!printRoot || !mapContainer) return null;

  if (!printLayoutRef.current) {
    const stage = mapContainer.closest?.(".print-map-stage");
    printLayoutRef.current = {
      root: printRoot,
      stage,
      rootStyle: printRoot.getAttribute("style"),
      stageStyle: stage?.getAttribute?.("style") ?? null,
      mapStyle: mapContainer.getAttribute("style")
    };
  }

  const page = PRINT_PAGE_CSS_PX;
  printRoot.style.position = "fixed";
  printRoot.style.inset = "0";
  printRoot.style.width = `${page.width}px`;
  printRoot.style.height = `${page.height}px`;
  printRoot.style.margin = "0";
  printRoot.style.padding = "0";
  printRoot.style.overflow = "hidden";
  printRoot.style.display = "block";

  return constrainPrintStage(printRoot, mapContainer);
}

export function restorePrintViewport(map, printLayoutRef) {
  const snapshot = printLayoutRef.current;
  if (!snapshot) return;

  if (snapshot.rootStyle == null) snapshot.root.removeAttribute("style");
  else snapshot.root.setAttribute("style", snapshot.rootStyle);

  if (snapshot.stage) {
    if (snapshot.stageStyle == null) snapshot.stage.removeAttribute("style");
    else snapshot.stage.setAttribute("style", snapshot.stageStyle);
  }

  const mapContainer = map?.getContainer?.();
  if (mapContainer) {
    if (snapshot.mapStyle == null) mapContainer.removeAttribute("style");
    else mapContainer.setAttribute("style", snapshot.mapStyle);
  }

  printLayoutRef.current = null;
}


export async function waitForPrintImages(root = document) {
  const images = Array.from(root?.querySelectorAll?.(".print-only-legend img") ?? []);
  if (!images.length) return;

  await Promise.all(
    images.map(async (image) => {
      if (!image.complete) {
        await new Promise((resolve) => {
          const done = () => {
            image.removeEventListener("load", done);
            image.removeEventListener("error", done);
            resolve();
          };
          image.addEventListener("load", done, { once: true });
          image.addEventListener("error", done, { once: true });
        });
      }

      try {
        await image.decode?.();
      } catch {
        // Browser print may still render a decoded image even when decode() rejects.
      }
    })
  );
}

export function fitMapForPrint(map, scope, printLayoutRef) {
  if (!map || !isUsableBounds(scope?.bounds)) return false;

  const layout = lockPrintViewport(map, printLayoutRef);
  if (!layout?.size) return false;

  const mapContainer = map.getContainer?.();
  if (mapContainer) {
    // Force layout before asking Leaflet for its container size. This keeps
    // the fit calculation independent from the interactive viewport.
    void mapContainer.offsetWidth;
    void mapContainer.offsetHeight;
  }

  map.invalidateSize({ pan: false, debounceMoveend: false });

  const measured = map.getSize?.();
  const size =
    measured &&
    Number.isFinite(Number(measured.x)) &&
    Number.isFinite(Number(measured.y)) &&
    measured.x > 1 &&
    measured.y > 1
      ? measured
      : layout.size;

  const padding = getPrintFitPadding(size);
  const maxZoom = getMaxPrintZoom(scope);
  const bounds = scope.bounds;

  try {
    map.fitBounds(bounds, {
      paddingTopLeft: [padding.topLeft.x, padding.topLeft.y],
      paddingBottomRight: [padding.bottomRight.x, padding.bottomRight.y],
      maxZoom,
      animate: false
    });
  } catch (error) {
    const center = bounds.getCenter?.();
    if (!isFiniteLatLng(center)) return false;

    map.setView?.(center, Math.min(maxZoom, map.getZoom?.() || maxZoom), {
      animate: false
    });
  }

  map.invalidateSize({ pan: false, debounceMoveend: false });
  return formatPrintScale(map);
}
