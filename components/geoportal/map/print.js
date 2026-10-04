import {
  featureAdministrativeCodes,
  normalizeRegionName
} from "../../../lib/geo/region";
import { administrationFeatureMatchesTarget, administrativeName } from "./context";
import { getFeatureBounds } from "./geometry";
import { styleFor, kecamatanColor } from "../../../lib/geo/styles";

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
  return true;
}
