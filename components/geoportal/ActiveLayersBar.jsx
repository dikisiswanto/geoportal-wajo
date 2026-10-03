import { IconChevronRight, IconEye, IconX } from "@tabler/icons-react";
import { regionDisplayName } from "../../lib/geo/region";
import { featureHasRenderableGeometry, featurePassesLayerFilter } from "../../lib/geo/dataFilter";

export default function ActiveLayersBar({
  activeLayers,
  layerData = {},
  dataSummary = {},
  regionFilter,
  regionSummary = {},
  onSelectLayer,
  onCloseLayer,
  onClearRegion
}) {
  if (!activeLayers?.length) return null;

  const countFor = (layer) => {
    if (!regionFilter) {
      const loaded = layerData?.[layer.id]?.features;
      if (loaded) return loaded.filter((feature) => featureHasRenderableGeometry(feature) && featurePassesLayerFilter(layer, feature)).length;
      return dataSummary?.[layer.file]?.mappedCount ?? dataSummary?.[layer.file]?.total ?? 0;
    }

    return regionSummary?.[layer.file]?.regions?.find(
      (item) => item.name.toLowerCase() === regionFilter.toLowerCase()
    )?.count ?? 0;
  };

  return (
    <section className="map-ui-chrome pointer-events-auto absolute left-1/2 top-3 z-[860] w-[min(820px,calc(100vw-4rem))] -translate-x-1/2 rounded-lg border border-slate-200 bg-white/95 px-2 py-1.5 shadow-sm backdrop-blur sm:top-4" aria-label="Data yang sedang tampil">
      <div className="flex items-center gap-2">
        <div className="hidden shrink-0 items-center gap-1.5 pl-1 sm:flex">
          <IconEye size={14} className="text-slate-400" aria-hidden="true" />
          <span className="map-text-micro font-semibold uppercase tracking-[0.12em] text-slate-400">Data aktif</span>
          <span className="map-text-micro font-semibold tabular-nums text-slate-800">{activeLayers.length}</span>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 active-layers-scroll overflow-x-auto overscroll-x-contain touch-pan-x">
          {regionFilter && (
            <button type="button" onClick={onClearRegion} className="inline-flex min-w-0 shrink-0 items-center gap-1 rounded-md bg-slate-900 px-2 py-1.5 map-text-micro font-semibold text-white hover:bg-slate-800" title={`Kembali ke seluruh Wajo dari ${regionDisplayName(regionFilter)}`}>
              {regionDisplayName(regionFilter)}
              <IconX size={11} aria-hidden="true" />
            </button>
          )}
          {activeLayers.map((layer) => (
            <button key={layer.id} type="button" onClick={() => onSelectLayer(layer)} className="group inline-flex min-w-0 shrink-0 items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-left hover:border-slate-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" title={`Lihat informasi ${layer.title}`}>
              <span className="max-w-[150px] truncate map-text-micro font-medium text-slate-700 sm:max-w-[210px]">{layer.title}</span>
              <span className="shrink-0 map-text-micro tabular-nums text-slate-400">{countFor(layer).toLocaleString("id-ID")}</span>
              <IconChevronRight size={13} className="text-slate-300 group-hover:text-slate-500" aria-hidden="true" />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => activeLayers.forEach(onCloseLayer)} className="hidden size-7 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 sm:grid" title="Sembunyikan semua data aktif" aria-label="Sembunyikan semua data aktif">
          <IconX size={14} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
