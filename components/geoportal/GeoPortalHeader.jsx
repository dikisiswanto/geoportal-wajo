import { IconLayersIntersect, IconMap, IconSearch } from "@tabler/icons-react";

export default function GeoPortalHeader({ search, onSearch, sidebarOpen, legendOpen, onToggleSidebar, onToggleLegend }) {
  return (
    <header className="z-[1500] flex h-14 shrink-0 items-center border-b border-slate-200 bg-white px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="grid size-8 shrink-0 place-items-center border border-slate-300 text-sm font-bold text-slate-800">W</div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Pemerintah Kabupaten Wajo</p>
          <h1 className="truncate text-[15px] font-semibold text-slate-900">Geoportal</h1>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-md px-8 md:block">
        <label className="relative block">
          <span className="sr-only">Cari layer</span>
          <IconSearch aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Cari layer…" className="w-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white" />
        </label>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button type="button" onClick={onToggleSidebar} className="grid size-9 place-items-center text-slate-600 hover:bg-slate-100" aria-label={sidebarOpen ? "Sembunyikan katalog" : "Tampilkan katalog"} aria-pressed={sidebarOpen}>
          <IconLayersIntersect size={18} stroke={1.7} />
        </button>
        <button type="button" onClick={onToggleLegend} className="grid size-9 place-items-center text-slate-600 hover:bg-slate-100" aria-label={legendOpen ? "Sembunyikan legenda" : "Tampilkan legenda"} aria-pressed={legendOpen}>
          <IconMap size={18} stroke={1.7} />
        </button>
      </div>
    </header>
  );
}
