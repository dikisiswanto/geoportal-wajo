const SOURCE_STYLES = {
  "Ina-Geoportal BIG": "border-sky-200 bg-sky-50 text-sky-700",
  "Kemendikdasmen": "border-indigo-200 bg-indigo-50 text-indigo-700",
  "Sumber terbuka / ArcGIS": "border-slate-200 bg-slate-50 text-slate-600"
};

const SOURCE_LABELS = {
  "Ina-Geoportal BIG": "Ina-Geo BIG",
  "Kemendikdasmen": "Kemendikdasmen",
  "Sumber terbuka / ArcGIS": "Terbuka / ArcGIS"
};

const SOURCE_FULL_LABELS = {
  "Ina-Geoportal BIG": "Ina-Geoportal BIG",
  "Kemendikdasmen": "Kemendikdasmen",
  "Sumber terbuka / ArcGIS": "Sumber terbuka / ArcGIS"
};

export default function SourceBadge({ sourceType, className = "" }) {
  const type = sourceType || "Sumber terbuka / ArcGIS";
  const style = SOURCE_STYLES[type] || SOURCE_STYLES["Sumber terbuka / ArcGIS"];
  const label = SOURCE_LABELS[type] || type;
  const fullLabel = SOURCE_FULL_LABELS[type] || type;

  return (
    <span className={`inline-flex max-w-[118px] shrink-0 items-center truncate rounded-full border px-1 py-px map-text-source font-medium ${style} ${className}`} title={fullLabel}>
      {label}
    </span>
  );
}

export function getSourceShortLabel(sourceType) {
  return SOURCE_LABELS[sourceType] || sourceType || "Sumber data";
}
