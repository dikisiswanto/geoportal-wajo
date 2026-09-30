"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { markerIconMarkup, pointKind } from "../../lib/geo/markers";
import { featureLabel } from "../../lib/geo/format";
import { styleFor } from "../../lib/geo/styles";

const DEFAULT_VIEW = [-4.13, 120.03];

const MapCanvas = forwardRef(function MapCanvas({ visible, layers, onFeatureSelect, onLayerDataLoaded, onLayerLoading, onLayerError, onStatus, onCoords }, ref) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const layerRefs = useRef({});
  const loadedData = useRef({});
  const requestCache = useRef({});
  const tileRef = useRef(null);
  const selectedRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [renderVersion, setRenderVersion] = useState(0);

  const loadLayerData = useCallback(async (layer) => {
    if (loadedData.current[layer.id]) return loadedData.current[layer.id];
    if (requestCache.current[layer.id]) return requestCache.current[layer.id];

    onLayerLoading?.(layer.id, true);
    const request = fetch(`/data/${encodeURIComponent(layer.file)}`, { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        loadedData.current[layer.id] = data;
        setErrors((previous) => {
          if (!previous[layer.id]) return previous;
          const next = { ...previous };
          delete next[layer.id];
          return next;
        });
        onLayerDataLoaded?.(layer, data);
        return data;
      })
      .catch((error) => {
        setErrors((previous) => ({ ...previous, [layer.id]: error.message || "Gagal memuat layer" }));
        onLayerError?.(layer.id, error.message || "Gagal memuat layer");
        return null;
      })
      .finally(() => {
        onLayerLoading?.(layer.id, false);
        delete requestCache.current[layer.id];
      });

    requestCache.current[layer.id] = request;
    return request;
  }, [onLayerDataLoaded, onLayerError, onLayerLoading]);

  useEffect(() => {
    let disposed = false;
    import("leaflet").then((L) => {
      if (disposed || !mapNode.current || mapRef.current) return;
      const map = L.map(mapNode.current, {
        zoomControl: false,
        preferCanvas: true,
        attributionControl: true,
        minZoom: 7,
        maxZoom: 19,
        zoomSnap: 1,
        zoomDelta: 1
      }).setView(DEFAULT_VIEW, 11);

      // Keep the basemap visually quieter while vector data remains fully legible.
      // Leaflet places tiles at z-index 200 and vector overlays at 400 by default.
      const tintPane = map.createPane("basemapTint");
      tintPane.style.zIndex = "250";
      tintPane.style.pointerEvents = "none";
      L.DomUtil.create("div", "leaflet-basemap-tint", tintPane);

      const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        maxNativeZoom: 19,
        tileSize: 256,
        updateWhenIdle: true,
        keepBuffer: 2,
        crossOrigin: true,
        attribution: "&copy; OpenStreetMap contributors"
      });

      osm.on("loading", () => onStatus?.("Memuat peta dasar OpenStreetMap…"));
      osm.on("load", () => onStatus?.("Peta dasar OpenStreetMap siap"));
      osm.on("tileerror", () => onStatus?.("Peta dasar OpenStreetMap tidak dapat dimuat"));
      osm.addTo(map);
      tileRef.current = osm;

      map.on("mousemove", (event) => onCoords?.(`${event.latlng.lat.toFixed(5)}, ${event.latlng.lng.toFixed(5)}`));
      map.on("zoomend", () => onStatus?.(`Zoom ${map.getZoom()} · WGS84`));
      mapRef.current = map;
      map.whenReady(() => {
        window.requestAnimationFrame(() => map.invalidateSize());
      });
      onStatus?.("Peta siap");
    });
    return () => { disposed = true; mapRef.current?.remove(); mapRef.current = null; tileRef.current = null; };
  }, [onCoords, onStatus]);

  useEffect(() => {
    const active = layers.filter((layer) => visible[layer.id] && !loadedData.current[layer.id] && !errors[layer.id]);
    if (!active.length) return;
    Promise.all(active.map(loadLayerData)).then(() => setRenderVersion((value) => value + 1));
  }, [layers, loadLayerData, visible, errors]);

  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((L) => {
      layers.forEach((layer) => {
        layerRefs.current[layer.id]?.remove();
        delete layerRefs.current[layer.id];
        if (!visible[layer.id] || !loadedData.current[layer.id]) return;

        const geoLayer = L.geoJSON(loadedData.current[layer.id], {
          style: (feature) => styleFor(layer, feature),
          pointToLayer: (feature, latlng) => {
            if (layer.group === "Infrastruktur" || layer.styleMode === "toponym") {
              const kind = pointKind(layer, feature);
              if (kind === "place") return L.circleMarker(latlng, { radius: 3.5, color: "#fff", weight: 1, fillColor: layer.color, fillOpacity: 0.85 });
              return L.marker(latlng, { icon: L.divIcon({ className: "", html: markerIconMarkup(kind, layer.color), iconSize: [30, 30], iconAnchor: [15, 15] }) });
            }
            return L.circleMarker(latlng, { radius: 4, color: "#fff", weight: 1, fillColor: layer.color, fillOpacity: 0.82 });
          },
          onEachFeature: (feature, featureLayer) => {
            const baseStyle = styleFor(layer, feature);
            const isPolygon = layer.geometry === "Polygon" || featureLayer instanceof L.Polygon;

            featureLayer.on("click", () => {
              selectedRef.current?.setStyle?.(selectedRef.current.__wajoBaseStyle || {});
              selectedRef.current = featureLayer;
              featureLayer.__wajoBaseStyle = baseStyle;
              featureLayer.setStyle?.({ weight: isPolygon ? 2.6 : 2.8, color: "#0f172a", fillOpacity: isPolygon ? 0.82 : baseStyle.fillOpacity });
              onFeatureSelect?.({ layer, feature });
            });

            if (isPolygon) {
              featureLayer.__wajoBaseStyle = baseStyle;
              featureLayer.on("mouseover", () => {
                if (selectedRef.current === featureLayer) return;
                featureLayer.setStyle({ weight: 2.05, color: "#334155", fillOpacity: Math.min(0.82, (baseStyle.fillOpacity ?? 0.7) + 0.12) });
                featureLayer.bringToFront?.();
              });
              featureLayer.on("mouseout", () => {
                if (selectedRef.current === featureLayer) return;
                featureLayer.setStyle(baseStyle);
              });
            }

            if (layer.styleMode === "admin" && feature.properties?.Kecamatan) {
              featureLayer.bindTooltip(String(feature.properties.Kecamatan), { permanent: true, direction: "center", className: "leaflet-kecamatan-label", opacity: 1, interactive: false });
            } else {
              const label = featureLabel(layer, feature);
              const tooltipOptions = { sticky: true, direction: "auto", opacity: 0.96, offset: [10, 0], className: "leaflet-smart-tooltip" };
              if (layer.group === "Infrastruktur" && feature.properties?.NAMOBJ) featureLayer.bindTooltip(String(feature.properties.NAMOBJ), tooltipOptions);
              else if (layer.styleMode === "toponym" || (label && layer.labelField && layer.geometry === "Point")) featureLayer.bindTooltip(String(label), tooltipOptions);
            }
          }
        }).addTo(mapRef.current);
        layerRefs.current[layer.id] = geoLayer;
      });

      const admin = loadedData.current["adm-kecamatan"];
      if (admin && visible["adm-kecamatan"] && !mapRef.current._wajoInitialFit) {
        const bounds = L.geoJSON(admin).getBounds();
        if (bounds.isValid()) mapRef.current.fitBounds(bounds, { padding: [36, 36], maxZoom: 12 });
        mapRef.current._wajoInitialFit = true;
      }
    });
  }, [layers, visible, renderVersion, onFeatureSelect]);

  useImperativeHandle(ref, () => ({
    isReady: () => !!mapRef.current,
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    zoomHome: () => {
      if (!mapRef.current) return;
      import("leaflet").then((L) => {
        const data = loadedData.current["adm-kecamatan"];
        if (data) {
          const bounds = L.geoJSON(data).getBounds();
          if (bounds.isValid()) return mapRef.current.fitBounds(bounds, { padding: [36, 36], maxZoom: 12 });
        }
        mapRef.current.setView(DEFAULT_VIEW, 11);
      });
    },
    locateMe: () => {
      if (!navigator.geolocation || !mapRef.current) return onStatus?.("Lokasi perangkat tidak tersedia");
      onStatus?.("Mencari lokasi…");
      navigator.geolocation.getCurrentPosition(
        ({ coords: position }) => { mapRef.current.setView([position.latitude, position.longitude], 15); onStatus?.("Lokasi ditemukan"); },
        () => onStatus?.("Lokasi tidak tersedia"),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },
    zoomToFeature: (selection) => {
      if (!selection || !mapRef.current) return;
      import("leaflet").then((L) => {
        const bounds = L.geoJSON(selection.feature).getBounds();
        if (bounds.isValid()) mapRef.current.fitBounds(bounds, { padding: [44, 44], maxZoom: 17 });
      });
    },
    clearSelection: () => {
      if (!selectedRef.current) return;
      const layer = Object.values(layerRefs.current).find((candidate) => candidate?.hasLayer?.(selectedRef.current));
      void layer;
      selectedRef.current?.setStyle?.(selectedRef.current.__wajoBaseStyle || { weight: 1.05 });
      selectedRef.current = null;
    }
  }), [onStatus]);

  return (
    <>
      <p id="map-instructions" className="sr-only">Gunakan katalog layer untuk menampilkan data. Klik objek pada peta untuk melihat informasi feature.</p>
      <div ref={mapNode} className="absolute inset-0" role="region" aria-label="Peta interaktif Kabupaten Wajo" aria-describedby="map-instructions" />
    </>
  );
});

export default MapCanvas;
