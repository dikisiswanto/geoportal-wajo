import { kecamatanColor, styleFor } from "../../../lib/geo/styles";
import { normalizeRegionName } from "../../../lib/geo/region";
import { administrationFeatureMatchesTarget, administrativeName, isAdministrativeLayerId } from "./context";

export function layerPaneName(layer) {
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

export function ensureLayerPane(map, layer, index) {
  const paneName = layerPaneName(layer);
  const existing = map.getPane?.(paneName);

  if (existing) return paneName;

  const pane = map.createPane(paneName);
  pane.classList.add("leaflet-wajo-data-pane");
  pane.style.zIndex = dataPaneZIndex(layer, index);
  pane.style.pointerEvents = "auto";
  return paneName;
}

export function selectedStyleFor(layer, baseStyle, isPolygon) {
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

export function applyActiveAdministrationStyles(layerRefs, loadedData, { focusAdmin, regionFilter } = {}) {
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

export function setFeatureSelectedVisual(featureLayer, layer, baseStyle, isPolygon, selected) {
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

export function applyFeatureHoverVisual(featureLayer, layer, baseStyle) {
  if (!featureLayer || featureLayer.__wajoSelected || featureLayer.__wajoActiveAdmin) return;

  if (typeof featureLayer.setStyle === "function") {
    featureLayer.setStyle(hoverStyleFor(layer, baseStyle));
  }

  if (typeof featureLayer.setZIndexOffset === "function") {
    const baseOffset = featureLayer.__wajoBaseZIndexOffset ?? 0;
    featureLayer.setZIndexOffset(baseOffset + 250);
  }
}

export function restoreFeatureHoverVisual(featureLayer, baseStyle) {
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
