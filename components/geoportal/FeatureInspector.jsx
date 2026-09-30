import { IconArrowBackUp, IconTarget, IconX } from "@tabler/icons-react";
import { featureLabel, formatValue } from "../../lib/geo/format";

export default function FeatureInspector({ selected, open, onClose, onZoom }) {
  if (!open || !selected) return null;

  return (
    <aside className="absolute inset-y-0 right-0 z-[1000] flex w-[380px] max-w-[92vw] flex-col border-l border-slate-200 bg-white shadow-[-8px_0_24px_rgba(15,23,42,0.05)]" aria-label="Informasi feature">
      <div className="flex items-start gap-3 border-b border-slate-200 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Feature</p>
          <h2 className="mt-1 truncate text-sm font-semibold text-slate-900">{featureLabel(selected.layer, selected.feature)}</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">{selected.layer.title}</p>
        </div>
        <button type="button" onClick={onClose} className="grid size-8 shrink-0 place-items-center text-slate-500 hover:bg-slate-100" aria-label="Tutup informasi feature"><IconX size={17} /></button>
      </div>
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onZoom} className="inline-flex items-center gap-1.5 border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"><IconTarget size={14} /> Zoom</button>
          <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"><IconArrowBackUp size={14} /> Tutup</button>
        </div>
      </div>
      <div className="inspect-scroll min-h-0 flex-1 overflow-y-auto">
        <dl className="divide-y divide-slate-100">
          {Object.entries(selected.feature.properties ?? {}).filter(([key]) => !/^shape_/i.test(key)).map(([key, value]) => (
            <div key={key} className="grid grid-cols-[42%_58%] gap-3 px-4 py-2.5">
              <dt className="break-words text-[11px] text-slate-500">{key}</dt>
              <dd className="break-words text-xs font-medium text-slate-800">{formatValue(value)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
