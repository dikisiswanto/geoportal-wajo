# Geoportal Wajo — Next.js / React / JavaScript

Starter geoportal Kabupaten Wajo yang fokus pada UI GIS sederhana, cepat, accessible, dan mudah dikembangkan.

## Stack

- Next.js App Router
- React 19
- JavaScript + JSX only
- Tailwind CSS
- Leaflet
- Tabler Icons
- Inter via `next/font/google`
- Static GeoJSON di `public/data`

## Arsitektur komponen

```text
app/
  layout.jsx
  page.jsx
  globals.css
  loading.jsx
  error.jsx
  manifest.js
  robots.js
  sitemap.js

components/
  GeoPortal.jsx                 # coordinator/state container
  geoportal/
    GeoPortalHeader.jsx         # header + layer search
    LayerCatalog.jsx            # catalog + filtering
    LayerRow.jsx                # single layer row
    LayerGlyph.jsx              # layer type glyph
    MapCanvas.jsx               # Leaflet lifecycle + GeoJSON rendering
    MapControls.jsx             # zoom/home/location controls
    LegendPanel.jsx             # active layer legend
    FeatureInspector.jsx        # feature identify panel
    MapStatus.jsx               # coordinate/status strip
    MobileActions.jsx            # mobile map actions

lib/
  layers.js                     # layer registry / metadata
  geo/
    format.js                   # display formatting + legend data
    markers.js                  # semantic point marker mapping
    styles.js                   # GIS symbology
```

## Prinsip refactor

`GeoPortal.jsx` hanya mengorkestrasi state dan komponen. Lifecycle Leaflet serta rendering GeoJSON dipusatkan di `MapCanvas.jsx`, sedangkan styling, marker, formatting, dan setiap bagian UI dipisah agar lebih mudah dirawat dan diuji.

Layer data tetap lazy-loaded ketika diaktifkan. Default map hanya menampilkan batas administrasi dan kecamatan.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Catatan

Tidak ada API key yang diperlukan. Basemap menggunakan OpenStreetMap. GeoJSON dibaca dari file lokal/static di `public/data`.

## Runtime bugfix

The latest refactor stabilizes callback identities passed to `MapCanvas` with `useCallback`.
This prevents the Leaflet initialization effect from being torn down and recreated on every
parent render, avoiding React's `Maximum update depth exceeded` loop. OSM initialization remains
inside the single Leaflet setup lifecycle.
