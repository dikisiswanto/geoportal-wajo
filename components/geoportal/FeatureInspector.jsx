import {
  IconArrowBackUp,
  IconChartBar,
  IconChevronDown,
  IconChevronRight,
  IconInfoCircle,
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
import { getAdministrativeStats, getAdministrativeType } from "../../lib/geo/administrationStats";
import LayerGlyph from "./LayerGlyph";
import SourceBadge from "./SourceBadge";
import useSheetPresence from "./useSheetPresence";
import useSheetSwipe from "./useSheetSwipe";
import { useEffect, useState } from "react";

function administrativeTitle(layer, properties) {
  const type = getAdministrativeType(layer?.id);
  const name =
    type === "kabupaten"
      ? properties?.nama_kabupaten ?? properties?.WADMKK ?? properties?.NAMOBJ ?? "Wajo"
      : type === "kecamatan"
        ? properties?.Kecamatan ?? properties?.WADMKC ?? properties?.nama_kecamatan ?? properties?.NAMOBJ
        : properties?.Desa ?? properties?.WADMKD ?? properties?.nama_desa ?? properties?.NAMOBJ;

  if (type === "kabupaten") return `${name}`;
  if (type === "kecamatan") return `${name}`;
  return `${name}`;
}

function administrativeSubtitle(type) {
  if (type === "kabupaten") return "Kabupaten Wajo";
  if (type === "kecamatan") return "Bagian wilayah Kabupaten Wajo";
  return "Bagian wilayah kecamatan";
}

function StatRow({ item, onClick }) {
  const content = (
    <>
      <span className="min-w-0 truncate text-left text-sm font-medium leading-5 text-slate-700">{item.label}</span>
      <span className="flex shrink-0 items-center gap-1.5">
        <span className="text-sm font-semibold tabular-nums text-slate-900">{item.count.toLocaleString("id-ID")}</span>
        {onClick && <IconChevronRight size={15} className="text-slate-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-slate-500" aria-hidden="true" />}
      </span>
    </>
  );

  if (!onClick) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-3">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-left transition-[border-color,background-color,box-shadow,transform] duration-150 hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      title={`Tampilkan ${item.label} di wilayah ini`}
    >
      {content}
    </button>
  );
}

function MetricCard({ item }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3.5">
      <p className="text-lg font-semibold tabular-nums text-slate-900">{Number(item.value).toLocaleString("id-ID")}</p>
      <p className="mt-0.5 map-text-micro font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
    </div>
  );
}

export default function FeatureInspector({
  selected,
  open,
  onClose,
  onZoom,
  onShare,
  regionName,
  relatedItems = [],
  onExploreRelated,
  onExploreAdminLayer
}) {
  const [renderSelected, setRenderSelected] = useState(selected);
  const [adminTab, setAdminTab] = useState("info");
  const { rendered, visible } = useSheetPresence(Boolean(open && selected));
  const { swipeHandlers, swipeStyle } = useSheetSwipe(onClose, Boolean(open && selected));

  useEffect(() => {
    if (selected) setRenderSelected(selected);
  }, [selected]);

  useEffect(() => {
    setAdminTab("info");
  }, [selected?.featureKey, selected?.layer?.id]);

  if (!rendered || !renderSelected) return null;

  const currentSelected = renderSelected;
  const properties = currentSelected.feature.properties ?? {};
  const adminType = getAdministrativeType(currentSelected.layer?.id);
  const isAdministrative = Boolean(adminType);
  const groups = inspectorGroups(currentSelected.layer, properties);
  const adminStats = isAdministrative ? getAdministrativeStats(currentSelected.layer, currentSelected.feature) : null;
  const hasAdminStats = Boolean(adminStats?.layers?.length);
  const title = isAdministrative
    ? administrativeTitle(currentSelected.layer, properties)
    : featureLabel(currentSelected.layer, currentSelected.feature);

  const infoContent = (
    <>
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
                  <dd className="break-words map-text-compact font-medium leading-5 text-slate-800">{formatValue(properties[key], key)}</dd>
                </div>
              ))}
            </dl>
          </details>
        ))}
      </div>

      {isAdministrative && (
        <section className="border-t border-slate-200 px-3 py-3">
          <div className="flex items-center gap-2">
            <IconInfoCircle size={15} className="text-slate-400" aria-hidden="true" />
            <h3 className="map-text-compact font-semibold text-slate-900">Tentang wilayah</h3>
          </div>
          <p className="mt-2 map-text-body leading-5 text-slate-600">
            {administrativeSubtitle(adminType)}. Garis batas ditampilkan dari data BIG tanpa menutup data lain pada peta.
          </p>
        </section>
      )}
    </>
  );

  const statisticsContent = hasAdminStats ? (
    <div className="px-3 py-3">
      {adminStats.metrics?.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {adminStats.metrics.map((item) => <MetricCard key={item.label} item={item} />)}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <IconChartBar size={16} className="text-slate-400" aria-hidden="true" />
        <div>
          <h3 className="map-text-compact font-semibold text-slate-900">Data yang tersedia di wilayah ini</h3>
          <p className="mt-0.5 map-text-micro text-slate-500">Hanya data yang benar-benar tersedia di wilayah ini yang ditampilkan.</p>
        </div>
      </div>

      <div className="mt-2.5 space-y-2">
        {adminStats.layers.map((item) => (
          <StatRow
            key={item.layerId}
            item={item}
            onClick={() => onExploreAdminLayer?.(item.layerId, currentSelected)}
          />
        ))}
      </div>

      {adminStats.notes?.length > 0 && (
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5">
          {adminStats.notes.map((note) => (
            <p key={note} className="map-text-micro leading-4 text-slate-500">{note}</p>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className="px-3 py-8 text-center">
      <IconChartBar className="mx-auto text-slate-300" size={28} stroke={1.5} />
      <p className="mt-3 map-text-compact font-medium text-slate-800">Statistik belum tersedia</p>
      <p className="mt-1 map-text-body leading-5 text-slate-500">
        Belum ada dataset yang dapat dihubungkan secara langsung dengan wilayah ini.
      </p>
    </div>
  );

  return (
    <aside className={`feature-inspector map-ui-chrome sheet-panel sheet-panel-right absolute inset-x-0 bottom-0 z-[1500] flex h-[min(74dvh,600px)] w-full max-w-none flex-col rounded-t-2xl border-t border-slate-200 bg-white shadow-[0_-10px_28px_rgba(15,23,42,0.08)] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-[390px] sm:max-w-[92vw] sm:rounded-none sm:border-l sm:border-t-0 sm:shadow-[-8px_0_24px_rgba(15,23,42,0.05)] ${visible ? "sheet-panel-visible" : "sheet-panel-hidden"}`} aria-label={isAdministrative ? "Informasi wilayah" : "Informasi lokasi"} style={swipeStyle}>
      <div className="mx-auto mb-1 mt-2 h-1 w-10 rounded-full bg-slate-200 sm:hidden touch-none" aria-hidden="true" {...swipeHandlers} />

      <div className="flex items-start gap-3 border-b border-slate-200 px-3 py-2.5 sm:pt-2.5">
        <div className="grid size-9 shrink-0 place-items-center border border-slate-200 bg-slate-50" aria-hidden="true">
          <LayerGlyph layer={currentSelected.layer} active />
        </div>
        <div className="min-w-0 flex-1">
          <p className="map-text-micro font-semibold uppercase tracking-[0.14em] text-slate-400">
            {isAdministrative ? "Wilayah" : "Informasi lokasi"}
          </p>
          <h2 className="mt-1 line-clamp-2 map-text-compact font-semibold text-slate-900">{title}</h2>
          <p className="mt-0.5 map-text-compact text-slate-500">{isAdministrative ? administrativeSubtitle(adminType) : currentSelected.layer.title}</p>
          <div className="mt-2"><SourceBadge sourceType={currentSelected.layer.sourceType} /></div>
        </div>
        <button type="button" onClick={onClose} className="grid size-8 shrink-0 place-items-center text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" aria-label="Tutup informasi" title="Tutup">
          <IconX size={17} aria-hidden="true" />
        </button>
      </div>

      <div className="border-b border-slate-200 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onZoom} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 map-text-compact font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" title="Tunjukkan lokasi ini di peta">
            <IconTarget size={14} aria-hidden="true" /> Zoom
          </button>
          <button type="button" onClick={onShare} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1.5 map-text-compact font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" title="Bagikan lokasi ini">
            <IconLink size={14} aria-hidden="true" /> Bagikan
          </button>
          <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 map-text-compact font-medium text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" title="Tutup">
            <IconArrowBackUp size={14} aria-hidden="true" /> Tutup
          </button>
        </div>
      </div>

      {isAdministrative ? (
        <>
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50/70 p-1" role="tablist" aria-label="Pilihan informasi wilayah">
            <button type="button" role="tab" aria-selected={adminTab === "info"} onClick={() => setAdminTab("info")} className={`rounded-md px-3 py-2 map-text-compact font-semibold transition ${adminTab === "info" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
              Informasi
            </button>
            {hasAdminStats && (
              <button type="button" role="tab" aria-selected={adminTab === "stats"} onClick={() => setAdminTab("stats")} className={`rounded-md px-3 py-2 map-text-compact font-semibold transition ${adminTab === "stats" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
                Statistik
              </button>
            )}
          </div>
          <div className="inspect-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]">
            {adminTab === "stats" ? statisticsContent : infoContent}
          </div>
        </>
      ) : (
        <div className="inspect-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]">
          {regionName && relatedItems.length > 0 && (
            <section className="border-b border-slate-200 bg-slate-50/60 px-3 py-3" aria-labelledby="jelajah-wilayah">
              <div>
                <p className="map-text-micro font-semibold uppercase tracking-[0.14em] text-slate-400">Konteks wilayah</p>
                <h3 id="jelajah-wilayah" className="mt-1 map-text-compact font-semibold text-slate-900">Jelajahi {regionDisplayName(regionName)}</h3>
                <p className="mt-1 map-text-body leading-5 text-slate-500">Lihat data lain yang tersedia di wilayah yang sama.</p>
              </div>
              <div className="mt-3 grid gap-1.5">
                {relatedItems.map(({ layer, count }) => (
                  <button key={layer.id} type="button" onClick={() => onExploreRelated?.(layer, regionName)} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-left hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                    <span className="min-w-0 truncate map-text-compact font-medium text-slate-700">{layer.title}</span>
                    <span className="shrink-0 map-text-micro font-semibold tabular-nums text-slate-400">{count.toLocaleString("id-ID")}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
          {infoContent}
        </div>
      )}
    </aside>
  );
}
