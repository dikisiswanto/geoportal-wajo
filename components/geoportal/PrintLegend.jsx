export default function PrintLegend({ activeLayers, kecamatanLegend }) {
  return (
    <aside className="print-only-legend" aria-label="Legenda peta untuk cetak">
      <div className="print-only-header">
        <div>
          <p className="print-only-kicker">Pemerintah Kabupaten Wajo</p>
          <h2>Legenda Peta</h2>
        </div>
        <p className="print-only-note">Data yang sedang ditampilkan</p>
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
              <span
                className={`print-only-swatch print-only-swatch-${swatchKind}`}
                style={{ backgroundColor: layer.color, borderColor: layer.color }}
                aria-hidden="true"
              />
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
                <span
                  className="print-only-swatch print-only-swatch-area"
                  style={{ backgroundColor: item.color, borderColor: item.color }}
                  aria-hidden="true"
                />
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
