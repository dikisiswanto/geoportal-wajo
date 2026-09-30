import { IconInfoCircle, IconLayersIntersect, IconMap } from "@tabler/icons-react";

export default function MobileActions({ onOpenSidebar, onToggleLegend, selected, onOpenInspector }) {
  return (
    <div className="absolute bottom-3 right-3 z-[700] flex items-center gap-2 sm:hidden">
      <button type="button" onClick={onOpenSidebar} className="grid size-9 place-items-center border border-slate-200 bg-white text-slate-600 shadow-sm" aria-label="Buka katalog layer"><IconLayersIntersect size={17} /></button>
      <button type="button" onClick={onToggleLegend} className="grid size-9 place-items-center border border-slate-200 bg-white text-slate-600 shadow-sm" aria-label="Tampilkan atau sembunyikan legenda"><IconMap size={17} /></button>
      {selected && <button type="button" onClick={onOpenInspector} className="grid size-9 place-items-center border border-slate-200 bg-white text-slate-600 shadow-sm" aria-label="Buka informasi feature"><IconInfoCircle size={17} /></button>}
    </div>
  );
}
