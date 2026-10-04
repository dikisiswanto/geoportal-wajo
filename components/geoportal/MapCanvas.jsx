"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";

import { withAssetVersion } from "../../lib/assetVersion";
import { createGeoJsonLayer } from "./map/geoLayer";
import { bindMapInteraction } from "./map/interaction";
import { DEFAULT_VIEW, fitWajoBounds, findFeatureLayerAtLatLng, getInteractiveMapFitOptions } from "./map/geometry";
import {
  getAdminContextKey,
  filterGeoJsonForLayer,
  isAdministrativeLayerId,
  administrativeName
} from "./map/context";
import {
  getPrintScope,
  lockPrintViewport,
  restorePrintViewport,
  applyPrintAdministrationStyles,
  restorePrintAdministrationStyles,
  fitMapForPrint
} from "./map/print";
import {
  layerPaneName,
  ensureLayerPane,
  applyActiveAdministrationStyles
} from "./map/layerStyles";

const MapCanvas = forwardRef(function MapCanvas(
  {
    visible,
    layers,
    onFeatureSelect,
    onLayerDataLoaded,
    onLayerLoading,
    onLayerError,
    onStatus,
    onCoords,
    onViewChange,
    regionFilter,
    focusAdmin = null,
    retryTokens = {}
  },
  ref
) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);

  const layerRefs = useRef({});
  const loadedData = useRef({});
  const requestCache = useRef({});

  const tileRef = useRef(null);
  const selectedRef = useRef(null);
  const printViewRef = useRef(null);
  const printLayoutRef = useRef(null);
  const markerIconCacheRef = useRef(new Map());
  const vectorRenderersRef = useRef(new Map());
  const leafletRef = useRef(null);
  const printStyleRef = useRef(false);
  const printScopeRef = useRef(null);
  const visibleRef = useRef(visible);
  const layersRefForImperative = useRef(layers);
  const regionFilterRef = useRef(regionFilter);
  const focusAdminRef = useRef(focusAdmin);
  const nativeAdminTapRef = useRef(null);
  const resolveAdministrativeTarget = useCallback((latlng) => {
    if (!latlng) return null;

    const visibleNow = visibleRef.current || {};
    const districtLayer = visibleNow["adm-kecamatan"]
      ? layerRefs.current["adm-kecamatan"]
      : null;
    const countyLayer = visibleNow["adm-kabupaten"]
      ? layerRefs.current["adm-kabupaten"]
      : null;

    return (
      findFeatureLayerAtLatLng(districtLayer, latlng) ||
      findFeatureLayerAtLatLng(countyLayer, latlng)
    );
  }, []);

  const [errors, setErrors] = useState({});
  const [renderVersion, setRenderVersion] = useState(0);
  const retryTokensRef = useRef({});

  const onStatusRef = useRef(onStatus);
  const onCoordsRef = useRef(onCoords);
  const onLayerLoadingRef = useRef(onLayerLoading);
  const onLayerErrorRef = useRef(onLayerError);
  const onLayerDataLoadedRef =
    useRef(onLayerDataLoaded);
  const onFeatureSelectRef =
    useRef(onFeatureSelect);
  const onViewChangeRef = useRef(onViewChange);

  useEffect(() => {
    onStatusRef.current = onStatus;
  }, [onStatus]);

  useEffect(() => {
    onCoordsRef.current = onCoords;
  }, [onCoords]);

  useEffect(() => {
    onLayerLoadingRef.current = onLayerLoading;
  }, [onLayerLoading]);

  useEffect(() => {
    onLayerErrorRef.current = onLayerError;
  }, [onLayerError]);

  useEffect(() => {
    onLayerDataLoadedRef.current =
      onLayerDataLoaded;
  }, [onLayerDataLoaded]);

  useEffect(() => {
    onFeatureSelectRef.current =
      onFeatureSelect;
  }, [onFeatureSelect]);

  useEffect(() => {
    onViewChangeRef.current = onViewChange;
  }, [onViewChange]);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    layersRefForImperative.current = layers;
    regionFilterRef.current = regionFilter;
    focusAdminRef.current = focusAdmin;
  }, [layers, regionFilter, focusAdmin]);

  const loadLayerData = useCallback(
    async (layer) => {
      if (loadedData.current[layer.id]) {
        return loadedData.current[layer.id];
      }

      if (requestCache.current[layer.id]) {
        return requestCache.current[layer.id];
      }

      onLayerLoadingRef.current?.(
        layer.id,
        true
      );

      const request = fetch(
        withAssetVersion(`/geo-data/${encodeURIComponent(layer.file)}`),
        {
          cache: "force-cache"
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `HTTP ${response.status}`
            );
          }

          return response.json();
        })
        .then((data) => {
          loadedData.current[layer.id] = data;

          setErrors((previous) => {
            if (!previous[layer.id]) {
              return previous;
            }

            const next = {
              ...previous
            };

            delete next[layer.id];

            return next;
          });

          onLayerDataLoadedRef.current?.(
            layer,
            data
          );

          return data;
        })
        .catch((error) => {
          const message =
            error.message ||
            "Data belum dapat ditampilkan";

          setErrors((previous) => ({
            ...previous,
            [layer.id]: message
          }));

          onLayerErrorRef.current?.(
            layer.id,
            message
          );

          return null;
        })
        .finally(() => {
          onLayerLoadingRef.current?.(
            layer.id,
            false
          );

          delete requestCache.current[
            layer.id
          ];
        });

      requestCache.current[layer.id] =
        request;

      return request;
    },
    []
  );

  /*
   * Leaflet initialization.
   * Hanya berjalan sekali.
   */
  useEffect(() => {
    let disposed = false;
    const layerRefsSnapshot = layerRefs.current;
    const vectorRenderersSnapshot = vectorRenderersRef.current;
    const markerIconCacheSnapshot = markerIconCacheRef.current;

    import("leaflet").then((L) => {
      if (
        disposed ||
        !mapNode.current ||
        mapRef.current
      ) {
        return;
      }

      const map = L.map(
        mapNode.current,
        {
          zoomControl: false,
          preferCanvas: true,
          attributionControl: true,
          minZoom: 7,
          maxZoom: 19,
          zoomSnap: 1,
          zoomDelta: 1
        }
      ).setView(
        DEFAULT_VIEW,
        11
      );

      const tintPane =
        map.createPane(
          "basemapTint"
        );

      tintPane.style.zIndex =
        "250";

      tintPane.style.pointerEvents =
        "none";

      const adminCountyPane = map.createPane("adminCounty");
      adminCountyPane.style.zIndex = "320";

      const adminDistrictPane = map.createPane("adminDistrict");
      adminDistrictPane.style.zIndex = "330";

      const adminVillagePane = map.createPane("adminVillage");
      adminVillagePane.style.zIndex = "340";

      const adminLabelPane = map.createPane("adminLabel");
      adminLabelPane.style.zIndex = "350";
      adminLabelPane.style.pointerEvents = "none";

      const featureTooltipPane = map.createPane("featureTooltip");
      featureTooltipPane.style.zIndex = "1200";
      featureTooltipPane.style.pointerEvents = "none";

      L.DomUtil.create(
        "div",
        "leaflet-basemap-tint",
        tintPane
      );

      const osm =
        L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            maxNativeZoom: 19,
            tileSize: 256,
            updateWhenIdle: true,
            keepBuffer: 2,
            crossOrigin: true,
            attribution:
              "&copy; OpenStreetMap contributors"
          }
        );

      osm.on(
        "loading",
        () =>
          onStatusRef.current?.(
            "Menyiapkan peta dasar…"
          )
      );

      osm.on(
        "load",
        () =>
          onStatusRef.current?.(
            "Peta dasar siap"
          )
      );

      osm.on(
        "tileerror",
        () =>
          onStatusRef.current?.(
            "Peta dasar tidak dapat dimuat"
          )
      );

      osm.addTo(map);

      tileRef.current = osm;

      bindMapInteraction({
        map,
        layerRefs,
        vectorRenderers: vectorRenderersRef.current,
        visibleRef,
        focusAdminRef,
        selectedRef,
        nativeAdminTapRef,
        resolveAdministrativeTarget,
        onCoordsRef,
        onStatusRef,
        onViewChangeRef
      });

      mapRef.current = map;
      leafletRef.current = L;
      setRenderVersion((value) => value + 1);

      map.whenReady(() => {
        window.requestAnimationFrame(
          () =>
            map.invalidateSize({
              pan: false
            })
        );
      });

      const beforePrint = () => {
        if (!mapRef.current) return;

        if (!printViewRef.current) {
          const center = map.getCenter();
          printViewRef.current = {
            lat: center.lat,
            lng: center.lng,
            zoom: map.getZoom()
          };
        }

        const scope = printScopeRef.current || getPrintScope(L, {
          regionFilter: regionFilterRef.current,
          focusAdmin: focusAdminRef.current,
          countyData: loadedData.current["adm-kabupaten"],
          districtData: loadedData.current["adm-kecamatan"],
          villageData: loadedData.current["adm-desa"]
        });

        if (scope) {
          applyPrintAdministrationStyles(layerRefs.current, loadedData.current, scope);
          printStyleRef.current = true;
          fitMapForPrint(map, scope, printLayoutRef);
        }
      };

      const afterPrint = () => {
        if (!mapRef.current || !printViewRef.current) {
          restorePrintAdministrationStyles(layerRefs.current);
          printStyleRef.current = false;
          printScopeRef.current = null;
          restorePrintViewport(map, printLayoutRef);
          return;
        }

        const view = printViewRef.current;

        window.requestAnimationFrame(() => {
          const printedScope = printScopeRef.current;
          restorePrintAdministrationStyles(layerRefs.current);
          if (printedScope?.type === "kecamatan" || printedScope?.type === "desa") {
            applyActiveAdministrationStyles(
              layerRefs.current,
              loadedData.current,
              {
                focusAdmin: { type: printedScope.type, feature: printedScope.feature },
                regionFilter: printedScope.type === "kecamatan" ? administrativeName(printedScope.feature, "kecamatan") : ""
              }
            );
          }
          printStyleRef.current = false;
          printScopeRef.current = null;
          restorePrintViewport(map, printLayoutRef);
          map.invalidateSize({ pan: false, debounceMoveend: false });

          map.setView([view.lat, view.lng], view.zoom, { animate: false });

          window.requestAnimationFrame(() => {
            map.invalidateSize({ pan: false });
            printViewRef.current = null;
          });
        });
      };

      window.addEventListener(
        "beforeprint",
        beforePrint
      );

      window.addEventListener(
        "afterprint",
        afterPrint
      );

      map._wajoPrintHandlers = {
        beforePrint,
        afterPrint
      };

      onStatusRef.current?.(
        "Peta siap"
      );
    });

    return () => {
      disposed = true;

      const map =
        mapRef.current;

      if (
        map?._wajoPrintHandlers
      ) {
        window.removeEventListener(
          "beforeprint",
          map._wajoPrintHandlers
            .beforePrint
        );

        window.removeEventListener(
          "afterprint",
          map._wajoPrintHandlers
            .afterPrint
        );
      }

      map?._wajoInteractionCleanup?.();
      if (map) {
        delete map._wajoInteractionCleanup;
        delete map._wajoPointerHandlers;
        delete map._wajoCoordsTimer;
        map.remove?.();
      }

      mapRef.current = null;
      leafletRef.current = null;
      tileRef.current = null;
      printViewRef.current = null;
      restorePrintAdministrationStyles(layerRefsSnapshot);
      printStyleRef.current = false;
      printScopeRef.current = null;
      restorePrintViewport(map, printLayoutRef);
      vectorRenderersSnapshot.clear();
      markerIconCacheSnapshot.clear();
      Object.values(layerRefsSnapshot).forEach((layerGroup) => layerGroup?.remove?.());
    };
  }, [resolveAdministrativeTarget]);

  useEffect(() => {
    const changedIds = layers
      .map((layer) => layer.id)
      .filter((id) => (retryTokens[id] || 0) !== (retryTokensRef.current[id] || 0));

    if (!changedIds.length) return;

    retryTokensRef.current = { ...retryTokens };
    setErrors((previous) => {
      const next = { ...previous };
      changedIds.forEach((id) => delete next[id]);
      return next;
    });
  }, [layers, retryTokens]);

  /*
   * Load data hanya ketika layer aktif.
   */
  useEffect(() => {
    const active =
      layers.filter(
        (layer) =>
          visible[layer.id] &&
          !loadedData.current[
            layer.id
          ] &&
          !errors[layer.id]
      );

    if (!active.length) {
      return;
    }

    Promise.all(
      active.map(loadLayerData)
    ).then(() =>
      setRenderVersion(
        (value) => value + 1
      )
    );
  }, [
    layers,
    loadLayerData,
    visible,
    errors
  ]);

  /*
   * Render vector layers.
   * Administrative layers remain mounted so their interaction never
   * disappears under thematic data. Thematic/vector layers reuse their
   * existing GeoJSON container and only replace feature children when the
   * administrative context changes.
   */
  const previousMapContextKeyRef = useRef(null);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    const contextKey = getAdminContextKey(regionFilter, focusAdmin);
    const contextChanged =
      previousMapContextKeyRef.current !== null &&
      previousMapContextKeyRef.current !== contextKey;

    if (contextChanged) {
      selectedRef.current?.setStyle?.(
        selectedRef.current?.__wajoBaseStyle || {}
      );
      selectedRef.current?.setZIndexOffset?.(
        selectedRef.current?.__wajoBaseZIndexOffset ?? 0
      );
      selectedRef.current = null;
    }

    previousMapContextKeyRef.current = contextKey;

    layers.forEach((layer, layerIndex) => {
      const existing = layerRefs.current[layer.id];
      const sourceData = loadedData.current[layer.id];

      if (!visible[layer.id] || !sourceData) {
        if (existing) {
          const paneName = layerPaneName(layer);
          existing.remove();
          delete layerRefs.current[layer.id];

          if (!isAdministrativeLayerId(layer.id)) {
            const renderer = vectorRenderersRef.current.get(paneName);
            if (renderer && Object.keys(renderer._layers || {}).length === 0) {
              renderer.remove?.();
              vectorRenderersRef.current.delete(paneName);
            }
          }
        }
        return;
      }

      // Kabupaten dan kecamatan tetap mounted. Batas desa bersifat
      // context-sensitive karena isi feature dan label mengikuti wilayah aktif.
      const renderKey = layer.id === "adm-desa" || !isAdministrativeLayerId(layer.id)
        ? `${layer.id}:${contextKey}`
        : `admin:${layer.id}`;

      if (existing) {
        if (existing.__wajoRenderKey !== renderKey) {
          const renderData = filterGeoJsonForLayer(
            layer,
            sourceData,
            regionFilter,
            loadedData.current["adm-kecamatan"],
            focusAdmin
          );

          existing.clearLayers();
          existing.addData(renderData);
          existing.__wajoRenderKey = renderKey;
        }
        return;
      }

      const renderData = filterGeoJsonForLayer(
        layer,
        sourceData,
        regionFilter,
        loadedData.current["adm-kecamatan"],
        focusAdmin
      );

      const paneName = ensureLayerPane(map, layer, layerIndex);

      let vectorRenderer = vectorRenderersRef.current.get(paneName);
      if (!vectorRenderer) {
        vectorRenderer = isAdministrativeLayerId(layer.id)
          ? L.svg({ pane: paneName })
          : L.canvas({ pane: paneName, padding: 0.45 });
        vectorRenderersRef.current.set(paneName, vectorRenderer);
      }

      const geoLayer = createGeoJsonLayer({
        L,
        renderData,
        layer,
        vectorRenderer,
        paneName,
        map,
        loadedData: loadedData.current,
        markerIconCache: markerIconCacheRef.current,
        selectedRef,
        onFeatureSelectRef,
        resolveAdministrativeTarget
      }).addTo(map);
      geoLayer.__wajoRenderKey = renderKey;
      layerRefs.current[layer.id] = geoLayer;
    });

    applyActiveAdministrationStyles(
      layerRefs.current,
      loadedData.current,
      { focusAdmin, regionFilter }
    );

    const adminLayer = layerRefs.current["adm-kecamatan"];
    if (
      adminLayer &&
      visible["adm-kecamatan"] &&
      !map._wajoInitialFit
    ) {
      if (adminLayer.getBounds().isValid()) {
        fitWajoBounds(map, L, adminLayer.toGeoJSON());
      }
      map._wajoInitialFit = true;
    }
  }, [layers, visible, renderVersion, regionFilter, focusAdmin, resolveAdministrativeTarget]);

  useImperativeHandle(
    ref,
    () => ({
      isReady: () =>
        !!mapRef.current,

      zoomIn: () =>
        mapRef.current?.zoomIn(),

      zoomOut: () =>
        mapRef.current?.zoomOut(),

      zoomHome: () => {
        if (!mapRef.current) {
          return;
        }

        import("leaflet").then(
          (L) => {
            const countyData = loadedData.current["adm-kabupaten"];
            if (countyData && fitWajoBounds(mapRef.current, L, countyData)) {
              return;
            }

            const districtData = loadedData.current["adm-kecamatan"];
            if (districtData && fitWajoBounds(mapRef.current, L, districtData)) {
              return;
            }

            mapRef.current.setView(
              DEFAULT_VIEW,
              11
            );
          }
        );
      },

      setView: ({ lat, lng, zoom } = {}) => {
        if (!mapRef.current || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
        mapRef.current.setView([lat, lng], Number.isFinite(zoom) ? zoom : mapRef.current.getZoom(), { animate: false });
      },

      zoomToRegion: (regionName) => {
        if (!mapRef.current || !regionName) return;
        const adminData = loadedData.current["adm-kecamatan"];
        if (!adminData?.features?.length) return;
        import("leaflet").then((L) => {
          const feature = adminData.features.find((item) =>
            String(item?.properties?.Kecamatan ?? item?.properties?.WADMKC ?? item?.properties?.NAMOBJ ?? "").trim().toLowerCase() === String(regionName).trim().toLowerCase()
          );
          if (!feature) return;
          const bounds = L.geoJSON(feature).getBounds();
          if (bounds.isValid()) {
            mapRef.current.fitBounds(bounds, getInteractiveMapFitOptions(mapRef.current, {
              horizontal: 56,
              vertical: 56,
              maxZoom: 13,
              animate: true
            }));
          }
        });
      },

      selectFeature: (layerId, key) => {
        const group = layerRefs.current[layerId];
        if (!group || key == null) return false;
        let target = null;
        group.eachLayer?.((candidate) => {
          if (target) return;
          if (candidate?.__wajoFeatureKey != null && String(candidate.__wajoFeatureKey) === String(key)) {
            target = candidate;
          }
        });
        if (!target) return false;
        target.fire?.("click");
        return true;
      },

      shareView: () => {
        if (!mapRef.current) return null;
        const center = mapRef.current.getCenter();
        return {
          lat: Number(center.lat.toFixed(5)),
          lng: Number(center.lng.toFixed(5)),
          zoom: mapRef.current.getZoom()
        };
      },

      locateMe: () => {
        if (
          !navigator.geolocation ||
          !mapRef.current
        ) {
          onStatus?.(
            "Lokasi perangkat tidak tersedia"
          );

          return;
        }

        onStatus?.(
          "Mencari lokasi…"
        );

        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            mapRef.current.setView(
              [
                coords.latitude,
                coords.longitude
              ],
              15
            );

            onStatus?.(
              "Lokasi ditemukan"
            );
          },

          () =>
            onStatus?.(
              "Lokasi tidak tersedia"
            ),

          {
            enableHighAccuracy:
              true,
            timeout: 10000
          }
        );
      },

      preparePrint: async () => {
        const map = mapRef.current;
        if (!map) return false;

        const L = await import("leaflet");

        if (!printViewRef.current) {
          const center = map.getCenter();
          printViewRef.current = { lat: center.lat, lng: center.lng, zoom: map.getZoom() };
        }

        const activeIds = layers.filter((layer) => visible[layer.id]).map((layer) => layer.id);
        const startedAt = performance.now();
        while (activeIds.some((id) => !loadedData.current[id] && !errors[id]) && performance.now() - startedAt < 5000) {
          await new Promise((resolve) => window.setTimeout(resolve, 80));
        }

        const scope = getPrintScope(L, {
          regionFilter,
          focusAdmin,
          countyData: loadedData.current["adm-kabupaten"],
          districtData: loadedData.current["adm-kecamatan"],
          villageData: loadedData.current["adm-desa"]
        });

        if (!scope) return false;

        restorePrintAdministrationStyles(layerRefs.current);
        printScopeRef.current = scope;
        applyPrintAdministrationStyles(layerRefs.current, loadedData.current, scope);
        printStyleRef.current = true;
        fitMapForPrint(map, scope, printLayoutRef);

        await new Promise((resolve) => {
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              fitMapForPrint(map, scope, printLayoutRef);
              map.invalidateSize({ pan: false, debounceMoveend: false });
              resolve();
            });
          });
        });

        return true;
      },

      zoomToLayer: (layerId) => {
        if (!mapRef.current) return;

        const renderedLayer = layerRefs.current[layerId];
        const renderedBounds = renderedLayer?.getBounds?.();
        if (renderedBounds?.isValid?.()) {
          mapRef.current.fitBounds(
            renderedBounds,
            getInteractiveMapFitOptions(mapRef.current, {
              horizontal: 44,
              vertical: 44,
              maxZoom: regionFilterRef.current ? 15 : 14,
              animate: true
            })
          );
          return;
        }

        const data = loadedData.current[layerId];
        const layerConfig = layersRefForImperative.current.find((item) => item.id === layerId);
        if (!data || !layerConfig) return;

        import("leaflet").then((L) => {
          const scoped = filterGeoJsonForLayer(
            layerConfig,
            data,
            regionFilterRef.current,
            loadedData.current["adm-kecamatan"],
            focusAdminRef.current
          );
          const bounds = L.geoJSON(scoped).getBounds();
          if (bounds.isValid()) {
            mapRef.current.fitBounds(
              bounds,
              getInteractiveMapFitOptions(mapRef.current, {
                horizontal: 44,
                vertical: 44,
                maxZoom: regionFilterRef.current ? 15 : 14,
                animate: true
              })
            );
          }
        });
      },

      zoomToFeature: (
        selection
      ) => {
        if (
          !selection ||
          !mapRef.current
        ) {
          return;
        }

        import("leaflet").then(
          (L) => {
            const bounds =
              L.geoJSON(
                selection.feature
              ).getBounds();

            if (
              bounds.isValid()
            ) {
              mapRef.current.fitBounds(
                bounds,
                getInteractiveMapFitOptions(mapRef.current, {
                  horizontal: 44,
                  vertical: 44,
                  maxZoom: 17,
                  animate: false
                })
              );
            }
          }
        );
      },

      clearSelection: () => {
        if (
          !selectedRef.current
        ) {
          return;
        }

        const layer =
          Object.values(
            layerRefs.current
          ).find(
            (candidate) =>
              candidate?.hasLayer?.(
                selectedRef.current
              )
          );

        void layer;

        selectedRef.current?.setStyle?.(
          selectedRef.current
            .__wajoBaseStyle || {
            weight: 1.05
          }
        );

        selectedRef.current =
          null;
      }
    }),
    [onStatus, regionFilter, focusAdmin, layers, visible, errors]
  );

  return (
    <>
      <p
        id="map-instructions"
        className="sr-only"
      >
        Gunakan daftar data untuk menampilkan informasi pada peta.
        Pilih wilayah atau lokasi pada peta untuk melihat informasinya.
      </p>

      <div
        ref={mapNode}
        className="absolute inset-0"
        role="region"
        aria-label="Peta Interaktif Kabupaten Wajo"
        aria-describedby="map-instructions"
      />
    </>
  );
});

export default MapCanvas;
