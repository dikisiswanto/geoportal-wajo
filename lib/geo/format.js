export function formatValue(value, key = "") {
  if (value == null || value === "") return "—";

  if (typeof value === "number") {
    return new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 3
    }).format(value);
  }

  if (typeof value === "boolean") {
    return value ? "Ya" : "Tidak";
  }

  const raw = String(value).trim();
  const normalized = raw.toUpperCase();

  const valueLabels = {
    NEGERI: "Negeri",
    SWASTA: "Swasta",
    "TIDAK ADA": "Tidak ada",
    "TIDAK TERSEDIA": "Tidak tersedia",
    HTTP_ONLY: "Hanya HTTP",
    "MISSING_OR_INVALID_COORDINATE": "Lokasi belum bisa ditampilkan",
    "BELUM_TERPETAKAN": "Lokasi belum tersedia di peta",
    "TERPETAKAN": "Terpetakan",
    "BATAS INDIKATIF": "Batas indikatif",
    KABUPATEN: "Kabupaten",
    KECAMATAN: "Kecamatan",
    "DESA/KELURAHAN": "Desa / Kelurahan"
  };

  if (valueLabels[normalized]) return valueLabels[normalized];

  return raw;
}


export function humanGeometryLabel(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (raw.includes("Point")) return "Lokasi";
  if (raw.includes("LineString")) return "Jaringan";
  if (raw.includes("Polygon")) return "Wilayah";
  return raw;
}

export function featureLabel(layer, feature) {
  const properties = feature?.properties ?? {};

  return (
    properties[layer.labelField] ??
    properties[layer.categoricalField ?? "NAMOBJ"] ??
    layer.title
  );
}


export function featureKey(layer, feature) {
  const properties = feature?.properties ?? {};
  const candidates = [
    layer?.featureKeyField,
    layer?.labelField,
    "npsn",
    "NPSN",
    "FID",
    "OBJECTID",
    "NO"
  ].filter(Boolean);

  for (const key of candidates) {
    const value = properties[key];
    if (value != null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }

  return null;
}

export function buildKecamatanLegend(data, colorFor) {
  const seen = new Set();

  return (
    data?.features
      ?.map((feature, index) => {
        const properties = feature?.properties ?? {};
        const name = String(
          properties.Kecamatan ?? properties.WADMKC ?? properties.NAMOBJ ?? ""
        ).trim();
        if (!name) return null;

        const sourceId = String(
          properties.KDCPUM ?? properties.KDCBPS ?? properties.OBJECTID ?? properties.FID ?? index
        ).trim();
        let id = `kec-${sourceId || index}`;
        if (seen.has(id)) id = `${id}-${index}`;
        seen.add(id);

        return {
          id,
          name,
          color: colorFor(
            properties.KDCPUM ??
            properties.kode_kecamatan ??
            properties.Kecamatan ??
            properties.WADMKC ??
            properties.NAMOBJ
          )
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name, "id")) ?? []
  );
}

const HUMAN_LABELS = {
  NAMOBJ: "Nama objek",
  OBJECTID: "ID data",
  FID: "ID data",
  Shape_Length: "Panjang geometri",
  Shape_Area: "Luas geometri",
  REMARK: "Catatan sumber",
  METADATA: "Identitas metadata",
  FCODE: "Kode fitur",
  KDBBPS: "Kode BPS kabupaten",
  KDCBPS: "Kode BPS kecamatan",
  KDCPUM: "Kode wilayah kecamatan",
  KDEPUM: "Kode wilayah desa",
  WADMKK: "Kabupaten",
  WADMKC: "Kecamatan",
  WADMKD: "Desa / Kelurahan",
  WADMPR: "Provinsi",
  LUASWH: "Luas wilayah (ha)",
  Kecamatan: "Kecamatan",
  Desa: "Desa / Kelurahan",
  Kabupaten: "Kabupaten",
  nama_kecamatan: "Kecamatan",
  nama_desa: "Desa / Kelurahan",
  kode_kecamatan: "Kode kecamatan",
  kode_desa: "Kode wilayah",
  luas_wilayah_ha: "Luas wilayah (ha)",
  status_batas: "Keterangan batas",
  wilayah_type: "Jenis wilayah",
  tahun_data: "Tahun data",
  fonte_data: "Sumber data",
  fonte_koordinat: "Asal lokasi",

  NPSN: "NPSN",
  PUSKESMAS: "Nama Puskesmas",
  PETERNAKAN: "Potensi peternakan",
  POTENSI: "Potensi utama",
  STSJRN: "Status jaringan",
  NO: "Nomor",
  ALAMAT: "Alamat",
  TITIK_KOOR: "Lokasi dari sumber data",
  X: "Bujur",
  Y: "Lintang",
  JML_PEND: "Jumlah penduduk terlayani",
  npsn: "NPSN",

  nama_sekolah: "Nama sekolah",
  bentuk_pendidikan: "Bentuk pendidikan",
  status_sekolah: "Status",
  akreditasi: "Akreditasi",

  alamat_jalan: "Alamat",
  nama_dusun: "Dusun",
  kecamatan: "Kecamatan",
  kabupaten: "Kabupaten",
  provinsi: "Provinsi",
  kode_pos: "Kode pos",

  nomor_telepon: "Telepon",
  email: "Email",
  website: "Website",

  latitude: "Lintang",
  longitude: "Bujur",

  luas_tanah_milik: "Luas tanah milik",
  daya_listrik: "Daya listrik",
  sumber_listrik: "Sumber listrik",
  akses_internet: "Akses internet",
  akses_internet_2: "Akses internet 2",
  waktu_penyelenggaraan: "Waktu penyelenggaraan",

  sumber_data: "Sumber data",
  sumber_koordinat: "Asal lokasi",
  tanggal_pengambilan: "Tanggal data",
  validasi: "Status validasi",
  koordinat_valid: "Lokasi dapat ditampilkan"
};

export function humanizeField(key) {
  if (HUMAN_LABELS[key]) {
    return HUMAN_LABELS[key];
  }

  return String(key)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (character) => character.toUpperCase());
}

const TECHNICAL_FIELDS = new Set([
  "OBJECTID",
  "FID",
  "FCODE",
  "METADATA",
  "SRS_ID",
  "Shape_Length",
  "Shape_Area",
  "shape_leng",
  "shape_area",
  "UUPP",
  "KDBBPS",
  "KDCBPS",
  "KDCPUM",
  "KDEPUM"
]);

function isUsefulInspectorField(key) {
  return !TECHNICAL_FIELDS.has(key) && !/^shape_/i.test(String(key));
}

export function inspectorGroups(layer, properties = {}) {
  const configured = layer?.inspector;

  /*
   * Layer yang punya konfigurasi field menggunakan konfigurasi tersebut,
   * tetapi tetap dirender oleh FeatureInspector universal.
   */
  if (configured) {
    const titles = {
      primary: "Informasi",
      location: "Lokasi",
      contact: "Kontak",
      other: "Keterangan"
    };

    return Object.entries(configured)
      .map(([id, fields]) => ({
        id,
        title: titles[id] ?? humanizeField(id),
        fields: fields.filter(([key]) =>
          isUsefulInspectorField(key) &&
          Object.prototype.hasOwnProperty.call(properties, key)
        )
      }))
      .filter((group) => group.fields.length);
  }

  /*
   * Fallback universal untuk layer yang belum memiliki mapping khusus.
   */
  return [
    {
      id: "attributes",
      title: "Informasi",
      fields: Object.keys(properties)
        .filter((key) => isUsefulInspectorField(key))
        .map((key) => [key, humanizeField(key)])
    }
  ];
}
