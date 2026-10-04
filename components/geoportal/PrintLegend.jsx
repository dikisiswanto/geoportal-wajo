import Image from "next/image";
import { absoluteUrl } from "../../lib/seo";
import { markerIconMarkup, pointKind } from "../../lib/geo/markers";
import { styleFor } from "../../lib/geo/styles";
import { featureKey } from "../../lib/geo/format";
import { featurePassesLayerFilter } from "../../lib/geo/dataFilter";
import {
  featureMatchesAdministrativeFeature,
  featureMatchesRegion,
} from "../../lib/geo/region";

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

function LegendSwatch({ kind, color, layer, feature, style }) {
  const safeColor = color || "#64748b";

  if (kind === "point") {
    const markup = markerIconMarkup(pointKind(layer || {}, feature || {}), safeColor);
    return (
      <div
        className="print-only-point-icon"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }

  if (kind === "line") {
    return (
      <svg className="print-only-swatch-svg" viewBox="0 0 24 12" aria-hidden="true" focusable="false">
        <line
          x1="2"
          y1="6"
          x2="22"
          y2="6"
          stroke={style?.color || safeColor}
          strokeWidth={Math.max(1.5, Math.min(4, Number(style?.weight) || 3))}
          strokeLinecap="round"
          strokeDasharray={style?.dashArray || undefined}
        />
      </svg>
    );
  }

  const fillColor = style?.fillColor || safeColor;
  const fillOpacity = Math.min(0.82, Math.max(0.08, Number(style?.fillOpacity ?? 0.62)));
  return (
    <svg className="print-only-swatch-svg" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <rect
        x="1"
        y="1"
        width="12"
        height="12"
        rx="2"
        fill={fillColor}
        fillOpacity={fillOpacity}
        stroke={style?.color || safeColor}
        strokeWidth="1.3"
      />
    </svg>
  );
}

function legendKind(layer) {
  const geometry = String(layer?.geometry || "").toLowerCase();
  if (geometry.includes("point")) return "point";
  if (geometry.includes("line")) return "line";
  return "area";
}

function normalizeLegendLabel(value) {
  const text = String(value ?? "").trim();
  if (!text) return "Data tersedia";
  return text.replace(/\s+/g, " ");
}

function isMeaningful(value) {
  const label = normalizeLegendLabel(value);
  return label !== "Data tersedia" && !GENERIC_VALUES.has(label.toLowerCase());
}

function pointKindLabel(kind, layer) {
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

function categoricalLegendLabel(layer, value) {
  const label = normalizeLegendLabel(value);
  if (layer?.categoricalField === "KLASIFIKAS") return `Klasifikasi ${label}`;
  return label;
}

function firstValue(properties, keys) {
  for (const key of keys) {
    const value = properties?.[key];
    if (isMeaningful(value)) return normalizeLegendLabel(value);
  }
  return "";
}

function featureSpecificLabel(layer, feature) {
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

function featureMatchesPrintContext(feature, { focusAdmin, regionFilter, boundaryData }) {
  if (focusAdmin?.feature) {
    return featureMatchesAdministrativeFeature(feature, focusAdmin.feature);
  }

  if (regionFilter) {
    return featureMatchesRegion(feature, regionFilter, boundaryData);
  }

  return true;
}

function getScopedFeatures(layer, data, context) {
  const features = Array.isArray(data?.features) ? data.features : [];
  return features.filter((feature) => {
    if (!featurePassesLayerFilter(layer, feature)) return false;
    return featureMatchesPrintContext(feature, context);
  });
}

function featureBelongsToSelectedLayer(layer, feature, selectedFeature) {
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
    const diffs = unique.slice(1).map((value, index) => value - unique[index]).filter((value) => value > 0);
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

function buildLayerLegendEntries(layer, data, context, selectedFeature) {
  if (!layer) return [];

  const features = getScopedFeatures(layer, data, context);
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

    const selectedIndex = features.findIndex((feature) => featureBelongsToSelectedLayer(layer, feature, selectedFeature));
    if (selectedIndex >= 0) {
      const selected = features[selectedIndex];
      const selectedKind = pointKind(layer, selected);
      const label = pointKindLabel(selectedKind, layer);
      const specific = featureSpecificLabel(layer, selected);
      if (specific && !entries.some((entry) => entry.label === specific)) {
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
      entries.unshift({
        key: `${layer.id}:selected:${featureKey(layer, selected)}`,
        label: `Fitur aktif: ${featureSpecificLabel(layer, selected)}`,
        kind,
        color: styleFor(layer, selected)?.color || layer.color,
        style: styleFor(layer, selected),
        feature: selected,
        layerId: layer.id,
      });
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

function geometryLabel(feature) {
  const type = String(feature?.geometry?.type || "");
  if (type === "Point" || type === "MultiPoint") return "Titik";
  if (type.includes("LineString")) return "Garis";
  if (type.includes("Polygon")) return "Area";
  return type || "—";
}

function collectCoordinatePairs(coordinates, pairs = []) {
  if (!Array.isArray(coordinates)) return pairs;
  if (
    coordinates.length >= 2 &&
    Number.isFinite(Number(coordinates[0])) &&
    Number.isFinite(Number(coordinates[1]))
  ) {
    pairs.push([Number(coordinates[0]), Number(coordinates[1])]);
    return pairs;
  }

  coordinates.forEach((item) => collectCoordinatePairs(item, pairs));
  return pairs;
}

function representativeCoordinate(feature) {
  const type = feature?.geometry?.type;
  const pairs = collectCoordinatePairs(feature?.geometry?.coordinates);
  if (!pairs.length) return null;
  if (type === "Point") return pairs[0];

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const [lng, lat] of pairs) {
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  if (![minLng, maxLng, minLat, maxLat].every(Number.isFinite)) return null;
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
}

function formatCoordinate(coordinate) {
  if (!coordinate) return "—";
  const [lng, lat] = coordinate;
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

function formatArea(properties) {
  const value = firstValue(properties, ["luas_wilayah_ha", "LUASWH"]);
  if (!value) return "—";
  const numeric = Number(value.replace?.(/,/g, ".") ?? value);
  if (Number.isFinite(numeric)) return `${numeric.toLocaleString("id-ID", { maximumFractionDigits: 2 })} ha`;
  return value;
}

function CompassRose() {
  return (
    <div className="print-only-compass" aria-label="Arah mata angin: utara, timur, selatan, barat">
      <span className="print-only-compass-label print-only-compass-n">U</span>
      <span className="print-only-compass-label print-only-compass-e">T</span>
      <span className="print-only-compass-label print-only-compass-s">S</span>
      <span className="print-only-compass-label print-only-compass-w">B</span>
      <span className="print-only-compass-center" aria-hidden="true" />
      <span className="print-only-compass-needle print-only-compass-needle-n" aria-hidden="true" />
      <span className="print-only-compass-needle print-only-compass-needle-s" aria-hidden="true" />
    </div>
  );
}

function buildMapInfo({ selectedFeature, focusAdmin, scopeTitle, selectedRegion }) {
  const activeFeature = selectedFeature?.feature ?? focusAdmin?.feature ?? null;
  if (!activeFeature) {
    return {
      name: scopeTitle || "Kabupaten Wajo",
      geometry: "—",
      location: selectedRegion ? `Berada di ${selectedRegion}` : "Kabupaten Wajo",
      area: "—",
      coordinate: "—",
    };
  }

  const properties = activeFeature.properties ?? {};
  const adminType = focusAdmin?.type;
  const name =
    adminType === "desa"
      ? firstValue(properties, ["Desa", "WADMKD", "nama_desa", "nama_desa_kemendagri"])
      : adminType === "kecamatan"
        ? firstValue(properties, ["Kecamatan", "WADMKC", "nama_kecamatan", "NAMOBJ"])
        : adminType === "kabupaten"
          ? firstValue(properties, ["nama_kabupaten", "WADMKK", "NAMOBJ"])
          : firstValue(properties, [selectedFeature?.layer?.labelField, selectedFeature?.layer?.categoricalField, "NAMOBJ", "nama", "NAMA"]) || scopeTitle || "Fitur terpilih";

  const district = firstValue(properties, ["Kecamatan", "WADMKC", "nama_kecamatan", "kecamatan"]);
  const location = adminType === "desa"
    ? district ? `Berada di Kecamatan ${district}` : "Berada di wilayah Kabupaten Wajo"
    : adminType === "kecamatan"
      ? "Berada di Kabupaten Wajo"
      : adminType === "kabupaten"
        ? "Kabupaten Wajo"
        : district
          ? `Berada di Kecamatan ${district}`
          : selectedRegion
            ? `Berada di ${selectedRegion}`
            : "Lokasi wilayah belum tersedia";

  const area = adminType ? formatArea(properties) : "—";

  return {
    name,
    geometry: geometryLabel(activeFeature),
    location,
    area,
    coordinate: formatCoordinate(representativeCoordinate(activeFeature)),
  };
}

export default function PrintLegend({
  activeLayers,
  layerData,
  kecamatanLegend,
  scopeTitle,
  selectedFeature,
  focusAdmin,
  selectedRegion,
  regionFilter,
  printScale,
}) {
  const info = buildMapInfo({ selectedFeature, focusAdmin, scopeTitle, selectedRegion });
  const interactiveMapUrl = absoluteUrl("/");
  const districtData = layerData?.["adm-kecamatan"];
  const context = { focusAdmin, regionFilter, boundaryData: districtData };

  return (
    <aside className="print-only-legend" aria-label="Legenda peta untuk cetak">
      <div className="print-only-header">
        <div className="print-only-brand-row">
          <Image
            src="/brand/logo-kabupaten-wajo.png"
            alt="Lambang Kabupaten Wajo"
            width={28}
            height={33}
            className="print-only-logo"
            unoptimized
            priority
          />
          <h1 className="print-only-kicker">Pemerintah Kabupaten Wajo</h1>
        </div>
        <div className="print-only-title-row">
          <h2>Legenda Peta</h2>
          <p className="print-only-note">{scopeTitle || "Tampilan saat ini"}</p>
        </div>
      </div>

      <section className="print-only-map-info" aria-labelledby="print-map-info-title">
        <div className="print-only-info-heading">
          <p id="print-map-info-title" className="print-only-section-title">Informasi peta</p>
          <CompassRose />
        </div>
        <dl className="print-only-info-grid">
          <div><dt>Nama</dt><dd>{info.name}</dd></div>
          <div><dt>Lokasi</dt><dd>{info.location}</dd></div>
          <div><dt>Luas wilayah</dt><dd>{info.area}</dd></div>
          <div><dt>Skala</dt><dd>{printScale?.label || "—"}</dd></div>
          <div><dt>Geometri</dt><dd>{info.geometry}</dd></div>
          <div className="print-only-coordinate"><dt>{info.geometry === "Titik" ? "Koordinat" : "Titik referensi"}</dt><dd>{info.coordinate}</dd></div>
        </dl>
      </section>

      <div className="print-only-legend-items">
        {activeLayers.flatMap((layer) => {
          if (layer.id === "adm-kabupaten") {
            return [
              <div key={`${layer.id}:heading`} className="print-only-legend-layer-title">{layer.title}</div>,
              <div key={`${layer.id}:entry`} className="print-only-legend-item print-only-legend-detail">
                <LegendSwatch kind="line" color="#1e293b" style={{ color: "#1e293b", weight: 2.35 }} />
                <span>Batas wilayah kabupaten</span>
              </div>,
            ];
          }

          if (layer.id === "adm-kecamatan") {
            return [
              <div key={`${layer.id}:heading`} className="print-only-legend-layer-title">{layer.title}</div>,
              <div key={`${layer.id}:entry`} className="print-only-legend-item print-only-legend-detail">
                <LegendSwatch kind="line" color="#334155" style={{ color: "#334155", weight: 2.15 }} />
                <span>Batas wilayah kecamatan</span>
              </div>,
            ];
          }

          if (layer.id === "adm-desa") {
            return [
              <div key={`${layer.id}:heading`} className="print-only-legend-layer-title">{layer.title}</div>,
              <div key={`${layer.id}:entry`} className="print-only-legend-item print-only-legend-detail">
                <LegendSwatch kind="line" color="#64748b" style={{ color: "#64748b", weight: 1.55 }} />
                <span>Batas desa / kelurahan</span>
              </div>,
            ];
          }

          const entries = buildLayerLegendEntries(layer, layerData?.[layer.id], context, selectedFeature);
          if (!entries.length) return [];
          return [
            <div key={`${layer.id}:heading`} className="print-only-legend-layer-title">{layer.title}</div>,
            ...entries.map((entry) => (
              <div key={entry.key} className="print-only-legend-item print-only-legend-detail">
                <LegendSwatch
                  kind={entry.kind}
                  color={entry.color}
                  layer={layer}
                  feature={entry.feature}
                  style={entry.style}
                />
                <span>{entry.label}</span>
              </div>
            )),
          ];
        })}
      </div>

      {kecamatanLegend.length > 0 && (
        <div className="print-only-kecamatan">
          <p className="print-only-section-title">Kecamatan</p>
          <div className="print-only-kecamatan-grid">
            {kecamatanLegend.map((item) => (
              <div key={`print-kec-${item.id}`} className="print-only-legend-item">
                <LegendSwatch kind="area" color={item.color} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="print-only-footer">
        <span>Dikelola oleh Diskominfotik Kabupaten Wajo</span>
        <a href={interactiveMapUrl}>Buka peta interaktif</a>
      </div>
    </aside>
  );
}

