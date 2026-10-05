const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const index = JSON.parse(fs.readFileSync(path.join(root, "public", "search-index.json"), "utf8"));

const items = Array.isArray(index.items) ? index.items : [];
const find = (label) => items.find((item) => String(item.label).trim().toLowerCase() === label.toLowerCase());

const checks = [];
const smkn = find("SMKN 1 WAJO");
checks.push(["search index exists", items.length >= 9000]);
checks.push(["SMKN 1 Wajo is indexed", Boolean(smkn)]);
checks.push(["SMKN 1 Wajo has region code", smkn?.regionCodes?.includes("73.13.08")]);
checks.push(["SMKN 1 Wajo resolves to Tanasitolo", smkn?.region === "Tanasitolo"]);
checks.push(["feature entries expose coverage context", items.every((item) => Array.isArray(item.regions) && Array.isArray(item.regionCodes))]);
checks.push(["search index format is v2", index.version === 2]);

const failed = checks.filter(([, ok]) => !ok);
checks.forEach(([label, ok]) => console.log(`${ok ? "✓" : "✗"} ${label}`));
if (failed.length) process.exit(1);
console.log(`Search index validation passed: ${checks.length} checks.`);
