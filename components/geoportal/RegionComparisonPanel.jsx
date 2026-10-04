import { useMemo, useState } from "react";
import { IconArrowsExchange, IconChartBar, IconX } from "@tabler/icons-react";
import { REGIONS, REGION_SUMMARY } from "../../lib/geo/regionSummary";
import { regionDisplayName } from "../../lib/geo/region";
import useSheetPresence from "./useSheetPresence";
import useSheetSwipe from "./useSheetSwipe";

function regionEntryCount(file, region) {
  const normalized = String(region ?? "").trim().toLowerCase();
  return REGION_SUMMARY?.[file]?.regions?.find((item) => String(item.name ?? "").trim().toLowerCase() === normalized)?.count ?? 0;
}

function districtFeatureByName(data, name) {
  return data?.features?.find((feature) => {
    const p = feature?.properties ?? {};
    return String(p.Kecamatan ?? p.WADMKC ?? p.nama_kecamatan ?? p.NAMOBJ ?? "").trim().toLowerCase() === String(name ?? "").trim().toLowerCase();
  });
}

function areaKm2(data, name) {
  const feature = districtFeatureByName(data, name);
  const value = Number(feature?.properties?.luas_wilayah_km2 ?? feature?.properties?.LUASWH);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function Metric({ label, left, right }) {
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-2 border-t border-slate-100 py-2.5 first:border-t-0">
      <div>
        <p className="map-text-micro text-slate-500">{label}</p>
        <p className="mt-0.5 map-text-compact font-semibold tabular-nums text-slate-900">{left}</p>
      </div>
      <div>
        <p className="map-text-micro text-slate-500">{label}</p>
        <p className="mt-0.5 map-text-compact font-semibold tabular-nums text-slate-900">{right}</p>
      </div>
    </div>
  );
}

export default function RegionComparisonPanel({ open, initialRegion = "", districtData, onClose }) {
  const { rendered, visible } = useSheetPresence(open);
  const { swipeHandlers, swipeStyle } = useSheetSwipe(onClose, open);
  const defaultFirst = initialRegion && REGIONS.includes(initialRegion) ? initialRegion : REGIONS[0];
  const defaultSecond = REGIONS.find((item) => item !== defaultFirst) || REGIONS[1];
  const [first, setFirst] = useState(defaultFirst);
  const [second, setSecond] = useState(defaultSecond);

  const metrics = useMemo(() => {
    const files = Object.keys(REGION_SUMMARY || {}).filter((file) => file !== "batas-kecamatan.geojson" && file !== "batas-desa-kelurahan.geojson");
    const leftDataCount = files.reduce((total, file) => total + regionEntryCount(file, first), 0);
    const rightDataCount = files.reduce((total, file) => total + regionEntryCount(file, second), 0);
    const villages = REGION_SUMMARY["batas-desa-kelurahan.geojson"]?.regions || [];
    const leftVillages = villages.find((item) => item.name === first)?.count ?? 0;
    const rightVillages = villages.find((item) => item.name === second)?.count ?? 0;
    return {
      areaLeft: areaKm2(districtData, first),
      areaRight: areaKm2(districtData, second),
      villagesLeft: leftVillages,
      villagesRight: rightVillages,
      dataLeft: leftDataCount,
      dataRight: rightDataCount
    };
  }, [districtData, first, second]);

  if (!rendered) return null;

  const swap = () => {
    setFirst(second);
    setSecond(first);
  };

  return (
    <aside className={`map-ui-chrome sheet-panel sheet-panel-right absolute inset-x-0 bottom-0 z-[1700] flex max-h-[78dvh] w-full flex-col rounded-t-2xl border-t border-slate-200 bg-white shadow-[0_-14px_36px_rgba(15,23,42,0.12)] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-[420px] sm:max-w-[92vw] sm:rounded-none sm:rounded-l-xl sm:border-l sm:border-t-0 sm:shadow-[-12px_0_32px_rgba(15,23,42,0.08)] ${visible ? "sheet-panel-visible" : "sheet-panel-hidden"}`} aria-label="Bandingkan wilayah" style={swipeStyle}>
      <div className="mx-auto mb-1 mt-2 h-1 w-10 rounded-full bg-slate-200 sm:hidden touch-none" aria-hidden="true" {...swipeHandlers} />
      <div className="flex items-start gap-2 border-b border-slate-200 px-3 py-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-md bg-slate-50 text-slate-600">
          <IconChartBar size={17} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="map-text-micro font-semibold uppercase tracking-[0.14em] text-slate-400">Perbandingan</p>
          <h2 className="mt-1 map-text-compact font-semibold text-slate-900">Bandingkan kecamatan</h2>
          <p className="mt-0.5 map-text-micro text-slate-500">Lihat perbedaan luas, desa/kelurahan, dan jumlah data.</p>
        </div>
        <button type="button" onClick={onClose} className="ui-micro-interaction grid size-8 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-100" aria-label="Tutup perbandingan" title="Tutup">
          <IconX size={17} aria-hidden="true" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <label className="min-w-0">
            <span className="map-text-micro font-semibold text-slate-500">Wilayah pertama</span>
            <select value={first} onChange={(event) => setFirst(event.target.value)} className="mt-1 h-9 w-full min-w-0 truncate rounded-md border border-slate-200 bg-white px-2 map-text-compact font-medium text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100">
              {REGIONS.map((region) => <option key={region} value={region}>{regionDisplayName(region)}</option>)}
            </select>
          </label>
          <button type="button" onClick={swap} className="ui-micro-interaction mb-0.5 grid size-8 place-items-center rounded-md border border-slate-200 bg-slate-50 text-slate-500 hover:bg-white" aria-label="Tukar wilayah" title="Tukar wilayah">
            <IconArrowsExchange size={15} aria-hidden="true" />
          </button>
          <label className="min-w-0">
            <span className="map-text-micro font-semibold text-slate-500">Wilayah kedua</span>
            <select value={second} onChange={(event) => setSecond(event.target.value)} className="mt-1 h-9 w-full min-w-0 truncate rounded-md border border-slate-200 bg-white px-2 map-text-compact font-medium text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100">
              {REGIONS.map((region) => <option key={region} value={region}>{regionDisplayName(region)}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
            <div className="px-3 py-2 map-text-compact font-semibold text-slate-900">{regionDisplayName(first)}</div>
            <div className="border-l border-slate-200 px-3 py-2 map-text-compact font-semibold text-slate-900">{regionDisplayName(second)}</div>
          </div>
          <div className="px-3 py-2">
            <Metric label="Luas wilayah" left={metrics.areaLeft != null ? `${metrics.areaLeft.toLocaleString("id-ID", { maximumFractionDigits: 2 })} km²` : "—"} right={metrics.areaRight != null ? `${metrics.areaRight.toLocaleString("id-ID", { maximumFractionDigits: 2 })} km²` : "—"} />
            <Metric label="Desa / Kelurahan" left={metrics.villagesLeft.toLocaleString("id-ID")} right={metrics.villagesRight.toLocaleString("id-ID")} />
            <Metric label="Data sektoral" left={metrics.dataLeft.toLocaleString("id-ID")} right={metrics.dataRight.toLocaleString("id-ID")} />
          </div>
        </div>
      </div>
    </aside>
  );
}
