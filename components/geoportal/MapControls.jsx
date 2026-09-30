import {
  IconCurrentLocation,
  IconLayersIntersect,
  IconMinus,
  IconPlus,
  IconTarget,
  IconPrinter,
} from "@tabler/icons-react";
import IconButton from "./IconButton";

export default function MapControls({
  mapReady,
  onZoomIn,
  onZoomOut,
  onHome,
  onLocate,
  sidebarOpen,
  onOpenSidebar,
  onPrint,
}) {
  return (
    <div className="map-ui-chrome pointer-events-none absolute inset-0 z-[700]">
      <div className="pointer-events-auto absolute left-3 top-14 flex flex-col gap-1 sm:top-3">
        <IconButton label="Perbesar peta" tone="blue" disabled={!mapReady} onClick={onZoomIn}>
          <IconPlus size={18} stroke={1.8} />
        </IconButton>
        <IconButton label="Perkecil peta" tone="slate" disabled={!mapReady} onClick={onZoomOut}>
          <IconMinus size={18} stroke={1.8} />
        </IconButton>
        <IconButton label="Tampilkan seluruh Kabupaten Wajo" tone="amber" disabled={!mapReady} onClick={onHome}>
          <IconTarget size={18} stroke={1.8} />
        </IconButton>
        <IconButton label="Gunakan lokasi perangkat" tone="emerald" disabled={!mapReady} onClick={onLocate}>
          <IconCurrentLocation size={18} stroke={1.8} />
        </IconButton>
        <IconButton label="Cetak peta" tone="violet" disabled={!mapReady} onClick={onPrint}>
          <IconPrinter size={18} stroke={1.8} />
        </IconButton>
      </div>

      {!sidebarOpen && (
        <div className="pointer-events-auto absolute left-3 top-3">
          <IconButton label="Tampilkan katalog layer" tone="blue" onClick={onOpenSidebar}>
            <IconLayersIntersect size={18} stroke={1.8} />
          </IconButton>
        </div>
      )}
    </div>
  );
}
