# Peta Interaktif Kabupaten Wajo

Web GIS / GeoPortal Kabupaten Wajo untuk menjelajahi data wilayah dan data geospasial secara interaktif.

Aplikasi menyediakan peta administrasi, data tematik, jaringan, fasilitas publik, pendidikan, kesehatan, serta potensi wilayah. Pengguna dapat memilih layer, menjelajahi wilayah hingga tingkat desa/kelurahan, melihat detail feature, dan mencetak peta.

## Teknologi

- Next.js 16 — App Router
- React 19
- JavaScript / JSX
- Tailwind CSS 4
- Leaflet
- GeoJSON
- Tabler Icons
- PWA / Service Worker

## Fitur Utama

- Peta administrasi Kabupaten, Kecamatan, dan Desa/Kelurahan
- Layer tematik dan jaringan
- Data fasilitas dan infrastruktur
- Navigasi wilayah dan filtering berdasarkan konteks wilayah
- Informasi detail setiap feature
- Statistik wilayah
- Katalog data dan halaman detail dataset
- Mode **Light / Dark**
- Peta siap cetak dalam format A4 Landscape
- PWA dan dukungan offline dasar
- SEO metadata, sitemap, dan Open Graph

## Struktur Proyek

```text
app/
├── page.jsx                 # Halaman utama peta
├── data/                    # Katalog dan detail dataset
├── tentang/                 # Halaman informasi
├── globals.css              # Global UI, tema, dan Leaflet
├── layout.jsx               # Root layout dan metadata
├── loading.jsx
├── error.jsx
├── manifest.js
├── robots.js
└── sitemap.js

components/
├── GeoPortal.jsx            # Orkestrasi utama aplikasi
├── SiteHeader.jsx
├── SiteFooter.jsx
├── ThemeToggle.jsx
└── geoportal/
    ├── MapCanvas.jsx        # Lifecycle dan rendering Leaflet
    ├── LayerCatalog.jsx
    ├── LayerRow.jsx
    ├── FeatureInspector.jsx
    ├── LayerInfoPanel.jsx
    ├── LegendPanel.jsx
    ├── PrintLegend.jsx
    └── map/
        ├── context.js       # Context wilayah
        ├── geoLayer.js      # Pembuatan thematic layer
        ├── geometry.js      # Utility geometri
        ├── interaction.js   # Interaksi feature dan administrasi
        ├── layerStyles.js   # Style layer
        └── print.js         # Mode dan layout print

lib/
├── layers.js                # Registry utama layer
├── seo.js                   # Metadata dan URL SEO
└── geo/
    ├── format.js
    ├── markers.js
    ├── styles.js
    ├── region.js
    ├── relations.js
    ├── dataFilter.js
    ├── dataSummary.js
    ├── administrationStats.js
    └── statistics.js

public/
├── geo-data/                # Dataset GeoJSON
├── brand/
├── pwa/
├── seo/
├── offline.html
└── sw.js

scripts/
├── sync-big-admin-boundaries.mjs
├── sync-big-kabupaten-boundary.mjs
├── validate-admin.mjs
├── validate-geo-membership.mjs
└── build-region-summary.mjs
```

## Instalasi

Pastikan Node.js dan npm sudah tersedia.

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Aplikasi tersedia secara default di:

```text
http://localhost:3000
```

Build production:

```bash
npm run build
npm start
```

## Konfigurasi Environment

Salin file environment:

```bash
cp .env.example .env.local
```

Konfigurasi utama:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BUILD_VERSION=
```

Untuk production, `NEXT_PUBLIC_SITE_URL` harus menggunakan URL publik Geoportal.

## Data Geospasial

Dataset disimpan di:

```text
public/geo-data/
```

Format utama adalah GeoJSON.

Nama file menggunakan format:

```text
lowercase-kebab-case.geojson
```

Contoh:

```text
batas-kabupaten.geojson
batas-kecamatan.geojson
batas-desa-kelurahan.geojson
puskesmas.geojson
potensi-pertanian.geojson
```

### Layer Registry

`lib/layers.js` merupakan **source of truth** untuk konfigurasi layer.

Informasi seperti nama layer, file, kelompok, geometri, sumber data, tahun, style, inspector, marker, dan konfigurasi wilayah didefinisikan di sini.

Untuk style dan utility GIS:

```text
lib/geo/styles.js
lib/geo/markers.js
lib/geo/format.js
```

## Wilayah Administrasi

Struktur wilayah:

```text
Kabupaten Wajo
└── Kecamatan
    └── Desa / Kelurahan
```

Identitas wilayah menggunakan **kode wilayah** sebagai referensi utama.

Filtering antarwilayah menggunakan field seperti:

```text
wilayah_kecamatan_kode
wilayah_desa_kode
```

Hindari menggunakan pencocokan nama sebagai mekanisme utama.

Data administrasi saat ini mencakup:

- 14 kecamatan
- 190 desa/kelurahan

## Sinkronisasi & Validasi Data

Perbarui ringkasan data wilayah:

```bash
npm run sync:data:region
```

Sinkronisasi batas administrasi:

```bash
npm run sync:admin
```

Sinkronisasi batas desa/kelurahan:

```bash
npm run sync:admin:desa
```

Sinkronisasi batas Kabupaten:

```bash
npm run sync:admin:kab
```

Validasi data administrasi:

```bash
npm run validate:admin
```

Validasi hubungan data dengan wilayah:

```bash
npm run validate:data:region
```

`npm run build` juga menjalankan proses pembentukan ringkasan wilayah melalui `prebuild`.

## Interaksi Peta

Layer administrasi dan thematic layer harus tetap dapat digunakan bersamaan.

Mengaktifkan layer seperti:

```text
Jaringan
Kontur
Danau
Sungai
Infrastruktur
```

tidak boleh mematikan interaksi wilayah administrasi.

Perubahan konteks wilayah mengikuti alur:

```text
Pilih wilayah
    ↓
Update context
    ↓
Filter feature
    ↓
Build/update layer
    ↓
Bind interaction
    ↓
Update informasi
    ↓
Update viewport
```

Hindari membuat ulang seluruh peta hanya karena satu layer atau konteks wilayah berubah.

## Light / Dark Mode

Tema default adalah **Light**.

Pengguna dapat berpindah antara:

```text
Light
Dark
```

Tema diterapkan ke UI aplikasi tanpa mengubah tampilan hasil cetak. Peta cetak tetap menggunakan layout dan styling khusus untuk media print.

## Cetak Peta

Peta dapat dicetak dalam format:

```text
A4 Landscape
```

Layout print:

```text
┌───────────────────────────────┬───────────┐
│             MAP               │  LEGEND   │
│             75%               │    25%    │
└───────────────────────────────┴───────────┘
```

Legenda memuat informasi wilayah, feature, layer aktif, dan tautan kembali ke peta interaktif.

## Lint

Periksa kode:

```bash
npm run lint
```

Perbaiki otomatis:

```bash
npm run lint:fix
```

## Prinsip Pengembangan

Beberapa prinsip yang perlu dipertahankan:

- `lib/layers.js` menjadi sumber konfigurasi layer.
- Pisahkan **visibility**, **interaction**, dan **selection/highlight**.
- Gunakan kode wilayah untuk relasi data.
- Hindari event listener atau renderer Leaflet yang tertinggal.
- Jangan melakukan rebuild seluruh map untuk perubahan kecil.
- Jangan menggunakan koordinat perkiraan untuk feature yang lokasinya tidak dapat dipastikan.
- UI dan teks harus tetap jelas pada Light maupun Dark Mode.
- Perubahan visual sebaiknya tidak mengganggu behavior interaksi peta.

## Sumber Data

Informasi sumber setiap dataset disimpan sebagai metadata pada konfigurasi layer.

Salah satu sumber data dasar administrasi adalah **Ina-Geoportal Badan Informasi Geospasial (BIG)**. Dataset sektoral lainnya mengikuti keterangan sumber yang tercantum pada masing-masing layer.

---

**Peta Interaktif Kabupaten Wajo**  
Dikelola oleh **Diskominfotik Kabupaten Wajo**