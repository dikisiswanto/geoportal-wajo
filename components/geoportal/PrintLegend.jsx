function LegendSwatch({ kind, color }) {
  const safeColor = color || "#64748b";

  if (kind === "line") {
    return (
      <svg className="print-only-swatch-svg" viewBox="0 0 24 12" aria-hidden="true" focusable="false">
        <line x1="2" y1="6" x2="22" y2="6" stroke={safeColor} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "point") {
    return (
      <svg className="print-only-swatch-svg" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
        <circle cx="7" cy="7" r="4.5" fill={safeColor} stroke="#334155" strokeWidth="1" />
      </svg>
    );
  }

  return (
    <svg className="print-only-swatch-svg" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="12" height="12" rx="2" fill={safeColor} fillOpacity="0.62" stroke={safeColor} strokeWidth="1.3" />
    </svg>
  );
}

export default function PrintLegend({ activeLayers, kecamatanLegend, scopeTitle }) {
  return (
    <aside className="print-only-legend" aria-label="Legenda peta untuk cetak">
      <div className="print-only-header">
        <div>
          <p className="print-only-kicker">Pemerintah Kabupaten Wajo</p>
          <h2>Legenda Peta</h2>
        </div>
        <p className="print-only-note">{scopeTitle || "Tampilan saat ini"}</p>
      </div>

      <div className="print-only-legend-items">
        {activeLayers.map((layer) => {
          const geometry = String(layer.geometry || "").toLowerCase();
          const swatchKind = layer.styleMode === "admin-county-outline" || geometry.includes("line")
            ? "line"
            : geometry.includes("point")
              ? "point"
              : "area";

          return (
            <div key={layer.id} className="print-only-legend-item">
              <LegendSwatch kind={swatchKind} color={layer.color} />
              <span>{layer.title}</span>
            </div>
          );
        })}
      </div>

      {kecamatanLegend.length > 0 && (
        <div className="print-only-kecamatan">
          <p className="print-only-section-title">Kecamatan</p>
          <div className="print-only-kecamatan-grid">
            {kecamatanLegend.map((item) => (
              <div key={`print-kec-${item.id}`} className="print-only-legend-item">
                <LegendSwatch kind="area" color={item.color} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="print-only-footer">Peta Interaktif Kabupaten Wajo</p>
    </aside>
  );
}
