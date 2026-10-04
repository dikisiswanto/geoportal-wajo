import { IconEye, IconEyeOff, IconInfoCircle } from "@tabler/icons-react";
import LayerGlyph from "./LayerGlyph";
import SourceBadge from "./SourceBadge";
import { regionDisplayName } from "../../lib/geo/region";

export default function LayerRow({ layer, active, busy, error, onToggle, onInfo, featureCount, regionFilter, regionScoped = false, totalCount = null, unmappedCount = 0 }) {
  const objectLabel = layer.id?.startsWith("adm-") ? "wilayah" : layer.geometry?.includes("Point") ? "lokasi" : layer.geometry?.includes("LineString") ? "jalur" : "area";
  const hasUnmapped = !regionFilter && Number(unmappedCount) > 0 && Number(totalCount) > Number(featureCount);
  const countLabel = featureCount > 0
    ? (hasUnmapped
      ? `${Number(totalCount).toLocaleString("id-ID")} data · ${Number(featureCount).toLocaleString("id-ID")} ${objectLabel}`
      : `${featureCount.toLocaleString("id-ID")} ${regionFilter && regionScoped ? objectLabel + " di " + regionDisplayName(regionFilter) : objectLabel}`)
    : regionFilter && regionScoped ? `Belum ada data di ${regionDisplayName(regionFilter)}` : "";

  return (
    <div className={`relative flex items-start gap-2 px-2.5 py-2.5 transition ${active ? "bg-sky-50/60" : "bg-white hover:bg-slate-50/80"}`}>
      {active && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sky-700" aria-hidden="true" />}
      <button type="button" onClick={() => onToggle(layer)} className="group ui-micro-interaction relative grid size-8 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-white hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" aria-label={active ? `Sembunyikan ${layer.title}` : `Tampilkan ${layer.title}`} aria-pressed={active} title={active ? `Sembunyikan ${layer.title}` : `Tampilkan ${layer.title}`}>
        {active ? <IconEye size={16} stroke={1.8} /> : <IconEyeOff size={16} stroke={1.7} />}
      </button>

      <button type="button" onClick={() => onToggle(layer)} className="ui-micro-interaction min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" title={active ? "Sembunyikan dari peta" : "Tampilkan di peta"}>
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex size-4 shrink-0 items-center justify-center"><LayerGlyph layer={layer} active={active} /></span>
          <span className="min-w-0 flex-1 truncate map-text-compact font-medium text-slate-800">{layer.title}</span>
        </span>
        <div className="mt-1 flex min-w-0 items-center gap-1 pl-6">
          <SourceBadge sourceType={layer.sourceType} />
          {countLabel && <span className="truncate map-text-micro tabular-nums text-slate-400">{countLabel}</span>}
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
        {busy && <span className="size-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" aria-label="Memuat data" />}
        {error && <span className="grid size-6 place-items-center map-text-compact font-semibold text-red-600" title="Data belum bisa ditampilkan" aria-label="Data belum bisa ditampilkan">!</span>}
        <button type="button" onClick={() => onInfo(layer)} className="ui-micro-interaction grid size-8 place-items-center rounded-md text-slate-400 hover:bg-white hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" aria-label={`Lihat detail ${layer.title}`} title="Lihat detail">
          <IconInfoCircle size={15} stroke={1.7} />
        </button>
      </div>
    </div>
  );
}
