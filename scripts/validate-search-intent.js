const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { REGIONS, REGION_SUMMARY } = require("../lib/geo/regionSummary.js");
const { layers } = require("../lib/layers.js");
const { normalizeRegionName, regionDisplayName } = require("../lib/geo/region.js");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "components", "geoportal", "search", "MapSearchResults.jsx"), "utf8");
const cut = source.indexOf("export default function MapSearchResults");
if (cut < 0) throw new Error("Search component structure changed: helper export boundary not found");

const helperSource = `${source.slice(source.indexOf("const MIN_QUERY_LENGTH"), cut)}\nmodule.exports = { parseQuery, scoreItem, contextMatchesItem, strongNameMatch, buildSearchCatalog, candidateIndexes, regionResult, villageResults, inferLayerIntentTags, intentTokenVariants, synonymVariants, tokenMatches };`;
const sandbox = {
  module: { exports: {} },
  exports: {},
  REGIONS,
  REGION_SUMMARY,
  normalizeRegionName,
  regionDisplayName,
  console
};
vm.runInNewContext(helperSource, sandbox, { filename: "MapSearchResults.search-helpers.js" });
const search = sandbox.module.exports;
const index = JSON.parse(fs.readFileSync(path.join(root, "public", "search-index.json"), "utf8"));

const catalog = sandbox.module.exports.buildSearchCatalog(index.items);

function rank(query) {
  const parsed = search.parseQuery(query);
  const hasContext = parsed.regions.length || parsed.villages.length;
  const pool = search.candidateIndexes(catalog, parsed);
  const hasThematicIntent = parsed.intents.some((intent) => intent !== "administration");
  const isFeatureEligible = (item) => {
    const isKecamatan = item.layerId === "adm-kecamatan";
    const isDesa = item.layerId === "adm-desa";
    if (parsed.wantsRegion) return isKecamatan;
    if (parsed.wantsVillage) return isDesa;
    if (hasThematicIntent) return !isKecamatan && !isDesa;
    return true;
  };

  const strict = pool
    .map((candidateIndex) => catalog.items[candidateIndex])
    .filter(isFeatureEligible)
    .map((item) => ({ item, score: search.scoreItem(item, parsed) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score || String(a.item.label).localeCompare(String(b.item.label), "id"));

  const contextualStrict = hasContext
    ? strict.filter(({ item }) => search.contextMatchesItem(item, parsed) || search.strongNameMatch(item, parsed))
    : [];

  const relaxed = (!strict.length || (hasContext && !contextualStrict.length))
    ? pool
      .map((candidateIndex) => catalog.items[candidateIndex])
      .filter(isFeatureEligible)
      .map((item) => ({ item, score: search.scoreItem(item, parsed, { relaxed: true }) }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score || String(a.item.label).localeCompare(String(b.item.label), "id"))
    : [];

  const contextualRelaxed = hasContext
    ? relaxed.filter(({ item }) => search.contextMatchesItem(item, parsed) || search.strongNameMatch(item, parsed))
    : [];

  const source = contextualStrict.length
    ? contextualStrict
    : contextualRelaxed.length
      ? contextualRelaxed
      : strict.length
        ? strict
        : relaxed;

  const featureResults = source.map(({ item, score }) => ({
    ...item,
    kind: item.layerId === "adm-kecamatan" ? "region" : item.layerId === "adm-desa" ? "village" : "feature",
    score
  }));

  const regionResults = parsed.wantsVillage ? [] : REGIONS
    .filter((region) => {
      const regionName = normalizeRegionName(region);
      const mentioned = parsed.regions.some((item) => normalizeRegionName(item) === regionName);
      const label = String(region ?? "").trim().toLowerCase();
      const adminOnly = parsed.intents.includes("administration") && parsed.entityTokens.length === 0 && !parsed.regions.length && !parsed.villages.length;
      return mentioned || (adminOnly && !parsed.wantsVillage) || (!parsed.intents.length && (label.includes(parsed.normalizedQuery) || search.tokenMatches(parsed.normalizedQuery, label)));
    })
    .map((region) => search.regionResult(region, parsed));

  const villageItems = hasThematicIntent && !parsed.wantsVillage
    ? []
    : search.villageResults(query, parsed).filter((item) => {
      if (parsed.wantsRegion && !parsed.wantsVillage) return false;
      if (parsed.wantsVillage && parsed.villages.length) return parsed.villages.some((village) => normalizeRegionName(village.name) === normalizeRegionName(item.village));
      return parsed.intents.includes("administration") || !parsed.intents.length || parsed.villages.some((village) => normalizeRegionName(village.name) === normalizeRegionName(item.village));
    });

  const layerResults = (parsed.wantsRegion || parsed.wantsVillage) ? [] : layers
    .map((layer) => {
      const intentTags = search.inferLayerIntentTags(layer);
      const layerText = String(`${layer.id} ${layer.title} ${layer.group}`).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      const layerTokens = layerText.split(" ").filter(Boolean);
      const intentTokenMatches = (parsed.intentTokens || []).filter((token) => {
        const variants = search.intentTokenVariants(token);
        return variants.some((variant) => layerTokens.some((candidate) => search.tokenMatches(variant, candidate)));
      }).length;
      const entityMatches = (parsed.entityTokens || []).filter((token) => {
        const variants = search.synonymVariants(token);
        return variants.some((variant) => layerTokens.some((candidate) => search.tokenMatches(variant, candidate)));
      }).length;
      const intentMatch = parsed.intents.some((intent) => intentTags.includes(intent));
      const item = {
        layerTitle: layer.title,
        group: layer.group,
        label: layer.title,
        text: layerText,
        intentTags,
        searchTokens: layerTokens
      };
      let score = search.scoreItem(item, parsed, { relaxed: true });
      if (score < 0) score = 0;
      if (intentMatch) score += 48;
      score += intentTokenMatches * 72;
      score += entityMatches * 34;
      if (parsed.intents.includes("terrain") && layer.id === "kontur") score += 44;
      if (intentTokenMatches === (parsed.intentTokens || []).length && intentTokenMatches > 0) score += 54;
      if (parsed.regions.length && intentTokenMatches) score += 12;
      return { id: `layer:${layer.id}`, kind: "layer", layerId: layer.id, label: layer.title, subtitle: parsed.regions.length ? `${layer.group} · ${parsed.regions[0]}` : layer.group, text: item.text, intentTags, region: parsed.regions.length === 1 ? parsed.regions[0] : "", score };
    })
    .filter(({ score }) => score >= 0)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label, "id"))
    .slice(0, 4);


  const resultKindPriority = (item) => {
    if (hasThematicIntent) {
      if (item.kind === "feature" || item.kind === "layer") return 3;
      if (item.kind === "region" || item.kind === "village") return 1;
    }
    if (parsed.wantsRegion && item.kind === "region") return 4;
    if (parsed.wantsVillage && item.kind === "village") return 4;
    return item.kind === "feature" ? 2 : 1;
  };

  const merged = [...regionResults, ...villageItems, ...featureResults, ...layerResults]
    .sort((a, b) => b.score - a.score || resultKindPriority(b) - resultKindPriority(a));
  const seen = new Set();
  return { parsed, candidateCount: pool.length, results: merged.filter((item) => { const key = `${item.kind}:${item.layerId}:${item.key ?? item.label}`; if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, 10) };
}

function assertTop(query, predicate, message) {
  const result = rank(query);
  if (!result.results.some(predicate)) {
    throw new Error(`${message}: ${query}\n${result.results.slice(0, 5).map((item) => `${item.label} [${item.layerId}]`).join("; ")}`);
  }
  console.log(`✓ ${query} → ${result.results.filter(predicate).slice(0, 3).map((item) => item.label).join("; ")}`);
}

function assertFirst(query, predicate, message) {
  const result = rank(query);
  const first = result.results[0];
  if (!first || !predicate(first)) {
    throw new Error(`${message}: ${query}\nFirst: ${first ? `${first.label} [${first.layerId}]` : "(none)"}`);
  }
  console.log(`✓ top ${query} → ${first.label}`);
}

const cases = [
  ["kecamatan keera", (item) => item.layerId === "adm-kecamatan" && normalizeRegionName(item.region || String(item.label).replace(/^kecamatan\s+/i, "")) === "keera", "Kecamatan context failed"],
  ["desa keera", (item) => item.layerId === "adm-desa" && item.label === "Keera" && item.region === "Keera", "Desa context failed"],
  ["sekolah di keera", (item) => item.layerId === "satuan-pendidikan" && item.region === "Keera" && (item.intentTags || []).includes("education"), "Education context failed"],
  ["puskesmas di keera", (item) => item.layerId === "puskesmas" && item.region === "Keera", "Health context failed"],
  ["jalan sekitar tempe", (item) => item.layerId === "jalan" && (item.regions || [item.region]).some((region) => normalizeRegionName(region) === "tempe"), "Road context failed"],
  ["kontur di tanasitolo", (item) => item.layerId === "kontur" || (item.layerId === "adm-kecamatan" && item.region === "Tanasitolo"), "Contour intent/context failed"],
  ["danau tempe", (item) => item.label === "Danau Tempe" && item.layerId === "toponimi", "Exact named feature should survive context ambiguity"],
  ["smkn 1 wajo", (item) => item.label === "SMKN 1 WAJO" && item.region === "Tanasitolo", "Exact school failed"],
  ["sd islam keera", (item) => item.layerId === "satuan-pendidikan" && item.region === "Keera", "Relaxed education context failed"],
  ["sekolah dasar keera", (item) => item.layerId === "satuan-pendidikan" && item.region === "Keera", "Semantic school intent failed"],
  ["fasilitas kesehatan keera", (item) => item.layerId === "puskesmas" && item.region === "Keera", "Semantic health intent failed"],
  ["kantor pemerintah keera", (item) => item.intentTags?.includes("government") && item.region === "Keera", "Government intent/context failed"],
  ["cari kontur di tanasitolo", (item) => item.layerId === "kontur", "Conversational contour intent failed"],
  ["jalan dekat tempe", (item) => item.layerId === "jalan" && (item.regions || [item.region]).some((region) => normalizeRegionName(region) === "tempe"), "Near-road context failed"]
];

for (const [query, predicate, message] of cases) assertTop(query, predicate, message);
assertFirst("kecamatan keera", (item) => item.layerId === "adm-kecamatan" && normalizeRegionName(item.region || "") === "keera", "Kecamatan should rank first");
assertFirst("desa keera", (item) => item.layerId === "adm-desa" && item.label === "Keera", "Desa should rank first");
assertFirst("sekolah dasar keera", (item) => item.layerId === "satuan-pendidikan" && item.region === "Keera", "School semantic query should rank first");
assertFirst("fasilitas kesehatan keera", (item) => item.layerId === "puskesmas" && item.region === "Keera", "Health semantic query should rank first");
assertFirst("sekolah di keera", (item) => item.layerId === "satuan-pendidikan" && item.region === "Keera", "School should outrank generic education layer");
assertFirst("puskesmas keera", (item) => item.layerId === "puskesmas" && item.region === "Keera", "Puskesmas should outrank generic health layer");
assertFirst("kontur di tanasitolo", (item) => item.layerId === "kontur", "Contour layer should rank first for contour intent");
assertFirst("danau tempe", (item) => item.label === "Danau Tempe" && item.layerId === "toponimi", "Exact named feature should rank first");

let coveredLayers = 0;
for (const layer of layers.filter((item) => !item.id.startsWith("adm-"))) {
  const query = String(layer.title || layer.id || "").trim().toLowerCase();
  if (query.length < 2) continue;
  const result = rank(query);
  const visible = result.results.some((item) => item.layerId === layer.id || item.id === `layer:${layer.id}`);
  if (!visible) {
    throw new Error(`Layer search coverage failed: ${layer.id} (${layer.title})`);
  }
  coveredLayers += 1;
}
const thematicLayerCount = layers.filter((item) => !item.id.startsWith("adm-")).length;
console.log(`✓ all thematic layer titles are searchable (${coveredLayers}/${thematicLayerCount})`);

assertTop("sawah di tanasitolo", (item) => item.layerId === "agri-sawah" && item.region === "Tanasitolo", "Rice polygon context failed");
assertTop("permukiman di tempe", (item) => item.layerId === "pemukiman" && item.region === "Tempe", "Settlement polygon context failed");
assertTop("tambak belawa", (item) => (item.layerId === "tambak" && item.region === "Belawa") || (item.kind === "layer" && item.layerId === "tambak"), "Pond polygon intent/context failed");
assertTop("sungai di keera", (item) => item.layerId === "sungai" && item.region === "Keera", "River context failed");
assertTop("kontur 100 tanasitolo", (item) => item.layerId === "kontur" && item.region === "Tanasitolo", "Contour elevation context failed");
assertTop("jaringan energi keera", (item) => item.layerId === "jaringan-energi" && item.region === "Keera", "Energy network context failed");
assertTop("sarana telekomunikasi keera", (item) => item.layerId === "infra-telekomunikasi" && item.region === "Keera", "Telecom infrastructure context failed");

const timing = process.hrtime.bigint();
let lastCandidateCount = 0;
for (let i = 0; i < 100; i += 1) lastCandidateCount = rank("sekolah di keera").candidateCount;
const elapsed = Number(process.hrtime.bigint() - timing) / 1e6;
console.log(`Search intent benchmark: ${((elapsed / 100)).toFixed(3)} ms/query over ${index.items.length.toLocaleString("id-ID")} entries (${lastCandidateCount.toLocaleString("id-ID")} candidates).`);
console.log(`Search intent validation passed: ${cases.length} checks.`);
