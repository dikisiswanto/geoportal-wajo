import { IconRefresh, IconSearch, IconSquareX } from "@tabler/icons-react";
import LayerRow from "./LayerRow";

export default function LayerCatalog({
  layers,
  groupOrder,
  visible,
  loading,
  errors,
  search,
  groupFilter,
  onSearch,
  onGroupFilter,
  onReset,
  onToggle,
  onClose
}) {
  const query = search.trim().toLowerCase();
  const filteredLayers = layers.filter((layer) => {
    if (groupFilter !== "Semua" && layer.group !== groupFilter) return false;
    if (!query) return true;
    return `${layer.title} ${layer.group} ${layer.description}`.toLowerCase().includes(query);
  });

  return (
    <aside className="absolute inset-y-0 left-0 z-[1200] flex w-[340px] max-w-[88vw] flex-col border-r border-slate-200 bg-white shadow-[8px_0_24px_rgba(15,23,42,0.04)] lg:relative lg:max-w-none lg:shadow-none" aria-label="Katalog layer">
      <div className="border-b border-slate-200 p-3">
        <div className="md:hidden">
          <label className="relative block">
            <span className="sr-only">Cari layer</span>
            <IconSearch aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Cari layer…" className="w-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
          </label>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div><p className="text-sm font-semibold text-slate-900">Layer</p><p className="text-xs text-slate-500">Pilih data yang ingin ditampilkan.</p></div>
          <button type="button" onClick={onReset} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" title="Kembalikan tampilan peta dan filter ke kondisi awal"><IconRefresh size={14} stroke={1.8} /> Reset</button>
        </div>
        <div className="mt-3">
          <label className="sr-only" htmlFor="group-filter">Kelompok layer</label>
          <select id="group-filter" value={groupFilter} onChange={(event) => onGroupFilter(event.target.value)} className="w-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-slate-400">
            <option>Semua</option>
            {groupOrder.map((group) => <option key={group}>{group}</option>)}
          </select>
        </div>
        <button type="button" onClick={onClose} className="mt-2 text-xs text-slate-500 hover:text-slate-900 lg:hidden">Tutup katalog</button>
      </div>

      <div className="layer-scroll min-h-0 flex-1 overflow-y-auto px-2 py-2" aria-label="Daftar layer">
        {groupOrder.map((group) => {
          const groupLayers = filteredLayers.filter((layer) => layer.group === group);
          if (!groupLayers.length) return null;
          return (
            <section key={group} className="mb-4 last:mb-1">
              <h2 className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{group}</h2>
              <div className="divide-y divide-slate-100 border-y border-slate-100">
                {groupLayers.map((layer) => <LayerRow key={layer.id} layer={layer} active={!!visible[layer.id]} busy={!!loading[layer.id]} error={errors[layer.id]} onToggle={onToggle} />)}
              </div>
            </section>
          );
        })}

        {!filteredLayers.length && (
          <div className="px-4 py-10 text-center">
            <IconSquareX className="mx-auto text-slate-300" size={28} stroke={1.5} />
            <p className="mt-3 text-sm font-medium text-slate-800">Tidak ada layer</p>
            <p className="mt-1 text-xs text-slate-500">Coba kata kunci lain.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
