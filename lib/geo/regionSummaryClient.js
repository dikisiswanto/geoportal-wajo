import { withAssetVersion } from "../assetVersion";

let summaryPromise;

export function loadRegionSummary() {
  if (!summaryPromise) {
    summaryPromise = fetch(withAssetVersion("/region-summary.json"), { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .catch((error) => {
        summaryPromise = undefined;
        throw error;
      });
  }
  return summaryPromise;
}
