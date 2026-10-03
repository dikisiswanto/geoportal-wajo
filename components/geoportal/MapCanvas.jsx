"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";

import {
  markerIconMarkup,
  pointKind
} from "../../lib/geo/markers";

import {
  featureKey,
  featureLabel
} from "../../lib/geo/format";

import {
  styleFor
} from "../../lib/geo/styles";
import { withAssetVersion } from "../../lib/assetVersion";

import {
  featureMatchesRegion,
  featureMatchesAdministrativeFeature,
  featureAdministrativeCodes,
  regionCodeFromBoundaryName,
  featureRegionName
} from "../../lib/geo/region";

const DEFAULT_VIEW = [-4.13, 120.03];

function getResponsiveHomeFitOptions(map) {
  const size = map.getSize();
  const width = Math.max(size.x || 0, 1);
  const height = Math.max(size.y || 0, 1);
  const compact = width < 768 || height < 560;

  const horizontal = Math.round(
    Math.min(64, Math.max(20, width * 0.035))
  );
  const vertical = Math.round(
    Math.min(56, Math.max(20, height * 0.035))
  );

  return {
    paddingTopLeft: [horizontal, vertical],
    paddingBottomRight: [horizontal, compact ? Math.max(64, vertical) : vertical],
    maxZoom: compact ? 11 : 12,
    animate: false
  };
}

function fitWajoBounds(map, L, data) {
  if (!map || !data) return false;

  const bounds = L.geoJSON(data).getBounds();

  if (!bounds.isValid()) return false;

  map.invalidateSize({ pan: false, debounceMoveend: true });
  map.fitBounds(bounds, getResponsiveHomeFitOptions(map));
  return true;
}

const REGION_MEMBERSHIP_CACHE = new WeakMap();

function getRegionMembership(data) {
  if (!data?.features?.length) return null;

  const cached = REGION_MEMBERSHIP_CACHE.get(data);
  if (cached?.length === data.features.length) return cached;

  const membership = data.features.map((feature) => featureAdministrativeCodes(feature, "kecamatan"));
  REGION_MEMBERSHIP_CACHE.set(data, membership);
  return membership;
}

function filterGeoJsonForLayer(layer, data, regionFilter, boundaryData, focusAdmin) {
  const filter = layer?.featureFilter;
  const hasRegionFilter = Boolean(regionFilter);

  if (!filter && !hasRegionFilter && !focusAdmin) return data;
  if (!Array.isArray(data?.features)) return data;

  const excluded = new Set(
    (filter?.excludeValues ?? []).map((value) => String(value ?? "").trim().toLowerCase())
  );
  const membership = hasRegionFilter && !["adm-kecamatan", "adm-kabupaten", "adm-desa"].includes(layer?.id)
    ? getRegionMembership(data)
    : null;
  const targetRegionCode = hasRegionFilter
    ? regionCodeFromBoundaryName(regionFilter, boundaryData)
    : "";

  const filtered = data.features.filter((feature, index) => {
    if (filter) {
      const value = feature?.properties?.[filter.field];
      const normalized = String(value ?? "").trim();
      if (filter.excludeEmpty && normalized === "") return false;
      if (excluded.has(normalized.toLowerCase())) return false;
    }

    if (focusAdmin?.feature && (focusAdmin.type === "desa" || focusAdmin.type === "kecamatan")) {
      return featureMatchesAdministrativeFeature(feature, focusAdmin.feature);
    }

    if (!hasRegionFilter || ["adm-kecamatan", "adm-kabupaten", "adm-desa"].includes(layer?.id)) {
      return true;
    }

    const regionCodes = membership?.[index] ?? featureAdministrativeCodes(feature, "kecamatan");
    if (targetRegionCode && regionCodes.length) return regionCodes.includes(targetRegionCode);

    return featureMatchesRegion(feature, regionFilter, boundaryData);
  });

  if (filtered.length === data.features.length) return data;
  return { ...data, features: filtered };
}

function layerPaneName(layer) {
  if (layer?.styleMode === "admin-county-outline") return "adminCounty";
  if (layer?.styleMode === "admin") return "adminDistrict";
  if (layer?.styleMode === "admin-village") return "adminVillage";
  return `wajoData-${String(layer?.id ?? "layer").replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function dataPaneZIndex(layer, index) {
  const geometry = String(layer?.geometry ?? "").toLowerCase();

  // Semua data tematik berada di atas batas administrasi. Di dalam data tematik,
  // titik berada paling atas, kemudian jaringan, lalu area/polygon.
  const base = geometry.includes("point")
    ? 700
    : geometry.includes("line")
      ? 600
      : 500;

  return String(base + Math.min(index, 99));
}

function ensureLayerPane(map, layer, index) {
  const paneName = layerPaneName(layer);
  const existing = map.getPane?.(paneName);

  if (existing) return paneName;

  const pane = map.createPane(paneName);
  pane.classList.add("leaflet-wajo-data-pane");
  pane.style.zIndex = dataPaneZIndex(layer, index);
  pane.style.pointerEvents = "auto";
  return paneName;
}

function selectedStyleFor(layer, baseStyle, isPolygon) {
  if (!isPolygon) {
    return {
      ...baseStyle,
      weight: 2.8,
      color: "#0f172a"
    };
  }

  if (layer?.styleMode === "admin-county-outline") {
    return {
      ...baseStyle,
      weight: 3,
      color: "#0f172a",
      fillOpacity: 0
    };
  }

  if (layer?.styleMode === "admin") {
    return {
      ...baseStyle,
      weight: 2.5,
      color: "#1e293b",
      fillOpacity: 0.46
    };
  }

  if (layer?.styleMode === "admin-village") {
    return {
      ...baseStyle,
      weight: 2.2,
      color: "#334155",
      fillOpacity: 0.18
    };
  }

  return {
    ...baseStyle,
    weight: 2.6,
    color: "#0f172a",
    fillOpacity: 0.82
  };
}

function hoverStyleFor(layer, baseStyle) {
  if (layer?.styleMode === "admin-county-outline") {
    return {
      ...baseStyle,
      weight: 2.5,
      color: "#0f172a",
      fillOpacity: 0
    };
  }

  if (layer?.styleMode === "admin") {
    return {
      ...baseStyle,
      weight: 2.1,
      color: "#334155",
      fillOpacity: 0.38
    };
  }

  if (layer?.styleMode === "admin-village") {
    return {
      ...baseStyle,
      weight: 1.4,
      color: "#64748b",
      fillOpacity: 0.05
    };
  }

  return {
    ...baseStyle,
    weight: 2.05,
    color: "#334155",
    fillOpacity: Math.min(0.82, (baseStyle.fillOpacity ?? 0.7) + 0.12)
  };
}

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
  const markerIconCacheRef = useRef(new Map());
  const vectorRenderersRef = useRef(new Map());

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

      let coordsFrame = 0;
      let latestCoords = null;

      const handleMapMouseMove = (event) => {
        latestCoords = event.latlng;

        if (coordsFrame) {
          return;
        }

        coordsFrame = window.requestAnimationFrame(() => {
          coordsFrame = 0;

          if (!latestCoords) {
            return;
          }

          onCoordsRef.current?.(
            `${latestCoords.lat.toFixed(5)}, ${latestCoords.lng.toFixed(5)}`
          );
        });
      };

      map.on("mousemove", handleMapMouseMove);

      map.on(
        "zoomend",
        () =>
          onStatusRef.current?.(
            `Zoom ${map.getZoom()} · WGS84`
          )
      );

      map.on("moveend", () => {
        const center = map.getCenter();
        onViewChangeRef.current?.({
          lat: Number(center.lat.toFixed(5)),
          lng: Number(center.lng.toFixed(5)),
          zoom: map.getZoom()
        });
      });

      mapRef.current = map;

      map.whenReady(() => {
        window.requestAnimationFrame(
          () =>
            map.invalidateSize({
              pan: false
            })
        );
      });

      const beforePrint = () => {
        if (!mapRef.current) {
          return;
        }

        const center =
          map.getCenter();

        printViewRef.current = {
          lat: center.lat,
          lng: center.lng,
          zoom: map.getZoom()
        };

        map.invalidateSize({
          pan: false,
          debounceMoveend: true
        });

        map.setView(
          center,
          map.getZoom(),
          {
            animate: false
          }
        );
      };

      const afterPrint = () => {
        if (
          !mapRef.current ||
          !printViewRef.current
        ) {
          return;
        }

        const view =
          printViewRef.current;

        window.requestAnimationFrame(
          () => {
            map.invalidateSize({
              pan: false,
              debounceMoveend: true
            });

            map.setView(
              [
                view.lat,
                view.lng
              ],
              view.zoom,
              {
                animate: false
              }
            );

            window.requestAnimationFrame(
              () =>
                map.invalidateSize({
                  pan: false
                })
            );
          }
        );
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

      mapRef.current = map;
      map._wajoCoordsFrame = () => {
        if (coordsFrame) {
          window.cancelAnimationFrame(coordsFrame);
          coordsFrame = 0;
        }
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

      map?._wajoCoordsFrame?.();
      map?.remove();

      mapRef.current = null;
      tileRef.current = null;
      printViewRef.current = null;
      vectorRenderersRef.current.clear();
      markerIconCacheRef.current.clear();
    };
  }, []);

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
   */
  const previousRegionFilterRef = useRef(regionFilter);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    import("leaflet").then((L) => {
      const map = mapRef.current;

      const regionChanged = previousRegionFilterRef.current !== regionFilter;
      if (regionChanged) {
        selectedRef.current?.setStyle?.(selectedRef.current?.__wajoBaseStyle || {});
        layers.forEach((layer) => {
          if (!layerRefs.current[layer.id]) return;
          if (["adm-kecamatan", "adm-kabupaten", "adm-desa"].includes(layer.id)) return;
          layerRefs.current[layer.id]?.remove?.();
          delete layerRefs.current[layer.id];
        });
        selectedRef.current = null;
        previousRegionFilterRef.current = regionFilter;
      }
      layers.forEach((layer, layerIndex) => {
        const existing =
          layerRefs.current[layer.id];

        const sourceData =
          loadedData.current[layer.id];

        if (
          !visible[layer.id] ||
          !sourceData
        ) {
          if (existing) {
            existing.remove();
            delete layerRefs.current[layer.id];
          }

          return;
        }

        // Keep already-rendered layers intact. Toggling one layer
        // should not rebuild every other active layer.
        if (existing) {
          return;
        }
        const renderData =
          filterGeoJsonForLayer(
            layer,
            sourceData,
            regionFilter,
            loadedData.current["adm-kecamatan"],
            focusAdmin
          );

        const paneName =
          ensureLayerPane(map, layer, layerIndex);

        let vectorRenderer =
          vectorRenderersRef.current.get(paneName);

        if (!vectorRenderer) {
          vectorRenderer = L.canvas({ padding: 0.45 });
          vectorRenderersRef.current.set(
            paneName,
            vectorRenderer
          );
        }

        const geoLayer =
          L.geoJSON(
            renderData,
            {
              renderer: vectorRenderer,
              pane: paneName,
              interactive: true,
              bubblingMouseEvents: true,
              style: (feature) =>
                styleFor(
                  layer,
                  feature
                ),

              pointToLayer: (
                feature,
                latlng
              ) => {
                const isPointLayer =
                  layer.geometry === "Point";

                if (isPointLayer) {
                  const kind =
                    pointKind(
                      layer,
                      feature
                    );

                  if (
                    kind === "place"
                  ) {
                    return L.circleMarker(
                      latlng,
                      {
                        radius: 3.5,
                        color: "#fff",
                        weight: 1,
                        fillColor:
                          layer.color,
                        fillOpacity:
                          0.85
                      }
                    );
                  }

                  const iconKey =
                    `${kind}:${layer.color}`;

                  let icon =
                    markerIconCacheRef.current.get(
                      iconKey
                    );

                  if (!icon) {
                    icon =
                      L.divIcon({
                        className: "",
                        html:
                          markerIconMarkup(
                            kind,
                            layer.color
                          ),
                        iconSize: [
                          30,
                          30
                        ],
                        iconAnchor: [
                          15,
                          15
                        ]
                      });

                    markerIconCacheRef.current.set(
                      iconKey,
                      icon
                    );
                  }

                  return L.marker(
                    latlng,
                    {
                      icon,
                      pane: layerPaneName(layer),
                      keyboard: true
                    }
                  );
                }

                return L.circleMarker(
                  latlng,
                  {
                    radius: 4,
                    color: "#fff",
                    weight: 1,
                    fillColor:
                      layer.color,
                    fillOpacity:
                      0.82
                  }
                );
              },

              onEachFeature: (
                feature,
                featureLayer
              ) => {
                const baseStyle =
                  styleFor(
                    layer,
                    feature
                  );

                const isPolygon =
                  ["Polygon", "MultiPolygon"].includes(feature?.geometry?.type) ||
                  featureLayer instanceof L.Polygon;

                featureLayer.__wajoFeatureKey = featureKey(layer, feature);

                /*
                 * Universal feature selection.
                 */
                featureLayer.on(
                  "click",
                  () => {
                    selectedRef.current?.setStyle?.(
                      selectedRef.current
                        ?.__wajoBaseStyle ||
                        {}
                    );

                    selectedRef.current =
                      featureLayer;

                    featureLayer.__wajoBaseStyle =
                      baseStyle;

                    featureLayer.setStyle?.(
                      selectedStyleFor(
                        layer,
                        baseStyle,
                        isPolygon
                      )
                    );

                    onFeatureSelectRef.current?.({
                      layer,
                      feature,
                      featureKey: featureKey(layer, feature),
                      regionName: featureRegionName(
                        feature,
                        loadedData.current["adm-kecamatan"]
                      )
                    });
                  }
                );

                /*
                 * Polygon highlight.
                 *
                 * Tidak menggunakan bringToFront().
                 * Feature lain tetap bisa di-click.
                 */
                if (isPolygon) {
                  featureLayer.__wajoBaseStyle =
                    baseStyle;

                  featureLayer.on(
                    "mouseover",
                    () => {
                      if (
                        selectedRef.current ===
                        featureLayer
                      ) {
                        return;
                      }

                      featureLayer.setStyle(
                        hoverStyleFor(
                          layer,
                          baseStyle
                        )
                      );
                    }
                  );

                  featureLayer.on(
                    "mouseout",
                    () => {
                      if (
                        selectedRef.current ===
                        featureLayer
                      ) {
                        return;
                      }

                      featureLayer.setStyle(
                        baseStyle
                      );
                    }
                  );
                }

                /*
                 * Label kecamatan permanen.
                 */
                if (
                  layer.styleMode === "admin" &&
                  (feature.properties?.Kecamatan ?? feature.properties?.WADMKC ?? feature.properties?.NAMOBJ)
                ) {
                  featureLayer.bindTooltip(
                    String(
                      feature.properties.Kecamatan ??
                      feature.properties.WADMKC ??
                      feature.properties.NAMOBJ
                    ),
                    {
                      permanent:
                        true,
                      direction:
                        "center",
                      className:
                        "leaflet-kecamatan-label",
                      opacity: 1,
                      interactive:
                        false
                    }
                  );
                } else {
                  const label =
                    featureLabel(
                      layer,
                      feature
                    );

                  const tooltipOptions =
                    {
                      sticky: true,
                      direction:
                        "auto",
                      opacity: 0.96,
                      offset: [
                        10,
                        0
                      ],
                      className:
                        "leaflet-smart-tooltip"
                    };

                  const bindSmartTooltip =
                    (content) => {
                      featureLayer.bindTooltip(
                        String(
                          content
                        ),
                        tooltipOptions
                      );

                      featureLayer.on(
                        "tooltipopen",
                        (event) => {
                          const map =
                            mapRef.current;

                          const tooltip =
                            event.tooltip;

                          const element =
                            tooltip?.getElement?.();

                          if (
                            !map ||
                            !tooltip ||
                            !element
                          ) {
                            return;
                          }

                          const size =
                            map.getSize();

                          const latLng =
                            event?.latlng ||
                            tooltip?.getLatLng?.() ||
                            featureLayer.getLatLng?.() ||
                            featureLayer
                              .getBounds?.()
                              .getCenter?.();

                          if (!latLng) {
                            return;
                          }

                          const point =
                            map.latLngToContainerPoint(
                              latLng
                            );

                          const width =
                            Math.min(
                              element.offsetWidth ||
                                220,
                              320
                            );

                          const height =
                            Math.min(
                              element.offsetHeight ||
                                40,
                              140
                            );

                          const gap = 12;

                          const available = {
                            right:
                              size.x -
                              point.x,

                            left:
                              point.x,

                            bottom:
                              size.y -
                              point.y,

                            top:
                              point.y
                          };

                          let direction =
                            "top";

                          if (
                            available.right >=
                            width +
                              gap
                          ) {
                            direction =
                              "right";
                          } else if (
                            available.left >=
                            width +
                              gap
                          ) {
                            direction =
                              "left";
                          } else if (
                            available.bottom >=
                            height +
                              gap
                          ) {
                            direction =
                              "bottom";
                          }

                          const offsets = {
                            right: [
                              10,
                              0
                            ],

                            left: [
                              -10,
                              0
                            ],

                            bottom: [
                              0,
                              10
                            ],

                            top: [
                              0,
                              -10
                            ]
                          };

                          tooltip.options.direction = direction;
                          tooltip.options.offset =
                            offsets[direction];
                          tooltip.update();
                        }
                      );
                    };

                  /*
                   * Sarana + pendidikan:
                   * gunakan nama objek/sekolah.
                   */
                  if (
                    layer.styleMode ===
                    "admin-village"
                  ) {
                    bindSmartTooltip(
                      label
                    );
                  } else if (
                    layer.styleMode ===
                    "admin-county-outline"
                  ) {
                    bindSmartTooltip(
                      feature.properties?.nama_kabupaten ??
                        feature.properties?.WADMKK ??
                        feature.properties?.NAMOBJ ??
                        "Kabupaten Wajo"
                    );
                  } else if (
                    (
                      layer.group ===
                        "Infrastruktur" ||
                      layer.group ===
                        "Pendidikan"
                    ) &&
                    (
                      feature
                        .properties
                        ?.NAMOBJ ||
                      feature
                        .properties
                        ?.nama_sekolah
                    )
                  ) {
                    bindSmartTooltip(
                      feature
                        .properties
                        ?.NAMOBJ ||
                        feature
                          .properties
                          ?.nama_sekolah
                    );
                  } else if (
                    layer.styleMode ===
                      "toponym" ||
                    (
                      label &&
                      layer.labelField &&
                      layer.geometry ===
                        "Point"
                    )
                  ) {
                    bindSmartTooltip(
                      label
                    );
                  }
                }
              }
            }
          ).addTo(
            mapRef.current
          );

        layerRefs.current[
          layer.id
        ] = geoLayer;
      });

      /*
       * Initial map fit hanya sekali
       * berdasarkan kecamatan.
       */
      const adminLayer =
        layerRefs.current[
          "adm-kecamatan"
        ];

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
    });
  }, [
    layers,
    visible,
    renderVersion,
    regionFilter,
    focusAdmin
  ]);

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
            const data =
              loadedData.current[
                "adm-kecamatan"
              ];

            if (data) {
              if (fitWajoBounds(mapRef.current, L, data)) {
                return;
              }
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
            mapRef.current.fitBounds(bounds, { padding: [56, 56], maxZoom: 13, animate: true });
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

      preparePrint: () => {
        const map =
          mapRef.current;

        if (!map) {
          return;
        }

        const center =
          map.getCenter();

        printViewRef.current = {
          lat: center.lat,
          lng: center.lng,
          zoom: map.getZoom()
        };

        map.invalidateSize({
          pan: false,
          debounceMoveend: true
        });

        map.setView(
          center,
          map.getZoom(),
          {
            animate: false
          }
        );
      },

      zoomToLayer: (layerId) => {
        if (!mapRef.current) return;
        import("leaflet").then((L) => {
          const data = loadedData.current[layerId];
          const layerConfig = layers.find((item) => item.id === layerId);
          if (!data || !layerConfig) return;
          const scoped = filterGeoJsonForLayer(
            layerConfig,
            data,
            regionFilter,
            loadedData.current["adm-kecamatan"],
            focusAdmin
          );
          const bounds = L.geoJSON(scoped).getBounds();
          if (bounds.isValid()) {
            mapRef.current.fitBounds(bounds, { padding: [44, 44], maxZoom: regionFilter ? 15 : 14, animate: true });
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
                {
                  padding: [
                    44,
                    44
                  ],
                  maxZoom: 17
                }
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
    [onStatus, regionFilter, focusAdmin, layers]
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
