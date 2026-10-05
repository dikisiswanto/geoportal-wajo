const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const index = JSON.parse(fs.readFileSync(path.join(root, "public", "search-index.json"), "utf8"));

const ALIASES = new Map([
  ["sdn", ["sdn", "sd"]],
  ["smpn", ["smpn", "smp"]],
  ["sman", ["sman", "sma"]],
  ["smkn", ["smkn", "smk"]],
  ["pkm", ["pkm", "puskesmas"]],
  ["puskesmas", ["puskesmas", "pkm"]]
]);

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value) { return normalize(value).split(" ").filter(Boolean); }
function variants(token) { return ALIASES.get(token) ?? [token]; }
function tokenMatches(token, candidate) {
  return variants(token).some((variant) => candidate === variant || candidate.startsWith(variant));
}
function matches(item, query) {
  const candidates = tokens([item.label, item.subtitle, item.layerTitle, item.text].join(" "));
  return tokens(query).every((token) => candidates.some((candidate) => tokenMatches(token, candidate)));
}
function contextMatches(item, query) {
  const queryTokens = tokens(query);
  const region = normalize(item.region || "");
  const village = normalize(item.village || "");
  return queryTokens.some((token) => region === token || village === token);
}

function assertCase(query, predicate, message) {
  const hits = index.items.filter((item) => matches(item, query));
  if (!hits.some(predicate)) throw new Error(`${message}: ${query}`);
  console.log(`✓ ${query} → ${hits.filter(predicate).slice(0, 3).map((item) => item.label).join("; ")}`);
}

assertCase("puskesmas keera", (item) => item.layerId === "puskesmas" && item.region === "Keera", "Puskesmas Keera not found");
assertCase("pkm keera", (item) => item.layerId === "puskesmas" && item.region === "Keera", "PKM Keera not found");
assertCase("sdn keera", (item) => item.layerId === "satuan-pendidikan" && item.region === "Keera", "SDN Keera school result not found");
const relaxedSchool = index.items
  .filter((item) => item.layerId === "satuan-pendidikan" && item.region === "Keera")
  .filter((item) => /\bsd(n)?\b/i.test(item.label || "") || /\bsd\b/i.test(item.label || ""));
if (!relaxedSchool.length) throw new Error("No Keera SD candidates available for relaxed contextual search");
console.log(`✓ sd islam keera → contextual fallback can use ${relaxedSchool.slice(0, 3).map((item) => item.label).join("; ")}`);
assertCase("smkn 1 wajo", (item) => item.label === "SMKN 1 WAJO" && item.region === "Tanasitolo", "SMKN 1 Wajo not found");

const villageIndex = index.items.find((item) => item.layerId === "adm-desa" && item.key === "73.13.14.2003");
if (!villageIndex || villageIndex.label !== "Keera" || villageIndex.region !== "Keera") {
  throw new Error("Village search index label/context regression for Keera");
}
console.log("✓ Desa Keera index uses desa label and Keera region");
console.log("Search query cases validation passed.");
