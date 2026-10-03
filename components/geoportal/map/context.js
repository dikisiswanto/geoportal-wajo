import {
  featureMatchesRegion,
  featureMatchesAdministrativeFeature,
  featureAdministrativeCodes,
  administrativeFeatureCode,
  regionCodeFromBoundaryName,
  normalizeRegionName
} from "../../../lib/geo/region";
import { featurePassesLayerFilter } from "../../../lib/geo/dataFilter";

export function getAdminContextKey(regionFilter, focusAdmin) {
  const type = String(focusAdmin?.type ?? "").trim();
  const feature = focusAdmin?.feature;
  const code = feature
    ? administrativeFeatureCode(
        feature,
        type === "desa" ? "desa" : type === "kecamatan" ? "kecamatan" : "kabupaten"
      )
    : "";
  const name = feature
    ? administrativeName(feature, type === "desa" ? "desa" : "kecamatan")
    : "";

  return [
    normalizeRegionName(regionFilter),
    type,
    code,
    normalizeRegionName(name)
  ].join("|");
}

const REGION_MEMBERSHIP_CACHE = new WeakMap();

function getRegionMembershipIndex(data) {
  if (!data?.features?.length) return null;

  const cached = REGION_MEMBERSHIP_CACHE.get(data);
  if (cached?.featureCount === data.features.length) return cached;

  const byKecamatan = new Map();
  const byDesa = new Map();
  const withoutKecamatanCode = [];
  const withoutDesaCode = [];

  data.features.forEach((feature) => {
    const kecamatanCodes = featureAdministrativeCodes(feature, "kecamatan");
    const desaCodes = featureAdministrativeCodes(feature, "desa");

    if (kecamatanCodes.length) {
      kecamatanCodes.forEach((code) => {
        const bucket = byKecamatan.get(code);
        if (bucket) bucket.push(feature);
        else byKecamatan.set(code, [feature]);
      });
    } else {
      withoutKecamatanCode.push(feature);
    }

    if (desaCodes.length) {
      desaCodes.forEach((code) => {
        const bucket = byDesa.get(code);
        if (bucket) bucket.push(feature);
        else byDesa.set(code, [feature]);
      });
    } else {
      withoutDesaCode.push(feature);
    }
  });

  const index = {
    featureCount: data.features.length,
    byKecamatan,
    byDesa,
    withoutKecamatanCode,
    withoutDesaCode
  };
  REGION_MEMBERSHIP_CACHE.set(data, index);
  return index;
}

const FILTERED_DATA_CACHE = new WeakMap();

function getFilteredDataCache(data) {
  let layerCache = FILTERED_DATA_CACHE.get(data);
  if (!layerCache) {
    layerCache = new Map();
    FILTERED_DATA_CACHE.set(data, layerCache);
  }
  return layerCache;
}

export function filterGeoJsonForLayer(layer, data, regionFilter, boundaryData, focusAdmin) {
  const hasRegionFilter = Boolean(regionFilter);
  if (!Array.isArray(data?.features)) return data;

  const isVillageBoundary = layer?.id === "adm-desa";
  const isAdministrativeLayer = isAdministrativeLayerId(layer?.id);
  if (!hasRegionFilter && !focusAdmin && !layer?.featureFilter) return data;

  const focusType = focusAdmin?.type === "desa" ? "desa" : focusAdmin?.type === "kecamatan" ? "kecamatan" : "";
  const focusCode = focusAdmin?.feature && focusType
    ? administrativeFeatureCode(focusAdmin.feature, focusType)
    : "";
  const targetRegionCode = hasRegionFilter
    ? regionCodeFromBoundaryName(regionFilter, boundaryData)
    : "";
  const cacheKey = `${layer?.id ?? "layer"}|${targetRegionCode}|${focusType}|${focusCode}`;
  const layerCache = getFilteredDataCache(data);
  if (layerCache.has(cacheKey)) return layerCache.get(cacheKey);

  const membershipIndex = getRegionMembershipIndex(data);
  let filtered;

  if (isVillageBoundary && focusType === "desa" && focusCode) {
    const indexed = membershipIndex?.byDesa.get(focusCode) ?? [];
    const candidates = indexed.length ? indexed : membershipIndex?.withoutDesaCode ?? [];
    filtered = candidates.filter((feature) => featureAdministrativeCodes(feature, "desa").includes(focusCode) || featureMatchesAdministrativeFeature(feature, focusAdmin.feature));
  } else if (isVillageBoundary && (focusType === "kecamatan" || targetRegionCode)) {
    const regionCode = focusType === "kecamatan" && focusCode ? focusCode : targetRegionCode;
    const indexed = membershipIndex?.byKecamatan.get(regionCode) ?? [];
    const fallback = membershipIndex?.withoutKecamatanCode ?? [];
    filtered = indexed.slice();
    if (fallback.length) {
      const extra = fallback.filter((feature) => featureMatchesRegion(feature, regionFilter, boundaryData));
      if (extra.length) filtered.push(...extra);
    }
  } else if (focusType === "desa" && focusCode) {
    const indexed = membershipIndex?.byDesa.get(focusCode) ?? [];
    const candidates = indexed.length ? indexed : membershipIndex?.withoutDesaCode ?? [];
    filtered = candidates.filter((feature) => featureMatchesAdministrativeFeature(feature, focusAdmin.feature));
  } else if (focusType === "kecamatan" && focusCode) {
    const indexed = membershipIndex?.byKecamatan.get(focusCode) ?? [];
    const candidates = indexed.length ? indexed : membershipIndex?.withoutKecamatanCode ?? [];
    filtered = candidates.filter((feature) => featureMatchesAdministrativeFeature(feature, focusAdmin.feature));
  } else if (hasRegionFilter && !isAdministrativeLayer) {
    const indexed = targetRegionCode ? membershipIndex?.byKecamatan.get(targetRegionCode) ?? [] : [];
    const candidates = indexed.length
      ? indexed
      : membershipIndex?.withoutKecamatanCode ?? data.features;
    filtered = candidates.filter((feature) => {
      if (!featurePassesLayerFilter(layer, feature)) return false;
      if (targetRegionCode) {
        const codes = featureAdministrativeCodes(feature, "kecamatan");
        if (codes.length) return codes.includes(targetRegionCode);
      }
      return featureMatchesRegion(feature, regionFilter, boundaryData);
    });
  } else {
    filtered = data.features.filter((feature) => featurePassesLayerFilter(layer, feature));
  }

  const result = filtered.length === data.features.length ? data : { ...data, features: filtered };
  layerCache.set(cacheKey, result);
  return result;
}

export function isAdministrativeLayerId(layerId) {
  return layerId === "adm-kabupaten" || layerId === "adm-kecamatan" || layerId === "adm-desa";
}

export function administrativeName(feature, type) {
  const properties = feature?.properties ?? {};
  if (type === "desa") {
    return String(
      properties.Desa ??
      properties.WADMKD ??
      properties.nama_desa ??
      properties.NAMOBJ ??
      ""
    ).trim();
  }

  if (type === "kabupaten") {
    return String(
      properties.Kabupaten ??
      properties.WADMKK ??
      properties.nama_kabupaten ??
      properties.NAMOBJ ??
      ""
    ).trim();
  }

  return String(
    properties.Kecamatan ??
    properties.WADMKC ??
    properties.nama_kecamatan ??
    properties.kecamatan ??
    properties.NAMOBJ ??
    ""
  ).trim();
}

export function administrationFeatureMatchesTarget(feature, targetFeature, type) {
  if (!feature || !targetFeature || !type) return false;

  const targetCode = administrativeFeatureCode(targetFeature, type);
  const featureCode = administrativeFeatureCode(feature, type);

  if (targetCode && featureCode) {
    return targetCode === featureCode;
  }

  const targetCodes = featureAdministrativeCodes(targetFeature, type);
  const featureCodes = featureAdministrativeCodes(feature, type);
  if (targetCodes.length && featureCodes.length) {
    return featureCodes.some((code) => targetCodes.includes(code));
  }

  const targetName = administrativeName(targetFeature, type);
  const featureName = administrativeName(feature, type);
  return Boolean(targetName && featureName) &&
    normalizeRegionName(targetName) === normalizeRegionName(featureName);
}
