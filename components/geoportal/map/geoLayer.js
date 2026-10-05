import { markerIconMarkup, pointKind } from "../../../lib/geo/markers";
import { featureKey, featureLabel } from "../../../lib/geo/format";
import { styleFor } from "../../../lib/geo/styles";
import { featureRegionName } from "../../../lib/geo/region";
import {
  isAdministrativeLayerId,
  administrativeName
} from "./context";
import {
  setFeatureSelectedVisual,
  applyFeatureHoverVisual,
  restoreFeatureHoverVisual
} from "./layerStyles";

export function createGeoJsonLayer({
  L,
  renderData,
  layer,
  vectorRenderer,
  paneName,
  map,
  loadedData,
  markerIconCache,
  selectedRef,
  onFeatureSelectRef,
  resolveAdministrativeTarget
}) {
  return L.geoJSON(renderData, {
        renderer: vectorRenderer,
        pane: paneName,
        interactive: true,
        bubblingMouseEvents: true,
        style: (feature) => styleFor(layer, feature),

        pointToLayer: (feature, latlng) => {
          const isPointLayer = layer.geometry === "Point";
          if (isPointLayer) {
            const kind = pointKind(layer, feature);

            if (kind === "place") {
              return L.circleMarker(latlng, {
                radius: 3.5,
                color: "#fff",
                weight: 1,
                fillColor: layer.color,
                fillOpacity: 0.85
              });
            }

            const iconKey = `${kind}:${layer.color}`;
            let icon = markerIconCache.get(iconKey);
            if (!icon) {
              icon = L.divIcon({
                className: "",
                html: markerIconMarkup(kind, layer.color),
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              });
              markerIconCache.set(iconKey, icon);
            }

            return L.marker(latlng, {
              icon,
              pane: paneName,
              keyboard: true
            });
          }

          return L.circleMarker(latlng, {
            radius: 4,
            color: "#fff",
            weight: 1,
            fillColor: layer.color,
            fillOpacity: 0.82
          });
        },

        onEachFeature: (feature, featureLayer) => {
          const baseStyle = styleFor(layer, feature);
          const isPolygon =
            ["Polygon", "MultiPolygon"].includes(feature?.geometry?.type) ||
            featureLayer instanceof L.Polygon;

          featureLayer.__wajoFeatureKey = featureKey(layer, feature);
          featureLayer.__wajoFeature = feature;
          featureLayer.__wajoLayerId = layer.id;
          featureLayer.__wajoLayerStyleMode = layer.styleMode;
          featureLayer.__wajoBaseStyle = baseStyle;
          featureLayer.__wajoBaseZIndexOffset =
            featureLayer.options?.zIndexOffset ?? 0;
          featureLayer.__wajoSelected = false;

          featureLayer.on("click", (event) => {
            const previousSelected = selectedRef.current;
            if (previousSelected && previousSelected !== featureLayer) {
              restoreFeatureHoverVisual(
                previousSelected,
                previousSelected.__wajoBaseStyle || {}
              );
            }

            selectedRef.current = featureLayer;
            setFeatureSelectedVisual(featureLayer, layer, baseStyle, isPolygon, true);

            let contextAdminFeature = null;
            let contextRegion = null;
            if (!isAdministrativeLayerId(layer.id) && event?.latlng && !event?.__wajoSuppressContextPromotion) {
              const districtTarget = resolveAdministrativeTarget(event.latlng);
              contextAdminFeature = districtTarget?.__wajoFeature ?? null;
              if (contextAdminFeature && districtTarget?.__wajoLayerId === "adm-kecamatan") {
                contextRegion = administrativeName(contextAdminFeature, "kecamatan") || null;
              }
            }

            onFeatureSelectRef.current?.({
              layer,
              feature,
              featureKey: featureKey(layer, feature),
              regionName: featureRegionName(
                feature,
                loadedData?.["adm-kecamatan"]
              ),
              contextRegion,
              contextAdminFeature
            });
          });

          featureLayer.on("mouseover", () => {
            map.getContainer().style.cursor = "pointer";
            applyFeatureHoverVisual(featureLayer, layer, baseStyle);
          });

          featureLayer.on("mouseout", () => {
            map.getContainer().style.cursor = "";
            restoreFeatureHoverVisual(featureLayer, baseStyle);
          });

          if (layer.styleMode === "admin" && (
            feature.properties?.Kecamatan ??
            feature.properties?.WADMKC ??
            feature.properties?.NAMOBJ
          )) {
            featureLayer.bindTooltip(
              String(
                feature.properties.Kecamatan ??
                feature.properties.WADMKC ??
                feature.properties.NAMOBJ
              ),
              {
                permanent: true,
                direction: "center",
                className: "leaflet-kecamatan-label",
                opacity: 1,
                interactive: false,
                pane: "adminLabel"
              }
            );
          } else {
            const label = featureLabel(layer, feature);
            const tooltipOptions = {
              sticky: true,
              direction: "auto",
              opacity: 0.96,
              offset: [10, 0],
              className: "leaflet-smart-tooltip",
              pane: "featureTooltip"
            };

            const bindSmartTooltip = (content) => {
              featureLayer.bindTooltip(String(content), tooltipOptions);
              featureLayer.on("tooltipopen", (event) => {
                const activeMap = map;
                const tooltip = event.tooltip;
                const element = tooltip?.getElement?.();
                if (!activeMap || !tooltip || !element) return;

                const size = activeMap.getSize();
                const latLng =
                  event?.latlng ||
                  tooltip?.getLatLng?.() ||
                  featureLayer.getLatLng?.() ||
                  featureLayer.getBounds?.().getCenter?.();
                if (!latLng) return;

                const point = activeMap.latLngToContainerPoint(latLng);
                const width = Math.min(element.offsetWidth || 220, 320);
                const height = Math.min(element.offsetHeight || 40, 140);
                const gap = 12;
                const available = {
                  right: size.x - point.x,
                  left: point.x,
                  bottom: size.y - point.y,
                  top: point.y
                };

                let direction = "top";
                if (available.right >= width + gap) {
                  direction = "right";
                } else if (available.left >= width + gap) {
                  direction = "left";
                } else if (available.bottom >= height + gap) {
                  direction = "bottom";
                }

                const offsets = {
                  right: [10, 0],
                  left: [-10, 0],
                  bottom: [0, 10],
                  top: [0, -10]
                };

                tooltip.options.direction = direction;
                tooltip.options.offset = offsets[direction];
                tooltip.update();
              });
            };

            if (layer.styleMode === "admin-village") {
              if (label) {
                featureLayer.bindTooltip(String(label), {
                  permanent: true,
                  direction: "center",
                  className: "leaflet-desa-label",
                  opacity: 0.9,
                  interactive: false,
                  pane: "adminLabel"
                });
              }
            } else if (layer.styleMode === "admin-county-outline") {
              bindSmartTooltip(
                feature.properties?.nama_kabupaten ??
                  feature.properties?.WADMKK ??
                  feature.properties?.NAMOBJ ??
                  "Kabupaten Wajo"
              );
            } else if ((
              layer.group === "Infrastruktur" ||
              layer.group === "Pendidikan"
            ) && (
              feature.properties?.NAMOBJ ||
              feature.properties?.nama_sekolah
            )) {
              bindSmartTooltip(
                feature.properties?.NAMOBJ ||
                  feature.properties?.nama_sekolah
              );
            } else if (
              layer.styleMode === "toponym" ||
              (label && layer.labelField && layer.geometry === "Point")
            ) {
              bindSmartTooltip(label);
            }
          }
        }
      });
}
