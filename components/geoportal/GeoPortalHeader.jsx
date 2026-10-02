import { IconLayersIntersect, IconMap, IconSearch } from "@tabler/icons-react";
import IconButton from "./IconButton";

const WAJO_LOGO = "/brand/logo-kabupaten-wajo.png";

export default function GeoPortalHeader({
  search,
  onSearch,
  sidebarOpen,
  legendOpen,
  onToggleSidebar,
  onToggleLegend
}) {
  return (
    <header className="z-[1500] flex h-14 shrink-0 items-center border-b border-slate-200 bg-white px-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={WAJO_LOGO}
          alt="Lambang Kabupaten Wajo"
          width="46"
          height="46"
          className="block h-11 w-[46px] shrink-0 object-contain"
        />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Pemerintah Kabupaten Wajo
          </p>
          <h1 className="truncate text-[15px] font-semibold text-slate-900">
            Peta Interaktif Kabupaten Wajo
          </h1>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-md px-8 md:block">
        <label className="relative block">
          <span className="sr-only">Cari layer</span>
          <IconSearch
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Cari layer…"
            className="w-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </label>
      </div>

      <nav className="ml-auto flex items-center gap-1" aria-label="Tampilan peta">
        <IconButton
          label={sidebarOpen ? "Sembunyikan katalog layer" : "Tampilkan katalog layer"}
          placement="bottom"
          tone="blue"
          active={sidebarOpen}
          onClick={onToggleSidebar}
          className="size-9"
        >
          <IconLayersIntersect size={18} stroke={1.7} />
        </IconButton>
        <IconButton
          label={legendOpen ? "Sembunyikan legenda" : "Tampilkan legenda"}
          placement="bottom"
          tone="amber"
          active={legendOpen}
          onClick={onToggleLegend}
          className="size-9"
        >
          <IconMap size={18} stroke={1.7} />
        </IconButton>
      </nav>
    </header>
  );
}
