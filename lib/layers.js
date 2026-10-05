const thematic = (id, title, file, color, description, extra = {}) => ({
  sourceType: "Sumber terbuka / ArcGIS",
  id,
  title,
  file,
  group: "Peta Tematik",
  geometry: "Polygon / MultiPolygon",
  visible: false,
  color,
  description,
  ...extra
});

const network = (id, title, file, color, description, extra = {}) => ({
  sourceType: "Sumber terbuka / ArcGIS",
  id,
  title,
  file,
  group: "Jaringan",
  geometry: "LineString / MultiLineString",
  visible: false,
  color,
  categoricalField: "NAMOBJ",
  description,
  ...extra
});

const infra = (id, title, file, color, description, extra = {}) => ({
  sourceType: "Sumber terbuka / ArcGIS",
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

const layers = [
  {
    id: "adm-kabupaten",
    title: "Batas Kabupaten Wajo",
    file: "batas-kabupaten.geojson",
    group: "Administrasi",
    geometry: "MultiPolygon",
    visible: true,
    color: "#334155",
    description: "Batas Kabupaten Wajo dari Badan Informasi Geospasial (BIG), menjadi garis dasar agar data lain tetap terlihat.",
    labelField: "nama_kabupaten",
    styleMode: "admin-county-outline",
    source: "Badan Informasi Geospasial (BIG)",
    sourceType: "Ina-Geoportal BIG",
    sourceNote: "Menggunakan data Kabupaten Wajo yang diambil langsung dari layanan BIG edisi Juni 2026.",
    dataYear: 2026,
    localDataStatus: "Garis batas Kabupaten dari BIG menjadi acuan dasar dan tidak menutup data lain.",
    latestReferenceUrl: "https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KABKOTA_AR/MapServer/0",
    latestMetadataUrl: "https://data.go.id/dataset/dataset/batas_kabkota_ar_2026",
    inspector: {
      primary: [
        ["nama_kabupaten", "Kabupaten"],
        ["luas_wilayah_km2", "Luas wilayah (km²)"],
        ["WADMPR", "Provinsi"]
      ],
      location: [
      ],
      other: [
        ["jumlah_kecamatan_luas", "Jumlah kecamatan dasar perhitungan"],
        ["luas_wilayah_metode", "Metode penghitungan"],
        ["status_data", "Keterangan"]
      ]
    }
  },
  {
    id: "adm-kecamatan",
    title: "Batas Kecamatan",
    file: "batas-kecamatan.geojson",
    group: "Administrasi",
    geometry: "Polygon / MultiPolygon",
    visible: true,
    color: "#64748b",
    description: "Batas 14 kecamatan di Kabupaten Wajo.",
    labelField: "Kecamatan",
    styleMode: "admin",
    source: "Ina-Geoportal Badan Informasi Geospasial (BIG)",
    sourceType: "Ina-Geoportal BIG",
    sourceNote: "Data batas kecamatan bersumber dari Ina-Geoportal BIG, edisi Juni 2026.",
    dataYear: 2026,
    localDataStatus: "Data batas kecamatan edisi Juni 2026",
    latestReferenceUrl: "https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_KECAMATAN_AR/MapServer/0",
    latestMetadataUrl: "https://data.go.id/dataset/dataset/batas_kecamatan_ar_2026",
    inspector: {
      primary: [
        ["Kecamatan", "Kecamatan"],
        ["Kabupaten", "Kabupaten"],
        ["luas_wilayah_km2", "Luas wilayah (km²)"]
      ],
      location: [],
      other: [
        ["status_batas", "Status batas"]
      ]
    }
  },

  {
    id: "adm-desa",
    title: "Batas Desa / Kelurahan",
    file: "batas-desa-kelurahan.geojson",
    group: "Administrasi",
    geometry: "Polygon / MultiPolygon",
    visible: false,
    color: "#94a3b8",
    description: "Batas desa dan kelurahan di Kabupaten Wajo.",
    labelField: "Desa",
    featureKeyField: "kode_desa",
    styleMode: "admin-village",
    source: "Ina-Geoportal Badan Informasi Geospasial (BIG)",
    sourceType: "Ina-Geoportal BIG",
    sourceNote: "Data batas desa dan kelurahan bersumber dari Ina-Geoportal BIG, edisi Juni 2026. Sebagian batas berstatus indikatif sesuai keterangan sumber.",
    dataYear: 2026,
    localDataStatus: "Batas desa/kelurahan edisi Juni 2026",
    latestReferenceUrl: "https://geoservices.big.go.id/rbi/rest/services/BATASWILAYAH/BATAS_DESAKEL_AR/MapServer/0",
    inspector: {
      primary: [
        ["Desa", "Desa / Kelurahan"],
        ["Kecamatan", "Kecamatan"],
        ["Kabupaten", "Kabupaten"],
        ["luas_wilayah_km2", "Luas wilayah (km²)"]
      ],
      location: [],
      other: [
        ["status_batas", "Status batas"]
      ]
    }
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
    "Jaringan Transportasi",
    "jaringan-transportasi.geojson",
    "#b45309",
    "Jaringan transportasi di Kabupaten Wajo.",
    {
      source: "Data Jaringan Transportasi Kabupaten Wajo"
    }
  ),

  network(
    "jaringan-prasarana-lainnya",
    "Prasarana Lainnya",
    "jaringan-prasarana-lainnya.geojson",
    "#2563eb",
    "Prasarana pendukung layanan wilayah di Kabupaten Wajo.",
    {
      styleMode: "prasarana",
      source: "Data Prasarana Lainnya Kabupaten Wajo"
    }
  ),

  network(
    "jaringan-sumber-daya-air",
    "Sumber Daya Air",
    "jaringan-sumber-daya-air.geojson",
    "#0284c7",
    "Jaringan sumber daya air di Kabupaten Wajo.",
    {
      styleMode: "prasarana",
      source: "Data Jaringan Sumber Daya Air Kabupaten Wajo"
    }
  ),

  network(
    "jaringan-telekomunikasi",
    "Jaringan Telekomunikasi",
    "jaringan-telekomunikasi.geojson",
    "#6d28d9",
    "Jaringan telekomunikasi di Kabupaten Wajo.",
    {
      styleMode: "prasarana",
      source: "Data Jaringan Telekomunikasi Kabupaten Wajo"
    }
  ),

  network(
    "jaringan-energi",
    "Jaringan Energi",
    "jaringan-energi.geojson",
    "#b91c1c",
    "Jaringan energi di Kabupaten Wajo.",
    {
      styleMode: "prasarana",
      source: "Data Jaringan Energi Kabupaten Wajo"
    }
  ),

  {
    id: "kontur",
    title: "Kontur Topografi",
    file: "kontur-topografi.geojson",
    group: "Peta Tematik",
    geometry: "LineString / MultiLineString",
    visible: false,
    color: "#8b7355",
    description: "Garis kontur topografi Kabupaten Wajo.",
    styleMode: "contour",
    source: "Data Kontur Topografi Kabupaten Wajo",
    sourceType: "Sumber terbuka / ArcGIS"
  },

  {
    id: "sungai",
    title: "Sungai",
    file: "sungai.geojson",
    group: "Peta Tematik",
    geometry: "Polygon / MultiPolygon",
    visible: false,
    color: "#0284c7",
    description: "Sebaran badan sungai dan aliran air Kabupaten Wajo.",
    styleMode: "water",
    source: "Data Sungai Kabupaten Wajo",
    sourceType: "Sumber terbuka / ArcGIS"
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
    source: "Data Toponimi Kabupaten Wajo",
    sourceType: "Sumber terbuka / ArcGIS"
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
    sourceType: "Sumber terbuka / ArcGIS",
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
    sourceType: "Sumber terbuka / ArcGIS",
    sourceNote: "Data ini berasal dari sumber terbuka dan/atau layanan ArcGIS. Sumber tiap data mengikuti keterangan pada dataset.",
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
    source: "Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen)",
    sourceType: "Kemendikdasmen",
    sourceNote: "Data pendidikan bersumber dari Kementerian Pendidikan Dasar dan Menengah.",

    inspector: {
      primary: [
        ["nama_sekolah", "Nama sekolah"],
        ["npsn", "NPSN"],
        ["bentuk_pendidikan", "Jenis pendidikan"],
        ["status_sekolah", "Status sekolah"],
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
        ["akses_internet", "Internet"],
        ["waktu_penyelenggaraan", "Waktu belajar"]
      ]
    }
  },

  thematic(
    "potensi-pertanian",
    "Potensi Pertanian",
    "potensi-pertanian.geojson",
    "#15803d",
    "Potensi komoditas pertanian pada wilayah kecamatan dan desa di Kabupaten Wajo.",
    {
      styleMode: "agriculture-potential",
      labelField: "DESA",
      categoricalField: "POTENSI",
      featureFilter: {
        field: "POTENSI",
        excludeEmpty: true,
        excludeValues: ["tidak ada", "tidak tersedia", "belum ada", "n/a", "na", "-", "—"]
      },
      source: "Data Potensi Pertanian Kabupaten Wajo",
      inspector: {
        primary: [
          ["KECAMATAN", "Kecamatan"],
          ["DESA", "Desa"],
          ["POTENSI", "Potensi pertanian"]
        ],
        other: [
          ]
      }
    }
  ),

  thematic(
    "potensi-peternakan",
    "Potensi Peternakan",
    "potensi-peternakan.geojson",
    "#b45309",
    "Potensi komoditas peternakan pada wilayah kecamatan dan desa di Kabupaten Wajo.",
    {
      styleMode: "livestock-potential",
      labelField: "DESA",
      categoricalField: "PETERNAKAN",
      featureFilter: {
        field: "PETERNAKAN",
        excludeEmpty: true,
        excludeValues: ["tidak ada", "tidak tersedia", "belum ada", "n/a", "na", "-", "—"]
      },
      source: "Data Potensi Peternakan Kabupaten Wajo",
      inspector: {
        primary: [
          ["KECAMATAN", "Kecamatan"],
          ["DESA", "Desa"],
          ["PETERNAKAN", "Potensi peternakan"]
        ],
        other: [
          ]
      }
    }
  ),

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
    "Lahan Terbuka & Padang Rumput",
    "kawasan-alang-alang.geojson",
    "#a16207",
    "Penutup lahan berupa tanah kosong/gundul dan padang rumput di Kabupaten Wajo.",
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

const groupOrder = [
  "Administrasi",
  "Pemerintahan",
  "Kesehatan",
  "Pendidikan",
  "Jaringan",
  "Infrastruktur",
  "Peta Tematik",
  "Referensi"
];

module.exports = { layers, groupOrder };
