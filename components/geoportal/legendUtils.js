import { pointKind } from "../../lib/geo/markers";
import { featureKey } from "../../lib/geo/format";
import { featurePassesLayerFilter } from "../../lib/geo/dataFilter";
import {
  featureMatchesAdministrativeFeature,
  featureMatchesRegion,
} from "../../lib/geo/region";
import { styleFor } from "../../lib/geo/styles";

const GENERIC_VALUES = new Set([
  "tidak ada",
  "tidak tersedia",
  "belum ada",
  "n/a",
  "na",
  "none",
  "null",
  "undefined",
  "-",
  "—",
  "/",
]);

export function normalizeLegendLabel(value) {
  const text = String(value ?? "").trim();
  if (!text) return "Data tersedia";
  return text.replace(/\s+/g, " ");
}

export function isMeaningful(value) {
  const label = normalizeLegendLabel(value);
  return label !== "Data tersedia" && !GENERIC_VALUES.has(label.toLowerCase());
}

export function firstValue(properties, keys) {
  for (const key of keys) {
    const value = properties?.[key];
    if (isMeaningful(value)) return normalizeLegendLabel(value);
  }
  return "";
}

export function pointKindLabel(kind, layer) {
  const labels = {
    bridge: "Jembatan",
    terminal: "Terminal",
    port: "Pelabuhan",
    fish: "Tempat pendaratan ikan",
    train: "Stasiun",
    scale: "Jembatan timbang",
    building: "Bangunan",
    government: "Kantor pemerintah",
    power: "Pembangkit listrik",
    bolt: "Gardu listrik",
    gas: "Fasilitas migas",
    telecom: "Fasilitas telekomunikasi",
    water: "Fasilitas sumber daya air",
    recycle: "Fasilitas persampahan",
    trash: "Fasilitas persampahan",
    sanitation: "Sanitasi",
    education: "Satuan pendidikan",
    health: "Puskesmas",
    evacuation: "Titik evakuasi",
    place: layer?.title || "Lokasi",
  };
  return labels[kind] || normalizeLegendLabel(kind);
}

export function categoricalLegendLabel(layer, value) {
  const label = normalizeLegendLabel(value);
  if (layer?.categoricalField === "KLASIFIKAS") return `Klasifikasi ${label}`;
  return label;
}

export function legendKind(layer) {
  const geometry = String(layer?.geometry || "").toLowerCase();
  if (geometry.includes("point")) return "point";
  if (geometry.includes("line")) return "line";
  return "area";
}

export function featureSpecificLabel(layer, feature) {
  const properties = feature?.properties ?? {};
  const styleMode = layer?.styleMode;

  if (styleMode === "roads") {
    return firstValue(properties, ["NAMA_RUAS", "NO_RUAS", "ID_JALAN"]);
  }

  if (styleMode === "contour") {
    const elevation = Number(properties.VALKNT);
    return Number.isFinite(elevation) ? `Kontur ${elevation} m` : "";
  }

  if (styleMode === "agriculture-potential") {
    const desa = firstValue(properties, ["DESA"]);
    const potential = firstValue(properties, ["POTENSI"]);
    return desa && potential ? `${desa} — ${potential}` : desa || potential;
  }

  if (styleMode === "livestock-potential") {
    const desa = firstValue(properties, ["DESA"]);
    const potential = firstValue(properties, ["PETERNAKAN"]);
    return desa && potential ? `${desa} — ${potential}` : desa || potential;
  }

  if (layer?.group === "Jaringan") {
    return firstValue(properties, ["REMARK", layer?.labelField, "NAMOBJ"]);
  }

  if (styleMode === "water" && layer?.id === "sungai") {
    return firstValue(properties, ["NAMOBJ", "REMARK"]);
  }

  return firstValue(properties, [layer?.labelField, "NAMOBJ", "REMARK", "NAMA", "nama"]);
}

export function featureMatchesLegendContext(feature, { focusAdmin, regionFilter, boundaryData } = {}) {
  if (focusAdmin?.feature) {
    return featureMatchesAdministrativeFeature(feature, focusAdmin.feature);
  }

  if (regionFilter) {
    return featureMatchesRegion(feature, regionFilter, boundaryData);
  }

  return true;
}

export function getScopedLegendFeatures(layer, data, context = {}) {
  const features = Array.isArray(data?.features) ? data.features : [];
  return features.filter((feature) => {
    if (!featurePassesLayerFilter(layer, feature)) return false;
    return featureMatchesLegendContext(feature, context);
  });
}

export function featureBelongsToSelectedLayer(layer, feature, selectedFeature) {
  if (!selectedFeature?.feature || selectedFeature?.layer?.id !== layer?.id) return false;
  try {
    const currentKey = featureKey(layer, feature);
    const selectedKey = featureKey(layer, selectedFeature.feature);
    if (currentKey != null && selectedKey != null) {
      return String(currentKey) === String(selectedKey);
    }
  } catch {
    // Fall back to object identity below.
  }
  return feature === selectedFeature.feature;
}

function addUniqueEntry(entries, seen, entry) {
  const key = `${entry.label}|${entry.kind}|${entry.color}|${entry.style?.dashArray || ""}`;
  if (seen.has(key)) return;
  seen.add(key);
  entries.push({ ...entry, key: `${entry.layerId}:${entries.length}:${key}` });
}

function buildContourEntries(layer, features) {
  const values = features
    .map((feature) => Number(feature?.properties?.VALKNT))
    .filter(Number.isFinite);

  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const unique = [...new Set(values)].sort((a, b) => a - b);
  let interval = null;
  if (unique.length > 1) {
    const diffs = unique.slice(1)
      .map((value, index) => value - unique[index])
      .filter((value) => value > 0);
    if (diffs.length) interval = Math.min(...diffs);
  }

  const sampleFeature = features.find((feature) => Number.isFinite(Number(feature?.properties?.VALKNT))) || features[0];
  const style = styleFor(layer, sampleFeature);
  const suffix = interval ? ` · interval ${interval} m` : "";
  return [{
    key: `${layer.id}:contour-range`,
    label: `${min}–${max} m${suffix}`,
    kind: "line",
    color: style?.color || layer.color,
    style,
    feature: sampleFeature,
    layerId: layer.id,
  }];
}

export function buildLayerLegendEntries(layer, data, context = {}, selectedFeature = null) {
  if (!layer) return [];

  const features = getScopedLegendFeatures(layer, data, context);
  const kind = legendKind(layer);
  if (!features.length) return [];

  if (kind === "point") {
    const entries = [];
    const seen = new Set();
    for (const feature of features) {
      const key = pointKind(layer, feature);
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({
        key: `${layer.id}:${key}`,
        label: pointKindLabel(key, layer),
        kind,
        color: layer.color,
        feature,
        style: styleFor(layer, feature),
        layerId: layer.id,
      });
      if (entries.length >= 8) break;
    }

    const selected = features.find((feature) => featureBelongsToSelectedLayer(layer, feature, selectedFeature));
    if (selected) {
      const selectedKind = pointKind(layer, selected);
      const label = pointKindLabel(selectedKind, layer);
      const specific = featureSpecificLabel(layer, selected);
      if (specific && !entries.some((entry) => entry.label === specific || entry.label === `Fitur aktif: ${specific}`)) {
        entries.unshift({
          key: `${layer.id}:selected:${featureKey(layer, selected)}`,
          label: `Fitur aktif: ${specific}`,
          kind,
          color: layer.color,
          feature: selected,
          style: styleFor(layer, selected),
          layerId: layer.id,
        });
      } else if (!entries.some((entry) => entry.label === label)) {
        entries.unshift({
          key: `${layer.id}:selected-kind:${selectedKind}`,
          label,
          kind,
          color: layer.color,
          feature: selected,
          style: styleFor(layer, selected),
          layerId: layer.id,
        });
      }
    }
    return entries;
  }

  if (layer.styleMode === "contour") {
    const entries = buildContourEntries(layer, features);
    const selected = features.find((feature) => featureBelongsToSelectedLayer(layer, feature, selectedFeature));
    if (selected) {
      const label = featureSpecificLabel(layer, selected);
      if (isMeaningful(label)) {
        entries.unshift({
          key: `${layer.id}:selected:${featureKey(layer, selected)}`,
          label: `Fitur aktif: ${label}`,
          kind,
          color: styleFor(layer, selected)?.color || layer.color,
          style: styleFor(layer, selected),
          feature: selected,
          layerId: layer.id,
        });
      }
    }
    return entries;
  }

  const entries = [];
  const seen = new Set();
  const field = layer.categoricalField;

  if (field) {
    for (const feature of features) {
      const value = feature?.properties?.[field];
      if (!isMeaningful(value)) continue;
      const label = categoricalLegendLabel(layer, value);
      const style = styleFor(layer, feature);
      addUniqueEntry(entries, seen, {
        label,
        kind,
        color: style?.fillColor || style?.color || layer.color,
        style,
        feature,
        layerId: layer.id,
      });
      if (entries.length >= 14) break;
    }
  } else {
    const candidates = [];
    for (const feature of features) {
      const label = featureSpecificLabel(layer, feature);
      if (!isMeaningful(label)) continue;
      const style = styleFor(layer, feature);
      candidates.push({ label, style, feature });
    }

    const uniqueLabels = [...new Set(candidates.map((entry) => entry.label))];
    if (uniqueLabels.length <= 8) {
      for (const candidate of candidates) {
        addUniqueEntry(entries, seen, {
          label: candidate.label,
          kind,
          color: candidate.style?.fillColor || candidate.style?.color || layer.color,
          style: candidate.style,
          feature: candidate.feature,
          layerId: layer.id,
        });
      }
    } else {
      const sample = candidates[0];
      if (sample) {
        addUniqueEntry(entries, seen, {
          label: layer.id === "sungai" ? "Sungai" : layer.title,
          kind,
          color: sample.style?.fillColor || sample.style?.color || layer.color,
          style: sample.style,
          feature: sample.feature,
          layerId: layer.id,
        });
      }
    }
  }

  const selected = features.find((feature) => featureBelongsToSelectedLayer(layer, feature, selectedFeature));
  if (selected) {
    const specific = featureSpecificLabel(layer, selected);
    const style = styleFor(layer, selected);
    if (isMeaningful(specific)) {
      addUniqueEntry(entries, seen, {
        label: `Fitur aktif: ${specific}`,
        kind,
        color: style?.fillColor || style?.color || layer.color,
        style,
        feature: selected,
        layerId: layer.id,
      });
    }
  }

  if (!entries.length) {
    const sample = features[0];
    const style = styleFor(layer, sample);
    entries.push({
      key: `${layer.id}:default`,
      label: layer.title,
      kind,
      color: style?.fillColor || style?.color || layer.color,
      style,
      feature: sample,
      layerId: layer.id,
    });
  }

  return entries;
}
