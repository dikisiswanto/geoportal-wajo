const ADMIN_REGION_PARAM = "region";

export function getStartupNavigationState(search = "") {
  const params = new URLSearchParams(search || "");
  const layerId = String(params.get("layer") || "").trim();
  const feature = String(params.get("feature") || "").trim();
  const region = String(params.get(ADMIN_REGION_PARAM) || "").trim();
  const latParam = String(params.get("lat") || "").trim();
  const lngParam = String(params.get("lng") || "").trim();
  const zoomParam = String(params.get("zoom") || "").trim();
  const lat = latParam === "" ? NaN : Number(latParam);
  const lng = lngParam === "" ? NaN : Number(lngParam);
  const zoom = zoomParam === "" ? NaN : Number(zoomParam);

  const hasFeature = Boolean(layerId && feature);
  const hasRegion = Boolean(region);
  const hasView = latParam !== "" && lngParam !== "" && Number.isFinite(lat) && Number.isFinite(lng);

  return Object.freeze({
    layerId,
    feature,
    region,
    lat,
    lng,
    zoom,
    hasFeature,
    hasRegion,
    hasView,
    hasDirectedNavigation: hasFeature || hasRegion || hasView,
    priority: hasFeature ? "feature" : hasRegion ? "region" : hasView ? "view" : "default"
  });
}

export function hasDirectedStartupNavigation(search = "") {
  return getStartupNavigationState(search).hasDirectedNavigation;
}
