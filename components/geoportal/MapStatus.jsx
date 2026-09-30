export default function MapStatus({ status, coords }) {
  return (
    <div className="map-ui-chrome map-status absolute bottom-3 right-3 z-[700] hidden items-center gap-2 border border-slate-200 px-2.5 py-1.5 text-[10px] text-slate-500 shadow-sm sm:flex" aria-live="polite">
      <span className="size-1.5 bg-emerald-500" aria-hidden="true" /><span>{status}</span><span className="text-slate-300">·</span><span className="tabular-nums">{coords}</span>
    </div>
  );
}
