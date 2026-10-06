import { withAssetVersion } from "../assetVersion";

const CRITICAL_LAYER_FILES = Object.freeze([
  "batas-kabupaten.geojson",
  "batas-kecamatan.geojson"
]);

const startupFetchPromises = new Map();
const startupDataPromises = new Map();

function loadStartupText(file) {
  if (!CRITICAL_LAYER_FILES.includes(file)) return null;

  if (!startupFetchPromises.has(file)) {
    const request = fetch(
      withAssetVersion(`/geo-data/${encodeURIComponent(file)}`),
      { cache: "force-cache" }
    ).then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    });

    startupFetchPromises.set(file, request);
  }

  return startupFetchPromises.get(file);
}

function parseStartupData(file) {
  if (!CRITICAL_LAYER_FILES.includes(file)) return null;

  if (!startupDataPromises.has(file)) {
    const request = loadStartupText(file)
      .then((text) => {
        const data = JSON.parse(text);
        startupFetchPromises.delete(file);
        return data;
      })
      .catch((error) => {
        startupDataPromises.delete(file);
        startupFetchPromises.delete(file);
        throw error;
      });
    startupDataPromises.set(file, request);
  }

  return startupDataPromises.get(file);
}

export function getStartupLayerDataPromise(file) {
  return parseStartupData(file);
}

export function preloadCriticalGeoData() {
  return Promise.allSettled(
    CRITICAL_LAYER_FILES.map((file) => loadStartupText(file))
  );
}
