# Peta Interaktif Kabupaten Wajo

Aplikasi web untuk melihat dan menjelajahi data geospasial Kabupaten Wajo secara interaktif. Antarmuka berfokus pada peta dengan katalog layer, legenda, pencarian, kontrol peta, dan informasi atribut feature.

## Fitur utama

- Basemap OpenStreetMap tanpa API key.
- Katalog layer dengan pencarian dan filter kelompok.
- Batas Kabupaten Wajo dan Batas Kecamatan aktif secara default.
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
batas-kabupaten.geojson
batas-desa-kelurahan.geojson
(batas administrasi lama tidak lagi disertakan pada katalog)
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
### Administrasi Wajo

Nama dan kode wilayah disimpan dengan dua referensi agar tidak terjadi pencampuran identitas:

- `kode_kecamatan_kemendagri` dan `kode_desa` / `kode_kemendagri`: kode wilayah administrasi dari BIG/Kemendagri.
- `kode_kecamatan_bps` dan `kode_desa_bps`: kode statistik BPS.
- `nama_*_kemendagri`: nama dari sumber BIG/Kemendagri.
- `nama_*_bps`: nama yang mengikuti nomenklatur BPS dan digunakan untuk tampilan pengguna.

Untuk Kabupaten Wajo saat ini terdapat **14 kecamatan dan 190 desa/kelurahan**. Perbedaan ejaan antara BIG/Kemendagri dan BPS tidak dipaksakan menjadi satu kode; keduanya disimpan sebagai pasangan referensi yang bisa diaudit.

Setelah memperbarui data administrasi, jalankan `npm run validate:admin` untuk memastikan seluruh kode Kemendagri dan BPS unik serta seluruh 14 kecamatan dan 190 desa/kelurahan terpetakan.

### Batas Kabupaten Wajo

Layer **Batas Kabupaten Wajo** menggunakan referensi Badan Informasi Geospasial (BIG), edisi Juni 2026. Paket ini menggunakan feature Kabupaten Wajo langsung dari layanan BIG edisi Juni 2026. Batas kabupaten ditampilkan sebagai garis dasar tanpa fill agar tidak menutupi layer lain. Untuk memperbarui feature kabupaten dari BIG, jalankan `npm run sync:admin:kab`.

### Sinkronisasi batas BIG

`npm run sync:admin:desa` memperbarui batas kecamatan dan desa/kelurahan dari BIG. Script menggunakan koneksi IPv4 terlebih dahulu, retry untuk gangguan jaringan seperti `ECONNRESET`, `EAI_AGAIN`, timeout, dan kegagalan socket, lalu memeriksa hasil terhadap master Kemendagri + BPS. **Identitas/uniqueness feature selalu berdasarkan kode administrasi (`kode_kecamatan` / `kode_desa`), bukan nama.** Nama hanya digunakan untuk mencocokkan nomenklatur BPS setelah kecamatan/lokasi ditentukan oleh kode BIG. Karena itu desa dengan nama sama di kecamatan berbeda tetap tersimpan sebagai feature yang berbeda. Saat `--apply`, script juga mencegah hasil BIG yang lebih sedikit menimpa data lokal; pakai `--allow-shrink` hanya bila pengurangan kode memang disengaja.

Jika layanan BIG sedang tidak dapat dijangkau, script otomatis memakai GeoJSON lokal terakhir yang sudah ada sebagai fallback dan tetap menjalankan validasi sebelum menulis hasil. Gunakan `--remote-only` atau `BIG_ALLOW_LOCAL_FALLBACK=0` bila proses harus gagal ketika BIG tidak tersedia. Timeout dan jumlah retry dapat diatur melalui `BIG_TIMEOUT_MS` dan `BIG_RETRIES`.

### Penyaringan berdasarkan wilayah

Data tematik, fasilitas, satuan pendidikan, sarana, dan jaringan memiliki pemetaan wilayah tambahan pada setiap feature melalui `wilayah_kecamatan_kode` dan `wilayah_desa_kode`. Kode tersebut dipakai untuk penyaringan kecamatan/desa sehingga data tidak lagi bergantung pada pencarian nama atau perhitungan titik-di-poligon berulang di browser. Untuk objek jaringan atau area yang melintasi beberapa wilayah, seluruh kode wilayah yang dilewati tetap disimpan.

Setelah data administrasi atau GeoJSON tematik diperbarui, jalankan:

```bash
npm run validate:data:region
```

Pemetaan hanya disimpan bila dapat ditentukan dari kode sumber atau hubungan spasial yang dapat dipertanggungjawabkan. Data tanpa lokasi yang dapat dipastikan tetap dipertahankan, tetapi tidak dipaksakan menjadi titik perkiraan.
