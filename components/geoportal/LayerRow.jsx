import { IconEye, IconEyeOff } from "@tabler/icons-react";
import LayerGlyph from "./LayerGlyph";

export default function LayerRow({ layer, active, busy, error, onToggle }) {
  return (
    <div className={`flex items-start gap-2.5 px-2 py-2.5 ${active ? "bg-slate-50" : "bg-white"}`}>
      <button
        type="button"
        onClick={() => onToggle(layer)}
        className="group relative grid size-6 shrink-0 place-items-center text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        aria-label={active ? `Sembunyikan ${layer.title}` : `Tampilkan ${layer.title}`}
        aria-pressed={active}
      >
        {active ? <IconEye size={16} stroke={1.7} /> : <IconEyeOff size={16} stroke={1.7} />}
      
        <span role="tooltip" className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg group-hover:block group-focus-visible:block">
          {active ? `Sembunyikan ${layer.title}` : `Tampilkan ${layer.title}`}
        </span>
      </button>
      <button type="button" onClick={() => onToggle(layer)} className="min-w-0 flex-1 text-left">
        <span className="flex items-center gap-2">
          <span className="flex size-4 shrink-0 items-center justify-center"><LayerGlyph layer={layer} active={active} /></span>
          <span className="truncate text-sm font-medium text-slate-800">{layer.title}</span>
        </span>
        <span className="mt-1 block truncate pl-6 text-[11px] leading-4 text-slate-500">{layer.description}</span>
      </button>
      {busy && <span className="mt-1 size-3 shrink-0 animate-spin border-2 border-slate-300 border-t-slate-700" aria-label="Memuat" />}
      {error && <span className="mt-0.5 text-xs text-red-600" title={error} aria-label="Gagal memuat">!</span>}
    </div>
  );
}
