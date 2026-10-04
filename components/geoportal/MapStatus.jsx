export default function MapStatus({ status, coords }) {
  return (
    <div className="map-ui-chrome map-status absolute left-auto right-3 top-14 z-[820] flex max-w-[220px] items-center gap-2 border border-slate-200 px-2.5 py-1.5 map-text-micro text-slate-500 shadow-sm sm:bottom-3 sm:left-auto sm:right-3 sm:top-auto sm:max-w-[calc(100vw-5rem)] " aria-live="polite">
      <span className="size-1.5 shrink-0 bg-sky-500" aria-hidden="true" />
      <span className="min-w-0 truncate">{status}</span>
      <span className="hidden shrink-0 text-slate-300 sm:inline">·</span>
      <span className="hidden shrink-0 tabular-nums sm:inline">{coords}</span>
    </div>
  );
}
