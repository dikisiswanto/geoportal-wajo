import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dns from "node:dns";
import { WAJO_ADMIN_MASTER, getWajoKecamatanByKemendagri, getWajoVillageByKemendagri, getWajoVillageByKemendagriCode } from "../lib/geo/adminMaster.mjs";

dns.setDefaultResultOrder("ipv4first");

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
const maxRetries = clampInt(process.env.BIG_RETRIES, 1, 10, 3);
const timeoutMs = clampInt(process.env.BIG_TIMEOUT_MS, 10000, 180000, 30000);
const allowLocalFallback = process.env.BIG_ALLOW_LOCAL_FALLBACK !== "0" && !args.has("--remote-only");
const allowShrink = process.env.BIG_ALLOW_SHRINK === "1" || args.has("--allow-shrink");

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

function normalizeAreaProperties(props) {
  const raw = readProperty(props, ["LUASWH"]);
  const areaKm2 = Number(raw);
  return Number.isFinite(areaKm2) && areaKm2 > 0
    ? { luas_wilayah_km2: areaKm2 }
    : {};
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
  return ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED", "EAI_AGAIN", "AbortError", "UND_ERR_CONNECT_TIMEOUT", "UND_ERR_SOCKET", "ERR_SOCKET_CLOSED"].includes(code) || error instanceof TypeError;
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
  const data = await requestJson(`${layerUrl}?f=pjson`, { method: "GET", label: `${label} metadata` });
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

function enrichKecamatanRows(rows) {
  return rows.map((feature) => {
    const props = featureProperties(feature);
    const rawCode = String(readProperty(props, ["KDCPUM", "KDCBPS"]) || "").trim();
    const codeKemendagri = rawCode.includes(".") ? rawCode : rawCode.length === 6 ? `${rawCode.slice(0, 2)}.${rawCode.slice(2, 4)}.${rawCode.slice(4, 6)}` : rawCode;
    const master = getWajoKecamatanByKemendagri(codeKemendagri);
    if (!master) throw new Error(`BIG kecamatan: kode Kemendagri tidak dikenal ${rawCode}.`);
    const nameKemendagri = String(readProperty(props, ["WADMKC", "NAMOBJ"]) || master.nameKemendagri).trim();
    return {
      ...feature,
      properties: {
        ...props,
        ...normalizeAreaProperties(props),
        Kecamatan: master.nameBps,
        nama_kecamatan: master.nameBps,
        kode_kecamatan: master.codeKemendagri,
        kode_kecamatan_kemendagri: master.codeKemendagri,
        kode_kecamatan_bps: master.codeBps,
        nama_kecamatan_kemendagri: nameKemendagri,
        nama_kecamatan_bps: master.nameBps,
        kode_kemendagri: master.codeKemendagri,
        kode_bps: master.codeBps,
        nama_kemendagri: nameKemendagri,
        nama_bps: master.nameBps,
        sumber_referensi_wilayah: "Kemendagri 2025 + BPS 2025 (Keputusan Kepala BPS 750/2025, perubahan KEPKA 135/2026)"
      },
    };
  });
}

function normalizeKemendagriVillageCode(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const dotted = raw.replace(/-/g, ".");
  const parts = dotted.split(".").filter(Boolean);
  if (parts.length === 4 && parts.every((part) => /^\d+$/.test(part))) {
    return `${parts[0].padStart(2, "0")}.${parts[1].padStart(2, "0")}.${parts[2].padStart(2, "0")}.${parts[3].padStart(4, "0")}`;
  }
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 ? `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 6)}.${digits.slice(6, 10)}` : raw;
}

function dedupeByAdminCode(rows, kind) {
  // Nama wilayah BUKAN identitas. Dua feature dengan nama sama tetap dipertahankan
  // selama kode administrasinya berbeda. Hanya kode yang sama yang dianggap duplikat.
  const codeField = kind === "kecamatan" ? "kode_kecamatan" : "kode_desa";
  const index = new Map();
  const duplicates = [];

  for (const row of rows) {
    const code = String(row?.properties?.[codeField] || "").trim();
    if (!code) throw new Error(`BIG ${kind}: feature tanpa ${codeField}.`);
    if (index.has(code)) {
      duplicates.push(code);
      continue;
    }
    index.set(code, row);
  }

  if (duplicates.length) {
    const unique = [...new Set(duplicates)];
    console.warn(`BIG ${kind}: ${duplicates.length} feature duplikat berdasarkan kode diabaikan (${unique.join(", ")}). Nama tidak digunakan sebagai kunci.`);
  }
  return [...index.values()];
}

function enrichDesaRows(rows) {
  return rows.map((feature) => {
    const props = featureProperties(feature);
    const codeKemendagri = normalizeKemendagriVillageCode(readProperty(props, ["KDEPUM"]));
    const village = getWajoVillageByKemendagriCode(codeKemendagri, String(readProperty(props, ["WADMKD", "NAMOBJ"]) || "").trim());
    if (!village?.kecamatan) throw new Error(`BIG desa: kode Kemendagri ${codeKemendagri || "(kosong)"} tidak ada di master Wajo.`);
    if (!village.nameBps || !village.codeBps) {
      throw new Error(`BIG desa: ${codeKemendagri} berhasil mengenali kecamatan ${village.kecamatan.nameBps}, tetapi padanan BPS tidak ditemukan dari nama sumber BIG.`);
    }
    const kec = village.kecamatan;
    const kecCode = kec.codeKemendagri;
    const nameKemendagri = String(readProperty(props, ["WADMKD", "NAMOBJ"]) || village.nameBps).trim();
    return {
      ...feature,
      properties: {
        ...props,
        ...normalizeAreaProperties(props),
        Desa: village.nameBps,
        nama_desa: village.nameBps,
        Kecamatan: kec.nameBps,
        nama_kecamatan: kec.nameBps,
        kode_desa: codeKemendagri,
        kode_kemendagri: codeKemendagri,
        kode_bps: village.codeBps,
        kode_desa_bps: village.codeBps,
        kode_kecamatan: kec.codeKemendagri,
        kode_kecamatan_kemendagri: kec.codeKemendagri,
        kode_kecamatan_bps: kec.codeBps,
        nama_desa_kemendagri: nameKemendagri,
        nama_desa_bps: village.nameBps,
        nama_kecamatan_kemendagri: kec.nameKemendagri,
        nama_kecamatan_bps: kec.nameBps,
        nama_kemendagri: nameKemendagri,
        nama_bps: village.nameBps,
        sumber_referensi_wilayah: "Kemendagri 2025 + BPS 2025 (Keputusan Kepala BPS 750/2025, perubahan KEPKA 135/2026)"
      },
    };
  });
}

async function readLocalFallback(kind, label) {
  const filename = kind === "kecamatan" ? "batas-kecamatan.geojson" : "batas-desa-kelurahan.geojson";
  const file = path.join(OUT, filename);
  try {
    const text = await fs.readFile(file, "utf8");
    const data = JSON.parse(text);
    if (!Array.isArray(data.features) || !data.features.length) throw new Error("FeatureCollection kosong.");
    const enriched = kind === "kecamatan" ? enrichKecamatanRows(data.features) : enrichDesaRows(data.features);
    console.warn(`${label}: BIG tidak dapat dihubungi; memakai data lokal ${filename} yang sudah divalidasi terhadap master Kemendagri + BPS.`);
    return dedupeByAdminCode(enriched, kind);
  } catch (error) {
    throw new Error(`${label}: fallback lokal gagal — ${error.message}`);
  }
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
      const enriched = kind === "kecamatan" ? enrichKecamatanRows(filtered) : enrichDesaRows(filtered);
      return dedupeByAdminCode(enriched, kind);
    } catch (error) {
      lastError = error;
      console.warn(`${label}: endpoint ${endpoint} gagal — ${error.message}`);
    }
  }
  if (allowLocalFallback) return readLocalFallback(kind, label);
  throw lastError;
}

function validateKec(rows) {
  const names = new Set(rows.map((f) => String(f.properties?.nama_kecamatan || "").trim()).filter(Boolean));
  const codes = new Set(rows.map((f) => String(f.properties?.kode_kecamatan || "").trim()).filter(Boolean));
  if (rows.length !== WAJO_ADMIN_MASTER.kecamatan.length) throw new Error(`BIG kecamatan Wajo: expected ${WAJO_ADMIN_MASTER.kecamatan.length} features, got ${rows.length}`);
  if (codes.size !== WAJO_ADMIN_MASTER.kecamatan.length) throw new Error(`BIG kecamatan Wajo: kode Kemendagri tidak unik/lengkap (${codes.size}/${WAJO_ADMIN_MASTER.kecamatan.length})`);
  for (const master of WAJO_ADMIN_MASTER.kecamatan) {
    const hit = rows.find((row) => row.properties?.kode_kecamatan === master.codeKemendagri);
    if (!hit) throw new Error(`Master kecamatan ${master.nameBps} (${master.codeBps}/${master.codeKemendagri}) tidak ditemukan pada GeoJSON BIG.`);
  }
  return { count: rows.length, names: [...names].sort(), codes: [...codes].sort() };
}

function validateDesa(rows) {
  const expected = WAJO_ADMIN_MASTER.kecamatan.reduce((sum, kec) => sum + Object.keys(kec.desa).length, 0);
  const codeKemendagri = new Set(rows.map((f) => String(f.properties?.kode_desa || "").trim()).filter(Boolean));
  const codeBps = new Set(rows.map((f) => String(f.properties?.kode_desa_bps || "").trim()).filter(Boolean));
  if (rows.length !== expected) throw new Error(`BIG desa/kelurahan Wajo: expected ${expected} records from BPS 2025, got ${rows.length}`);
  if (codeKemendagri.size !== expected) throw new Error(`BIG desa/kelurahan Wajo: kode Kemendagri tidak unik/lengkap (${codeKemendagri.size}/${expected})`);
  if (codeBps.size !== expected) throw new Error(`BIG desa/kelurahan Wajo: kode BPS tidak unik/lengkap (${codeBps.size}/${expected})`);
  return { count: rows.length, uniqueKemendagri: codeKemendagri.size, uniqueBps: codeBps.size };
}

function toFeatureCollection(features) {
  return { type: "FeatureCollection", features };
}

async function guardAgainstDataLoss(kind, nextRows) {
  if (allowShrink) return;

  const filename = kind === "kecamatan" ? "batas-kecamatan.geojson" : "batas-desa-kelurahan.geojson";
  const codeField = kind === "kecamatan" ? "kode_kecamatan" : "kode_desa";
  const file = path.join(OUT, filename);

  try {
    const current = JSON.parse(await fs.readFile(file, "utf8"));
    const currentCodes = new Set((current.features || [])
      .map((feature) => String(feature?.properties?.[codeField] || "").trim())
      .filter(Boolean));
    if (!currentCodes.size) return;

    const nextCodes = new Set(nextRows
      .map((feature) => String(feature?.properties?.[codeField] || "").trim())
      .filter(Boolean));
    const missing = [...currentCodes].filter((code) => !nextCodes.has(code));

    if (missing.length) {
      throw new Error(
        `${filename}: hasil BIG kehilangan ${missing.length} kode wilayah yang sudah tersimpan. ` +
        `File lokal tidak ditimpa. Kode hilang: ${missing.slice(0, 20).join(", ")}${missing.length > 20 ? " …" : ""}. ` +
        `Gunakan --allow-shrink hanya bila penghapusan tersebut memang disengaja.`,
      );
    }
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
}

console.log(`BIG boundary sync · Kabupaten Wajo (${WJ})`);
console.log(`Mode: ${apply ? "APPLY" : "DRY RUN"}`);
console.log(`Network: retries=${maxRetries}, timeout=${timeoutMs}ms, page=${pageSize}, ids=${idChunkSize}`);
console.log(`Identity: kode administrasi; shrink protection=${allowShrink ? "OFF (--allow-shrink)" : "ON"}`);

const kecRows = await fetchWajoLayer("kecamatan", "BIG 2026 kecamatan");
const kecMeta = validateKec(kecRows);
console.log(`BIG 2026 kecamatan: ${kecMeta.count} feature valid; ${kecMeta.names.join(", ")}`);

let desaRows = null;
if (includeDesa) {
  desaRows = await fetchWajoLayer("desa", "BIG 2026 desa/kelurahan");
  const desaMeta = validateDesa(desaRows);
  console.log(`BIG 2026 desa/kelurahan: ${desaMeta.count} feature valid; kode Kemendagri: ${desaMeta.uniqueKemendagri}; kode BPS: ${desaMeta.uniqueBps}`);
}

if (!apply) {
  console.log("DRY RUN: tidak ada file lokal yang diganti.");
  console.log("Untuk menerapkan kecamatan + desa/kelurahan: npm run sync:admin:desa");
  process.exit(0);
}

await fs.mkdir(OUT, { recursive: true });
await guardAgainstDataLoss("kecamatan", kecRows);
await guardAgainstDataLoss("desa", desaRows || []);
await fs.writeFile(path.join(OUT, "batas-kecamatan.geojson"), JSON.stringify(toFeatureCollection(kecRows)), "utf8");
console.log("Diperbarui: public/geo-data/batas-kecamatan.geojson");

if (desaRows) {
  await fs.writeFile(path.join(OUT, "batas-desa-kelurahan.geojson"), JSON.stringify(toFeatureCollection(desaRows)), "utf8");
  console.log("Diperbarui: public/geo-data/batas-desa-kelurahan.geojson");
}
