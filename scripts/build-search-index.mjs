import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { layers } from "../lib/layers.js";
import { featureKey } from "../lib/geo/format.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "public", "geo-data");
const outputPath = path.join(dataDir, "../search-index.json");

const GENERIC = new Set(["", "tidak ada", "tidak tersedia", "belum ada", "n/a", "na", "none", "null", "undefined", "-", "—", "/"]);
const PRIORITY_FIELDS = [
  "NAMA_RUAS", "NAMA_OPD", "PUSKESMAS", "nama_sekolah", "NAMOBJ", "POTENSI", "PETERNAKAN",
  "Desa", "Kecamatan", "DESA", "KECAMATAN", "REMARK"
];

function meaningful(value) {
  const text = String(value ?? "").trim();
  return Boolean(text) && !GENERIC.has(text.toLowerCase());
}

function firstMeaningful(properties, keys) {
  for (const key of keys) {
    const value = properties?.[key];
    if (meaningful(value)) return String(value).trim();
  }
  return "";
}

function contextLabel(properties) {
  const desa = firstMeaningful(properties, ["Desa", "WADMKD", "nama_desa", "DESA"]);
  const kecamatan = firstMeaningful(properties, ["Kecamatan", "WADMKC", "nama_kecamatan", "KECAMATAN"]);
  if (desa && kecamatan) return `${desa} · ${kecamatan}`;
  return kecamatan || desa || "Kabupaten Wajo";
}

function featureType(layer) {
  const geometry = String(layer?.geometry ?? "").toLowerCase();
  if (geometry.includes("point")) return "point";
  if (geometry.includes("line")) return "line";
  if (geometry.includes("polygon")) return "polygon";
  return "other";
}

const searchableLayers = new Map(layers.map((layer) => [layer.file, layer]));
const items = [];
const seen = new Set();

for (const [file, layer] of searchableLayers) {
  if (!layer?.file) continue;
  const filePath = path.join(dataDir, file);
  let data;
  try {
    data = JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    continue;
  }

  const type = featureType(layer);
  for (let index = 0; index < (data.features?.length ?? 0); index += 1) {
    const feature = data.features[index];
    const properties = feature?.properties ?? {};
    const label = firstMeaningful(properties, PRIORITY_FIELDS);
    if (!label) continue;

    const specificForSearch = firstMeaningful(properties, [
      "NAMA_RUAS", "NAMA_OPD", "PUSKESMAS", "nama_sekolah", "NAMOBJ", "POTENSI", "PETERNAKAN"
    ]);
    const admin = featureType(layer) === "polygon" && layer.id?.startsWith("adm-")
      ? firstMeaningful(properties, ["Kecamatan", "Desa", "nama_kecamatan", "nama_desa", "NAMOBJ"])
      : "";

    const key = featureKey(layer, feature);
    if (key == null) continue;

    const dedupeKey = `${layer.id}|${String(key).toLowerCase()}|${label.toLowerCase()}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    // Avoid filling the search index with generic land-cover records. Named
    // polygons, points, networks, and administrative boundaries remain searchable.
    const includeGenericPolygon = type === "polygon" && !layer.id?.startsWith("adm-")
      ? meaningful(specificForSearch) && !["tidak ada", "belum ada"].includes(label.toLowerCase())
      : true;
    if (!includeGenericPolygon) continue;

    const searchText = [
      layer.title,
      layer.group,
      label,
      specificForSearch,
      contextLabel(properties),
      ...PRIORITY_FIELDS.map((field) => properties[field])
    ].filter(meaningful).join(" ");

    items.push({
      id: `${layer.id}:${String(key)}:${index}`,
      layerId: layer.id,
      layerTitle: layer.title,
      group: layer.group,
      type,
      key: String(key),
      label: admin || label,
      subtitle: contextLabel(properties),
      region: firstMeaningful(properties, ["Kecamatan", "WADMKC", "nama_kecamatan", "KECAMATAN"]),
      village: firstMeaningful(properties, ["Desa", "WADMKD", "nama_desa", "DESA"]),
      text: searchText
    });
  }
}

const payload = {
  version: 1,
  items
};
await fs.writeFile(outputPath, `${JSON.stringify(payload)}\n`);
console.log(`Search index: ${items.length.toLocaleString("id-ID")} entries → ${path.relative(root, outputPath)}`);
