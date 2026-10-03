import {
  featureAdministrativeCodes,
  normalizeRegionName
} from "../../../lib/geo/region";
import { administrationFeatureMatchesTarget, administrativeName } from "./context";
import { getFeatureBounds } from "./geometry";
import { styleFor, kecamatanColor } from "../../../lib/geo/styles";

export function getPrintScope(L, { regionFilter, focusAdmin, countyData, districtData, villageData }) {
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

export function lockPrintViewport(map, printLayoutRef) {
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

export function restorePrintViewport(map, printLayoutRef) {
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

export function fitMapForPrint(map, scope, printLayoutRef) {
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

