"use client";

import { useEffect, useMemo, useState } from "react";
import { IconDatabase, IconLoader2, IconMapPin, IconSearch } from "@tabler/icons-react";
import { layers } from "../../../lib/layers";
import { REGIONS } from "../../../lib/geo/regions";
import { withAssetVersion } from "../../../lib/assetVersion";
import { normalizeRegionName, regionDisplayName } from "../../../lib/geo/region";

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 9;
const MAX_VILLAGE_RESULTS = 3;

let searchIndexPromise;
let regionSearchIndexPromise;

function loadSearchIndex() {
  if (!searchIndexPromise) {
    searchIndexPromise = fetch(withAssetVersion("/search-index.json"), { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .catch((error) => {
        searchIndexPromise = undefined;
        throw error;
      });
  }
  return searchIndexPromise;
}

function loadRegionSearchIndex() {
  if (!regionSearchIndexPromise) {
    regionSearchIndexPromise = fetch(withAssetVersion("/region-search-index.json"), { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .catch((error) => {
        regionSearchIndexPromise = undefined;
        throw error;
      });
  }
  return regionSearchIndexPromise;
}

const QUERY_ALIASES = new Map([
  ["sdn", ["sdn", "sd"]],
  ["sd", ["sd", "sdn"]],
  ["smpn", ["smpn", "smp"]],
  ["smp", ["smp", "smpn"]],
  ["sman", ["sman", "sma"]],
  ["sma", ["sma", "sman"]],
  ["pustu", ["pustu", "puskesmas"]],
  ["klinik", ["klinik", "kesehatan"]],
  ["rsud", ["rsud", "rumah", "sakit"]],
  ["opd", ["opd", "dinas", "badan", "kantor"]],
  ["smkn", ["smkn", "smk"]],
  ["smk", ["smk", "smkn"]],
  ["pkm", ["pkm", "puskesmas"]],
  ["puskesmas", ["puskesmas", "pkm"]],
  ["rs", ["rs", "rumah", "sakit"]],
  ["sekolah", ["sekolah", "sd", "sdn", "smp", "smpn", "sma", "sman", "smk", "smkn", "madrasah", "mi", "mts", "ma", "tk", "paud"]],
  ["kec", ["kec", "kecamatan"]],
  ["camat", ["camat", "kecamatan"]],
  ["kel", ["kel", "kelurahan"]]
]);

const QUERY_PHRASES = [
  ["sekolah dasar", "education"],
  ["sekolah menengah pertama", "education"],
  ["sekolah menengah atas", "education"],
  ["sekolah menengah kejuruan", "education"],
  ["sekolah negeri", "education"],
  ["sekolah islam", "education"],
  ["fasilitas kesehatan", "health"],
  ["layanan kesehatan", "health"],
  ["rumah sakit", "health"],
  ["kantor pemerintah", "government"],
  ["instansi pemerintah", "government"],
  ["jaringan jalan", "transport"],
  ["jalan raya", "transport"],
  ["ruas jalan", "transport"],
  ["badan air", "water"],
  ["sumber daya air", "water"],
  ["peta kontur", "terrain"],
  ["peta topografi", "terrain"],
  ["ketinggian medan", "terrain"],
  ["lahan pertanian", "agriculture"],
  ["jaringan listrik", "infrastructure"],
  ["jaringan telekomunikasi", "infrastructure"]
];

const QUERY_SYNONYMS = new Map([
  ["sekolah", ["sekolah", "sd", "sdn", "smp", "smpn", "sma", "sman", "smk", "smkn", "madrasah", "mi", "mts", "ma", "tk", "paud"]],
  ["dasar", ["sd", "sdn"]],
  ["menengah", ["smp", "smpn", "sma", "sman", "smk", "smkn"]],
  ["pertama", ["smp", "smpn"]],
  ["atas", ["sma", "sman"]],
  ["kejuruan", ["smk", "smkn"]],
  ["madrasah", ["madrasah", "mi", "mts", "ma"]],
  ["islam", ["madrasah", "mi", "mts", "ma"]],
  ["puskesmas", ["puskesmas", "pkm"]],
  ["kesehatan", ["puskesmas", "pkm", "kesehatan", "klinik", "posyandu"]],
  ["fasilitas", ["puskesmas", "rumah sakit", "klinik", "posyandu"]],
  ["jalan", ["jalan", "ruas", "jaringan"]],
  ["jalanraya", ["jalan", "ruas"]],
  ["sungai", ["sungai", "waterway", "saluran"]],
  ["danau", ["danau", "waduk", "perairan"]],
  ["kontur", ["kontur", "topografi", "elevasi"]],
  ["topografi", ["kontur", "topografi", "elevasi"]],
  ["elevasi", ["kontur", "topografi", "elevasi"]],
  ["pertanian", ["pertanian", "sawah", "ladang", "perkebunan"]],
  ["listrik", ["listrik", "energi", "jaringan"]],
  ["telekomunikasi", ["telekomunikasi", "menara", "jaringan"]],
  ["permukiman", ["permukiman", "perumahan", "kawasan"]],
  ["perumahan", ["permukiman", "perumahan"]],
  ["hutan", ["hutan", "kawasan"]],
  ["semak", ["semak", "belukar"]],
  ["belukar", ["semak", "belukar"]],
  ["sawah", ["sawah", "persawahan", "pertanian"]],
  ["persawahan", ["sawah", "persawahan"]],
  ["ladang", ["ladang", "pertanian lahan kering"]],
  ["perkebunan", ["perkebunan", "pertanian"]],
  ["tambak", ["tambak", "perairan"]],
  ["alang", ["alang", "lahan terbuka", "padang"]],
  ["infrastruktur", ["infrastruktur", "prasarana", "sarana", "jaringan"]],
  ["prasarana", ["prasarana", "infrastruktur", "jaringan"]],
  ["sarana", ["sarana", "fasilitas", "infrastruktur"]],
  ["irigasi", ["irigasi", "sumber", "daya", "air"]],
  ["drainase", ["drainase", "saluran", "air"]],
  ["menara", ["menara", "telekomunikasi", "jaringan"]],
  ["energi", ["energi", "listrik", "jaringan"]],
  ["toponimi", ["toponimi", "nama", "tempat"]]
]);

const STOP_WORDS = new Set([
  "di", "ke", "dari", "dan", "yang", "untuk", "dalam", "pada", "ini", "itu", "ada", "cari", "mencari",
  "lihat", "melihat", "tampilkan", "tampilkanlah", "tolong", "mohon", "bisa", "ingin", "mau", "lokasi",
  "dimana", "di mana", "dimanakah", "sekitar", "seputar", "dekat", "deket", "disekitar", "sekitaran",
  "wilayah", "area", "peta", "data", "sumber",
  "nomor", "nama", "tempat", "fasilitas", "terdekat", "terdekatnya", "meter", "mdpl", "mdplnya"
]);

const INTENT_RULES = {
  administration: ["kecamatan", "kec", "desa", "kelurahan", "camat", "wilayah", "batas", "administrasi"],
  education: ["sekolah", "sd", "sdn", "smp", "smpn", "sma", "sman", "smk", "smkn", "madrasah", "mi", "mts", "ma", "tk", "paud", "pendidikan"],
  health: ["puskesmas", "pkm", "kesehatan", "rumah sakit", "rs", "klinik", "posyandu", "apotik", "apotek"],
  government: ["pemerintah", "pemkab", "opd", "dinas", "kantor", "badan", "sekretariat", "camat"],
  transport: ["jalan", "ruas", "jembatan", "kereta", "rel", "transportasi", "terminal", "pelabuhan", "pelayaran"],
  water: ["sungai", "danau", "waduk", "irigasi", "drainase", "saluran", "air", "tanggul", "tambak"],
  terrain: ["kontur", "topografi", "elevasi", "ketinggian", "tinggi", "medan"],
  agriculture: ["pertanian", "sawah", "ladang", "perkebunan", "peternakan", "tambak"],
  landuse: ["tutupan lahan", "penggunaan lahan", "permukiman", "perumahan", "hutan", "semak", "belukar", "alang", "padang", "lahan terbuka", "sawah", "ladang", "perkebunan", "tambak"],
  infrastructure: ["infrastruktur", "prasarana", "telekomunikasi", "energi", "listrik", "jaringan", "menara"]
};

const INTENT_LABELS = {
  administration: "Wilayah",
  education: "Pendidikan",
  health: "Kesehatan",
  government: "Pemerintahan",
  transport: "Transportasi",
  water: "Sumber Daya Air",
  terrain: "Topografi",
  agriculture: "Pertanian",
  landuse: "Tutupan Lahan",
  infrastructure: "Infrastruktur"
};

const LAYER_INTENT_OVERRIDES = {
  jalan: ["transport"],
  "jaringan-transportasi": ["transport"],
  "jaringan-prasarana-lainnya": ["infrastructure"],
  "jaringan-sumber-daya-air": ["water", "infrastructure"],
  "jaringan-telekomunikasi": ["infrastructure"],
  "jaringan-energi": ["infrastructure"],
  kontur: ["terrain"],
  sungai: ["water"],
  danau: ["water", "landuse"],
  tambak: ["water", "agriculture", "landuse"],
  pemukiman: ["landuse"],
  "agri-kebun": ["agriculture", "landuse"],
  "agri-ladang": ["agriculture", "landuse"],
  "agri-sawah": ["agriculture", "landuse"],
  "non-agri-hutan-kering": ["landuse"],
  "non-agri-hutan-basah": ["landuse"],
  "non-agri-semak-belukar": ["landuse"],
  "non-agri-alang": ["landuse"],
  "infra-transportasi": ["transport", "infrastructure"],
  "infra-prasarana-lainnya": ["infrastructure"],
  "infra-sumber-daya-air": ["water", "infrastructure"],
  "infra-telekomunikasi": ["infrastructure"],
  "infra-energi": ["infrastructure"]
};

const INTENT_TOKEN_MAP = new Map();
for (const [intent, terms] of Object.entries(INTENT_RULES)) {
  for (const term of terms) {
    const normalized = normalizeQuery(term);
    if (normalized.includes(" ")) continue;
    INTENT_TOKEN_MAP.set(normalized, [...(INTENT_TOKEN_MAP.get(normalized) || []), intent]);
  }
}


const INTENT_TOKEN_VARIANTS = new Map([
  ["sekolah", ["sekolah", "sd", "sdn", "smp", "smpn", "sma", "sman", "smk", "smkn", "madrasah", "mi", "mts", "ma", "tk", "paud"]],
  ["sd", ["sd", "sdn"]],
  ["sdn", ["sdn", "sd"]],
  ["smp", ["smp", "smpn"]],
  ["smpn", ["smpn", "smp"]],
  ["sma", ["sma", "sman"]],
  ["sman", ["sman", "sma"]],
  ["smk", ["smk", "smkn"]],
  ["smkn", ["smkn", "smk"]],
  ["puskesmas", ["puskesmas", "pkm"]],
  ["pkm", ["pkm", "puskesmas"]],
  ["jalan", ["jalan", "ruas"]],
  ["ruas", ["ruas", "jalan"]],
  ["sungai", ["sungai", "waterway"]],
  ["danau", ["danau", "waduk"]],
  ["kontur", ["kontur", "topografi", "elevasi"]],
  ["topografi", ["topografi", "kontur", "elevasi"]],
  ["elevasi", ["elevasi", "kontur", "topografi"]],
  ["sawah", ["sawah", "persawahan"]],
  ["persawahan", ["persawahan", "sawah"]],
  ["ladang", ["ladang"]],
  ["perkebunan", ["perkebunan"]],
  ["tambak", ["tambak"]],
  ["permukiman", ["permukiman", "perumahan"]],
  ["perumahan", ["perumahan", "permukiman"]],
  ["hutan", ["hutan"]],
  ["semak", ["semak", "belukar"]],
  ["belukar", ["belukar", "semak"]],
  ["telekomunikasi", ["telekomunikasi", "menara"]],
  ["menara", ["menara", "telekomunikasi"]],
  ["energi", ["energi", "listrik"]],
  ["listrik", ["listrik", "energi"]],
  ["jaringan", ["jaringan"]],
  ["infrastruktur", ["infrastruktur", "prasarana", "sarana", "jaringan"]],
  ["prasarana", ["prasarana", "infrastruktur"]],
  ["sarana", ["sarana", "infrastruktur"]],
  ["irigasi", ["irigasi"]],
  ["drainase", ["drainase", "saluran"]]
]);

function intentTokenVariants(token) {
  return INTENT_TOKEN_VARIANTS.get(token) || [token];
}

const preparedItemCache = new WeakMap();

function normalizeQuery(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalizeQuery(value).split(" ").filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function queryVariants(token) {
  return QUERY_ALIASES.get(token) ?? [token];
}

function synonymVariants(token) {
  return unique([token, ...(QUERY_SYNONYMS.get(token) || [])].flatMap((value) => queryVariants(value)));
}

function phraseIntentMatches(normalizedQuery, intent) {
  return QUERY_PHRASES.some(([phrase, mappedIntent]) => mappedIntent === intent && normalizedQuery.includes(phrase));
}


function searchQueryTerms(parsedQuery) {
  if (!parsedQuery.entityTokens.length) return [];
  const expanded = unique(parsedQuery.entityTokens.flatMap((token) => synonymVariants(token)));
  return expanded.filter((token) => token.length > 1);
}

function tokenMatches(token, candidate) {
  if (!token || !candidate) return false;
  if (/^\d+$/.test(token) || /^\d+$/.test(candidate)) return candidate === token;
  if (candidate === token || candidate.startsWith(token)) return true;
  if (token.length >= 3 && candidate.length >= 3) {
    const stem = token.endsWith("n") ? token.slice(0, -1) : token;
    return candidate === stem || candidate.startsWith(stem);
  }
  return false;
}

function editDistanceAtMostOne(a, b) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1 || a.length < 4 || b.length < 4) return false;

  let i = 0;
  let j = 0;
  let differences = 0;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
      continue;
    }

    differences += 1;
    if (differences > 1) return false;

    if (a.length > b.length) i += 1;
    else if (a.length < b.length) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }

  return differences + Math.abs((a.length - i) - (b.length - j)) <= 1;
}

function preparedItem(item) {
  if (!item || typeof item !== "object") return null;
  const cached = preparedItemCache.get(item);
  if (cached) return cached;

  const prepared = {
    label: normalizeQuery(item?.label),
    labelTokens: tokenize(item?.label),
    // Search index tokens are already normalized at build time. Reuse them
    // directly so the first catalog build does not re-normalize thousands of
    // tokens in the browser.
    searchTokens: Array.isArray(item?.searchTokens) && item.searchTokens.length
      ? item.searchTokens
      : tokenize([item?.label, item?.subtitle, item?.layerTitle, item?.text].filter(Boolean).join(" ")),
    regionKeys: [item?.region, ...(item?.regions || [])].map(normalizeRegionName).filter(Boolean),
    villageKeys: [item?.village, ...(item?.villages || [])].map(normalizeRegionName).filter(Boolean)
  };

  preparedItemCache.set(item, prepared);
  return prepared;
}

function buildSearchCatalog(items) {
  const tokenIndex = new Map();
  const phraseIndex = new Map();
  const regionIndex = new Map();
  const villageIndex = new Map();
  const intentIndex = new Map();
  const prepared = items.map((item, index) => {
    const data = preparedItem(item);
    const add = (map, key) => {
      if (!key) return;
      let set = map.get(key);
      if (!set) {
        set = new Set();
        map.set(key, set);
      }
      set.add(index);
    };
    for (const token of data.searchTokens) add(tokenIndex, token);
    add(phraseIndex, data.label);
    for (const region of data.regionKeys) add(regionIndex, region);
    for (const village of data.villageKeys) add(villageIndex, village);
    for (const intent of item.intentTags || []) add(intentIndex, intent);
    return data;
  });
  return { items, prepared, tokenIndex, phraseIndex, regionIndex, villageIndex, intentIndex };
}

function unionInto(target, source) {
  if (!source) return;
  for (const value of source) target.add(value);
}

function candidateIndexes(catalog, parsedQuery) {
  if (!catalog?.items?.length) return [];

  const buildSetFromTokens = (tokens) => {
    const result = new Set();
    for (const token of tokens) {
      const variants = synonymVariants(token);
      for (const variant of variants) unionInto(result, catalog.tokenIndex.get(variant));
    }
    return result;
  };

  const entitySets = parsedQuery.entityTokens
    .map((token) => {
      const indexes = buildSetFromTokens([token]);
      return indexes;
    })
    .filter((set) => set.size);

  const intentCandidates = new Set();
  for (const intent of parsedQuery.intents) unionInto(intentCandidates, catalog.intentIndex.get(intent));
  const intersectSets = (sets) => {
    if (!sets.length) return new Set();
    const result = new Set(sets[0]);
    for (let index = 1; index < sets.length; index += 1) {
      for (const candidate of result) {
        if (!sets[index].has(candidate)) result.delete(candidate);
      }
    }
    return result;
  };
  const directIntentSets = (parsedQuery.intentTokens || [])
    .map((token) => {
      const result = new Set();
      for (const variant of intentTokenVariants(token)) unionInto(result, catalog.tokenIndex.get(variant));
      return result;
    })
    .filter((set) => set.size);
  const exactIntentCandidates = directIntentSets.length
    ? intersectSets(directIntentSets)
    : new Set();
  const intentTermCandidates = exactIntentCandidates.size
    ? exactIntentCandidates
    : buildSetFromTokens(parsedQuery.intentTokens || []);

  const exactNameCandidates = catalog.phraseIndex.get(parsedQuery.normalizedQuery) || new Set();
  if (exactNameCandidates.size) return [...exactNameCandidates];

  const contextCandidates = new Set();
  for (const region of parsedQuery.regions) unionInto(contextCandidates, catalog.regionIndex.get(normalizeRegionName(region)));
  for (const village of parsedQuery.villages) unionInto(contextCandidates, catalog.villageIndex.get(normalizeRegionName(village.name || village)));

  const intersected = (left, right) => {
    if (!left?.size || !right?.size) return new Set();
    const result = new Set();
    const [smaller, larger] = left.size <= right.size ? [left, right] : [right, left];
    for (const value of smaller) if (larger.has(value)) result.add(value);
    return result;
  };

  let entityCandidates = null;
  if (parsedQuery.entityTokens.length && entitySets.length === parsedQuery.entityTokens.length) {
    entityCandidates = new Set(entitySets[0]);
    for (let index = 1; index < entitySets.length; index += 1) {
      for (const candidate of entityCandidates) {
        if (!entitySets[index].has(candidate)) entityCandidates.delete(candidate);
      }
    }
  }

  const entityIntentTerms = entityCandidates?.size && intentTermCandidates.size
    ? intersected(entityCandidates, intentTermCandidates)
    : new Set();
  const contextIntentTerms = contextCandidates.size && intentTermCandidates.size
    ? intersected(contextCandidates, intentTermCandidates)
    : new Set();
  const entityContextIntent = entityCandidates?.size && contextCandidates.size && intentTermCandidates.size
    ? intersected(entityCandidates, contextIntentTerms)
    : new Set();

  // A concrete intent token such as "tambak", "sawah", "energi", or "kontur"
  // is stronger than a broad thematic intent. Prefer its candidates whenever
  // an exact intersection is available; otherwise keep the exact-intent pool
  // and let contextual scoring rank the best region without broadening into
  // unrelated thematic features.
  if (exactIntentCandidates.size) {
    if (entityContextIntent.size) return [...entityContextIntent];
    if (contextIntentTerms.size) return [...contextIntentTerms];
    if (entityIntentTerms.size) return [...entityIntentTerms];
    return [...exactIntentCandidates];
  }

  if (entityContextIntent.size) return [...entityContextIntent];
  if (contextIntentTerms.size && parsedQuery.intents.length) return [...contextIntentTerms];
  if (entityIntentTerms.size) return [...entityIntentTerms];
  if (entityCandidates?.size && intentCandidates.size) {
    const entityIntent = intersected(entityCandidates, intentCandidates);
    if (entityIntent.size) return [...entityIntent];
  }
  if (entityCandidates?.size && contextCandidates.size && intentCandidates.size) {
    const contextIntent = intersected(contextCandidates, intentCandidates);
    if (contextIntent.size) {
      const entityContextIntent = intersected(entityCandidates, contextIntent);
      if (entityContextIntent.size) return [...entityContextIntent];
      return [...contextIntent];
    }
  }

  if (entityCandidates?.size) return [...entityCandidates];
  if (intentTermCandidates.size) return [...intentTermCandidates];
  if (contextCandidates.size && intentCandidates.size) {
    const contextIntent = intersected(contextCandidates, intentCandidates);
    if (contextIntent.size) return [...contextIntent];
  }
  if (intentCandidates.size) return [...intentCandidates];
  if (contextCandidates.size) return [...contextCandidates];

  if (entitySets.length) {
    const union = new Set();
    for (const set of entitySets) unionInto(union, set);
    if (union.size) return [...union];
  }

  return [];
}

function contextValues(item) {
  const prepared = preparedItem(item);
  return [...(prepared?.regionKeys || []), ...(prepared?.villageKeys || [])];
}

function nameMentioned(queryTokens, name) {
  const nameTokens = tokenize(name);
  if (!nameTokens.length) return false;
  return nameTokens.every((nameToken) => queryTokens.some((queryToken) =>
    tokenMatches(queryToken, nameToken) ||
    (nameToken.length >= 4 && editDistanceAtMostOne(queryToken, nameToken))
  ));
}

function mentionedRegionNames(query) {
  const queryTokens = tokenize(query);
  return REGIONS.filter((region) => nameMentioned(queryTokens, region));
}

function mentionedVillageNames(query, regionIndex) {
  const queryTokens = tokenize(query);
  const villages = regionIndex?.villages || [];
  return villages
    .filter((village) => nameMentioned(queryTokens, village.name))
    .slice(0, 8);
}

function parseQuery(query, regionIndex) {
  const rawTokens = tokenize(query);
  const intents = new Set();

  for (const token of rawTokens) {
    const tokenIntents = INTENT_TOKEN_MAP.get(token) || [];
    tokenIntents.forEach((intent) => intents.add(intent));
  }

  const normalizedQuery = normalizeQuery(query);
  for (const [intent, terms] of Object.entries(INTENT_RULES)) {
    if (terms.some((term) => {
      const normalizedTerm = normalizeQuery(term);
      return normalizedTerm.includes(" ") && normalizedQuery.includes(normalizedTerm);
    }) || phraseIntentMatches(normalizedQuery, intent)) {
      intents.add(intent);
    }
  }

  const contextRegions = mentionedRegionNames(normalizedQuery);
  const contextVillages = mentionedVillageNames(normalizedQuery, regionIndex);
  const intentTokens = new Set(rawTokens.filter((token) => INTENT_TOKEN_MAP.has(token)));

  const entityTokens = rawTokens.filter((token) => !STOP_WORDS.has(token) && !intentTokens.has(token));
  const wantsRegion = rawTokens.some((token) => ["kecamatan", "kec", "wilayah", "batas"].includes(token));
  const wantsVillage = rawTokens.some((token) => ["desa", "kelurahan", "kel"].includes(token));

  return {
    normalizedQuery,
    intents: [...intents],
    intentTokens: [...intentTokens],
    regions: contextRegions,
    villages: contextVillages,
    entityTokens,
    wantsRegion,
    wantsVillage
  };
}

function contextMatchesItem(item, queryContexts) {
  const regionTargets = (queryContexts?.regions || []).map(normalizeRegionName);
  const villageTargets = (queryContexts?.villages || []).map((value) => normalizeRegionName(value.name || value));
  if (!regionTargets.length && !villageTargets.length) return false;

  const itemRegions = [item?.region, ...(item?.regions || [])].map(normalizeRegionName).filter(Boolean);
  const itemVillages = [item?.village, ...(item?.villages || [])].map(normalizeRegionName).filter(Boolean);

  return regionTargets.some((region) => itemRegions.includes(region)) ||
    villageTargets.some((village) => itemVillages.includes(village));
}

function itemIntentMatches(item, intents) {
  if (!intents.length) return false;
  if (item?.kind === "region" || item?.layerId === "adm-kecamatan" || item?.layerId === "adm-desa") {
    return intents.includes("administration");
  }
  return (item?.intentTags || []).some((tag) => intents.includes(tag));
}

function inferLayerIntentTags(layer) {
  const haystack = normalizeQuery(`${layer?.id ?? ""} ${layer?.title ?? ""} ${layer?.group ?? ""}`);
  const inferred = Object.entries(INTENT_RULES)
    .filter(([, terms]) => terms.some((term) => {
      const normalizedTerm = normalizeQuery(term);
      return normalizedTerm.includes(" ")
        ? ` ${haystack} `.includes(` ${normalizedTerm} `)
        : tokenize(haystack).includes(normalizedTerm);
    }))
    .map(([intent]) => intent);
  return [...new Set([...(LAYER_INTENT_OVERRIDES[layer?.id] || []), ...inferred])];
}

function strongNameMatch(item, parsedQuery) {
  const label = normalizeQuery(item?.label);
  if (!label) return false;
  if (label === parsedQuery.normalizedQuery || label.includes(parsedQuery.normalizedQuery)) return true;
  const entityTokens = searchQueryTerms(parsedQuery);
  if (!entityTokens.length) return false;
  const labelTokens = tokenize(label);
  return entityTokens.every((token) => queryVariants(token).some((variant) =>
    labelTokens.some((candidate) => tokenMatches(variant, candidate))
  ));
}

function scoreItem(item, parsedQuery, { relaxed = false, contextualOnly = false } = {}) {
  const prepared = preparedItem(item);
  const label = prepared?.label || "";
  const text = normalizeQuery(item?.text);
  const availableTokens = prepared?.searchTokens?.length ? prepared.searchTokens : tokenize(`${label} ${text}`);
  if (!label && !availableTokens.length) return -1;

  const phrase = parsedQuery.normalizedQuery;
  const labelTokens = prepared?.labelTokens || [];
  const contextTokens = contextValues(item);
  const searchTokens = availableTokens;
  const queryEntityTokens = searchQueryTerms(parsedQuery);
  const queryIntentTokens = unique(parsedQuery.intentTokens || [])
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

  const contextualHit = contextMatchesItem(item, parsedQuery);
  const intentHit = itemIntentMatches(item, parsedQuery.intents);
  const layerTitleTokens = tokenize(item?.layerTitle);

  if (contextualOnly && !contextualHit) return -1;

  let score = 0;
  if (label === phrase) score += 190;
  else if (label.startsWith(phrase)) score += 150;
  else if (label.includes(phrase)) score += 128;

  let matchedIntentTokenCount = 0;
  let labelIntentTokenCount = 0;
  for (const token of queryIntentTokens) {
    const variants = intentTokenVariants(token);
    const directLabelMatch = variants.some((variant) => labelTokens.some((candidate) => tokenMatches(variant, candidate)));
    const directSearchMatch = variants.some((variant) => searchTokens.some((candidate) => tokenMatches(variant, candidate)));
    const expandedLabelMatch = variants.some((variant) => labelTokens.some((candidate) => tokenMatches(variant, candidate)));
    const expandedSearchMatch = variants.some((variant) => searchTokens.some((candidate) => tokenMatches(variant, candidate)));

    if (directLabelMatch) {
      matchedIntentTokenCount += 1;
      labelIntentTokenCount += 1;
    } else if (directSearchMatch) {
      matchedIntentTokenCount += 1;
    } else if (expandedLabelMatch || expandedSearchMatch) {
      matchedIntentTokenCount += 1;
    }
  }

  let matchedEntityCount = 0;
  let labelEntityCount = 0;
  let fuzzyEntityCount = 0;

  for (const token of queryEntityTokens) {
    const variants = synonymVariants(token);
    const labelMatch = variants.some((variant) => labelTokens.some((candidate) => tokenMatches(variant, candidate)));
    const searchMatch = variants.some((variant) => searchTokens.some((candidate) => tokenMatches(variant, candidate)));
    const contextMatch = variants.some((variant) => contextTokens.some((candidate) => tokenMatches(variant, candidate)));

    if (labelMatch) {
      labelEntityCount += 1;
      matchedEntityCount += 1;
    } else if (searchMatch || contextMatch) {
      matchedEntityCount += 1;
    } else if (relaxed) {
      const fuzzy = variants.some((variant) =>
        labelTokens.some((candidate) => editDistanceAtMostOne(variant, candidate)) ||
        contextTokens.some((candidate) => editDistanceAtMostOne(variant, candidate))
      );
      if (fuzzy) {
        matchedEntityCount += 1;
        fuzzyEntityCount += 1;
      }
    }
  }

  const strongContextualIntent = contextualHit && intentHit;
  if (queryEntityTokens.length && !relaxed && matchedEntityCount < queryEntityTokens.length && !strongContextualIntent) return -1;
  if (queryEntityTokens.length && relaxed && !matchedEntityCount && !strongContextualIntent) return -1;

  score += matchedIntentTokenCount * 42;
  score += labelIntentTokenCount * 18;
  score += matchedEntityCount * 24;
  score += labelEntityCount * 18;
  score += fuzzyEntityCount * 8;
  if (queryEntityTokens.length && matchedEntityCount === queryEntityTokens.length) score += 24;
  if (queryIntentTokens.length && matchedIntentTokenCount === queryIntentTokens.length) score += 36;
  if (intentHit) score += 38 + Math.min(parsedQuery.intents.length, 3) * 4;
  if (queryIntentTokens.length && labelIntentTokenCount) score += 10;
  if (queryIntentTokens.some((token) => layerTitleTokens.some((candidate) => tokenMatches(token, candidate)))) score += 28;
  if (contextualHit) score += 48;

  if (item?.coverageCount > 1 && contextualHit) score += 8;
  if (parsedQuery.intents.length && intentHit && !item?.layerId?.startsWith("adm-")) score += 6;
  if (item?.layerId === "adm-kecamatan" && parsedQuery.intents.includes("administration")) score += 20;
  if (item?.layerId === "adm-desa" && parsedQuery.intents.includes("administration")) score += 18;

  return score;
}

function regionResult(region, parsedQuery) {
  const normalizedRegion = normalizeQuery(region);
  const phrase = parsedQuery.normalizedQuery;
  const hasThematicIntent = parsedQuery.intents.some((intent) => intent !== "administration");
  let score = hasThematicIntent ? 48 : 96;

  if (normalizedRegion === phrase) score = hasThematicIntent ? 88 : 220;
  else if (normalizedRegion.startsWith(phrase)) score = hasThematicIntent ? 76 : 175;
  else if (normalizedRegion.includes(phrase)) score = hasThematicIntent ? 68 : 150;

  if (parsedQuery.intents.includes("administration")) score += 34;
  if (parsedQuery.regions.some((item) => normalizeRegionName(item) === normalizeRegionName(region))) {
    score += hasThematicIntent ? 8 : 64;
  }

  return {
    id: `region:${region}`,
    kind: "region",
    layerId: "adm-kecamatan",
    label: regionDisplayName(region),
    subtitle: "Kecamatan · Kabupaten Wajo",
    text: region,
    key: region,
    region,
    score
  };
}

function villageResults(query, parsedQuery, regionIndex) {
  const summary = regionIndex || {};
  const villages = summary.villages || [];
  const regionByCode = new Map(
    (summary.regions || []).map((item) => [String(item.code || "").trim(), String(item.name || "").trim()])
  );

  return villages
    .map((village) => {
      const normalizedVillage = normalizeRegionName(village.name);
      const requestedVillages = (parsedQuery.villages || []).map((item) => normalizeRegionName(item.name || item));
      if (parsedQuery.wantsVillage && requestedVillages.length && !requestedVillages.includes(normalizedVillage)) return null;

      const item = {
        kind: "village",
        layerId: "adm-desa",
        label: village.name,
        subtitle: `Desa/Kelurahan · ${regionByCode.get(String(village.kecamatanCode || "").trim()) || "Kabupaten Wajo"}`,
        layerTitle: "Desa/Kelurahan",
        text: `${village.name} ${village.code} ${village.kecamatanCode || ""}`,
        village: village.name,
        region: regionByCode.get(String(village.kecamatanCode || "").trim()) || "",
        searchTokens: tokenize(`${village.name} ${village.code} ${village.kecamatanCode || ""}`),
        intentTags: ["administration"]
      };
      const exactVillage = requestedVillages.includes(normalizedVillage);
      return {
        ...item,
        id: `village:${village.code}`,
        key: village.code,
        score: scoreItem(item, parsedQuery, { relaxed: true }) +
          (parsedQuery.intents.includes("administration") ? 32 : 0) +
          (exactVillage ? 140 : 0)
      };
    })
    .filter(Boolean)
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || String(a.label).localeCompare(String(b.label), "id"))
    .slice(0, MAX_VILLAGE_RESULTS)
    .map((item) => ({ ...item, score: Math.max(120, item.score || 120) }));
}

function resultSubtitle(result) {
  if (result.kind === "region") return result.subtitle;
  if (result.kind === "village") return result.subtitle;

  const intent = (result.intentTags || [])[0];
  const intentLabel = INTENT_LABELS[intent];
  if (result.contextSummary && result.contextSummary !== "Kabupaten Wajo") {
    return intentLabel ? `${result.contextSummary} · ${intentLabel}` : `${result.contextSummary} · ${result.layerTitle || "Data peta"}`;
  }
  return intentLabel || result.layerTitle || "Data peta";
}

export default function MapSearchResults({ query = "", onSelect }) {
  const [index, setIndex] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [regionIndex, setRegionIndex] = useState({ regions: [], villages: [] });

  const normalized = normalizeQuery(query);
  const loading = normalized.length >= MIN_QUERY_LENGTH && !index && !loadError;
  const catalog = useMemo(() => buildSearchCatalog(index || []), [index]);

  const shouldLoadIndexes = normalized.length >= MIN_QUERY_LENGTH && !loadError;

  useEffect(() => {
    if (!shouldLoadIndexes) return undefined;

    let disposed = false;
    loadRegionSearchIndex()
      .then((regionData) => {
        if (disposed) return;
        setRegionIndex({
          regions: Array.isArray(regionData?.regions) ? regionData.regions : [],
          villages: Array.isArray(regionData?.villages) ? regionData.villages : []
        });
      })
      .catch(() => {
        if (!disposed) setRegionIndex({ regions: [], villages: [] });
      });

    loadSearchIndex()
      .then((data) => {
        if (!disposed) setIndex((current) => current || (Array.isArray(data?.items) ? data.items : []));
      })
      .catch(() => {
        if (!disposed) setLoadError(true);
      });

    return () => {
      disposed = true;
    };
  }, [shouldLoadIndexes]);

  const results = useMemo(() => {
    if (normalized.length < MIN_QUERY_LENGTH) return [];

    const parsedQuery = parseQuery(normalized, regionIndex);
    const adminOnlyQuery = parsedQuery.intents.includes("administration") && parsedQuery.entityTokens.length === 0 && !parsedQuery.regions.length && !parsedQuery.villages.length;
    const regionResults = parsedQuery.wantsVillage ? [] : REGIONS
      .filter((region) => {
        const regionName = normalizeRegionName(region);
        const mentioned = parsedQuery.regions.some((item) => normalizeRegionName(item) === regionName);
        const label = normalizeQuery(region);
        return mentioned || (adminOnlyQuery && !parsedQuery.wantsVillage) || (!parsedQuery.intents.length && (label.includes(normalized) || tokenMatches(normalized, label)));
      })
      .map((region) => regionResult(region, parsedQuery));

    const hasThematicIntent = parsedQuery.intents.some((intent) => intent !== "administration");
    const villageItems = hasThematicIntent && !parsedQuery.wantsVillage
      ? []
      : villageResults(normalized, parsedQuery, regionIndex)
      .filter((item) => {
        if (parsedQuery.wantsRegion && !parsedQuery.wantsVillage) return false;
        if (parsedQuery.wantsVillage && parsedQuery.villages.length) {
          return parsedQuery.villages.some((village) => normalizeRegionName(village.name) === normalizeRegionName(item.village));
        }
        return parsedQuery.intents.includes("administration") || !parsedQuery.intents.length || parsedQuery.villages.some((village) => normalizeRegionName(village.name) === normalizeRegionName(item.village));
      });
    const hasContext = parsedQuery.regions.length || parsedQuery.villages.length;

    const candidatePool = candidateIndexes(catalog, parsedQuery);
    const isFeatureEligible = (item) => {
      const isKecamatan = item.layerId === "adm-kecamatan";
      const isDesa = item.layerId === "adm-desa";
      const hasThematicIntent = parsedQuery.intents.some((intent) => intent !== "administration");

      if (parsedQuery.wantsRegion) return isKecamatan;
      if (parsedQuery.wantsVillage) return isDesa;
      if (hasThematicIntent) return !isKecamatan && !isDesa;
      return true;
    };

    const strictFeatureResults = candidatePool
      .map((candidateIndex) => catalog.items[candidateIndex])
      .filter(isFeatureEligible)
      .map((item) => ({
        item,
        score: scoreItem(item, parsedQuery)
      }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score || String(a.item.label).localeCompare(String(b.item.label), "id"));

    const contextualStrictResults = hasContext
      ? strictFeatureResults.filter(({ item }) => contextMatchesItem(item, parsedQuery) || strongNameMatch(item, parsedQuery))
      : [];

    let relaxedFeatureResults = [];
    let contextualRelaxedResults = [];

    if (!strictFeatureResults.length || (hasContext && !contextualStrictResults.length)) {
      relaxedFeatureResults = candidatePool
        .map((candidateIndex) => catalog.items[candidateIndex])
        .filter(isFeatureEligible)
        .map((item) => ({
          item,
          score: scoreItem(item, parsedQuery, { relaxed: true })
        }))
        .filter(({ score }) => score >= 0)
        .sort((a, b) => b.score - a.score || String(a.item.label).localeCompare(String(b.item.label), "id"));

      contextualRelaxedResults = hasContext
        ? relaxedFeatureResults.filter(({ item }) => contextMatchesItem(item, parsedQuery) || strongNameMatch(item, parsedQuery))
        : [];
    }

    const source = contextualStrictResults.length
      ? contextualStrictResults
      : hasContext && contextualRelaxedResults.length
        ? contextualRelaxedResults
        : strictFeatureResults.length
          ? strictFeatureResults
          : relaxedFeatureResults;

    const featureResults = source.map(({ item, score }) => ({
      ...item,
      kind: item.layerId === "adm-kecamatan" ? "region" : item.layerId === "adm-desa" ? "village" : "feature",
      label: item.layerId === "adm-kecamatan" ? regionDisplayName(item.label) : item.label,
      subtitle: resultSubtitle(item),
      score
    }));

    const layerResults = (parsedQuery.wantsRegion || parsedQuery.wantsVillage)
      ? []
      : layers
      .map((layer) => {
        const intentTags = inferLayerIntentTags(layer);
        const layerText = normalizeQuery(`${layer.id} ${layer.title} ${layer.group}`);
        const layerTokens = tokenize(layerText);
        const intentTokenMatches = (parsedQuery.intentTokens || []).filter((token) => {
          const variants = intentTokenVariants(token);
          return variants.some((variant) => layerTokens.some((candidate) => tokenMatches(variant, candidate)));
        }).length;
        const entityMatches = (parsedQuery.entityTokens || []).filter((token) => {
          const variants = intentTokenVariants(token);
          return variants.some((variant) => layerTokens.some((candidate) => tokenMatches(variant, candidate)));
        }).length;
        const intentMatch = parsedQuery.intents.some((intent) => intentTags.includes(intent));
        const item = {
          layerTitle: layer.title,
          group: layer.group,
          label: layer.title,
          text: layerText,
          intentTags,
          searchTokens: layerTokens
        };
        let score = scoreItem(item, parsedQuery, { relaxed: true });
        if (score < 0) score = 0;
        if (intentMatch) score += 48;
        score += intentTokenMatches * 72;
        score += entityMatches * 34;
        if (parsedQuery.intents.includes("terrain") && layer.id === "kontur") score += 44;
        if (intentTokenMatches === (parsedQuery.intentTokens || []).length && intentTokenMatches > 0) score += 54;
        if (parsedQuery.regions.length && intentTokenMatches) score += 12;
        return { layer, score, intentTags };
      })
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score || a.layer.title.localeCompare(b.layer.title, "id"))
      .slice(0, 4)
      .map(({ layer, score, intentTags }) => ({
        id: `layer:${layer.id}`,
        kind: "layer",
        layerId: layer.id,
        label: layer.title,
        subtitle: parsedQuery.regions.length ? `${layer.group} · ${parsedQuery.regions[0]}` : layer.group,
        text: `${layer.title} ${layer.group} ${layer.description ?? ""}`,
        intentTags,
        region: parsedQuery.regions.length === 1 ? parsedQuery.regions[0] : "",
        score: Math.max(50, score)
      }));

    const resultKindPriority = (item) => {
      if (hasThematicIntent) {
        if (item.kind === "feature" || item.kind === "layer") return 3;
        if (item.kind === "region" || item.kind === "village") return 1;
      }
      if (parsedQuery.wantsRegion && item.kind === "region") return 4;
      if (parsedQuery.wantsVillage && item.kind === "village") return 4;
      return item.kind === "feature" ? 2 : 1;
    };

    const merged = [...regionResults, ...villageItems, ...featureResults, ...layerResults]
      .sort((a, b) => {
        const scoreDelta = (b.scoreBoost ?? b.score ?? 0) - (a.scoreBoost ?? a.score ?? 0);
        if (scoreDelta) return scoreDelta;
        return resultKindPriority(b) - resultKindPriority(a) || String(a.label).localeCompare(String(b.label), "id");
      });

    const seen = new Set();
    return merged
      .filter((item) => {
        const key = `${item.kind}:${item.layerId}:${item.key ?? item.label}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, MAX_RESULTS);
  }, [catalog, normalized, regionIndex]);

  if (normalized.length < MIN_QUERY_LENGTH) return null;

  return (
    <div id="geoportal-search-results" className="map-search-popover absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg" role="listbox" aria-label="Hasil pencarian peta">
      {loading && !index && !results.length && (
        <div className="flex items-center gap-2 px-3 py-3 map-text-compact text-slate-500">
          <IconLoader2 size={15} className="animate-spin" aria-hidden="true" />
          Mencari lokasi dan data…
        </div>
      )}

      {!loading && loadError && (
        <div className="px-3 py-3 map-text-compact text-slate-500">Pencarian belum tersedia. Coba lagi beberapa saat.</div>
      )}

      {!loading && !loadError && !results.length && (
        <div className="flex items-start gap-2 px-3 py-3">
          <IconSearch size={15} className="mt-0.5 text-slate-400" aria-hidden="true" />
          <div>
            <p className="map-text-compact font-medium text-slate-800">Belum ditemukan</p>
            <p className="mt-0.5 map-text-micro text-slate-500">Coba nama tempat, kecamatan, desa, fasilitas, jalan, atau jenis data.</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="max-h-[min(60dvh,420px)] overflow-y-auto py-1">
          {results.map((result) => {
            const isArea = result.kind === "region" || result.kind === "village";
            return (
              <button
                key={result.id}
                type="button"
                role="option"
                onClick={() => onSelect?.(result)}
                className="ui-micro-interaction flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-700"
              >
                <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-md ${isArea ? "bg-slate-100 text-slate-600" : result.kind === "layer" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"}`}>
                  {isArea ? <IconMapPin size={14} aria-hidden="true" /> : result.kind === "layer" ? <IconDatabase size={14} aria-hidden="true" /> : <IconSearch size={14} aria-hidden="true" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate map-text-compact font-semibold text-slate-800">{result.label}</span>
                  <span className="mt-0.5 block truncate map-text-micro text-slate-500">{result.subtitle || result.layerTitle || "Data peta"}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
