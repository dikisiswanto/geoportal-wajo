const fs = require("node:fs/promises");
const path = require("node:path");

const { layers } = require("../lib/layers.js");

const root = path.resolve(__dirname, "..");
const reportPath = path.join(root, "DATA_QUALITY_REPORT.json");
const outputPath = path.join(root, "public", "data-quality.json");

function scoreDataset(dataset) {
  const total = Math.max(1, Number(dataset.features) || 1);
  const invalid = Number(dataset.invalid_geometry || 0) + Number(dataset.empty_geometry || 0) + Number(dataset.null_geometry || 0);
  const outside = Number(dataset.point_or_representative_outside_local_mask || 0);
  let score = 100;

  if (invalid > 0) score -= Math.min(45, (invalid / total) * 100);
  if (outside > 0) score -= Math.min(18, (outside / total) * 70);

  return Math.max(0, Math.round(score));
}

function qualityStatus(dataset, score) {
  const invalid = Number(dataset.invalid_geometry || 0) + Number(dataset.empty_geometry || 0) + Number(dataset.null_geometry || 0);
  if (invalid > 0) return "Perlu perbaikan";
  if (score < 95) return "Perlu tinjauan";
  return "Lulus pemeriksaan";
}

async function main() {
  const report = JSON.parse(await fs.readFile(reportPath, "utf8"));
  const layerByFile = new Map(layers.map((layer) => [layer.file, layer]));

  const datasets = (report.datasets || []).map((dataset) => {
    const layer = layerByFile.get(dataset.dataset);
    const score = scoreDataset(dataset);
    return {
      dataset: dataset.dataset,
      title: layer?.title || dataset.dataset,
      group: layer?.group || "Peta Tematik",
      features: Number(dataset.features || 0),
      geometryTypes: dataset.geometry_types || {},
      invalidGeometry: Number(dataset.invalid_geometry || 0),
      emptyGeometry: Number(dataset.empty_geometry || 0),
      nullGeometry: Number(dataset.null_geometry || 0),
      outsideCandidates: Number(dataset.point_or_representative_outside_local_mask || 0),
      status: qualityStatus(dataset, score),
      score,
      note: dataset.note || "",
      source: layer?.source || "Belum dicantumkan",
      sourceType: layer?.sourceType || "Belum dicantumkan",
      dataYear: layer?.dataYear || null,
      latestReferenceUrl: layer?.latestReferenceUrl || null,
      latestMetadataUrl: layer?.latestMetadataUrl || null,
      validationDate: report.validation_date || null,
      validationMethod: "Pemeriksaan struktur GeoJSON, geometri, kelengkapan, posisi representatif, dan konsistensi wilayah."
    };
  });

  const payload = {
    version: 1,
    generatedAt: report.validation_timestamp || report.validation_date || null,
    validationDate: report.validation_date || null,
    summary: report.summary || "",
    methodology: [
      "Status geometri dihitung dari pemeriksaan GeoJSON yang tersimpan pada laporan QA.",
      "Kandidat di luar batas lokal tidak otomatis dianggap salah karena objek tematik dapat melintasi batas administratif.",
      "Skor QA adalah indikator pemeriksaan internal, bukan tingkat kebenaran absolut terhadap sumber eksternal."
    ],
    datasets
  };

  await fs.writeFile(outputPath, `${JSON.stringify(payload)}\n`);
  console.log(`Data quality: ${datasets.length} dataset → ${path.relative(root, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
