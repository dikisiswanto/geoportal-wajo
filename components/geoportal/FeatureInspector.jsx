import {
  IconArrowBackUp,
  IconChevronDown,
  IconTarget,
  IconX
} from "@tabler/icons-react";

import {
  featureLabel,
  formatValue,
  inspectorGroups
} from "../../lib/geo/format";

import LayerGlyph from "./LayerGlyph";

export default function FeatureInspector({
  selected,
  open,
  onClose,
  onZoom
}) {
  if (!open || !selected) {
    return null;
  }

  const properties = selected.feature.properties ?? {};

  const groups = inspectorGroups(
    selected.layer,
    properties
  );

  return (
    <aside
      className="
        map-ui-chrome
        absolute inset-y-0 right-0 z-[1000]
        flex w-[380px] max-w-[92vw] flex-col
        border-l border-slate-200
        bg-white
        shadow-[-8px_0_24px_rgba(15,23,42,0.05)]
      "
      aria-label="Informasi feature"
    >
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-slate-200 px-4 py-3">
        <div
          className="
            grid size-9 shrink-0 place-items-center
            border border-slate-200
            bg-slate-50
          "
          aria-hidden
        >
          <LayerGlyph
            layer={selected.layer}
            active
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Feature
          </p>

          <h2 className="mt-1 truncate text-sm font-semibold text-slate-900">
            {featureLabel(
              selected.layer,
              selected.feature
            )}
          </h2>

          <p className="mt-0.5 text-[11px] text-slate-500">
            {selected.layer.title}
            {" · "}
            {selected.layer.group}
          </p>
          <p className="mt-1 truncate text-[10px] text-slate-400" title={selected.layer.source}>
            Sumber: {selected.layer.source || "Tidak tersedia"}
            {selected.layer.dataYear ? ` · ${selected.layer.dataYear}` : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            grid size-8 shrink-0 place-items-center
            text-slate-500
            hover:bg-slate-100
            focus:outline-none
            focus:ring-2 focus:ring-blue-500
          "
          aria-label="Tutup informasi feature"
          title="Tutup"
        >
          <IconX
            size={17}
            aria-hidden
          />
        </button>
      </div>

      {/* Actions */}
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onZoom}
            className="
              inline-flex items-center gap-1.5
              border border-slate-300
              px-2.5 py-1.5
              text-xs font-medium text-slate-700
              hover:bg-slate-50
              focus:outline-none
              focus:ring-2 focus:ring-blue-500
            "
            title="Zoom ke feature"
          >
            <IconTarget
              size={14}
              aria-hidden
            />
            Zoom
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
              inline-flex items-center gap-1.5
              border border-slate-200
              px-2.5 py-1.5
              text-xs font-medium text-slate-600
              hover:bg-slate-50
              focus:outline-none
              focus:ring-2 focus:ring-blue-500
            "
            title="Tutup inspector"
          >
            <IconArrowBackUp
              size={14}
              aria-hidden
            />
            Tutup
          </button>
        </div>
      </div>

      {/* Attributes */}
      <div className="inspect-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="divide-y divide-slate-200">
          {groups.map((group, index) => (
            <details
              key={group.id}
              open={index === 0}
              className="group"
            >
              <summary
                className="
                  flex cursor-pointer list-none
                  items-center justify-between
                  px-4 py-3
                  text-xs font-semibold text-slate-800
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-inset
                  focus-visible:ring-blue-500
                "
              >
                <span>{group.title}</span>

                <IconChevronDown
                  size={15}
                  className="
                    text-slate-400
                    transition-transform
                    group-open:rotate-180
                  "
                  aria-hidden
                />
              </summary>

              <dl className="border-t border-slate-100">
                {group.fields.map(([key, label]) => (
                  <div
                    key={key}
                    className="
                      grid
                      grid-cols-[42%_58%]
                      gap-3
                      border-b border-slate-50
                      px-4 py-2.5
                      last:border-b-0
                    "
                  >
                    <dt className="break-words text-[11px] text-slate-500">
                      {label}
                    </dt>

                    <dd className="break-words text-xs font-medium text-slate-800">
                      {formatValue(properties[key])}
                    </dd>
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
