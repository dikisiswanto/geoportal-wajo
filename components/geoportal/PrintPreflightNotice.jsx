import { IconPrinter, IconX } from "@tabler/icons-react";
import LegendSymbol from "./LegendSymbol";

export default function PrintPreflightNotice({
  activeLayers = [],
  maxLayers,
  onClose,
  onOpenLayers,
}) {
  return (
    <section
      className="map-ui-chrome print-preflight-notice absolute bottom-24 left-1/2 z-[1060] w-[min(420px,calc(100vw-1.5rem))] -translate-x-1/2 border border-amber-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:bottom-20"
      role="alert"
      aria-live="polite"
      aria-label="Pemberitahuan batas layer untuk cetak"
    >
      <div className="flex items-start gap-3">
        <span className="print-preflight-icon grid size-8 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700" aria-hidden="true">
          <IconPrinter size={17} stroke={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="map-text-compact font-semibold text-slate-900">Layer terlalu banyak untuk dicetak</p>
              <p className="mt-0.5 map-text-micro text-slate-600">
                {activeLayers.length} layer garis/area sedang aktif. Maksimal {maxLayers} layer dapat dicetak sekaligus agar semua data tetap terlihat.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ui-micro-interaction grid size-7 shrink-0 place-items-center text-slate-500 hover:bg-slate-100"
              aria-label="Tutup pemberitahuan cetak"
            >
              <IconX size={15} />
            </button>
          </div>

          <div className="print-preflight-list mt-2 grid max-h-32 grid-cols-1 gap-x-3 gap-y-1 overflow-y-auto rounded-md border border-slate-100 bg-slate-50/70 px-2 py-1.5 sm:grid-cols-2">
            {activeLayers.map((layer) => {
              const geometry = String(layer.geometry || "").toLowerCase();
              const kind = geometry.includes("line") ? "line" : "area";
              return (
                <div key={layer.id} className="flex min-w-0 items-center gap-2 py-0.5 map-text-micro text-slate-700">
                  <LegendSymbol kind={kind} color={layer.color} layer={layer} />
                  <span className="min-w-0 truncate" title={layer.title}>{layer.title}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onOpenLayers}
              className="ui-micro-interaction border border-slate-200 bg-white px-2.5 py-1.5 map-text-micro font-semibold text-slate-700 hover:bg-slate-50"
            >
              Atur layer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ui-micro-interaction bg-slate-900 px-2.5 py-1.5 map-text-micro font-semibold text-white hover:bg-slate-800"
            >
              Mengerti
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
