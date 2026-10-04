import { IconInfoCircle, IconLayersIntersect, IconMap, IconShare2 } from "@tabler/icons-react";
import IconButton from "./IconButton";

export default function MobileActions({ onOpenSidebar, onToggleLegend, onShare, selected, onOpenInspector, sidebarOpen = false, legendOpen = false }) {
  return (
    <div className="map-ui-chrome absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 z-[840] flex items-center gap-2 sm:hidden">
      <IconButton label={sidebarOpen ? "Daftar data terbuka" : "Buka daftar data"} tone="blue" active={sidebarOpen} placement="top" onClick={onOpenSidebar} className="size-10">
        <IconLayersIntersect size={17} />
      </IconButton>
      <IconButton label={legendOpen ? "Sembunyikan legenda" : "Tampilkan legenda"} tone="amber" active={legendOpen} placement="top" onClick={onToggleLegend} className="size-10">
        <IconMap size={17} />
      </IconButton>
      <IconButton label="Bagikan peta ini" tone="slate" placement="top" onClick={onShare} className="size-10">
        <IconShare2 size={17} />
      </IconButton>
      {selected && (
        <IconButton label="Buka detail lokasi" tone="emerald" placement="top" onClick={onOpenInspector} className="size-10">
          <IconInfoCircle size={17} />
        </IconButton>
      )}
    </div>
  );
}
