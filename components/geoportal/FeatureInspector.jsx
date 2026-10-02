import {
  IconArrowBackUp,
  IconChevronDown,
  IconLink,
  IconTarget,
  IconX
} from "@tabler/icons-react";

import {
  featureLabel,
  formatValue,
  inspectorGroups
} from "../../lib/geo/format";

import { regionDisplayName } from "../../lib/geo/region";
import LayerGlyph from "./LayerGlyph";
import SourceBadge from "./SourceBadge";
import useSheetPresence from "./useSheetPresence";
import useSheetSwipe from "./useSheetSwipe";
import { useEffect, useState } from "react";

export default function FeatureInspector({
  selected,
  open,
  onClose,
  onZoom,
  onShare,
  regionName,
  relatedItems = [],
  onExploreRelated
}) {
  const [renderSelected, setRenderSelected] = useState(selected);
  const { rendered, visible } = useSheetPresence(Boolean(open && selected));
  const { swipeHandlers, swipeStyle } = useSheetSwipe(onClose, Boolean(open && selected));

  useEffect(() => {
    if (selected) setRenderSelected(selected);
  }, [selected]);

  if (!rendered || !renderSelected) return null;

  const currentSelected = renderSelected;
  const properties = currentSelected.feature.properties ?? {};
  const groups = inspectorGroups(currentSelected.layer, properties);

  return (
    <aside className={`feature-inspector map-ui-chrome sheet-panel sheet-panel-right absolute inset-x-0 bottom-0 z-[1500] flex h-[min(74dvh,600px)] w-full max-w-none flex-col rounded-t-2xl border-t border-slate-200 bg-white shadow-[0_-10px_28px_rgba(15,23,42,0.08)] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-[390px] sm:max-w-[92vw] sm:rounded-none sm:border-l sm:border-t-0 sm:shadow-[-8px_0_24px_rgba(15,23,42,0.05)] ${visible ? "sheet-panel-visible" : "sheet-panel-hidden"}`} aria-label="Informasi feature" style={swipeStyle}>
      <div className="mx-auto mb-1 mt-2 h-1 w-10 rounded-full bg-slate-200 sm:hidden touch-none" aria-hidden="true" {...swipeHandlers} />
      <div className="flex items-start gap-3 border-b border-slate-200 px-3 py-2.5 sm:pt-2.5">
        <div className="grid size-9 shrink-0 place-items-center border border-slate-200 bg-slate-50" aria-hidden="true">
          <LayerGlyph layer={currentSelected.layer} active />
        </div>
        <div className="min-w-0 flex-1">
          <p className="map-text-micro font-semibold uppercase tracking-[0.14em] text-slate-400">Informasi objek</p>
          <h2 className="mt-1 line-clamp-2 map-text-compact font-semibold text-slate-900">{featureLabel(currentSelected.layer, currentSelected.feature)}</h2>
          <p className="mt-0.5 map-text-compact text-slate-500">{currentSelected.layer.title} · {currentSelected.layer.group}</p>
          <div className="mt-2"><SourceBadge sourceType={currentSelected.layer.sourceType} /></div>
        </div>
        <button type="button" onClick={onClose} className="grid size-8 shrink-0 place-items-center text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" aria-label="Tutup informasi feature" title="Tutup">
          <IconX size={17} aria-hidden="true" />
        </button>
      </div>

      <div className="border-b border-slate-200 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onZoom} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 map-text-compact font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" title="Zoom ke objek">
            <IconTarget size={14} aria-hidden="true" /> Zoom
          </button>
          <button type="button" onClick={onShare} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 map-text-compact font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" title="Bagikan posisi dan objek ini">
            <IconLink size={14} aria-hidden="true" /> Bagikan
          </button>
          <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 map-text-compact font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" title="Tutup inspector">
            <IconArrowBackUp size={14} aria-hidden="true" /> Tutup
          </button>
        </div>
      </div>

      <div className="inspect-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]">
        {regionName && relatedItems.length > 0 && (
          <section className="border-b border-slate-200 bg-slate-50/60 px-3 py-3" aria-labelledby="jelajah-wilayah">
            <div>
              <p className="map-text-micro font-semibold uppercase tracking-[0.14em] text-slate-400">Konteks wilayah</p>
              <h3 id="jelajah-wilayah" className="mt-1 map-text-compact font-semibold text-slate-900">Jelajahi {regionDisplayName(regionName)}</h3>
              <p className="mt-1 map-text-body leading-5 text-slate-500">Lihat data lain di wilayah yang sama tanpa perlu mencari ulang.</p>
            </div>
            <div className="mt-3 grid gap-1.5">
              {relatedItems.map(({ layer, count }) => (
                <button key={layer.id} type="button" onClick={() => onExploreRelated?.(layer, regionName)} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-left hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                  <span className="min-w-0 truncate map-text-compact font-medium text-slate-700">{layer.title}</span>
                  {count > 0 ? <span className="shrink-0 map-text-micro font-semibold tabular-nums text-slate-400">{count.toLocaleString("id-ID")}</span> : <span className="shrink-0 map-text-micro text-slate-400">Lihat</span>}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="divide-y divide-slate-200">
          {groups.map((group, index) => (
            <details key={group.id} open={index === 0} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 map-text-compact font-semibold text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                <span>{group.title}</span>
                <IconChevronDown size={15} className="text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <dl className="border-t border-slate-100">
                {group.fields.map(([key, label]) => (
                  <div key={key} className="grid grid-cols-[42%_58%] gap-3 border-b border-slate-50 px-3 py-2 last:border-b-0">
                    <dt className="break-words map-text-micro text-slate-500">{label}</dt>
                    <dd className="break-words map-text-compact font-medium leading-5 text-slate-800">{formatValue(properties[key])}</dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
        </div>
      </div>
    </aside>
  );
}
