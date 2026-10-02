"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { groupOrder, layers } from "../lib/layers";
import { buildKecamatanLegend } from "../lib/geo/format";
import { kecamatanColor } from "../lib/geo/styles";
import GeoPortalHeader from "./geoportal/GeoPortalHeader";
import LayerCatalog from "./geoportal/LayerCatalog";
import MapCanvas from "./geoportal/MapCanvas";
import MapControls from "./geoportal/MapControls";
import LegendPanel from "./geoportal/LegendPanel";
import FeatureInspector from "./geoportal/FeatureInspector";
import MapStatus from "./geoportal/MapStatus";
import MobileActions from "./geoportal/MobileActions";

const DEFAULT_VISIBLE = Object.freeze(
  Object.fromEntries(layers.map((layer) => [layer.id, Boolean(layer.visible)]))
);

export default function GeoPortal() {
  const mapApi = useRef(null);
  const [visible, setVisible] = useState(() => ({ ...DEFAULT_VISIBLE }));
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [layerData, setLayerData] = useState({});
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("Semua");
  const [legendOpen, setLegendOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [coords, setCoords] = useState("—");
  const [status, setStatus] = useState("Memuat peta…");
  const [mapReady, setMapReady] = useState(false);
  const [startupLoading, setStartupLoading] = useState(true);

  useEffect(() => {
    if (!mapReady) return undefined;

    const timer = window.setTimeout(() => {
      setStartupLoading(false);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [mapReady]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setSidebarOpen(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  const activeLayers = useMemo(() => layers.filter((layer) => visible[layer.id]), [visible]);
  const kecamatanLegend = useMemo(
    () => buildKecamatanLegend(layerData["adm-kecamatan"], kecamatanColor),
    [layerData]
  );

  const handleLayerDataLoaded = useCallback((layer, data) => {
    setLayerData((previous) => ({ ...previous, [layer.id]: data }));
    setLoading((previous) => ({ ...previous, [layer.id]: false }));
    setErrors((previous) => {
      if (!previous[layer.id]) return previous;
      const next = { ...previous };
      delete next[layer.id];
      return next;
    });
  }, []);

  const handleToggleLayer = useCallback((layer) => {
    setVisible((previous) => ({ ...previous, [layer.id]: !previous[layer.id] }));
  }, []);

  const handleFeatureSelect = useCallback((payload) => {
    setSelected(payload);
    setInspectOpen(true);
  }, []);

  const closeInspector = useCallback(() => {
    mapApi.current?.clearSelection?.();
    setSelected(null);
    setInspectOpen(false);
  }, []);

  const resetPortal = useCallback(() => {
    setVisible({ ...DEFAULT_VISIBLE });
    setSearch("");
    setGroupFilter("Semua");
    setSelected(null);
    setInspectOpen(false);
    mapApi.current?.clearSelection?.();
    mapApi.current?.zoomHome?.();
  }, []);

  const handleLayerLoading = useCallback((layerId, isLoading) => {
    setLoading((previous) => ({ ...previous, [layerId]: isLoading }));
  }, []);

  const handleLayerError = useCallback((layerId, message) => {
    setErrors((previous) => ({ ...previous, [layerId]: message }));
  }, []);

  const handleMapCoords = useCallback((nextCoords) => setCoords(nextCoords), []);
  const handlePrint = useCallback(() => {
    if (typeof window === "undefined") return;
    setStatus("Menyiapkan area peta untuk dicetak…");
    // Preserve the exact map viewport. Print CSS changes the map container
    // dimensions; MapCanvas invalidates Leaflet without allowing it to pan.
    mapApi.current?.preparePrint?.();
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => window.print());
    });
  }, []);

  const handleMapReadyStatus = useCallback((nextStatus) => {
    setMapReady((current) => current || true);
    setStatus((current) => current === nextStatus ? current : nextStatus);
  }, []);

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-white">
      <a
        href="#map"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[3000] focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg"
      >
        Lewati ke peta
      </a>

      {startupLoading && (
        <div
          className="fixed inset-0 z-[5000] grid place-items-center bg-white"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex flex-col items-center text-center px-6">
            <img
              src="/brand/logo-kabupaten-wajo.png"
              alt="Lambang Kabupaten Wajo"
              width="82"
              height="82"
              className="h-20 w-20 object-contain"
            />
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Pemerintah Kabupaten Wajo
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Peta Interaktif Kabupaten Wajo
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <span className="size-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" aria-hidden="true" />
              Menyiapkan peta…
            </div>
          </div>
        </div>
      )}

      <GeoPortalHeader
        search={search}
        onSearch={setSearch}
        sidebarOpen={sidebarOpen}
        legendOpen={legendOpen}
        onToggleSidebar={() => setSidebarOpen((value) => !value)}
        onToggleLegend={() => setLegendOpen((value) => !value)}
      />

      <main id="map" className="relative flex min-h-0 flex-1 overflow-hidden">
        {sidebarOpen && (
          <LayerCatalog
            layers={layers}
            groupOrder={groupOrder}
            visible={visible}
            loading={loading}
            errors={errors}
            search={search}
            groupFilter={groupFilter}
            onSearch={setSearch}
            onGroupFilter={setGroupFilter}
            onReset={resetPortal}
            onToggle={handleToggleLayer}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {sidebarOpen && (
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 z-[1100] bg-slate-950/10 lg:hidden"
            aria-label="Tutup katalog layer"
          />
        )}

        <div className="relative min-w-0 flex-1">
          <MapCanvas
            ref={mapApi}
            visible={visible}
            layers={layers}
            onFeatureSelect={handleFeatureSelect}
            onLayerDataLoaded={handleLayerDataLoaded}
            onLayerLoading={handleLayerLoading}
            onLayerError={handleLayerError}
            onStatus={handleMapReadyStatus}
            onCoords={handleMapCoords}
          />
          <MapControls
            mapReady={mapReady}
            onZoomIn={() => mapApi.current?.zoomIn?.()}
            onZoomOut={() => mapApi.current?.zoomOut?.()}
            onHome={() => mapApi.current?.zoomHome?.()}
            onLocate={() => mapApi.current?.locateMe?.()}
            onPrint={handlePrint}
            sidebarOpen={sidebarOpen}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
          <LegendPanel
            activeLayers={activeLayers}
            kecamatanLegend={kecamatanLegend}
            open={legendOpen}
            onClose={() => setLegendOpen(false)}
          />
          <MapStatus status={status} coords={coords} />
          <FeatureInspector
            selected={selected}
            open={inspectOpen}
            onClose={closeInspector}
            onZoom={() => mapApi.current?.zoomToFeature?.(selected)}
          />
          <MobileActions
            onOpenSidebar={() => setSidebarOpen(true)}
            onToggleLegend={() => setLegendOpen((value) => !value)}
            selected={selected}
            onOpenInspector={() => setInspectOpen(true)}
          />
        </div>
      </main>
    </div>
  );
}
