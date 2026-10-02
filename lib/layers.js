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
    file: "batas-administrasi.geojson",
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
    file: "batas-kecamatan.geojson",
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
    "jaringan-jalan.geojson",
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
    "jaringan-transportasi.geojson",
    "#b45309",
    "Sistem jaringan transportasi Kabupaten Wajo.",
    {
      source: "Data Sistem Jaringan Transportasi Kabupaten Wajo"
    }
  ),

  network(
    "jaringan-prasarana-lainnya",
    "Sistem Jaringan Prasarana Lainnya",
    "jaringan-prasarana-lainnya.geojson",
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
    "jaringan-sumber-daya-air.geojson",
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
    "jaringan-telekomunikasi.geojson",
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
    "jaringan-energi.geojson",
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
    file: "kontur-topografi.geojson",
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
    file: "sungai.geojson",
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
    file: "toponimi.geojson",
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
    id: "opd",
    title: "Organisasi Perangkat Daerah",
    file: "organisasi-perangkat-daerah.geojson",
    group: "Pemerintahan",
    geometry: "Point",
    visible: false,
    color: "#0f4c5c",
    labelField: "NAMA_OPD",
    styleMode: "opd",
    pointCategory: "opd",
    description: "Lokasi kantor Organisasi Perangkat Daerah Kabupaten Wajo.",
    source: "Data Organisasi Perangkat Daerah Kabupaten Wajo",
    inspector: {
      primary: [
        ["NAMA_OPD", "Nama OPD"],
        ["NO", "Nomor"]
      ],
      location: [
        ["Alamat", "Alamat"],
        ["Latitude", "Latitude"],
        ["Longitude", "Longitude"]
      ],
      other: [
        ["FID", "FID"]
      ]
    }
  },

  {
    id: "puskesmas",
    title: "Puskesmas",
    file: "puskesmas.geojson",
    group: "Kesehatan",
    geometry: "Point",
    visible: false,
    color: "#b42318",
    labelField: "PUSKESMAS",
    styleMode: "puskesmas",
    pointCategory: "health",
    description: "Lokasi pusat kesehatan masyarakat (Puskesmas) di Kabupaten Wajo.",
    source: "Data Puskesmas Kabupaten Wajo",
    inspector: {
      primary: [
        ["PUSKESMAS", "Nama Puskesmas"],
        ["NO", "Nomor"]
      ],
      location: [
        ["ALAMAT", "Alamat"],
        ["X", "Longitude"],
        ["Y", "Latitude"]
      ],
      other: [
        ["JML_PEND", "Jumlah penduduk terlayani"],
        ["TITIK_KOOR", "Koordinat sumber"]
      ]
    }
  },

  {
    id: "satuan-pendidikan",
    title: "Satuan Pendidikan",
    file: "satuan-pendidikan.geojson",
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
    "kawasan-perkebunan.geojson",
    "#4d7c0f",
    "Kawasan perkebunan Kabupaten Wajo.",
    {
      source: "Data Kawasan Perkebunan Kabupaten Wajo"
    }
  ),

  thematic(
    "agri-ladang",
    "Kawasan Pertanian Lahan Kering",
    "kawasan-pertanian-lahan-kering.geojson",
    "#a16207",
    "Kawasan pertanian lahan kering Kabupaten Wajo.",
    {
      source: "Data Pertanian Lahan Kering Kabupaten Wajo"
    }
  ),

  thematic(
    "agri-sawah",
    "Kawasan Persawahan",
    "kawasan-persawahan.geojson",
    "#15803d",
    "Kawasan persawahan Kabupaten Wajo.",
    {
      source: "Data Persawahan Kabupaten Wajo"
    }
  ),

  thematic(
    "tambak",
    "Kawasan Tambak",
    "kawasan-tambak.geojson",
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
    "danau.geojson",
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
    "kawasan-permukiman.geojson",
    "#c2410c",
    "Kawasan permukiman Kabupaten Wajo.",
    {
      source: "Data Permukiman Kabupaten Wajo"
    }
  ),

  thematic(
    "non-agri-hutan-kering",
    "Kawasan Hutan Lahan Kering",
    "kawasan-hutan-lahan-kering.geojson",
    "#166534",
    "Kawasan hutan lahan kering Kabupaten Wajo.",
    {
      source: "Data Hutan Lahan Kering Kabupaten Wajo"
    }
  ),

  thematic(
    "non-agri-hutan-basah",
    "Kawasan Hutan Lahan Basah",
    "kawasan-hutan-lahan-basah.geojson",
    "#15803d",
    "Kawasan hutan lahan basah Kabupaten Wajo.",
    {
      source: "Data Hutan Lahan Basah Kabupaten Wajo"
    }
  ),

  thematic(
    "non-agri-semak-belukar",
    "Kawasan Semak Belukar",
    "kawasan-semak-belukar.geojson",
    "#65a30d",
    "Kawasan semak belukar Kabupaten Wajo.",
    {
      source: "Data Semak Belukar Kabupaten Wajo"
    }
  ),

  thematic(
    "non-agri-alang",
    "Kawasan Alang-Alang",
    "kawasan-alang-alang.geojson",
    "#a16207",
    "Kawasan alang-alang Kabupaten Wajo.",
    {
      source: "Data Alang-Alang Kabupaten Wajo"
    }
  ),

  infra(
    "infra-transportasi",
    "Sarana Transportasi",
    "sarana-transportasi.geojson",
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
    "sarana-prasarana-lainnya.geojson",
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
    "sarana-sumber-daya-air.geojson",
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
    "sarana-telekomunikasi.geojson",
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
    "sarana-energi.geojson",
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
  "Pemerintahan",
  "Kesehatan",
  "Pendidikan",
  "Jaringan",
  "Infrastruktur",
  "Peta Tematik",
  "Referensi"
];
