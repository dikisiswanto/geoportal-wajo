import { markerIconMarkup, pointKind } from "../../lib/geo/markers";

export default function LegendSymbol({
  kind,
  color,
  layer,
  feature,
  style,
  size = "interactive",
}) {
  const safeColor = color || "#64748b";
  const print = size === "print";

  if (kind === "point") {
    const markup = markerIconMarkup(pointKind(layer || {}, feature || {}), safeColor);
    return (
      <span
        className={print ? "print-only-point-icon" : "legend-point-symbol"}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }

  if (kind === "line") {
    return (
      <svg
        className={print ? "print-only-swatch-svg" : "legend-line-symbol"}
        viewBox="0 0 24 12"
        aria-hidden="true"
        focusable="false"
      >
        <line
          x1="2"
          y1="6"
          x2="22"
          y2="6"
          stroke={style?.color || safeColor}
          strokeWidth={Math.max(1.5, Math.min(4, Number(style?.weight) || 3))}
          strokeLinecap="round"
          strokeDasharray={style?.dashArray || undefined}
        />
      </svg>
    );
  }

  const fillColor = style?.fillColor || safeColor;
  const fillOpacity = Math.min(0.82, Math.max(0.08, Number(style?.fillOpacity ?? 0.62)));
  return (
    <svg
      className={print ? "print-only-swatch-svg" : "legend-area-symbol"}
      viewBox="0 0 14 14"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="1"
        y="1"
        width="12"
        height="12"
        rx="2"
        fill={fillColor}
        fillOpacity={fillOpacity}
        stroke={style?.color || safeColor}
        strokeWidth="1.3"
      />
    </svg>
  );
}
