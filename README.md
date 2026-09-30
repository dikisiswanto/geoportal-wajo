# Geoportal Kabupaten Wajo

Geoportal ini adalah aplikasi web untuk melihat dan menjelajahi data geospasial Kabupaten Wajo secara interaktif.

Tampilan utama berfokus pada peta. Pengguna dapat membuka katalog layer, menyalakan atau mematikan data, melihat legenda, mencari layer, lalu mengeklik objek di peta untuk melihat atributnya.

## Yang tersedia

- Basemap OpenStreetMap tanpa API key.
- Katalog layer yang dapat dicari dan difilter berdasarkan kelompok.
- Batas administrasi dan kecamatan aktif secara default.
- Nama kecamatan ditampilkan langsung pada area kecamatan.
- Polygon diberi warna agar perbedaan wilayah mudah dibaca.
- Layer jaringan dan jalan ditampilkan sebagai garis.
- Data titik menggunakan ikon yang disesuaikan dengan jenis sarana, misalnya transportasi, telekomunikasi, energi, air, dan fasilitas lainnya.
- Klik feature untuk membuka informasi atribut.
- Tombol Zoom, Home, dan Lokasi perangkat.
- Reset untuk mengembalikan layer, filter, pilihan feature, dan posisi peta ke kondisi awal.
- Panel katalog, legenda, dan informasi feature memiliki scroll internal agar layar peta tetap tersedia.

## Cara menjalankan

Pastikan Node.js sudah terpasang, kemudian dari folder project jalankan:

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` pada browser.

Untuk mode production:

```bash
npm run build
npm run start
```

## Teknologi

- Next.js App Router
- React
- JavaScript + JSX
- Tailwind CSS
- Leaflet
- Tabler Icons
- Inter melalui `next/font/google`
- GeoJSON statis di `public/data`

## Struktur project

```text
app/
  layout.jsx                 # metadata, font, global layout
  page.jsx                   # halaman utama + structured data
  globals.css                # reset, Leaflet, accessibility, basemap tint
  loading.jsx
  error.jsx
  manifest.js
  robots.js
  sitemap.js

components/
  GeoPortal.jsx               # state dan orkestrasi aplikasi
  geoportal/
    GeoPortalHeader.jsx       # branding, pencarian, kontrol tampilan
    LayerCatalog.jsx          # katalog dan filter layer
    LayerRow.jsx              # satu item layer
    LayerGlyph.jsx             # simbol kecil untuk katalog
    MapCanvas.jsx              # lifecycle Leaflet + rendering GeoJSON
    MapControls.jsx            # kontrol peta di atas canvas
    IconButton.jsx             # tombol ikon reusable + tooltip
    LegendPanel.jsx            # legenda layer aktif
    FeatureInspector.jsx       # detail atribut feature
    MapStatus.jsx              # status peta + koordinat
    MobileActions.jsx          # aksi cepat mobile

lib/
  layers.js                   # registry layer dan metadata
  geo/
    format.js                 # label, formatting, legenda
    markers.js                # pemetaan jenis sarana ke ikon
    styles.js                 # simbologi geometry

public/data/
  *.geojson                   # dataset yang digunakan portal
```

## Prinsip pengembangan

### 1. Komponen kecil berdasarkan tanggung jawab

`GeoPortal.jsx` hanya mengelola state global dan menghubungkan komponen. Logika Leaflet berada di `MapCanvas.jsx`, katalog berada di `LayerCatalog.jsx`, tombol reusable berada di `IconButton.jsx`, sedangkan aturan marker dan style GIS berada di folder `lib/geo`.

Dengan pembagian ini, perubahan pada satu bagian tidak perlu membuka satu file besar. Contohnya, perubahan ikon sarana cukup dilakukan di `lib/geo/markers.js`, sedangkan perubahan warna polygon dilakukan di `lib/geo/styles.js`.

### 2. Data dimuat saat dibutuhkan

GeoJSON tidak dimuat semuanya saat halaman dibuka. Layer diambil ketika pengguna mengaktifkannya. Ini membuat first load lebih ringan, terutama karena beberapa layer berisi banyak feature.

### 3. Basemap tidak membutuhkan API key

Basemap menggunakan OpenStreetMap. Di atas tile dasar digunakan pane Leaflet khusus dengan tint tipis sehingga layer geospasial utama lebih menonjol. Leaflet menyediakan pane dengan z-index berbeda, sehingga tint ditempatkan di antara tile dasar dan vector overlay.

### 4. Accessibility

Tombol memiliki nama yang dapat dibaca screen reader, tooltip saat hover/focus, focus state yang jelas, label form, skip link, dan landmark semantik. Map juga diberi label yang menjelaskan fungsinya.

### 5. SEO

Halaman memakai semantic heading, metadata title/description, canonical URL, Open Graph metadata, `robots.js`, `sitemap.js`, dan structured data. Next.js menyediakan Metadata API serta file khusus seperti robots dan sitemap untuk kebutuhan SEO.

## Menambah layer baru

1. Tambahkan file GeoJSON ke `public/data/`.
2. Daftarkan metadata layer pada `lib/layers.js`.
3. Tentukan kelompok, geometry, warna, dan mode style.
4. Bila layer berupa point dan membutuhkan ikon khusus, tambahkan aturan pada `lib/geo/markers.js`.
5. Bila perlu simbologi khusus untuk garis/polygon, tambahkan aturan pada `lib/geo/styles.js`.

Jangan menaruh aturan simbologi langsung di banyak komponen UI. Simpan aturan GIS di `lib/geo` agar konsisten.

## Catatan data

Project ini menggunakan GeoJSON hasil ekstraksi/konversi dari data geospasial yang tersedia pada project. Aplikasi tidak mengubah sumber data pada saat runtime; browser hanya membaca file GeoJSON yang sudah disiapkan.

## Catatan deployment

Untuk deployment publik, isi `NEXT_PUBLIC_SITE_URL` dengan URL portal sebenarnya agar canonical URL, sitemap, robots, dan structured data menggunakan alamat production.
