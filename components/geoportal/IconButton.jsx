export default function IconButton({
  label,
  tone = "slate",
  children,
  onClick,
  disabled = false,
  active = false,
  className = "",
}) {
  const tones = {
    slate: active
      ? "bg-slate-200 text-slate-900 ring-slate-300"
      : "bg-white/95 text-slate-700 ring-slate-200 hover:bg-slate-50",
    blue: active
      ? "bg-blue-100 text-blue-800 ring-blue-300"
      : "bg-blue-50 text-blue-700 ring-blue-200 hover:bg-blue-100",
    amber: active
      ? "bg-amber-100 text-amber-800 ring-amber-300"
      : "bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100",
    emerald: active
      ? "bg-emerald-100 text-emerald-800 ring-emerald-300"
      : "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100",
    violet: active
      ? "bg-violet-100 text-violet-800 ring-violet-300"
      : "bg-violet-50 text-violet-700 ring-violet-200 hover:bg-violet-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active || undefined}
      title={label}
      className={`group relative grid size-10 place-items-center rounded-md shadow-sm ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]} ${className}`}
    >
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-full top-1/2 z-[1400] ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg group-hover:block group-focus-visible:block"
      >
        {label}
      </span>
    </button>
  );
}
