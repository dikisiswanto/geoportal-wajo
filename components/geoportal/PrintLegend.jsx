import Image from "next/image";
import { absoluteUrl } from "../../lib/seo";
import { markerIconMarkup, pointKind } from "../../lib/geo/markers";
import { styleFor } from "../../lib/geo/styles";

function LegendSwatch({ kind, color, layer, feature }) {
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
        <line x1="2" y1="6" x2="22" y2="6" stroke={safeColor} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className="print-only-swatch-svg" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="12" height="12" rx="2" fill={safeColor} fillOpacity="0.62" stroke={safeColor} strokeWidth="1.3" />
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
    place: layer?.title || "Lokasi"
  };
  return labels[kind] || normalizeLegendLabel(kind);
}

function categoricalLegendLabel(layer, value) {
  const label = normalizeLegendLabel(value);
  if (layer?.categoricalField === "KLASIFIKAS") return `Klasifikasi ${label}`;
  return label;
}

function buildLayerLegendEntries(layer, data) {
  if (!layer) return [];

  const features = Array.isArray(data?.features) ? data.features : [];
  const kind = legendKind(layer);
  const field = layer.categoricalField;

  // Point layers reuse the exact marker glyph used on the map. If a point
  // layer contains multiple marker kinds, expose each kind once.
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
        feature
      });
      if (entries.length >= 8) break;
    }
    return entries.length ? entries : [{
      key: `${layer.id}:default`,
      label: layer.title,
      kind,
      color: layer.color,
      feature: null
    }];
  }

  // Categorical layers (roads, infrastructure, potentials, etc.) derive
  // their legend directly from the same style function used by the map.
  if (field && features.length) {
    const entries = [];
    const seen = new Set();
    for (const feature of features) {
      const value = feature?.properties?.[field];
      if (value == null || String(value).trim() === "") continue;
      const label = categoricalLegendLabel(layer, value);
      const style = styleFor(layer, feature);
      const color = style?.fillColor || style?.color || layer.color;
      const key = `${label}:${color}`;
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({
        key: `${layer.id}:${key}`,
        label,
        kind,
        color,
        feature
      });
      if (entries.length >= 12) break;
    }
    if (entries.length) return entries;
  }

  return [{
    key: `${layer.id}:default`,
    label: layer.title,
    kind,
    color: layer.color,
    feature: features[0] || null
  }];
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
  const coordinates = feature?.geometry?.coordinates;
  const pairs = collectCoordinatePairs(coordinates);
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

function firstValue(properties, keys) {
  for (const key of keys) {
    const value = properties?.[key];
    if (value != null && String(value).trim() !== "") return String(value).trim();
  }
  return "";
}

function formatArea(properties) {
  const value = firstValue(properties, ["luas_wilayah_ha", "LUASWH"]);
  if (!value) return "—";
  const numeric = Number(value.replace?.(/,/g, ".") ?? value);
  if (Number.isFinite(numeric)) return `${numeric.toLocaleString("id-ID", { maximumFractionDigits: 2 })} ha`;
  return value;
}

function buildMapInfo({ selectedFeature, focusAdmin, scopeTitle, selectedRegion }) {
  const activeFeature = selectedFeature?.feature ?? focusAdmin?.feature ?? null;
  if (!activeFeature) {
    return {
      name: scopeTitle || "Kabupaten Wajo",
      geometry: "—",
      location: selectedRegion ? `Berada di ${selectedRegion}` : "Kabupaten Wajo",
      area: "—",
      coordinate: "—"
    };
  }

  const properties = activeFeature.properties ?? {};
  const featureType = selectedFeature?.layer?.geometry || focusAdmin?.type || "";
  const adminType = focusAdmin?.type;
  const name =
    adminType === "desa"
      ? firstValue(properties, ["Desa", "WADMKD", "nama_desa", "nama_desa_kemendagri"])
      : adminType === "kecamatan"
        ? firstValue(properties, ["Kecamatan", "WADMKC", "nama_kecamatan", "NAMOBJ"])
        : adminType === "kabupaten"
          ? firstValue(properties, ["nama_kabupaten", "WADMKK", "NAMOBJ"])
          : firstValue(properties, [
            selectedFeature?.layer?.labelField,
            selectedFeature?.layer?.categoricalField,
            "NAMOBJ",
            "nama",
            "NAMA"
          ]) || scopeTitle || "Fitur terpilih";

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

  const area = adminType || selectedFeature?.layer?.id?.startsWith("adm-")
    ? formatArea(properties)
    : "—";

  return {
    name,
    geometry: geometryLabel(activeFeature) || geometryLabel({ geometry: { type: featureType } }),
    location,
    area,
    coordinate: formatCoordinate(representativeCoordinate(activeFeature))
  };
}

export default function PrintLegend({ activeLayers, layerData, kecamatanLegend, scopeTitle, selectedFeature, focusAdmin, selectedRegion, printScale }) {
  const info = buildMapInfo({ selectedFeature, focusAdmin, scopeTitle, selectedRegion });
  const interactiveMapUrl = absoluteUrl("/");

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
        <p id="print-map-info-title" className="print-only-section-title">Informasi peta</p>
        <dl className="print-only-info-grid">
          <div>
            <dt>Nama</dt>
            <dd>{info.name}</dd>
          </div>
          <div>
            <dt>Lokasi</dt>
            <dd>{info.location}</dd>
          </div>
          <div>
            <dt>Luas wilayah</dt>
            <dd>{info.area}</dd>
          </div>
          <div>
            <dt>Skala</dt>
            <dd>{printScale?.label || "—"}</dd>
          </div>
          <div>
            <dt>Geometri</dt>
            <dd>{info.geometry}</dd>
          </div>
          <div className="print-only-coordinate">
            <dt>{info.geometry === "Titik" ? "Koordinat" : "Titik referensi"}</dt>
            <dd>{info.coordinate}</dd>
          </div>
        </dl>
      </section>

      <div className="print-only-legend-items">
        {activeLayers.flatMap((layer) => {
          const entries = buildLayerLegendEntries(layer, layerData?.[layer.id]);
          return [
            <div key={`${layer.id}:heading`} className="print-only-legend-layer-title">
              {layer.title}
            </div>,
            ...entries.map((entry) => (
              <div key={entry.key} className="print-only-legend-item print-only-legend-detail">
                <LegendSwatch
                  kind={entry.kind}
                  color={entry.color}
                  layer={layer}
                  feature={entry.feature}
                />
                <span>{entry.label}</span>
              </div>
            ))
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
