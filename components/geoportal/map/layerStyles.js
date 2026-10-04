import { kecamatanColor, styleFor } from "../../../lib/geo/styles";
import { normalizeRegionName } from "../../../lib/geo/region";
import { administrationFeatureMatchesTarget, administrativeName, isAdministrativeLayerId } from "./context";

function layerGeometryFamily(layer) {
  const geometry = String(layer?.geometry ?? "").toLowerCase();

  if (geometry.includes("point")) return "point";
  if (geometry.includes("line")) return "line";
  if (geometry.includes("polygon")) return "polygon";

  return "other";
}

export function layerPaneName(layer) {
  if (layer?.styleMode === "admin-county-outline") return "adminCounty";
  if (layer?.styleMode === "admin") return "adminDistrict";
  if (layer?.styleMode === "admin-village") return "adminVillage";

  // Data tematik berbagi renderer berdasarkan kelompok geometri.
  // Ini menjaga semua feature tetap hidup dalam satu composite renderer tanpa
  // membuat satu Canvas baru untuk setiap layer.
  switch (layerGeometryFamily(layer)) {
    case "polygon":
      return "thematicPolygon";
    case "line":
      return "thematicLine";
    case "point":
      return "thematicPoint";
    default:
      return "thematicOther";
  }
}

function dataPaneZIndex(layer) {
  switch (layerGeometryFamily(layer)) {
    case "point":
      return "700";
    case "line":
      return "600";
    case "polygon":
      return "500";
    default:
      return "550";
  }
}

export function ensureLayerPane(map, layer) {
  const paneName = layerPaneName(layer);
  const existing = map.getPane?.(paneName);

  if (existing) return paneName;

  const pane = map.createPane(paneName);
  pane.classList.add("leaflet-wajo-data-pane");
  pane.style.zIndex = dataPaneZIndex(layer);
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
      fillOpacity: 0.14
    };
  }

  if (layer?.styleMode === "admin-village") {
    return {
      ...baseStyle,
      weight: 2.2,
      color: "#334155",
      fillOpacity: 0.06
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

  if (selected) {
    featureLayer.bringToFront?.();
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

  featureLayer.bringToFront?.();

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
