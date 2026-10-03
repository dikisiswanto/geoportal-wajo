import { IconChevronDown, IconChevronUp, IconX } from "@tabler/icons-react";
import { useState } from "react";
import LayerGlyph from "./LayerGlyph";

export default function LegendPanel({ activeLayers, kecamatanLegend, open, onClose }) {
  const [expanded, setExpanded] = useState(false);
  if (!open) return null;
  const visibleLayers = expanded ? activeLayers : activeLayers.slice(0, 3);
  const hiddenCount = Math.max(0, activeLayers.length - visibleLayers.length);
  return (
    <section className="print-map-legend absolute bottom-20 left-3 z-[820] sm:bottom-3 w-[min(310px,calc(100vw-1.5rem))] border border-slate-200 bg-white shadow-sm" aria-label="Keterangan simbol peta">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5">
        <div><h2 className="map-text-compact font-semibold text-slate-900">Legenda</h2><p className="map-text-micro text-slate-500">Data yang sedang tampil</p></div>
        <button type="button" onClick={onClose} className="grid size-7 place-items-center text-slate-500 hover:bg-slate-100" aria-label="Tutup legenda"><IconX size={15} /></button>
      </div>
      <div className="legend-scroll max-h-56 overflow-y-auto px-3 py-2">
        {visibleLayers.map((layer) => (
          <div key={layer.id} className="py-1.5">
            <div className="flex items-center gap-2 map-text-compact font-medium text-slate-700">
              {String(layer.geometry || "").includes("Point") ? (
                <span className="inline-flex size-4 items-center justify-center" aria-hidden="true">
                  <LayerGlyph layer={layer} active />
                </span>
              ) : (
                <span className="inline-block h-2.5 w-2.5 border border-slate-300" style={{ backgroundColor: layer.color }} aria-hidden="true" />
              )}
              <span>{layer.title}</span>
            </div>
            {layer.id === "adm-kecamatan" && kecamatanLegend.length > 0 && (
              <div className="legend-scroll mt-1 max-h-36 overflow-y-auto pl-5">
                {kecamatanLegend.map((item) => <div key={item.id} className="flex items-center gap-2 py-0.5 map-text-micro text-slate-600"><span className="inline-block h-2 w-2 border border-slate-300" style={{ backgroundColor: item.color }} aria-hidden="true" /><span>{item.name}</span></div>)}
              </div>
            )}
          </div>
        ))}
      </div>
      {activeLayers.length > 3 && (
        <button type="button" onClick={() => setExpanded((value) => !value)} className="flex w-full items-center justify-center gap-1 border-t border-slate-100 px-3 py-2 map-text-micro font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
          {expanded ? "Ringkas" : `Tampilkan ${hiddenCount} data lainnya`}
          {expanded ? <IconChevronUp size={13} aria-hidden="true" /> : <IconChevronDown size={13} aria-hidden="true" />}
        </button>
      )}
    </section>
  );
}
