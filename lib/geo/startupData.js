import { withAssetVersion } from "../assetVersion";

const CRITICAL_LAYER_FILES = Object.freeze([
  "batas-kabupaten.geojson",
  "batas-kecamatan.geojson"
]);

const startupPromises = new Map();

function loadStartupFile(file) {
  if (!CRITICAL_LAYER_FILES.includes(file)) return null;

  if (!startupPromises.has(file)) {
    const request = fetch(
      withAssetVersion(`/geo-data/${encodeURIComponent(file)}`),
      { cache: "force-cache" }
    ).then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });

    startupPromises.set(file, request);
  }

  return startupPromises.get(file);
}

export function getStartupLayerDataPromise(file) {
  return loadStartupFile(file);
}

export function preloadCriticalGeoData() {
  return Promise.allSettled(
    CRITICAL_LAYER_FILES.map((file) => loadStartupFile(file))
  );
}

