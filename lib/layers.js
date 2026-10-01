const thematic = (id, title, file, color, description, extra = {}) => ({
  id,
  title,
  file,
  group: "Peta Tematik",
  geometry: "Polygon",
  visible: false,
  color,
  description,
  ...extra
});

const network = (id, title, file, color, description, extra = {}) => ({
  id,
  title,
  file,
  group: "Jaringan",
  geometry: "LineString",
  visible: false,
  color,
  categoricalField: "NAMOBJ",
  description,
  ...extra
});

const infra = (id, title, file, color, description, extra = {}) => ({
  id,
  title,
  file,
  group: "Infrastruktur",
  geometry: "Point",
  visible: false,
  color,
  categoricalField: "NAMOBJ",
  description,
  ...extra
});

export const layers = [
  {
    id: "batas-administrasi",
    title: "Batas Administrasi",
    file: "GARIS_BATAS_ADMINISTRASI.geojson",
    group: "Administrasi",
    geometry: "LineString",
    visible: true,
    color: "#475569",
    description: "Batas administrasi Kabupaten Wajo.",
    styleMode: "boundary",
    source: "Data Administrasi Kabupaten Wajo"
  },

  {
    id: "adm-kecamatan",
    title: "Batas Kecamatan",
    file: "Adm_Kecamatan2017.geojson",
    group: "Administrasi",
    geometry: "Polygon",
    visible: true,
    color: "#64748b",
    description: "Batas wilayah kecamatan Kabupaten Wajo.",
    labelField: "Kecamatan",
    styleMode: "admin",
    source: "Data Administrasi Kecamatan Kabupaten Wajo",
    dataYear: 2017
  },

  network(
    "jalan",
    "Jaringan Jalan",
    "Data_Jalan_Wajo_2020_ONLINE.geojson",
    "#c2410c",
    "Jaringan jalan Kabupaten Wajo.",
    {
      styleMode: "roads",
      categoricalField: "KLASIFIKAS",
      labelField: "NAMA_RUAS",
      source: "Data Jaringan Jalan Kabupaten Wajo",
      dataYear: 2020
    }
  ),

  network(
    "jaringan-transportasi",
    "Sistem Jaringan Transportasi",
    "Sistem_Jaringan_Transportasi.geojson",
    "#b45309",
    "Sistem jaringan transportasi Kabupaten Wajo.",
    {
      source: "Data Sistem Jaringan Transportasi Kabupaten Wajo"
    }
  ),

  network(
    "jaringan-prasarana-lainnya",
    "Sistem Jaringan Prasarana Lainnya",
    "Sistem_Jaringan_Prasarana_Lainnya.geojson",
    "#2563eb",
    "Sistem jaringan prasarana lainnya di Kabupaten Wajo.",
    {
      styleMode: "prasarana",
      source: "Data Sistem Jaringan Prasarana Kabupaten Wajo"
    }
  ),

  network(
    "jaringan-sumber-daya-air",
    "Sistem Jaringan Sumber Daya Air",
    "Sistem_Jaringan_Sumber_Daya_Air.geojson",
    "#0284c7",
    "Sistem jaringan sumber daya air Kabupaten Wajo.",
    {
      styleMode: "prasarana",
      source: "Data Sistem Jaringan Sumber Daya Air Kabupaten Wajo"
    }
  ),

  network(
    "jaringan-telekomunikasi",
    "Sistem Jaringan Telekomunikasi",
    "Sistem_Jaringan_Telekomunikasi.geojson",
    "#6d28d9",
    "Sistem jaringan telekomunikasi Kabupaten Wajo.",
    {
      styleMode: "prasarana",
      source: "Data Sistem Jaringan Telekomunikasi Kabupaten Wajo"
    }
  ),

  network(
    "jaringan-energi",
    "Sistem Jaringan Energi",
    "Sistem_Jaringan_Energi.geojson",
    "#b91c1c",
    "Sistem jaringan energi Kabupaten Wajo.",
    {
      styleMode: "prasarana",
      source: "Data Sistem Jaringan Energi Kabupaten Wajo"
    }
  ),

  {
    id: "kontur",
    title: "Kontur Topografi",
    file: "KONTUR_TOPOGRAFI.geojson",
    group: "Peta Tematik",
    geometry: "LineString",
    visible: false,
    color: "#8b7355",
    description: "Garis kontur topografi Kabupaten Wajo.",
    styleMode: "contour",
    source: "Data Kontur Topografi Kabupaten Wajo"
  },

  {
    id: "sungai",
    title: "Sungai",
    file: "SUNGAI.geojson",
    group: "Peta Tematik",
    geometry: "LineString",
    visible: false,
    color: "#0284c7",
    description: "Jaringan sungai dan aliran air Kabupaten Wajo.",
    styleMode: "water",
    source: "Data Sungai Kabupaten Wajo"
  },

  {
    id: "toponimi",
    title: "Toponimi",
    file: "TOPONIMI.geojson",
    group: "Referensi",
    geometry: "Point",
    visible: false,
    color: "#334155",
    description: "Nama tempat dan unsur toponimi Kabupaten Wajo.",
    labelField: "NAMOBJ",
    styleMode: "toponym",
    source: "Data Toponimi Kabupaten Wajo"
  },

  {
    id: "satuan-pendidikan",
    title: "Satuan Pendidikan",
    file: "wajo_satuan_pendidikan.geojson",
    group: "Pendidikan",
    geometry: "Point",
    visible: false,
    color: "#2563eb",
    description: "Lokasi satuan pendidikan di Kabupaten Wajo.",
    labelField: "nama_sekolah",
    styleMode: "school",
    pointCategory: "education",
    source: "Data Satuan Pendidikan Kabupaten Wajo",

    inspector: {
      primary: [
        ["nama_sekolah", "Nama sekolah"],
        ["npsn", "NPSN"],
        ["bentuk_pendidikan", "Bentuk pendidikan"],
        ["status_sekolah", "Status"],
        ["akreditasi", "Akreditasi"]
      ],

      location: [
        ["alamat_jalan", "Alamat"],
        ["nama_dusun", "Dusun"],
        ["kecamatan", "Kecamatan"],
        ["kabupaten", "Kabupaten"],
        ["kode_pos", "Kode pos"]
      ],

      contact: [
        ["nomor_telepon", "Telepon"],
        ["email", "Email"],
        ["website", "Website"]
      ],

      other: [
        ["luas_tanah_milik", "Luas tanah milik"],
        ["daya_listrik", "Daya listrik"],
        ["sumber_listrik", "Sumber listrik"],
        ["akses_internet", "Akses internet"],
        ["waktu_penyelenggaraan", "Waktu penyelenggaraan"]
      ]
    }
  },

  thematic(
    "agri-kebun",
    "Kawasan Perkebunan",
    "AGRI_KEBUN.geojson",
    "#4d7c0f",
    "Kawasan perkebunan Kabupaten Wajo.",
    {
      source: "Data Kawasan Perkebunan Kabupaten Wajo"
    }
  ),

  thematic(
    "agri-ladang",
    "Kawasan Pertanian Lahan Kering",
    "AGRI_LADANG.geojson",
    "#a16207",
    "Kawasan pertanian lahan kering Kabupaten Wajo.",
    {
      source: "Data Pertanian Lahan Kering Kabupaten Wajo"
    }
  ),

  thematic(
    "agri-sawah",
    "Kawasan Persawahan",
    "AGRI_SAWAH.geojson",
    "#15803d",
    "Kawasan persawahan Kabupaten Wajo.",
    {
      source: "Data Persawahan Kabupaten Wajo"
    }
  ),

  thematic(
    "tambak",
    "Kawasan Tambak",
    "TAMBAK.geojson",
    "#0e7490",
    "Kawasan tambak Kabupaten Wajo.",
    {
      styleMode: "water",
      source: "Data Kawasan Tambak Kabupaten Wajo"
    }
  ),

  thematic(
    "danau",
    "Danau",
    "DANAU.geojson",
    "#0284c7",
    "Badan air danau Kabupaten Wajo.",
    {
      styleMode: "water",
      source: "Data Danau Kabupaten Wajo"
    }
  ),

  thematic(
    "pemukiman",
    "Kawasan Permukiman",
    "PEMUKIMAN.geojson",
    "#c2410c",
    "Kawasan permukiman Kabupaten Wajo.",
    {
      source: "Data Permukiman Kabupaten Wajo"
    }
  ),

  thematic(
    "non-agri-hutan-kering",
    "Kawasan Hutan Lahan Kering",
    "NON_AGRI_HUTAN_KERING.geojson",
    "#166534",
    "Kawasan hutan lahan kering Kabupaten Wajo.",
    {
      source: "Data Hutan Lahan Kering Kabupaten Wajo"
    }
  ),

  thematic(
    "non-agri-hutan-basah",
    "Kawasan Hutan Lahan Basah",
    "NON_AGRI_HUTAN_BASAH.geojson",
    "#15803d",
    "Kawasan hutan lahan basah Kabupaten Wajo.",
    {
      source: "Data Hutan Lahan Basah Kabupaten Wajo"
    }
  ),

  thematic(
    "non-agri-semak-belukar",
    "Kawasan Semak Belukar",
    "NON_AGRI_SEMAK_BELUKAR.geojson",
    "#65a30d",
    "Kawasan semak belukar Kabupaten Wajo.",
    {
      source: "Data Semak Belukar Kabupaten Wajo"
    }
  ),

  thematic(
    "non-agri-alang",
    "Kawasan Alang-Alang",
    "NON_AGRI_ALANG.geojson",
    "#a16207",
    "Kawasan alang-alang Kabupaten Wajo.",
    {
      source: "Data Alang-Alang Kabupaten Wajo"
    }
  ),

  infra(
    "infra-transportasi",
    "Sarana Transportasi",
    "Sistem_Infrastruktur_Transportasi.geojson",
    "#c2410c",
    "Sarana transportasi Kabupaten Wajo.",
    {
      pointCategory: "transport",
      source: "Data Sarana Transportasi Kabupaten Wajo"
    }
  ),

  infra(
    "infra-prasarana-lainnya",
    "Sarana Prasarana Lainnya",
    "Sistem_Infrastruktur_Prasarana_Lainnya.geojson",
    "#15803d",
    "Sarana prasarana lainnya Kabupaten Wajo.",
    {
      pointCategory: "sanitation",
      source: "Data Sarana Prasarana Kabupaten Wajo"
    }
  ),

  infra(
    "infra-sumber-daya-air",
    "Sarana Sumber Daya Air",
    "Sistem_Infrastruktur_Sumber_Daya_Air.geojson",
    "#0e7490",
    "Sarana sumber daya air Kabupaten Wajo.",
    {
      pointCategory: "water",
      source: "Data Sarana Sumber Daya Air Kabupaten Wajo"
    }
  ),

  infra(
    "infra-telekomunikasi",
    "Sarana Telekomunikasi",
    "Sistem_Infrastruktur_Telekomunikasi.geojson",
    "#6d28d9",
    "Sarana telekomunikasi Kabupaten Wajo.",
    {
      pointCategory: "telecom",
      source: "Data Sarana Telekomunikasi Kabupaten Wajo"
    }
  ),

  infra(
    "infra-energi",
    "Sarana Energi",
    "Sistem_Infrastruktur_Energi.geojson",
    "#b91c1c",
    "Sarana energi Kabupaten Wajo.",
    {
      pointCategory: "energy",
      source: "Data Sarana Energi Kabupaten Wajo"
    }
  )
];

export const groupOrder = [
  "Administrasi",
  "Pendidikan",
  "Jaringan",
  "Infrastruktur",
  "Peta Tematik",
  "Referensi"
];
