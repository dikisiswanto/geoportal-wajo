import { IconX } from "@tabler/icons-react";
import LayerGlyph from "./LayerGlyph";

export default function LegendPanel({ activeLayers, kecamatanLegend, open, onClose }) {
  if (!open) return null;
  return (
    <section className="print-map-legend absolute bottom-3 left-3 z-[700] w-[min(310px,calc(100vw-1.5rem))] border border-slate-200 bg-white shadow-sm" aria-label="Legenda">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5">
        <div><h2 className="text-xs font-semibold text-slate-900">Legenda</h2><p className="text-[10px] text-slate-500">Layer yang sedang aktif</p></div>
        <button type="button" onClick={onClose} className="grid size-7 place-items-center text-slate-500 hover:bg-slate-100" aria-label="Tutup legenda"><IconX size={15} /></button>
      </div>
      <div className="legend-scroll max-h-56 overflow-y-auto px-3 py-2">
        {activeLayers.map((layer) => (
          <div key={layer.id} className="py-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              {layer.geometry === "Point" ? (
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
                {kecamatanLegend.map((item) => <div key={item.id} className="flex items-center gap-2 py-0.5 text-[11px] text-slate-600"><span className="inline-block h-2 w-2 border border-slate-300" style={{ backgroundColor: item.color }} aria-hidden="true" /><span>{item.name}</span></div>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
