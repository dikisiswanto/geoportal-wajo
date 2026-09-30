export default function PrintLegend({ activeLayers, kecamatanLegend }) {
  return (
    <aside className="print-only-legend" aria-hidden="true">
      <h2>Legenda</h2>
      <div className="print-only-legend-items">
        {activeLayers.map((layer) => (
          <div key={layer.id} className="print-only-legend-item">
            <span className="print-only-swatch" style={{ backgroundColor: layer.color }} />
            <span>{layer.title}</span>
          </div>
        ))}
      </div>
      {kecamatanLegend.length > 0 && (
        <div className="print-only-kecamatan">
          <p>Administrasi Kecamatan</p>
          {kecamatanLegend.map((item) => (
            <div key={item.id} className="print-only-legend-item">
              <span className="print-only-swatch" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
