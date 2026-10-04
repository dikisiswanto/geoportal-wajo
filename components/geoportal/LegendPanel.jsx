import { IconChevronDown, IconChevronUp, IconX } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import LayerGlyph from "./LayerGlyph";
import LegendSymbol from "./LegendSymbol";
import { buildLayerLegendEntries } from "./legendUtils";

const INTERACTIVE_ENTRY_LIMIT = 6;

function AdminLegend({ layer, kecamatanLegend }) {
  if (layer.id === "adm-kabupaten") {
    return (
      <div className="mt-1 flex items-center gap-2 pl-5 map-text-micro text-slate-600">
        <LegendSymbol kind="line" color="#1e293b" style={{ color: "#1e293b", weight: 2.35 }} />
        <span>Batas wilayah kabupaten</span>
      </div>
    );
  }

  if (layer.id === "adm-kecamatan") {
    return (
      <div className="mt-1 pl-5">
        <div className="flex items-center gap-2 map-text-micro text-slate-600">
          <LegendSymbol kind="line" color="#334155" style={{ color: "#334155", weight: 2.15 }} />
          <span>Batas wilayah kecamatan</span>
        </div>
        {kecamatanLegend.length > 0 && (
          <div className="mt-1 grid max-h-36 grid-cols-2 gap-x-3 gap-y-1 overflow-y-auto pr-1">
            {kecamatanLegend.map((item) => (
              <div key={item.id} className="flex min-w-0 items-center gap-1.5 py-0.5 map-text-micro text-slate-600">
                <LegendSymbol kind="area" color={item.color} style={{ fillColor: item.color, color: item.color, fillOpacity: 0.28 }} />
                <span className="min-w-0 truncate" title={item.name}>{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (layer.id === "adm-desa") {
    return (
      <div className="mt-1 flex items-center gap-2 pl-5 map-text-micro text-slate-600">
        <LegendSymbol kind="line" color="#64748b" style={{ color: "#64748b", weight: 1.55 }} />
        <span>Batas desa / kelurahan</span>
      </div>
    );
  }

  return null;
}

export default function LegendPanel({
  activeLayers,
  layerData = {},
  kecamatanLegend,
  selectedFeature = null,
  focusAdmin = null,
  regionFilter = "",
  boundaryData = null,
  open,
  onClose,
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleLayers = expanded ? activeLayers : activeLayers.slice(0, 3);
  const hiddenCount = Math.max(0, activeLayers.length - visibleLayers.length);
  const context = useMemo(
    () => ({ focusAdmin, regionFilter, boundaryData }),
    [boundaryData, focusAdmin, regionFilter]
  );

  if (!open) return null;

  return (
    <section className="print-map-legend absolute bottom-20 left-3 z-[820] w-[min(310px,calc(100vw-1.5rem))] border border-slate-200 bg-white shadow-sm sm:bottom-3" aria-label="Keterangan simbol peta">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5">
        <div>
          <h2 className="map-text-compact font-semibold text-slate-900">Legenda</h2>
          <p className="map-text-micro text-slate-500">Data di peta</p>
        </div>
        <button type="button" onClick={onClose} className="ui-micro-interaction grid size-7 place-items-center text-slate-500 hover:bg-slate-100" aria-label="Tutup legenda">
          <IconX size={15} />
        </button>
      </div>

      <div className="legend-scroll max-h-56 overflow-y-auto px-3 py-2">
        {visibleLayers.map((layer) => {
          const isAdmin = String(layer.group || "") === "Administrasi";
          const entries = isAdmin
            ? []
            : buildLayerLegendEntries(layer, layerData[layer.id], context, selectedFeature);
          const shownEntries = entries.slice(0, INTERACTIVE_ENTRY_LIMIT);
          const extraEntries = Math.max(0, entries.length - shownEntries.length);

          return (
            <div key={layer.id} className="py-1.5">
              <div className="flex min-w-0 items-center gap-2 map-text-compact font-medium text-slate-700">
                <span className="inline-flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
                  <LayerGlyph layer={layer} active />
                </span>
                <span className="min-w-0 truncate" title={layer.title}>{layer.title}</span>
              </div>

              {isAdmin ? (
                <AdminLegend layer={layer} kecamatanLegend={kecamatanLegend} />
              ) : shownEntries.length > 0 ? (
                <div className="mt-1 space-y-0.5 pl-5">
                  {shownEntries.map((entry) => (
                    <div key={entry.key} className="flex min-w-0 items-center gap-2 py-0.5 map-text-micro text-slate-600">
                      <LegendSymbol
                        kind={entry.kind}
                        color={entry.color}
                        layer={layer}
                        feature={entry.feature}
                        style={entry.style}
                      />
                      <span className="min-w-0 break-words">{entry.label}</span>
                    </div>
                  ))}
                  {extraEntries > 0 && (
                    <div className="pt-0.5 map-text-source text-slate-400">+{extraEntries} kategori/data lainnya</div>
                  )}
                </div>
              ) : (
                <div className="mt-1 pl-5 flex items-center gap-2 map-text-micro text-slate-500">
                  <LegendSymbol kind={String(layer.geometry || "").toLowerCase().includes("line") ? "line" : String(layer.geometry || "").toLowerCase().includes("point") ? "point" : "area"} color={layer.color} layer={layer} />
                  <span>Data tersedia</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeLayers.length > 3 && (
        <button type="button" onClick={() => setExpanded((value) => !value)} className="ui-micro-interaction flex w-full items-center justify-center gap-1 border-t border-slate-100 px-3 py-2 map-text-micro font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
          {expanded ? "Tampilkan lebih sedikit" : `Tampilkan ${hiddenCount} data lainnya`}
          {expanded ? <IconChevronUp size={13} aria-hidden="true" /> : <IconChevronDown size={13} aria-hidden="true" />}
        </button>
      )}
    </section>
  );
}
