const KECAMATAN_PALETTE = [
  "#dfe8f1", "#e6ece2", "#f0e5da", "#e7e1ee", "#ddeaea",
  "#eee6dc", "#e1e8ef", "#ece1e8", "#e1e9dd", "#eee9dc",
  "#e4e9ec", "#f0e1db", "#e6e6ef", "#deebe5", "#ece5dc"
];

export const PRASARANA_COLORS = {
  "Jaringan Air Baku": "#005ce6",
  "Jaringan Produksi": "#149ece",
  "Unit Distribusi": "#6b6bd6",
  "Jaringan Sistem Pengelolaan Air Limbah Domestik": "#f789d8",
  "Jaringan Drainase Sekunder": "#ff00c5",
  "Jaringan Drainase Tersier": "#4c0073",
  "Jalur Evakuasi Bencana": "#8b5cf6"
};

export const ROAD_COLORS = { 0: "#149ece", 2: "#ed5151", 3: "#fc921f" };

const AGRICULTURE_POTENTIAL_COLORS = {
  "PADI": "#15803d",
  "JAGUNG": "#ca8a04",
  "KACANG HIJAU": "#65a30d",
  "KACANG TANAH": "#a16207",
  "UBI KAYU": "#b45309",
  "KEDELAI": "#4f46e5",
  "UBI JALAR": "#c2410c",
  "PADI, UBI KAYU": "#0f766e",
  "PADI, JAGUNG": "#7c3aed",
  "KACANG TANAH, KACANG HIJAU, UBI KAYU": "#92400e",
  "UBI KAYU, UBI JALAR": "#be123c"
};

export function agriculturePotentialColor(value) {
  const key = String(value ?? "").trim();
  return AGRICULTURE_POTENTIAL_COLORS[key] ?? "#94a3b8";
}

function hashIndex(value, length) {
  if (value == null) return 0;
  let hash = 0;
  const text = String(value);
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
  }
  return Math.abs(hash) % length;
}

export function kecamatanColor(name) {
  return KECAMATAN_PALETTE[hashIndex(name, KECAMATAN_PALETTE.length)];
}

export function lineColor(layer, feature) {
  const properties = feature?.properties ?? {};
  if (layer.styleMode === "roads") return ROAD_COLORS[properties.KLASIFIKAS] ?? layer.color;
  if (layer.styleMode === "prasarana") return PRASARANA_COLORS[properties.NAMOBJ] ?? layer.color;
  return layer.color;
}

export function styleFor(layer, feature) {
  const properties = feature?.properties ?? {};
  const color = lineColor(layer, feature);

  if (layer.styleMode === "admin") {
    return {
      color: "#64748b",
      weight: 1.35,
      opacity: 0.95,
      fillColor: kecamatanColor(properties.Kecamatan),
      fillOpacity: 0.72
    };
  }
  if (layer.styleMode === "boundary") return { color: "#475569", weight: 1.2, opacity: 0.88, dashArray: "7 5" };
  if (layer.styleMode === "roads") return { color, weight: properties.KLASIFIKAS === 2 ? 3 : 2, opacity: 0.9 };
  if (layer.styleMode === "prasarana") {
    const dashArray = properties.NAMOBJ === "Jaringan Drainase Tersier" ? "3 7" : properties.NAMOBJ === "Unit Distribusi" ? "1 7" : "10 6 2 6";
    return { color, weight: 1.8, opacity: 0.92, dashArray };
  }
  if (layer.styleMode === "contour") return { color: "#8b7355", weight: 0.75, opacity: 0.45 };
  if (layer.styleMode === "water") return { color: "#0284c7", weight: 1.1, opacity: 0.88, fillColor: "#38bdf8", fillOpacity: 0.2 };
  if (layer.styleMode === "agriculture-potential") {
    const potential = properties.POTENSI;
    const fillColor = agriculturePotentialColor(potential);
    const hasPotential = potential != null && String(potential).trim() !== "";

    return {
      color: hasPotential ? fillColor : "#cbd5e1",
      weight: 1,
      opacity: 0.85,
      fillColor,
      fillOpacity: hasPotential ? 0.55 : 0.08
    };
  }
  if (layer.styleMode === "value") return { color: "#a16207", weight: 0.7, opacity: 0.6, fillColor: "#f59e0b", fillOpacity: 0.08 };
  return { color, weight: 1.25, opacity: 0.86, fillColor: color, fillOpacity: 0.12 };
}
