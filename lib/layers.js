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
    title: "Garis Batas Administrasi",
    file: "GARIS_BATAS_ADMINISTRASI.geojson",
    group: "Administrasi",
    geometry: "LineString",
    visible: true,
    color: "#475569",
    description: "Garis batas administrasi Kabupaten Wajo.",
    styleMode: "boundary"
  },
  {
    id: "adm-kecamatan",
    title: "Administrasi Kecamatan",
    file: "Adm_Kecamatan2017.geojson",
    group: "Administrasi",
    geometry: "Polygon",
    visible: true,
    color: "#64748b",
    description: "Batas kecamatan dan nama wilayah.",
    labelField: "Kecamatan",
    styleMode: "admin"
  },

  network("jalan", "Jalan Wajo 2020", "Data_Jalan_Wajo_2020_ONLINE.geojson", "#c2410c", "Jaringan jalan Wajo 2020.", { styleMode: "roads", categoricalField: "KLASIFIKAS", labelField: "NAMA_RUAS" }),
  network("jaringan-transportasi", "Sistem Jaringan Transportasi", "Sistem_Jaringan_Transportasi.geojson", "#b45309", "Sistem jaringan transportasi wilayah Kabupaten Wajo."),
  network("jaringan-prasarana-lainnya", "Sistem Jaringan Prasarana Lainnya", "Sistem_Jaringan_Prasarana_Lainnya.geojson", "#2563eb", "Air baku, produksi, distribusi, drainase, dan jalur evakuasi.", { styleMode: "prasarana" }),
  network("jaringan-sumber-daya-air", "Sistem Jaringan Sumber Daya Air", "Sistem_Jaringan_Sumber_Daya_Air.geojson", "#0284c7", "Jaringan sumber daya air.", { styleMode: "prasarana" }),
  network("jaringan-telekomunikasi", "Sistem Jaringan Telekomunikasi", "Sistem_Jaringan_Telekomunikasi.geojson", "#6d28d9", "Jaringan telekomunikasi.", { styleMode: "prasarana" }),
  network("jaringan-energi", "Sistem Jaringan Energi", "Sistem_Jaringan_Energi.geojson", "#b91c1c", "Jaringan energi.", { styleMode: "prasarana" }),

  { id: "kontur", title: "Kontur Topografi", file: "KONTUR_TOPOGRAFI.geojson", group: "Peta Tematik", geometry: "LineString", visible: false, color: "#8b7355", description: "Garis kontur/topografi.", styleMode: "contour" },
  { id: "sungai", title: "Sungai", file: "SUNGAI.geojson", group: "Peta Tematik", geometry: "LineString", visible: false, color: "#0284c7", description: "Jaringan sungai dan aliran air.", styleMode: "water" },
  { id: "toponimi", title: "Toponimi", file: "TOPONIMI.geojson", group: "Referensi", geometry: "Point", visible: false, color: "#334155", description: "Nama tempat dan unsur toponimi.", labelField: "NAMOBJ", styleMode: "toponym" },

  thematic("agri-kebun", "Agri Kebun", "AGRI_KEBUN.geojson", "#4d7c0f", "Tutupan/penggunaan lahan kebun."),
  thematic("agri-ladang", "Agri Ladang", "AGRI_LADANG.geojson", "#a16207", "Tutupan/penggunaan lahan ladang."),
  thematic("agri-sawah", "Agri Sawah", "AGRI_SAWAH.geojson", "#15803d", "Tutupan/penggunaan lahan sawah."),
  thematic("tambak", "Tambak", "TAMBAK.geojson", "#0e7490", "Area tambak.", { styleMode: "water" }),
  thematic("danau", "Danau", "DANAU.geojson", "#0284c7", "Badan air danau.", { styleMode: "water" }),
  thematic("pemukiman", "Pemukiman", "PEMUKIMAN.geojson", "#c2410c", "Area pemukiman."),
  thematic("non-agri-hutan-kering", "Non Agri Hutan Kering", "NON_AGRI_HUTAN_KERING.geojson", "#166534", "Area hutan kering."),
  thematic("non-agri-hutan-basah", "Non Agri Hutan Basah", "NON_AGRI_HUTAN_BASAH.geojson", "#15803d", "Area hutan basah."),
  thematic("non-agri-semak-belukar", "Non Agri Semak Belukar", "NON_AGRI_SEMAK_BELUKAR.geojson", "#65a30d", "Area semak belukar."),
  thematic("non-agri-alang", "Non Agri Alang-Alang", "NON_AGRI_ALANG.geojson", "#a16207", "Area alang-alang."),

  infra("infra-transportasi", "Sarana Transportasi", "Sistem_Infrastruktur_Transportasi.geojson", "#c2410c", "Sarana transportasi titik.", { pointCategory: "transport" }),
  infra("infra-prasarana-lainnya", "Sarana Prasarana Lainnya", "Sistem_Infrastruktur_Prasarana_Lainnya.geojson", "#15803d", "Sarana prasarana lainnya.", { pointCategory: "sanitation" }),
  infra("infra-sumber-daya-air", "Sarana Sumber Daya Air", "Sistem_Infrastruktur_Sumber_Daya_Air.geojson", "#0e7490", "Sarana sumber daya air.", { pointCategory: "water" }),
  infra("infra-telekomunikasi", "Sarana Telekomunikasi", "Sistem_Infrastruktur_Telekomunikasi.geojson", "#6d28d9", "Sarana telekomunikasi.", { pointCategory: "telecom" }),
  infra("infra-energi", "Sarana Energi", "Sistem_Infrastruktur_Energi.geojson", "#b91c1c", "Sarana energi.", { pointCategory: "energy" }),

];

export const groupOrder = ["Administrasi", "Jaringan", "Infrastruktur", "Peta Tematik", "Referensi"];
