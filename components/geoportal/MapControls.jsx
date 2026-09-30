import { IconCurrentLocation, IconLayersIntersect, IconMinus, IconPlus, IconTarget } from "@tabler/icons-react";

export default function MapControls({ mapReady, onZoomIn, onZoomOut, onHome, onLocate, sidebarOpen, onOpenSidebar }) {
  return (
    <>
      <div className="absolute left-3 top-14 z-[700] flex flex-col border border-slate-200 bg-white shadow-sm sm:top-3">
        <button type="button" onClick={onZoomIn} disabled={!mapReady} className="grid size-10 place-items-center border-b border-slate-200 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300" aria-label="Perbesar peta"><IconPlus size={18} stroke={1.7} /></button>
        <button type="button" onClick={onZoomOut} disabled={!mapReady} className="grid size-10 place-items-center border-b border-slate-200 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300" aria-label="Perkecil peta"><IconMinus size={18} stroke={1.7} /></button>
        <button type="button" onClick={onHome} disabled={!mapReady} className="grid size-10 place-items-center border-b border-slate-200 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300" aria-label="Tampilkan Kabupaten Wajo"><IconTarget size={18} stroke={1.7} /></button>
        <button type="button" onClick={onLocate} disabled={!mapReady} className="grid size-10 place-items-center text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300" aria-label="Gunakan lokasi perangkat"><IconCurrentLocation size={18} stroke={1.7} /></button>
      </div>
      {!sidebarOpen && <button type="button" onClick={onOpenSidebar} className="absolute left-3 top-3 z-[700] grid size-10 place-items-center border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50" aria-label="Tampilkan katalog layer"><IconLayersIntersect size={18} stroke={1.7} /></button>}
    </>
  );
}
