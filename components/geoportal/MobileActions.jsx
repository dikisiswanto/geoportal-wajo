import { IconInfoCircle, IconLayersIntersect, IconMap } from "@tabler/icons-react";
import IconButton from "./IconButton";

export default function MobileActions({ onOpenSidebar, onToggleLegend, selected, onOpenInspector }) {
  return (
    <div className="map-ui-chrome absolute bottom-3 right-3 z-[700] flex items-center gap-2 sm:hidden">
      <IconButton label="Buka katalog layer" tone="blue" placement="top" onClick={onOpenSidebar} className="size-9">
        <IconLayersIntersect size={17} />
      </IconButton>
      <IconButton label="Tampilkan atau sembunyikan legenda" tone="amber" placement="top" onClick={onToggleLegend} className="size-9">
        <IconMap size={17} />
      </IconButton>
      {selected && (
        <IconButton label="Buka informasi feature" tone="emerald" placement="top" onClick={onOpenInspector} className="size-9">
          <IconInfoCircle size={17} />
        </IconButton>
      )}
    </div>
  );
}
