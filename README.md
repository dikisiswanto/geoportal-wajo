# Peta Interaktif Kabupaten Wajo

Web GIS / GeoPortal Kabupaten Wajo untuk menampilkan dan menjelajahi data geospasial secara interaktif.

Aplikasi dibangun dengan **Next.js, React, Leaflet, dan GeoJSON statis**. Fokus utamanya adalah navigasi wilayah, thematic layer, feature inspection, dan interaksi peta yang ringan serta konsisten.

## Stack

* Next.js App Router
* React
* JavaScript / JSX
* Tailwind CSS
* Leaflet
* GeoJSON
* Tabler Icons
* `next/font/google`
* Service Worker / PWA

## Struktur Utama

```text
app/
├── layout.jsx          # metadata, font, layout
├── page.jsx            # halaman utama
├── globals.css         # global styles + Leaflet
├── loading.jsx
├── error.jsx
├── manifest.js
├── robots.js
└── sitemap.js

components/
├── GeoPortal.jsx       # state & orkestrasi aplikasi
├── PwaRegister.jsx
└── geoportal/
    ├── GeoPortalHeader.jsx
    ├── LayerCatalog.jsx
    ├── LayerRow.jsx
    ├── LayerGlyph.jsx
    ├── MapCanvas.jsx   # lifecycle Leaflet & feature
    ├── MapControls.jsx
    ├── IconButton.jsx
    ├── LegendPanel.jsx
    ├── FeatureInspector.jsx
    ├── MapStatus.jsx
    ├── MobileActions.jsx
    └── PrintLegend.jsx

lib/
├── layers.js           # registry utama layer
└── geo/
    ├── format.js
    ├── markers.js
    └── styles.js

public/
├── brand/
├── pwa/
├── geo-data/           # dataset GeoJSON
└── sw.js
```

## Layer Registry

`lib/layers.js` adalah **source of truth** untuk layer.

Informasi layer seperti:

* nama;
* file;
* kelompok;
* geometry;
* sumber;
* tahun;
* style;
* inspector;
* marker;
* konfigurasi wilayah

didefinisikan di sini.

Aturan GIS jangan disebar ke banyak component.

* `lib/geo/styles.js` → simbologi
* `lib/geo/markers.js` → marker/icon
* `lib/geo/format.js` → formatting dan legenda

## Data

GeoJSON disimpan di:

```text
public/geo-data/
```

Gunakan nama file:

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

Nama layer di UI tidak perlu menyertakan tahun. Tahun disimpan sebagai metadata.

## Administrasi Wajo

Hirarki wilayah:

```text
Kabupaten
  └── Kecamatan
       └── Desa/Kelurahan
```

Identitas wilayah menggunakan **kode**, bukan nama.

Referensi dapat menyimpan:

```text
kode_*_kemendagri
kode_*_bps
nama_*_kemendagri
nama_*_bps
```

Saat ini data mencakup **14 kecamatan dan 190 desa/kelurahan**.

## Region Filtering

Feature yang mengikuti wilayah menggunakan:

```text
wilayah_kecamatan_kode
wilayah_desa_kode
```

Kode tersebut digunakan untuk filtering saat context wilayah berubah.

Jangan menggunakan pencocokan nama sebagai mekanisme utama.

Feature tanpa lokasi yang dapat dipastikan tidak boleh diberi koordinat perkiraan.

## Interaksi Peta

Tiga konsep berikut harus tetap dipisahkan:

```text
Visibility
Interaction
Selection / Highlight
```

Mengaktifkan thematic layer **tidak boleh mematikan interaksi wilayah administrasi**.

Contoh yang harus selalu bekerja:

```text
Kabupaten → Kecamatan → Desa
Desa → Kecamatan → Kabupaten
```

Thematic layer seperti sekolah, puskesmas, jalan, pertanian, peternakan, dan lainnya harus dapat hidup berdampingan dengan layer administrasi.

Saat wilayah berubah:

```text
Update context
    ↓
Filter feature
    ↓
Remove feature lama
    ↓
Build/update feature baru
    ↓
Bind interaction
    ↓
Update tooltip/popup
    ↓
Update viewport
```

Jangan sampai feature atau event handler dari wilayah sebelumnya tertinggal.

## Performance

GeoJSON dimuat secara lazy.

Hindari:

```text
❌ recreate seluruh map saat layer berubah
❌ rebuild semua layer untuk satu perubahan kecil
❌ setState React pada setiap mousemove
❌ duplicate event listener
❌ operasi GeoJSON besar pada setiap hover/click
```

Gunakan update incremental dan manfaatkan lifecycle Leaflet.

## Layer & Pane

Pastikan hierarchy layer benar sehingga:

* polygon tidak menghalangi interaction yang seharusnya;
* marker tetap clickable;
* tooltip berada di atas marker;
* popup tidak tertutup layer lain;
* administrative layer tetap dapat diklik.

Jangan menggunakan `z-index` secara acak sebagai workaround.

## Administrative Coloring

Saat satu kecamatan dipilih:

```text
Kecamatan terpilih → highlight
Kecamatan lain     → tetap memiliki warna/style normal
```

Jangan menghapus warna kecamatan lain pada mode interaktif.

Style khusus untuk kebutuhan print boleh berbeda.

## Menambah Layer

1. Tambahkan GeoJSON ke `public/geo-data/`.
2. Register di `lib/layers.js`.
3. Tambahkan style di `lib/geo/styles.js` bila perlu.
4. Tambahkan marker mapping di `lib/geo/markers.js` bila perlu.
5. Tambahkan region mapping bila layer mengikuti wilayah.
6. Tambahkan konfigurasi inspector bila diperlukan.

## Validasi & Sinkronisasi

Validasi administrasi:

```bash
npm run validate:admin
```

Validasi region:

```bash
npm run validate:data:region
```

Sinkronisasi BIG:

```bash
npm run sync:admin:kab
npm run sync:admin:desa
```

`sync:admin:desa` menggunakan kode administrasi sebagai identity dan memiliki retry/fallback serta perlindungan terhadap accidental shrink.

## Development

Install:

```bash
npm install
```

Development:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Production:

```bash
npm run build
npm run start
```

## PWA & SEO

PWA:

```text
app/manifest.js
components/PwaRegister.jsx
public/sw.js
public/pwa/
```

SEO:

```text
metadata
canonical
Open Graph
robots.js
sitemap.js
structured data
```

Production URL:

```env
NEXT_PUBLIC_SITE_URL=https://example.com
```

## Prinsip Pengembangan

* Perbaiki **root cause**, bukan workaround.
* Jangan ubah UI/HTML besar-besaran untuk bug logic.
* Jangan membuat satu layer merusak layer lain.
* Jangan recreate map tanpa alasan.
* Jangan kehilangan interaction setelah pindah wilayah.
* Jangan menggunakan nama sebagai identity jika tersedia kode.
* Jangan mengarang lokasi data.

### Mental Model

```text
GeoJSON
   ↓
Layer Registry
   ↓
GIS Rules
   ↓
MapCanvas / Leaflet
   ↓
Application State
   ↓
UI
```

Sebelum mengubah behavior map, pastikan perubahan tidak merusak **layer lifecycle, region context, event handling, atau interaction layer lain**.
