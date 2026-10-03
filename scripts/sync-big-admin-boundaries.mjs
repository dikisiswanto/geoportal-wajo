import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "geo-data");
const WJ = "7313";
const WJ_ALT = "73.13";
const WJ_NAME = "WAJO";

const DEFAULT_SERVICES = {
  kecamatan: [
    "https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KECAMATAN_AR/MapServer",
  ],
  desa: [
    "https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_DESAKEL_AR/MapServer",
  ],
};

const customEndpoint = (kind) => process.env[kind === "kecamatan" ? "BIG_KEC_ENDPOINT" : "BIG_DESA_ENDPOINT"];

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const includeDesa = args.has("--desa");
const pageSize = clampInt(process.env.BIG_PAGE_SIZE, 100, 1000, 500);
const idChunkSize = clampInt(process.env.BIG_ID_CHUNK_SIZE, 25, 100, 50);
const maxRetries = clampInt(process.env.BIG_RETRIES, 1, 8, 4);
const timeoutMs = clampInt(process.env.BIG_TIMEOUT_MS, 10000, 120000, 30000);

function clampInt(value, min, max, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

function normalizeCode(value) {
  return String(value ?? "").replace(/[^0-9]/g, "").trim();
}

function normalizeName(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function readProperty(properties, keys) {
  for (const key of keys) {
    if (properties && Object.prototype.hasOwnProperty.call(properties, key)) return properties[key];
    const match = Object.keys(properties || {}).find((candidate) => candidate.toLowerCase() === key.toLowerCase());
    if (match) return properties[match];
  }
  return null;
}

function featureProperties(feature) {
  return feature?.properties || feature?.attributes || {};
}

function belongsToWajo(feature) {
  const props = featureProperties(feature);
  const codes = ["KDBBPS", "KDPKAB"]
    .map((key) => normalizeCode(readProperty(props, [key])))
    .filter(Boolean);
  if (codes.some((code) => code === WJ || code.endsWith(WJ))) return true;

  const names = ["WADMKK", "WIADKK"]
    .map((key) => normalizeName(readProperty(props, [key])))
    .filter(Boolean);
  return names.some((name) => name === WJ_NAME || name === `KABUPATEN ${WJ_NAME}`);
}

function toLayerQueryUrl(value) {
  const raw = String(value || "").replace(/\/$/, "");
  return raw.endsWith("/query") ? raw : `${raw}/0/query`;
}

function toLayerInfoUrl(value) {
  const raw = String(value || "").replace(/\/$/, "");
  return raw.endsWith("/query") ? raw.slice(0, -"/query".length) : raw.endsWith("/MapServer") ? `${raw}/0` : raw;
}

function buildParams(params = {}) {
  return new URLSearchParams({ f: "json", ...params });
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error) {
  const code = error?.cause?.code || error?.code || error?.name;
  return ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED", "EAI_AGAIN", "AbortError", "UND_ERR_CONNECT_TIMEOUT"].includes(code);
}

async function requestText(url, { method = "GET", form, label }) {
  let lastError = null;
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const init = {
        method,
        headers: {
          accept: "application/json,application/geo+json,text/plain,*/*",
          "user-agent": "Geoportal-Wajo-BIG-Sync/2.0",
        },
        signal: controller.signal,
        cache: "no-store",
      };
      if (method === "POST") {
        init.headers["content-type"] = "application/x-www-form-urlencoded;charset=UTF-8";
        init.body = form instanceof URLSearchParams ? form.toString() : new URLSearchParams(form || {}).toString();
      }
      const response = await fetch(url, init);
      const text = await response.text();
      clearTimeout(timer);
      if (!response.ok) {
        const snippet = text.replace(/\s+/g, " ").slice(0, 220);
        throw new Error(`${label}: HTTP ${response.status}${snippet ? ` — ${snippet}` : ""}`);
      }
      return text;
    } catch (error) {
      clearTimeout(timer);
      lastError = error;
      if (!isRetryable(error) || attempt === maxRetries) break;
      const delay = Math.min(10000, 800 * 2 ** (attempt - 1));
      console.warn(`${label}: ${error?.cause?.code || error?.name || "network error"} pada percobaan ${attempt}; retry ${delay}ms`);
      await sleep(delay);
    }
  }
  throw lastError;
}

async function requestJson(url, options = {}) {
  const text = await requestText(url, options);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`${options.label || url}: response BIG bukan JSON yang valid.`);
  }
  if (data?.error) {
    const detail = data.error.details?.join("; ") || data.error.message || "BIG API error";
    throw new Error(`${options.label || url}: ${detail}`);
  }
  return data;
}

async function postQuery(endpoint, params, label) {
  const url = toLayerQueryUrl(endpoint);
  const form = buildParams(params);
  try {
    return await requestJson(url, { method: "POST", form, label: `${label} POST` });
  } catch (postError) {
    // BIG/ArcGIS normally supports GET too; keep it as compatibility fallback.
    console.warn(`${label}: POST gagal, mencoba GET fallback — ${postError.message}`);
    const getUrl = `${url}?${form.toString()}`;
    return requestJson(getUrl, { method: "GET", label: `${label} GET` });
  }
}

async function inspectLayer(endpoint, label) {
  const layerUrl = toLayerInfoUrl(endpoint);
  const data = await requestJson(`${layerUrl}?f=pjson`, { label: `${label} metadata` });
  if (data?.type !== "Feature Layer") throw new Error(`${label}: endpoint tidak menunjuk Feature Layer.`);
  const fields = new Set((data.fields || []).map((field) => field.name));
  const objectIdField = data.objectIdField || [...fields].find((field) => field.toUpperCase() === "OBJECTID") || "OBJECTID";
  return { layerUrl, queryUrl: `${layerUrl}/query`, fields, objectIdField, maxRecordCount: data.maxRecordCount || 1000 };
}

function pickExisting(fields, candidates) {
  for (const candidate of candidates) if (fields.has(candidate)) return candidate;
  return null;
}

async function discoverObjectIds(endpoint, label) {
  const meta = await inspectLayer(endpoint, label);
  const kabCodeField = pickExisting(meta.fields, ["KDBBPS", "KDPKAB"]);
  const kabNameField = pickExisting(meta.fields, ["WADMKK", "WIADKK"]);
  const idField = meta.objectIdField;

  const whereCandidates = [];
  if (kabCodeField) {
    whereCandidates.push(`${kabCodeField}='${WJ}'`);
    whereCandidates.push(`${kabCodeField}='${WJ_ALT}'`);
  }
  if (kabNameField) {
    whereCandidates.push(`${kabNameField}='Wajo'`);
    whereCandidates.push(`${kabNameField}='WAJO'`);
    whereCandidates.push(`${kabNameField}='Kabupaten Wajo'`);
  }

  for (const where of whereCandidates) {
    try {
      const data = await postQuery(meta.queryUrl, {
        where,
        outFields: `${idField}${kabCodeField ? `,${kabCodeField}` : ""}${kabNameField ? `,${kabNameField}` : ""}`,
        returnGeometry: "false",
        returnIdsOnly: "true",
        resultRecordCount: "1000",
      }, `${label} where=${where}`);
      const ids = Array.isArray(data.objectIds) ? data.objectIds : [];
      if (ids.length) return { meta, ids: [...new Set(ids)] };
    } catch (error) {
      console.warn(`${label}: kandidat filter gagal (${where}) — ${error.message}`);
    }
  }

  console.warn(`${label}: filter atribut langsung tidak menemukan Wajo; scan atribut nasional dengan POST.`);
  const ids = [];
  let offset = 0;
  while (true) {
    const data = await postQuery(meta.queryUrl, {
      where: "1=1",
      outFields: [idField, kabCodeField, kabNameField].filter(Boolean).join(","),
      returnGeometry: "false",
      resultOffset: String(offset),
      resultRecordCount: String(Math.min(pageSize, meta.maxRecordCount)),
      orderByFields: idField,
    }, `${label} fallback offset=${offset}`);
    const features = Array.isArray(data.features) ? data.features : [];
    for (const feature of features) {
      if (belongsToWajo(feature)) {
        const props = featureProperties(feature);
        const id = props?.[idField] ?? props?.[idField.toLowerCase()];
        if (id !== undefined && id !== null) ids.push(id);
      }
    }
    if (features.length === 0 || features.length < Math.min(pageSize, meta.maxRecordCount) || data.exceededTransferLimit !== true) break;
    offset += features.length;
  }

  return { meta, ids: [...new Set(ids)] };
}

async function fetchAttributesByIds(discovered, label) {
  const { meta, ids } = discovered;
  const rows = new Map();
  for (let i = 0; i < ids.length; i += idChunkSize) {
    const chunk = ids.slice(i, i + idChunkSize);
    const data = await postQuery(meta.queryUrl, {
      objectIds: chunk.join(","),
      outFields: "*",
      returnGeometry: "false",
      returnIdsOnly: "false",
    }, `${label} attributes ${i + 1}-${Math.min(i + idChunkSize, ids.length)}`);
    for (const feature of Array.isArray(data.features) ? data.features : []) {
      const attrs = featureProperties(feature);
      const id = attrs?.[meta.objectIdField] ?? attrs?.[meta.objectIdField?.toLowerCase?.()];
      if (id !== undefined && id !== null) rows.set(String(id), attrs);
    }
  }
  return rows;
}

async function fetchGeometryByIds(endpoint, label, discovered) {
  const { meta, ids } = discovered;
  const attributesById = await fetchAttributesByIds(discovered, label);
  const features = [];
  for (let i = 0; i < ids.length; i += idChunkSize) {
    const chunk = ids.slice(i, i + idChunkSize);
    const data = await postQuery(meta.queryUrl, {
      objectIds: chunk.join(","),
      outFields: "*",
      returnGeometry: "true",
      outSR: "4326",
      f: "geojson",
    }, `${label} geometry ${i + 1}-${Math.min(i + idChunkSize, ids.length)}`);

    if (data?.type === "FeatureCollection" && Array.isArray(data.features)) {
      for (const feature of data.features) {
        const id = feature.id ?? feature.properties?.[meta.objectIdField];
        const attrs = attributesById.get(String(id)) || feature.properties || {};
        features.push({ ...feature, id, properties: attrs });
      }
      continue;
    }
    if (Array.isArray(data.features)) {
      const converted = data.features.map((feature) => {
        const attributes = feature.attributes || {};
        const id = feature.id ?? attributes[meta.objectIdField];
        return {
          type: "Feature",
          id,
          properties: attributesById.get(String(id)) || attributes,
          geometry: feature.geometry ? esriGeometryToGeoJson(feature.geometry) : null,
        };
      });
      features.push(...converted);
      continue;
    }
    throw new Error(`${label}: response geometry tidak dikenali sebagai GeoJSON/Esri FeatureSet.`);
  }
  return features;
}

function esriGeometryToGeoJson(geometry) {
  if (!geometry) return null;
  if (Array.isArray(geometry.x) && Array.isArray(geometry.y)) return null;
  if (typeof geometry.x === "number" && typeof geometry.y === "number") {
    return { type: "Point", coordinates: [geometry.x, geometry.y] };
  }
  if (Array.isArray(geometry.rings)) {
    return { type: "Polygon", coordinates: geometry.rings };
  }
  if (Array.isArray(geometry.paths)) {
    return { type: geometry.paths.length > 1 ? "MultiLineString" : "LineString", coordinates: geometry.paths.length > 1 ? geometry.paths : geometry.paths[0] };
  }
  return null;
}

async function fetchWajoLayer(kind, label) {
  const endpoints = [customEndpoint(kind), ...DEFAULT_SERVICES[kind]].filter(Boolean);
  let lastError = null;
  for (const endpoint of [...new Set(endpoints)]) {
    try {
      console.log(`${label}: mencoba ${endpoint}`);
      const discovered = await discoverObjectIds(endpoint, label);
      if (!discovered.ids.length) throw new Error(`${label}: BIG tidak menemukan ObjectID Kabupaten Wajo.`);
      console.log(`${label}: ${discovered.ids.length} ObjectID ditemukan.`);
      const rows = await fetchGeometryByIds(endpoint, label, discovered);
      const filtered = rows.filter(belongsToWajo);
      if (!filtered.length) throw new Error(`${label}: geometry terambil tetapi 0 feature lolos validasi atribut Wajo.`);
      return filtered;
    } catch (error) {
      lastError = error;
      console.warn(`${label}: endpoint ${endpoint} gagal — ${error.message}`);
    }
  }
  throw lastError;
}

function validateKec(rows) {
  const names = new Set(rows.map((f) => String(readProperty(f.properties, ["WADMKC", "NAMOBJ"]) || "").trim()).filter(Boolean));
  const codes = new Set(rows.map((f) => normalizeCode(readProperty(f.properties, ["KDCBPS", "KDCPUM"]))).filter(Boolean));
  if (rows.length !== 14) throw new Error(`BIG kecamatan Wajo: expected 14 features, got ${rows.length}`);
  if (names.size !== 14) throw new Error(`BIG kecamatan Wajo: expected 14 unique names, got ${names.size}`);
  if (codes.size === 0) {
    console.warn("BIG kecamatan Wajo: field kode kecamatan tidak ikut pada response geometry; validasi dilanjutkan berdasarkan 14 nama unik dan WADMKK.");
  } else if (codes.size < 14) {
    throw new Error(`BIG kecamatan Wajo: kode kecamatan tidak lengkap (${codes.size}/14)`);
  }
  return { count: rows.length, names: [...names].sort(), codes: [...codes].sort() };
}

function validateDesa(rows) {
  const names = new Set(rows.map((f) => String(readProperty(f.properties, ["WADMKD", "NAMOBJ"]) || "").trim()).filter(Boolean));
  if (rows.length < 190) throw new Error(`BIG desa/kelurahan Wajo: expected at least 190 records by BPS 2025, got ${rows.length}`);
  return { count: rows.length, uniqueNames: names.size };
}

function toFeatureCollection(features) {
  return { type: "FeatureCollection", features };
}

console.log(`BIG boundary sync · Kabupaten Wajo (${WJ})`);
console.log(`Mode: ${apply ? "APPLY" : "DRY RUN"}`);
console.log(`Network: retries=${maxRetries}, timeout=${timeoutMs}ms, page=${pageSize}, ids=${idChunkSize}`);

const kecRows = await fetchWajoLayer("kecamatan", "BIG 2026 kecamatan");
const kecMeta = validateKec(kecRows);
console.log(`BIG 2026 kecamatan: ${kecMeta.count} feature valid; ${kecMeta.names.join(", ")}`);

let desaRows = null;
if (includeDesa) {
  desaRows = await fetchWajoLayer("desa", "BIG 2026 desa/kelurahan");
  const desaMeta = validateDesa(desaRows);
  console.log(`BIG 2026 desa/kelurahan: ${desaMeta.count} feature valid; nama unik: ${desaMeta.uniqueNames}`);
}

if (!apply) {
  console.log("DRY RUN: tidak ada file lokal yang diganti.");
  console.log("Untuk menerapkan kecamatan + desa/kelurahan: npm run sync:admin:desa");
  process.exit(0);
}

await fs.mkdir(OUT, { recursive: true });
await fs.writeFile(path.join(OUT, "batas-kecamatan.geojson"), JSON.stringify(toFeatureCollection(kecRows)), "utf8");
console.log("Diperbarui: public/geo-data/batas-kecamatan.geojson");

if (desaRows) {
  await fs.writeFile(path.join(OUT, "batas-desa-kelurahan.geojson"), JSON.stringify(toFeatureCollection(desaRows)), "utf8");
  console.log("Diperbarui: public/geo-data/batas-desa-kelurahan.geojson");
}
