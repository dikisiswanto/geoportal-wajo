export const SITE_NAME = "Peta Interaktif Kabupaten Wajo";
export const PUBLISHER_NAME = "Diskominfotik Kabupaten Wajo";
export const SOCIAL_IMAGE = "/seo/geoportal-wajo-og.png";

export const DEFAULT_DESCRIPTION =
  "Geoportal resmi Kabupaten Wajo untuk menjelajahi peta administrasi, jaringan, fasilitas publik, pendidikan, kesehatan, serta data potensi wilayah secara interaktif.";

export const SITE_KEYWORDS = [
  "Peta Interaktif Kabupaten Wajo",
  "Geoportal Kabupaten Wajo",
  "Geoportal Wajo",
  "Peta Kabupaten Wajo",
  "Peta Digital Wajo",
  "Data Geospasial Kabupaten Wajo",
  "GIS Kabupaten Wajo",
  "Peta Administrasi Wajo",
  "Peta Kecamatan Wajo",
  "Peta Desa Kabupaten Wajo",
  "Peta Jaringan Jalan Wajo",
  "Peta Fasilitas Publik Wajo"
];

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}

export function absoluteUrl(pathname = "/") {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${path}`;
}

export function slugify(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function datasetSlug(layer) {
  return layer?.slug || slugify(layer?.title || layer?.id);
}

export function datasetUrl(layer) {
  return absoluteUrl(`/data/${datasetSlug(layer)}`);
}

export function buildDatasetDescription(layer) {
  const geometry = layer.geometry ? ` Tipe geometri: ${layer.geometry}.` : "";
  const year = layer.dataYear ? ` Tahun data: ${layer.dataYear}.` : "";
  const source = layer.source ? ` Sumber: ${layer.source}.` : "";
  return `${layer.description || `Data ${layer.title} Kabupaten Wajo.`}${geometry}${year}${source}`;
}

const DATASET_SEO = {
  "batas-administrasi": {
    title: "Peta Batas Administrasi Kabupaten Wajo",
    description: "Peta batas administrasi Kabupaten Wajo untuk melihat wilayah administratif dan garis batas kabupaten."
  },
  "adm-kecamatan": {
    title: "Peta Batas Kecamatan Kabupaten Wajo",
    description: "Peta batas kecamatan Kabupaten Wajo untuk melihat pembagian wilayah kecamatan secara interaktif."
  },
  jalan: {
    title: "Peta Jaringan Jalan Kabupaten Wajo",
    description: "Peta jaringan jalan Kabupaten Wajo untuk melihat ruas dan klasifikasi jaringan jalan pada wilayah Wajo."
  },
  "jaringan-transportasi": {
    title: "Peta Sistem Jaringan Transportasi Kabupaten Wajo",
    description: "Peta sistem jaringan transportasi Kabupaten Wajo yang menyajikan jaringan transportasi pada wilayah kabupaten."
  },
  "jaringan-prasarana-lainnya": {
    title: "Peta Jaringan Prasarana Kabupaten Wajo",
    description: "Peta sistem jaringan prasarana Kabupaten Wajo untuk melihat jaringan infrastruktur prasarana wilayah."
  },
  "jaringan-sumber-daya-air": {
    title: "Peta Jaringan Sumber Daya Air Kabupaten Wajo",
    description: "Peta sistem jaringan sumber daya air Kabupaten Wajo untuk melihat jaringan dan prasarana terkait sumber daya air."
  },
  "jaringan-telekomunikasi": {
    title: "Peta Jaringan Telekomunikasi Kabupaten Wajo",
    description: "Peta sistem jaringan telekomunikasi Kabupaten Wajo untuk melihat jaringan komunikasi pada wilayah kabupaten."
  },
  "jaringan-energi": {
    title: "Peta Jaringan Energi Kabupaten Wajo",
    description: "Peta sistem jaringan energi Kabupaten Wajo untuk melihat jaringan energi dan unsur pendukungnya."
  },
  kontur: {
    title: "Peta Kontur Topografi Kabupaten Wajo",
    description: "Peta kontur topografi Kabupaten Wajo untuk melihat informasi relief dan ketinggian wilayah."
  },
  sungai: {
    title: "Peta Sungai Kabupaten Wajo",
    description: "Peta sungai Kabupaten Wajo untuk melihat jaringan sungai dan aliran air secara interaktif."
  },
  toponimi: {
    title: "Peta Toponimi Kabupaten Wajo",
    description: "Peta toponimi Kabupaten Wajo untuk melihat nama tempat dan unsur geografis yang tercatat dalam data portal."
  },
  opd: {
    title: "Peta OPD Kabupaten Wajo",
    description: "Peta lokasi Organisasi Perangkat Daerah Kabupaten Wajo untuk membantu menemukan kantor dan informasi lokasi OPD."
  },
  puskesmas: {
    title: "Peta Puskesmas Kabupaten Wajo",
    description: "Peta lokasi Puskesmas Kabupaten Wajo untuk membantu menemukan fasilitas kesehatan masyarakat pada setiap wilayah."
  },
  "satuan-pendidikan": {
    title: "Peta Satuan Pendidikan Kabupaten Wajo",
    description: "Peta satuan pendidikan Kabupaten Wajo yang memuat lokasi sekolah dan informasi dasar satuan pendidikan."
  },
  "potensi-pertanian": {
    title: "Peta Potensi Pertanian Kabupaten Wajo",
    description: "Peta potensi pertanian Kabupaten Wajo untuk melihat sebaran potensi komoditas pada wilayah desa dan kecamatan."
  },
  "potensi-peternakan": {
    title: "Peta Potensi Peternakan Kabupaten Wajo",
    description: "Peta potensi peternakan Kabupaten Wajo untuk melihat sebaran potensi komoditas peternakan pada wilayah desa dan kecamatan."
  }
};

export function getDatasetSeo(layer) {
  const custom = DATASET_SEO[layer?.id];
  const baseTitle = `Peta ${layer?.title || "Data"} Kabupaten Wajo`;
  const baseDescription = buildDatasetDescription(layer);
  return {
    title: custom?.title || baseTitle,
    description: custom?.description || baseDescription,
    keywords: [
      custom?.title || baseTitle,
      layer?.title,
      "Kabupaten Wajo",
      "Geoportal Wajo",
      "peta Wajo",
      layer?.group,
      layer?.source
    ].filter(Boolean)
  };
}
