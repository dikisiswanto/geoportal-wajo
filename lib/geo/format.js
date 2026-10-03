export function formatValue(value) {
  if (value == null || value === "") return "—";

  if (typeof value === "number") {
    return new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 3
    }).format(value);
  }

  return String(value);
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
          color: colorFor(name)
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name, "id")) ?? []
  );
}

const HUMAN_LABELS = {
  NAMOBJ: "Nama objek",
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
  fonte_koordinat: "Sumber koordinat",

  NPSN: "NPSN",
  PUSKESMAS: "Nama Puskesmas",
  PETERNAKAN: "Potensi peternakan",
  NO: "Nomor",
  ALAMAT: "Alamat",
  TITIK_KOOR: "Koordinat sumber",
  X: "Longitude",
  Y: "Latitude",
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

  latitude: "Latitude",
  longitude: "Longitude",

  luas_tanah_milik: "Luas tanah milik",
  daya_listrik: "Daya listrik",
  sumber_listrik: "Sumber listrik",
  akses_internet: "Akses internet",
  akses_internet_2: "Akses internet 2",
  waktu_penyelenggaraan: "Waktu penyelenggaraan",

  sumber_data: "Sumber data",
  sumber_koordinat: "Sumber koordinat",
  tanggal_pengambilan: "Tanggal data",
  validasi: "Status validasi",
  koordinat_valid: "Koordinat valid"
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

export function inspectorGroups(layer, properties = {}) {
  const configured = layer?.inspector;

  /*
   * Layer yang punya konfigurasi field menggunakan konfigurasi tersebut,
   * tetapi tetap dirender oleh FeatureInspector universal.
   */
  if (configured) {
    const titles = {
      primary: "Informasi utama",
      location: "Lokasi",
      contact: "Kontak",
      other: "Informasi lainnya"
    };

    return Object.entries(configured)
      .map(([id, fields]) => ({
        id,
        title: titles[id] ?? humanizeField(id),
        fields: fields.filter(([key]) =>
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
      title: "Atribut",
      fields: Object.keys(properties)
        .filter((key) => !/^shape_/i.test(key))
        .map((key) => [key, humanizeField(key)])
    }
  ];
}
