import { IconArrowRight, IconInfoCircle, IconMapPin } from "@tabler/icons-react";
import { regionDisplayName } from "../../lib/geo/region";

export default function MapHint({ step = "layer", regionName = "", onAction }) {
  const content = regionName
    ? {
        title: `${regionDisplayName(regionName)} siap dijelajahi`,
        text: "Klik wilayah atau objek di peta untuk melihat informasinya.",
        action: "Lihat data",
        icon: IconMapPin
      }
    : step === "feature"
      ? {
          title: "Coba klik wilayah di peta",
          text: "Pilih wilayah atau objek untuk melihat informasi dan data terkait.",
          action: "Jelajahi data",
          icon: IconInfoCircle
        }
      : {
          title: "Mulai eksplorasi",
          text: "Aktifkan layer untuk menampilkan data di peta.",
          action: "Buka layer",
          icon: IconInfoCircle
        };

  const Icon = content.icon;

  return (
    <div
      className="map-ui-chrome pointer-events-auto absolute bottom-20 left-1/2 z-[830] w-[min(380px,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-md backdrop-blur sm:bottom-5"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-2">
        <div className="grid size-8 shrink-0 place-items-center rounded-md bg-slate-50 text-slate-500" aria-hidden="true">
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="map-text-compact font-semibold text-slate-900">{content.title}</p>
          <p className="mt-0.5 map-text-compact leading-5 text-slate-500">{content.text}</p>
          <button
            type="button"
            onClick={onAction}
            className="mt-1.5 inline-flex items-center gap-1 map-text-compact font-semibold text-slate-700 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {content.action}
            <IconArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
