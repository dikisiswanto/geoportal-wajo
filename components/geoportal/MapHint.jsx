import { IconArrowRight, IconInfoCircle, IconMapPin } from "@tabler/icons-react";
import { regionDisplayName } from "../../lib/geo/region";

export default function MapHint({ step = "layer", regionName = "", onAction }) {
  const content = regionName
    ? {
        title: `Lihat ${regionDisplayName(regionName)} di peta`,
        text: "Pilih wilayah atau lokasi di peta untuk melihat detailnya.",
        action: "Lihat detail",
        icon: IconMapPin
      }
    : step === "feature"
      ? {
          title: "Pilih wilayah di peta",
          text: "Pilih wilayah atau lokasi untuk melihat detailnya.",
          action: "Jelajahi",
          icon: IconInfoCircle
        }
      : {
          title: "Mulai menjelajah",
          text: "Pilih data untuk ditampilkan di peta.",
          action: "Pilih data",
          icon: IconInfoCircle
        };

  const Icon = content.icon;

  return (
    <div
      className="map-ui-chrome pointer-events-auto absolute bottom-20 left-1/2 z-[830] w-[min(380px,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-md backdrop-blur sm:bottom-5 ui-fade-in"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-2">
        <div className="grid size-8 shrink-0 place-items-center rounded-md bg-slate-100 text-sky-700" aria-hidden="true">
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="map-text-compact font-semibold text-slate-900">{content.title}</p>
          <p className="mt-0.5 map-text-compact leading-5 text-slate-500">{content.text}</p>
          <button
            type="button"
            onClick={onAction}
            className="ui-micro-interaction mt-1.5 inline-flex items-center gap-1 map-text-compact font-semibold text-sky-800 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {content.action}
            <IconArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
