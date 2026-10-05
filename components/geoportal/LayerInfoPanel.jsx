import { useEffect, useState } from "react";
import { IconAlertTriangle, IconChartBar, IconDatabase, IconInfoCircle, IconLink, IconShieldCheck, IconX } from "@tabler/icons-react";
import LayerGlyph from "./LayerGlyph";
import { getLayerInsight, getLayerStatistics } from "../../lib/geo/statistics";
import { featureAdministrativeCodes } from "../../lib/geo/region";
import SourceBadge from "./SourceBadge";
import useSheetPresence from "./useSheetPresence";
import useSheetSwipe from "./useSheetSwipe";

let dataQualityPromise;

function loadDataQuality() {
  if (!dataQualityPromise) {
    dataQualityPromise = fetch("/data-quality.json", { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .catch(() => null);
  }
  return dataQualityPromise;
}
const SOURCE_HELP = {
  "Ina-Geoportal BIG": "Data wilayah administrasi berasal dari Badan Informasi Geospasial (BIG).",
  "Kemendikdasmen": "Data pendidikan berasal dari Kementerian Pendidikan Dasar dan Menengah.",
  "Sumber terbuka / ArcGIS": "Data wilayah dan fasilitas dihimpun dari sumber terbuka yang dicantumkan pada keterangan data."
};

function StatNumber({ value, label }) {
  const formatted = typeof value === "number" ? value.toLocaleString("id-ID") : value;
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5">
      <p className="map-text-compact font-semibold tabular-nums text-slate-900">{formatted}</p>
      <p className="mt-0.5 map-text-micro font-medium uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}

function Distribution({ title, items }) {
  if (!items?.length) return null;
  const max = Math.max(...items.map((item) => item.count), 1);
  return (
    <section className="mt-3 px-3">
      <div className="flex items-center gap-2">
        <IconChartBar size={15} className="text-slate-400" aria-hidden="true" />
        <h3 className="map-text-compact font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="mt-2.5 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="py-0.5">
            <div className="mb-1 flex items-center justify-between gap-3 map-text-micro">
              <span className="min-w-0 truncate text-slate-600">{item.label}</span>
              <span className="shrink-0 font-semibold tabular-nums text-slate-800">{item.count.toLocaleString("id-ID")}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-400" style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LayerInfoPanel({ layer, data, summary, regionSummary = null, regionFilter = "", active = false, loading = false, error = "", open, onClose, onShowOnMap, onZoomToLayer, onShare }) {
  const { rendered, visible } = useSheetPresence(Boolean(open && layer));
  const { swipeHandlers, swipeStyle } = useSheetSwipe(onClose, Boolean(open && layer));
  const [quality, setQuality] = useState(null);

  useEffect(() => {
    if (!open || !layer?.file) return undefined;
    let disposed = false;
    loadDataQuality().then((payload) => {
      if (disposed || !payload?.datasets) return;
      setQuality(payload.datasets.find((item) => item.dataset === layer.file) || null);
    });
    return () => {
      disposed = true;
    };
  }, [open, layer?.file]);

  if (!rendered || !layer) return null;

  const currentLayer = layer;
  const selectedRegionSummary = regionFilter
    ? regionSummary?.regions?.find((item) => item.name.toLowerCase() === regionFilter.toLowerCase())
    : null;
  const scopedData = regionFilter && selectedRegionSummary?.code && Array.isArray(data?.features)
    ? {
        ...data,
        features: data.features.filter((feature) =>
          featureAdministrativeCodes(feature, "kecamatan").includes(selectedRegionSummary.code)
        )
      }
    : data;
  const stats = getLayerStatistics(currentLayer, scopedData, summary);
  const sourceType = currentLayer.sourceType || "Sumber terbuka / ArcGIS";
  const coverageCount = stats.kecamatanDistribution?.length || 0;
  const summaryContextCount = selectedRegionSummary?.count ?? null;
  const contextCount = regionFilter
    ? (stats.loaded ? stats.mappedCount : summaryContextCount)
    : null;
  const sourceNote = currentLayer.sourceNote || SOURCE_HELP[sourceType] || "Catatan sumber mengikuti informasi pada data.";

  return (
    <aside
      className={`map-ui-chrome sheet-panel sheet-panel-right absolute inset-x-0 bottom-0 top-auto z-[1500] flex h-[min(72dvh,560px)] w-full max-w-none flex-col border-t border-slate-200 bg-white shadow-[0_-8px_24px_rgba(15,23,42,0.06)] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-[360px] sm:max-w-[92vw] sm:border-l sm:border-t-0 sm:shadow-[-8px_0_24px_rgba(15,23,42,0.06)] ${visible ? "sheet-panel-visible" : "sheet-panel-hidden"}`}
      aria-label={`Informasi ${currentLayer.title}`}
      style={swipeStyle}
    >
      <div className="mx-auto mb-1 mt-2 h-1 w-10 rounded-full bg-slate-200 sm:hidden touch-none" aria-hidden="true" {...swipeHandlers} />
      <div className="flex items-start gap-3 border-b border-slate-200 px-3 py-2 sm:pt-2.5">
        <div className="grid size-9 shrink-0 place-items-center border border-slate-200 bg-slate-50" aria-hidden="true">
          <LayerGlyph layer={currentLayer} active />
        </div>
        <div className="min-w-0 flex-1">
          <p className="map-text-micro font-semibold uppercase tracking-[0.14em] text-slate-400">Tentang data</p>
          <h2 className="mt-1 map-text-compact font-semibold text-slate-900">{currentLayer.title}</h2>
          <p className="mt-0.5 map-text-compact leading-5 text-slate-500">{currentLayer.description || "Catatan data belum tersedia."}</p>
          <div className="mt-2"><SourceBadge sourceType={currentLayer.sourceType} /></div>
        </div>
        <button type="button" onClick={onClose} className="ui-micro-interaction grid size-8 shrink-0 place-items-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" aria-label="Tutup informasi data">
          <IconX size={17} aria-hidden="true" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="mt-2.5 rounded-lg bg-slate-50 px-3 py-2 map-text-body leading-5 text-slate-600">{getLayerInsight(currentLayer, data, stats)}</p>

        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <StatNumber value={contextCount != null ? contextCount : currentLayer.geometry?.includes("Point") ? stats.mappedCount : stats.total} label={contextCount != null ? "Data di wilayah ini" : currentLayer.geometry?.includes("Point") && stats.unmappedCount > 0 ? "Lokasi yang tampil" : "Jumlah data"} />
          <StatNumber value={stats.unmappedCount > 0 ? stats.total : (coverageCount || stats.geometryCounts.length)} label={stats.unmappedCount > 0 ? "Jumlah data" : (coverageCount ? "Kecamatan tercakup" : "Jumlah data")} />
        </div>
        {regionFilter && contextCount == null && (
          <p className="mt-2 map-text-micro leading-4 text-slate-500">Jumlah data di wilayah ini belum tersedia.</p>
        )}

        {quality && (
          <section className="mt-4 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3">
              <span className={`grid size-8 shrink-0 place-items-center rounded-md ${quality.status === "Lulus pemeriksaan" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`} aria-hidden="true">
                {quality.status === "Lulus pemeriksaan" ? <IconShieldCheck size={16} /> : <IconAlertTriangle size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="map-text-compact font-semibold text-slate-900">Kualitas & asal data</h3>
                <p className="mt-0.5 map-text-micro leading-4 text-slate-500">{quality.status} · skor pemeriksaan {quality.score}/100</p>
              </div>
            </div>
            <dl className="divide-y divide-slate-100">
              <div className="grid grid-cols-[40%_60%] gap-3 px-4 py-2.5">
                <dt className="map-text-micro text-slate-500">Pemeriksaan</dt>
                <dd className="map-text-micro leading-4 text-slate-700">{quality.validationDate || "Belum dicantumkan"} · geometri, kelengkapan, dan posisi representatif</dd>
              </div>
              <div className="grid grid-cols-[40%_60%] gap-3 px-4 py-2.5">
                <dt className="map-text-micro text-slate-500">Kandidat tinjauan</dt>
                <dd className="map-text-compact font-medium text-slate-800">{quality.outsideCandidates.toLocaleString("id-ID")} feature</dd>
              </div>
            </dl>
            {quality.note && (
              <p className="border-t border-slate-100 px-4 py-3 map-text-micro leading-4 text-slate-500">{quality.note}</p>
            )}
          </section>
        )}

        <section className="mt-4 rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <IconInfoCircle size={15} className="text-slate-400" aria-hidden="true" />
            <h3 className="map-text-compact font-semibold text-slate-900">Sumber data</h3>
          </div>
          <dl className="divide-y divide-slate-100">
            <div className="grid grid-cols-[40%_60%] gap-3 px-4 py-3">
              <dt className="map-text-micro text-slate-500">Sumber data</dt>
              <dd className="break-words map-text-compact font-medium leading-5 text-slate-800">{currentLayer.source || "Belum dicantumkan"}</dd>
            </div>
            <div className="grid grid-cols-[40%_60%] gap-3 px-4 py-3">
              <dt className="map-text-micro text-slate-500">Penyedia data</dt>
              <dd className="break-words map-text-compact font-medium leading-5 text-slate-800">{currentLayer.publisher || (sourceType === "Ina-Geoportal BIG" ? "Badan Informasi Geospasial (BIG)" : sourceType === "Kemendikdasmen" ? "Kementerian Pendidikan Dasar dan Menengah" : "Mengikuti keterangan sumber")}</dd>
            </div>
            <div className="grid grid-cols-[40%_60%] gap-3 px-4 py-3">
              <dt className="map-text-micro text-slate-500">Tahun</dt>
              <dd className="map-text-compact font-medium leading-5 text-slate-800">{currentLayer.dataYear || "Belum dicantumkan"}</dd>
            </div>
            {currentLayer.latestDataYear && currentLayer.latestDataYear !== currentLayer.dataYear && (
              <div className="grid grid-cols-[40%_60%] gap-3 px-4 py-3">
                <dt className="map-text-micro text-slate-500">Terakhir diperbarui</dt>
                <dd className="map-text-compact font-medium leading-5 text-slate-800">BIG · Edisi Juni {currentLayer.latestDataYear}</dd>
              </div>
            )}
            {currentLayer.localDataStatus && (
              <div className="grid grid-cols-[40%_60%] gap-3 px-4 py-3">
                <dt className="map-text-micro text-slate-500">Catatan</dt>
                <dd className="map-text-compact font-medium leading-5 text-amber-700">{currentLayer.localDataStatus}</dd>
              </div>
            )}
            <div className="grid grid-cols-[40%_60%] gap-3 px-4 py-3">
              <dt className="map-text-micro text-slate-500">Wilayah</dt>
              <dd className="map-text-compact font-medium leading-5 text-slate-800">Kabupaten Wajo, Sulawesi Selatan</dd>
            </div>
          </dl>
        </section>

        <p className="mt-3 map-text-micro leading-4 text-slate-500">{sourceNote}</p>
        {(currentLayer.latestReferenceUrl || currentLayer.latestMetadataUrl) && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 map-text-micro">
            {currentLayer.latestReferenceUrl && (
              <a href={currentLayer.latestReferenceUrl} target="_blank" rel="noreferrer" className="font-semibold text-sky-700 hover:underline">Rujukan data ↗</a>
            )}
            {currentLayer.latestMetadataUrl && (
              <a href={currentLayer.latestMetadataUrl} target="_blank" rel="noreferrer" className="font-semibold text-sky-700 hover:underline">Metadata ↗</a>
            )}
          </div>
        )}

        {!stats.loaded && stats.unmappedCount > 0 && (
          <div className="mt-3.5 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-3 map-text-compact leading-5 text-slate-500">
            Catatan: {stats.unmappedCount.toLocaleString("id-ID")} data belum bisa tampil karena lokasinya belum tersedia atau belum jelas.
          </div>
        )}

        {(currentLayer.id === "satuan-pendidikan"
          ? stats.educationGroupDistribution.length + stats.educationTypeDistribution.length + stats.educationStatusDistribution.length + stats.educationAccreditationDistribution.length + stats.kecamatanDistribution.length
          : stats.distribution.length + stats.kecamatanDistribution.length) > 0 && (
          <details className="mt-4 rounded-lg border border-slate-200 bg-white group">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 map-text-compact font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
              <span>Detail data</span>
              <span className="map-text-micro font-medium text-slate-400 group-open:hidden">Buka</span>
              <span className="hidden map-text-micro font-medium text-slate-400 group-open:inline">Tutup</span>
            </summary>
            {currentLayer.id === "satuan-pendidikan" ? (
              <>
                <Distribution title="Kelompok jenjang pendidikan" items={stats.educationGroupDistribution} />
                <Distribution title="Jenis satuan pendidikan" items={stats.educationTypeDistribution} />
                <Distribution title="Status satuan pendidikan" items={stats.educationStatusDistribution} />
                <Distribution title="Akreditasi" items={stats.educationAccreditationDistribution} />
                <Distribution title="Sebaran menurut kecamatan" items={stats.kecamatanDistribution} />
              </>
            ) : (
              <>
                <Distribution title="Sebaran kategori utama" items={stats.distribution} />
                <Distribution title="Sebaran menurut kecamatan" items={stats.kecamatanDistribution} />
              </>
            )}
        </details>
        )}

      </div>

      {error && !loading && (
        <div className="border-t border-amber-100 bg-amber-50 px-4 py-2 map-text-micro text-amber-800" role="status">Data belum bisa ditampilkan. Periksa koneksi internet lalu coba lagi.</div>
      )}

      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <div className="flex gap-2">
          <button type="button" onClick={onShowOnMap} disabled={loading} className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 map-text-compact font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
            <IconDatabase size={15} aria-hidden="true" />
            {loading ? "Menyiapkan…" : error ? "Coba lagi" : active ? "Sembunyikan dari peta" : stats.loaded ? "Tampilkan di peta" : "Tampilkan di peta"}
          </button>
          {stats.loaded && (
            <button type="button" onClick={() => onZoomToLayer?.(currentLayer)} className="inline-flex shrink-0 items-center justify-center rounded-md border border-slate-300 px-3 py-2 map-text-compact font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" title="Tampilkan semua data di peta">
              Lihat di peta
            </button>
          )}
          <button type="button" onClick={onShare} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 map-text-compact font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700" title="Bagikan data dan peta">
            <IconLink size={14} aria-hidden="true" />
            Bagikan
          </button>
        </div>
      </div>
    </aside>
  );
}
