import { findFeatureLayerAtLatLng } from "./geometry";
import {
  administrationFeatureMatchesTarget,
  isAdministrativeLayerId
} from "./context";

const ADMIN_POINTER_DISTANCE = 7;
const NATIVE_ADMIN_TAP_WINDOW = 750;
const NATIVE_ADMIN_TAP_DISTANCE = 8;
const COORDS_THROTTLE = 120;

function setInteractiveCursor(map, vectorRenderers, target) {
  const cursor = target ? "pointer" : "";
  const container = map.getContainer?.();
  if (container) container.style.cursor = cursor;

  vectorRenderers?.forEach?.((renderer) => {
    const rendererContainer = renderer?.getContainer?.();
    if (rendererContainer) rendererContainer.style.cursor = cursor;
  });
}

function isAdministrativeDomTarget(target) {
  if (typeof Element === "undefined" || !(target instanceof Element)) return false;
  return Boolean(target.closest(".adminDistrict, .adminCounty, .adminVillage"));
}

function getEventLatLng(map, event) {
  return map.mouseEventToLatLng?.(event) ||
    map.containerPointToLatLng([event.offsetX, event.offsetY]);
}

export function bindMapInteraction({
  map,
  layerRefs,
  vectorRenderers,
  visibleRef,
  focusAdminRef,
  selectedRef,
  nativeAdminTapRef,
  resolveAdministrativeTarget,
  onCoordsRef,
  onStatusRef,
  onViewChangeRef
}) {
  let coordsTimer = 0;
  let latestCoords = null;
  let lastCoordsUpdate = 0;
  let cursorFrame = 0;
  let latestCursorLatLng = null;
  let pointerState = null;

  const flushCoords = () => {
    coordsTimer = 0;
    if (!latestCoords) return;

    lastCoordsUpdate = performance.now();
    onCoordsRef.current?.(
      `${latestCoords.lat.toFixed(5)}, ${latestCoords.lng.toFixed(5)}`
    );
  };

  const updateAdministrativeCursor = (latlng) => {
    latestCursorLatLng = latlng;
    if (cursorFrame) return;

    cursorFrame = window.requestAnimationFrame(() => {
      cursorFrame = 0;
      const target = resolveAdministrativeTarget(latestCursorLatLng);
      setInteractiveCursor(map, vectorRenderers, target);
    });
  };

  const pointerDistance = (event) => {
    if (!pointerState) return 0;
    return Math.hypot(
      Number(event.clientX ?? 0) - pointerState.x,
      Number(event.clientY ?? 0) - pointerState.y
    );
  };

  const handlePointerDown = (event) => {
    if (event.isPrimary === false) return;
    nativeAdminTapRef.current = null;
    pointerState = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false,
      directAdmin: isAdministrativeDomTarget(event.target)
    };
  };

  const handlePointerMove = (event) => {
    if (pointerState && event.pointerId === pointerState.pointerId) {
      if (pointerDistance(event) > ADMIN_POINTER_DISTANCE) pointerState.moved = true;
    }

    if (event.pointerType === "mouse") {
      updateAdministrativeCursor(getEventLatLng(map, event));
    }
  };

  const handlePointerUp = (event) => {
    if (!pointerState || event.pointerId !== pointerState.pointerId) return;

    const state = pointerState;
    pointerState = null;

    if (state.moved || state.directAdmin) return;

    const latlng = getEventLatLng(map, event);
    const target = resolveAdministrativeTarget(latlng);
    if (!target) return;

    const currentFocus = focusAdminRef.current;
    const targetType = target.__wajoLayerId === "adm-kabupaten" ? "kabupaten" : "kecamatan";
    const sameFeature = currentFocus?.feature
      ? administrationFeatureMatchesTarget(
          target.__wajoFeature,
          currentFocus.feature,
          currentFocus.type === "desa" ? "desa" : targetType
        )
      : false;

    if (sameFeature && currentFocus?.type !== "kabupaten") return;

    nativeAdminTapRef.current = {
      at: performance.now(),
      latlng
    };
    target.fire("click", { originalEvent: event, latlng });
  };

  const clearPointerState = () => {
    pointerState = null;
  };

  const handleMapMouseMove = (event) => {
    latestCoords = event.latlng;
    updateAdministrativeCursor(event.latlng);

    const elapsed = performance.now() - lastCoordsUpdate;
    if (coordsTimer || elapsed < COORDS_THROTTLE) return;
    coordsTimer = window.setTimeout(flushCoords, COORDS_THROTTLE);
  };

  const handleMapClick = (event) => {
    const originalEvent = event?.originalEvent;
    const latlng = event?.latlng;
    if (!originalEvent || !latlng) return;

    const nativeAdminTap = nativeAdminTapRef.current;
    if (nativeAdminTap) {
      const elapsed = performance.now() - nativeAdminTap.at;
      const distance = map.latLngToContainerPoint(nativeAdminTap.latlng)
        .distanceTo(map.latLngToContainerPoint(latlng));
      if (
        elapsed < NATIVE_ADMIN_TAP_WINDOW &&
        distance < NATIVE_ADMIN_TAP_DISTANCE
      ) {
        nativeAdminTapRef.current = null;
        return;
      }
      nativeAdminTapRef.current = null;
    }

    const visibleNow = visibleRef.current || {};
    const currentFocus = focusAdminRef.current;
    const selectedLayerId = selectedRef.current?.__wajoLayerId;
    const navigationType = currentFocus?.type === "desa" ? "desa" : "kecamatan";
    const priority = navigationType === "desa"
      ? [
          { layerId: "adm-desa", type: "desa" },
          { layerId: "adm-kecamatan", type: "kecamatan" },
          { layerId: "adm-kabupaten", type: "kabupaten" }
        ]
      : [
          { layerId: "adm-kecamatan", type: "kecamatan" },
          { layerId: "adm-kabupaten", type: "kabupaten" },
          { layerId: "adm-desa", type: "desa" }
        ];

    for (const candidate of priority) {
      if (!visibleNow[candidate.layerId]) continue;

      const target = findFeatureLayerAtLatLng(
        layerRefs.current[candidate.layerId],
        latlng
      );
      if (!target) continue;

      const feature = target.__wajoFeature;
      const currentFeature = currentFocus?.feature;
      const sameFeature = currentFeature
        ? administrationFeatureMatchesTarget(
            feature,
            currentFeature,
            candidate.type
          )
        : false;

      if (
        selectedLayerId &&
        isAdministrativeLayerId(selectedLayerId) &&
        sameFeature
      ) {
        return;
      }

      target.fire("click", { originalEvent, latlng });
      return;
    }
  };

  const handleZoomEnd = () => {
    onStatusRef.current?.(`Zoom ${map.getZoom()} · WGS84`);
  };

  const handleMoveEnd = () => {
    const center = map.getCenter();
    onViewChangeRef.current?.({
      lat: Number(center.lat.toFixed(5)),
      lng: Number(center.lng.toFixed(5)),
      zoom: map.getZoom()
    });
  };

  const element = map.getContainer();
  element.addEventListener("pointerdown", handlePointerDown, true);
  element.addEventListener("pointermove", handlePointerMove, true);
  element.addEventListener("pointerup", handlePointerUp, true);
  element.addEventListener("pointercancel", clearPointerState, true);
  map.on("mousemove", handleMapMouseMove);
  map.on("click", handleMapClick);
  map.on("zoomend", handleZoomEnd);
  map.on("moveend", handleMoveEnd);

  const cancelCursorFrame = () => {
    if (cursorFrame) {
      window.cancelAnimationFrame(cursorFrame);
      cursorFrame = 0;
    }
  };

  const cleanup = () => {
    element.removeEventListener("pointerdown", handlePointerDown, true);
    element.removeEventListener("pointermove", handlePointerMove, true);
    element.removeEventListener("pointerup", handlePointerUp, true);
    element.removeEventListener("pointercancel", clearPointerState, true);
    map.off("mousemove", handleMapMouseMove);
    map.off("click", handleMapClick);
    map.off("zoomend", handleZoomEnd);
    map.off("moveend", handleMoveEnd);

    if (coordsTimer) {
      window.clearTimeout(coordsTimer);
      coordsTimer = 0;
    }
    cancelCursorFrame();
    setInteractiveCursor(map, vectorRenderers, null);
    nativeAdminTapRef.current = null;
    pointerState = null;
  };

  map._wajoPointerHandlers = {
    element,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    clearPointerState,
    cancelCursorFrame
  };
  map._wajoCoordsTimer = cleanup;
  map._wajoInteractionCleanup = cleanup;

  return cleanup;
}
