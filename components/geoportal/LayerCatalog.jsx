import { useEffect } from "react";
import { IconMapPin, IconRefresh, IconSearch, IconSquareX, IconX } from "@tabler/icons-react";
import LayerRow from "./LayerRow";
import { regionDisplayName } from "../../lib/geo/region";
import { featureHasRenderableGeometry, featurePassesLayerFilter } from "../../lib/geo/dataFilter";
import useSheetPresence from "./useSheetPresence";
import useSheetSwipe from "./useSheetSwipe";

export default function LayerCatalog({
  layers,
  groupOrder,
  visible,
  loading,
  errors,
  search,
  groupFilter,
  regionFilter,
  regionOptions = [],
  onSearch,
  onGroupFilter,
  onRegionFilter,
  onReset,
  onToggle,
  onInfo,
  layerData,
  dataSummary,
  regionSummary = {},
  onClose,
  open = false,
  focusLayerId = ""
}) {
  const { rendered, visible: sheetVisible } = useSheetPresence(open);
  const { swipeHandlers, swipeStyle } = useSheetSwipe(onClose, open);

  useEffect(() => {
    if (!rendered || !open || !focusLayerId) return;
    const frameId = window.requestAnimationFrame(() => {
      const target = Array.from(document.querySelectorAll("[data-layer-id]"))
        .find((element) => element.getAttribute("data-layer-id") === focusLayerId);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [rendered, open, focusLayerId]);

  if (!rendered) return null;

  const query = search.trim().toLowerCase();
  const filteredLayers = layers.filter((layer) => {
    if (groupFilter !== "Semua" && layer.group !== groupFilter) return false;
    if (!query) return true;
    return `${layer.title} ${layer.group} ${layer.description} ${layer.source} ${layer.sourceType} ${layer.publisher ?? ""}`.toLowerCase().includes(query);
  });

  const regionMatches = query
    ? regionOptions.filter((region) => region.toLowerCase().includes(query)).slice(0, 4)
    : [];

  const summaryFor = (layer) => regionSummary?.[layer.file];

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
    <aside className={`layer-catalog-sheet sheet-panel sheet-panel-left absolute inset-x-0 bottom-0 z-[1400] flex h-[min(72dvh,560px)] w-full flex-col rounded-t-2xl border-t border-slate-200 bg-white shadow-[0_-12px_32px_rgba(15,23,42,0.10)] sm:inset-y-0 sm:left-0 sm:bottom-auto sm:h-auto sm:w-[340px] sm:rounded-none sm:rounded-r-xl sm:border-r sm:border-t-0 sm:shadow-[8px_0_24px_rgba(15,23,42,0.04)] lg:relative lg:w-[340px] lg:rounded-none lg:border-r-0 lg:shadow-none ${sheetVisible ? "sheet-panel-visible" : "sheet-panel-hidden"}`} aria-label="Daftar data peta" style={swipeStyle}>
      <div className="border-b border-slate-200 px-3 pb-2 pt-2">
        <div className="mx-auto mb-1.5 h-1 w-9 rounded-full bg-slate-200 sm:hidden touch-none" aria-hidden="true" {...swipeHandlers} />
        <div>
          <label className="relative block">
            <span className="sr-only">Cari data atau wilayah</span>
            <IconSearch aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Cari tempat, fasilitas, atau data…" className="ui-field h-9 w-full border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-8 map-text-compact outline-none focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100" />
            {search && (
              <button type="button" onClick={() => onSearch("")} className="ui-micro-interaction absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center text-slate-400 hover:text-sky-800" aria-label="Hapus pencarian" title="Hapus pencarian">
                <IconX size={14} aria-hidden="true" />
              </button>
            )}
          </label>
        </div>

        {regionMatches.length > 0 && (
          <div className="mt-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1" aria-label="Wilayah yang ditemukan">
            <p className="px-2 py-1 map-text-micro font-semibold uppercase tracking-[0.14em] text-slate-400">Wilayah</p>
            {regionMatches.map((region) => (
              <button key={region} type="button" onClick={() => { onRegionFilter(region); onSearch(""); }} className="ui-micro-interaction flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left map-text-compact font-medium text-slate-700 hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-700">
                <IconMapPin size={14} className="text-slate-400" aria-hidden="true" />
                <span className="truncate">{regionDisplayName(region)}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-1.5 flex items-center justify-between gap-3">
          <p className="map-text-compact font-semibold text-slate-900">Data</p>
          <button type="button" onClick={onReset} className="ui-micro-interaction inline-flex shrink-0 items-center gap-1 map-text-micro font-semibold text-slate-500 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" title="Kembalikan tampilan peta ke awal"><IconRefresh size={13} stroke={1.8} /> Atur ulang</button>
        </div>

        <div className="mt-1.5 grid grid-cols-2 gap-1">
          <label className="min-w-0 pb-0.5">
            <span className="sr-only">Kategori data</span>
            <select id="group-filter" value={groupFilter} onChange={(event) => onGroupFilter(event.target.value)} className="h-9 w-full min-w-0 truncate rounded-md border border-slate-200 bg-white px-2.5 map-text-compact text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100">
              <option value="Semua">Semua kategori</option>
              {groupOrder.map((group) => <option key={group}>{group}</option>)}
            </select>
          </label>
          <label className="min-w-0 pb-0.5">
            <span className="sr-only">Wilayah</span>
            <select value={regionFilter} onChange={(event) => onRegionFilter(event.target.value)} className="h-9 w-full min-w-0 truncate rounded-md border border-slate-200 bg-white px-2.5 map-text-compact text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100">
              <option value="">Seluruh Wajo</option>
              {regionOptions.map((region) => <option key={region} value={region}>{regionDisplayName(region)}</option>)}
            </select>
          </label>
        </div>

      </div>

      <div className="layer-scroll min-h-0 flex-1 overflow-y-auto px-1.5 py-1.5" aria-label="Daftar data peta">
        {groupOrder.map((group) => {
          const groupLayers = filteredLayers.filter((layer) => layer.group === group);
          if (!groupLayers.length) return null;
          return (
            <section key={group} className="mb-3 last:mb-1">
              <h2 className="px-2 py-1 map-text-micro font-semibold uppercase tracking-[0.14em] text-slate-400">{group}</h2>
              <div className="divide-y divide-slate-100 border-y border-slate-100">
                {groupLayers.map((layer) => {
                  const layerSummary = dataSummary?.[layer.file];
                  return (
                    <div
                      key={layer.id}
                      data-layer-id={layer.id}
                      className={focusLayerId === layer.id ? "layer-catalog-focus" : ""}
                    >
                      <LayerRow
                        layer={layer}
                        active={!!visible[layer.id]}
                        busy={!!loading[layer.id]}
                        error={errors[layer.id]}
                        featureCount={countFor(layer)}
                        totalCount={layerSummary?.total ?? null}
                        unmappedCount={layerSummary?.unmappedCount ?? 0}
                        regionFilter={regionFilter}
                        regionScoped={Boolean(summaryFor(layer))}
                        onToggle={onToggle}
                        onInfo={onInfo}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {!filteredLayers.length && (
          <div className="px-4 py-10 text-center">
            <IconSquareX className="mx-auto text-slate-300" size={28} stroke={1.5} />
            <p className="mt-3 map-text-compact font-medium text-slate-800">Data tidak ditemukan</p>
            <p className="mt-1 map-text-compact text-slate-500">Coba nama tempat, fasilitas, jenis data, atau kecamatan.</p>
          </div>
        )}
      </div>

    </aside>
  );
}
