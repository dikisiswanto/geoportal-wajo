# Peta Interaktif Kabupaten Wajo

Aplikasi web untuk melihat dan menjelajahi data geospasial Kabupaten Wajo secara interaktif. Antarmuka berfokus pada peta dengan katalog layer, legenda, pencarian, kontrol peta, dan informasi atribut feature.

## Fitur utama

- Basemap OpenStreetMap tanpa API key.
- Katalog layer dengan pencarian dan filter kelompok.
- Batas Administrasi dan Batas Kecamatan aktif secara default.
- Label nama kecamatan ditampilkan pada peta.
- Layer polygon, garis, dan titik dengan simbologi yang konsisten.
- Ikon Tabler untuk layer titik, termasuk OPD dan Puskesmas.
- Inspector universal untuk melihat atribut feature.
- Zoom, Home, lokasi perangkat, dan Reset.
- Panel katalog, legenda, dan inspector dengan scroll internal.
- Loading screen saat aplikasi pertama kali dibuka.
- Branding dan favicon menggunakan aset logo lokal Kabupaten Wajo.
- PWA installable dengan manifest, service worker, dan cache aset/data lokal.
- SEO dasar, accessibility, print map, dan responsive layout.

## Teknologi

- Next.js App Router
- React
- JavaScript + JSX
- Tailwind CSS
- Leaflet
- Tabler Icons
- Inter melalui `next/font/google`
- GeoJSON statis di `public/geo-data`

## Struktur project

```text
app/
  layout.jsx              # metadata, font, global layout
  page.jsx                # halaman utama + structured data
  globals.css             # global style, Leaflet, accessibility
  loading.jsx             # loading screen
  error.jsx               # error boundary
  manifest.js             # PWA manifest
  robots.js               # robots.txt
  sitemap.js              # sitemap.xml

components/
  GeoPortal.jsx           # state dan orkestrasi aplikasi
  geoportal/
    GeoPortalHeader.jsx   # branding, pencarian, kontrol tampilan
    LayerCatalog.jsx      # katalog dan filter layer
    LayerRow.jsx          # item layer
    LayerGlyph.jsx        # simbol katalog
    MapCanvas.jsx         # lifecycle Leaflet + GeoJSON
    MapControls.jsx       # kontrol peta
    IconButton.jsx        # tombol ikon reusable + tooltip
    LegendPanel.jsx       # legenda layer aktif
    FeatureInspector.jsx  # detail atribut feature
    MapStatus.jsx         # status peta + koordinat
    MobileActions.jsx     # aksi cepat mobile
    PrintLegend.jsx       # legenda untuk print

lib/
  layers.js               # registry layer dan metadata
  geo/
    format.js             # formatting dan legenda
    markers.js            # pemetaan ikon point
    styles.js             # simbologi GIS

public/
  brand/
    logo-kabupaten-wajo.png
  geo-data/
    *.geojson              # dataset portal

```

## Data dan penamaan

Nama layer di UI menggunakan istilah geografis/formal tanpa tahun. Tahun dataset disimpan sebagai metadata pada `lib/layers.js` bila tersedia.

```text
Jaringan Jalan
Sumber: Data Jaringan Jalan Kabupaten Wajo
Tahun: 2020
```

File GeoJSON menggunakan konvensi `lowercase-kebab-case`, misalnya:

```text
batas-administrasi.geojson
batas-kecamatan.geojson
organisasi-perangkat-daerah.geojson
puskesmas.geojson
potensi-pertanian.geojson
potensi-peternakan.geojson
```

`lib/layers.js` menjadi registry utama untuk nama tampilan, file, kelompok, geometry, style, sumber, tahun data, dan konfigurasi inspector.

Layer potensi hanya menampilkan wilayah yang memiliki nilai potensi. Record dengan nilai potensi kosong tidak dirender.

## Performa

GeoJSON dimuat secara lazy saat layer diaktifkan. Dataset telah dipadatkan untuk mengurangi ukuran transfer, vector layer menggunakan Canvas Leaflet, dan perubahan visibility diproses secara incremental agar layer lain tidak perlu dibangun ulang.

Ikon point menggunakan cache, sedangkan update koordinat kursor dibatasi agar tidak memicu render React berlebihan.

## PWA

PWA menggunakan `app/manifest.js`, `public/sw.js`, ikon lokal di `public/pwa/`, dan registrasi service worker pada `components/PwaRegister.jsx`. Service worker mencache shell aplikasi, branding, ikon, GeoJSON, serta aset Next.js yang sudah pernah dimuat. Basemap OpenStreetMap tetap membutuhkan koneksi saat tile belum tersedia di cache browser.

## Menjalankan project

Gunakan Node.js yang sesuai dengan dependency project, lalu dari folder project jalankan:

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Untuk production:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

## Menambah layer

1. Tambahkan GeoJSON ke `public/geo-data/` dengan nama `lowercase-kebab-case.geojson`.
2. Tambahkan metadata layer ke `lib/layers.js`.
3. Tentukan kelompok, geometry, sumber data, dan style.
4. Untuk point, tambahkan pemetaan ikon di `lib/geo/markers.js` bila diperlukan.
5. Untuk simbologi khusus garis/polygon, tambahkan aturan di `lib/geo/styles.js`.

Hindari menaruh aturan GIS langsung di banyak komponen UI agar simbologi tetap terpusat dan konsisten.

## Accessibility dan SEO

Aplikasi menggunakan label yang dapat dibaca screen reader, focus state, tooltip hover/focus, skip link, landmark semantik, metadata halaman, canonical URL, Open Graph, `robots.js`, `sitemap.js`, dan structured data.

## Deployment

Untuk deployment publik, isi `NEXT_PUBLIC_SITE_URL` dengan URL production agar canonical URL, sitemap, robots, dan structured data mengarah ke alamat yang benar.

Pastikan seluruh file di `public/geo-data/` dan `public/brand/` ikut dipublikasikan.

## Catatan data

Portal membaca GeoJSON statis yang sudah disiapkan di project. Tidak ada proses perubahan sumber data saat runtime.
### Batas Kabupaten Wajo

Layer **Batas Kabupaten Wajo** menggunakan referensi Badan Informasi Geospasial (BIG), edisi Juni 2026. Paket ini menyediakan geometri awal hasil penggabungan 14 batas kecamatan BIG 2026 agar peta dapat langsung digunakan. Untuk mengambil feature kabupaten secara langsung dari layanan `BATAS_KABKOTA_AR_2026`, jalankan `npm run sync:admin:kab`.
