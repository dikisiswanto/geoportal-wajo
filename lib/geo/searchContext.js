import { REGIONS } from "./regionSummary.js";
import { administrativeFeatureCode, featureRegionName, normalizeRegionName } from "./region.js";

const KECAMATAN_NAME_FIELDS = [
  "Kecamatan", "kecamatan", "WADMKC", "nama_kecamatan", "KECAMATAN"
];
const KECAMATAN_CODE_FIELDS = [
  "wilayah_kecamatan_kode", "kode_kecamatan_kemendagri", "kode_kecamatan", "KDCPUM", "KDCBPS"
];

function asList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item ?? "").trim()).filter(Boolean);
  const text = String(value ?? "").trim();
  return text ? [text] : [];
}

function cleanRegionName(value) {
  return String(value ?? "")
    .replace(/^kec\.?\s*/i, "")
    .replace(/^kab\.?\s*/i, "")
    .trim();
}

function uniqueNames(values) {
  const result = [];
  const seen = new Set();
  for (const value of values) {
    const clean = cleanRegionName(value);
    const key = normalizeRegionName(clean);
    if (!clean || !key || seen.has(key)) continue;
    seen.add(key);
    result.push(clean);
  }
  return result;
}

function namesFromBoundaryCodes(feature, boundaryData) {
  if (!feature || !boundaryData?.features?.length) return [];
  const properties = feature.properties ?? {};
  const codes = KECAMATAN_CODE_FIELDS.flatMap((field) => asList(properties[field]));
  if (!codes.length) return [];

  return uniqueNames(
    boundaryData.features
      .filter((boundary) => codes.includes(administrativeFeatureCode(boundary, "kecamatan")))
      .map((boundary) => boundary?.properties?.Kecamatan ?? boundary?.properties?.WADMKC ?? boundary?.properties?.nama_kecamatan ?? boundary?.properties?.NAMOBJ ?? "")
  );
}

function namesFromFeature(feature, boundaryData) {
  if (!feature) return [];
  const properties = feature.properties ?? {};
  const names = KECAMATAN_NAME_FIELDS.flatMap((field) => asList(properties[field]));
  names.push(...namesFromBoundaryCodes(feature, boundaryData));

  const spatialName = featureRegionName(feature, boundaryData);
  if (spatialName) names.push(spatialName);

  return uniqueNames(names);
}

export function resolveSearchRegion(result, feature = null, boundaryData = null) {
  const candidateNames = [
    ...(Array.isArray(result?.regionNames) ? result.regionNames : []),
    ...(result?.regionName ? [result.regionName] : []),
    ...namesFromFeature(feature, boundaryData)
  ];

  const matchedRegions = uniqueNames(candidateNames)
    .map((name) => REGIONS.find((region) => normalizeRegionName(region) === normalizeRegionName(name)))
    .filter(Boolean);

  const regions = uniqueNames(matchedRegions);
  const ambiguous = regions.length > 1;

  return {
    region: regions.length === 1 ? regions[0] : "",
    regions,
    ambiguous,
    hasContext: candidateNames.length > 0
  };
}
