import fs from "node:fs/promises";
import { resolveSearchRegion } from "../lib/geo/searchContext.js";

const index = JSON.parse(await fs.readFile("public/search-index.json", "utf8"));
const items = Array.isArray(index?.items) ? index.items : [];
if (!items.length) throw new Error("Search index kosong");

const smkn = items.find((item) => item.layerId === "satuan-pendidikan" && item.label === "SMKN 1 WAJO");
if (!smkn) throw new Error("SMKN 1 WAJO tidak ditemukan di search index");
if (smkn.regionNames?.length !== 1 || smkn.regionNames[0] !== "Tanasitolo") {
  throw new Error(`Konteks SMKN 1 WAJO salah: ${JSON.stringify(smkn.regionNames)}`);
}
if (smkn.villageNames?.length !== 1 || smkn.villageNames[0] !== "Pakkanna") {
  throw new Error(`Desa SMKN 1 WAJO salah: ${JSON.stringify(smkn.villageNames)}`);
}

const single = resolveSearchRegion({ regionNames: ["Tanasitolo"] });
if (single.region !== "Tanasitolo" || single.ambiguous) {
  throw new Error(`Single-region search context gagal: ${JSON.stringify(single)}`);
}

const ambiguousItem = items.find((item) => Array.isArray(item.regionNames) && item.regionNames.length > 1);
if (ambiguousItem) {
  const ambiguous = resolveSearchRegion({ regionNames: ambiguousItem.regionNames });
  if (ambiguous.region !== "" || !ambiguous.ambiguous) {
    throw new Error(`Multi-region feature tidak di-clear: ${JSON.stringify(ambiguous)}`);
  }
}

const noContext = resolveSearchRegion({});
if (noContext.region !== "") throw new Error("Feature tanpa konteks seharusnya tidak memaksa region");

console.log(`Search context valid: ${items.length.toLocaleString("id-ID")} entries; SMKN 1 Wajo → Tanasitolo / Pakkanna.`);
