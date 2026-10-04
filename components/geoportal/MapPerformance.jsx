export default function MapPerformance({ stats }) {
  if (process.env.NODE_ENV === "production" || !stats) return null;

  return (
    <aside className="map-ui-chrome map-performance pointer-events-none absolute bottom-3 left-1/2 z-[910] hidden -translate-x-1/2 rounded-md border border-slate-200 bg-white/92 px-2.5 py-1.5 shadow-sm backdrop-blur lg:block" aria-label="Informasi performa peta">
      <div className="flex items-center gap-2 map-text-micro text-slate-500">
        <span>{stats.activeVectorLayers} vector</span>
        <span className="text-slate-300">·</span>
        <span>{stats.featureCount.toLocaleString("id-ID")} fitur</span>
        <span className="text-slate-300">·</span>
        <span>{stats.renderMs.toFixed(1)} ms</span>
      </div>
    </aside>
  );
}
