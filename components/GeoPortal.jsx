"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { groupOrder, layers } from "../lib/layers";
import { buildKecamatanLegend } from "../lib/geo/format";
import { kecamatanColor } from "../lib/geo/styles";
import { DATA_SUMMARY } from "../lib/geo/dataSummary";
import { REGION_SUMMARY, REGIONS } from "../lib/geo/regionSummary";
import { getRelatedLayerIds, getRegionCount } from "../lib/geo/relations";
import { normalizeRegionName, regionDisplayName } from "../lib/geo/region";
import { featureKey } from "../lib/geo/format";
import GeoPortalHeader from "./geoportal/GeoPortalHeader";
import LayerCatalog from "./geoportal/LayerCatalog";
import MapCanvas from "./geoportal/MapCanvas";
import MapControls from "./geoportal/MapControls";
import LegendPanel from "./geoportal/LegendPanel";
import PrintLegend from "./geoportal/PrintLegend";
import FeatureInspector from "./geoportal/FeatureInspector";
import LayerInfoPanel from "./geoportal/LayerInfoPanel";
import MapStatus from "./geoportal/MapStatus";
import MobileActions from "./geoportal/MobileActions";
import ActiveLayersBar from "./geoportal/ActiveLayersBar";
import MapHint from "./geoportal/MapHint";
import Image from "next/image";
import { withAssetVersion } from "../lib/assetVersion";

const DEFAULT_VISIBLE = Object.freeze(
  Object.fromEntries(layers.map((layer) => [layer.id, Boolean(layer.visible)]))
);

export default function GeoPortal() {
  const mapApi = useRef(null);
  const requestedFeatureHandledRef = useRef("");
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
  const [layerInfo, setLayerInfo] = useState(null);
  const [coords, setCoords] = useState("—");
  const [status, setStatus] = useState("Memuat peta…");
  const [mapReady, setMapReady] = useState(false);
  const [startupLoading, setStartupLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [regionFilter, setRegionFilter] = useState("");
  const [focusAdmin, setFocusAdmin] = useState(null);
  const [requestedFeature, setRequestedFeature] = useState("");
  const [catalogLayerId, setCatalogLayerId] = useState("");
  const [retryTokens, setRetryTokens] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedLayer = params.get("layer");
    const requestedLayers = (params.get("layers") || requestedLayer || "")
      .split(",")
      .map((id) => id.trim())
      .filter((id) => layers.some((layer) => layer.id === id));
    const requestedRegion = params.get("region");
    const requestedFeatureParam = params.get("feature");
    const requestedCatalog = params.get("catalog") === "1";

    if (requestedLayers.length) {
      const hasExplicitLayerState = Boolean(params.get("layers"));
      window.requestAnimationFrame(() => {
        setVisible((previous) => {
          const base = hasExplicitLayerState
            ? Object.fromEntries(layers.map((layer) => [layer.id, false]))
            : previous;
          return {
            ...base,
            ...Object.fromEntries(requestedLayers.map((id) => [id, true]))
          };
        });
        setHasInteracted(true);
        if (requestedFeatureParam) setRequestedFeature(requestedFeatureParam);
        if (requestedCatalog && requestedLayer) {
          setCatalogLayerId(requestedLayer);
          setSidebarOpen(true);
        }
      });
    }

    if (requestedRegion && REGIONS.some((region) => normalizeRegionName(region) === normalizeRegionName(requestedRegion))) {
      const region = REGIONS.find((item) => normalizeRegionName(item) === normalizeRegionName(requestedRegion));
      window.requestAnimationFrame(() => {
        setRegionFilter(region || "");
        setVisible((previous) => ({
          ...previous,
          "adm-desa": true
        }));
        setHasInteracted(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!mapReady) return undefined;

    const timer = window.setTimeout(() => {
      setStartupLoading(false);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [mapReady]);

  useEffect(() => {
    if (!mapReady) return;
    const params = new URLSearchParams(window.location.search);
    const lat = Number(params.get("lat"));
    const lng = Number(params.get("lng"));
    const zoom = Number(params.get("zoom"));
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      mapApi.current?.setView?.({ lat, lng, zoom: Number.isFinite(zoom) ? zoom : undefined });
    }
  }, [mapReady]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      const requestedCatalog = new URLSearchParams(window.location.search).get("catalog") === "1";
      setSidebarOpen(media.matches || requestedCatalog);
      setLegendOpen(media.matches);
    };
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    if (!mapReady || !regionFilter) return;
    mapApi.current?.zoomToRegion?.(regionFilter);
  }, [mapReady, regionFilter]);

  useEffect(() => {
    if (!requestedFeature || !mapReady) return;
    const params = new URLSearchParams(window.location.search);
    const layerId = params.get("layer");
    const layer = layers.find((item) => item.id === layerId);
    if (!layer) return;
    const data = layerData[layer.id];
    if (!data?.features?.length) return;
    const found = data.features.find((feature) => String(featureKey(layer, feature) ?? "") === String(requestedFeature));
    const requestKey = `${layer.id}:${requestedFeature}`;
    if (found && requestedFeatureHandledRef.current !== requestKey) {
      requestedFeatureHandledRef.current = requestKey;
      mapApi.current?.selectFeature?.(layer.id, requestedFeature);
      mapApi.current?.zoomToFeature?.({ layer, feature: found });
    }
  }, [requestedFeature, mapReady, layerData]);

  const activeLayers = useMemo(() => layers.filter((layer) => visible[layer.id]), [visible]);
  const kecamatanLegend = useMemo(
    () => buildKecamatanLegend(layerData["adm-kecamatan"], kecamatanColor),
    [layerData]
  );

  const printKecamatanLegend = useMemo(() => {
    if (!visible["adm-kecamatan"]) return [];

    if (focusAdmin?.type === "kecamatan") {
      const selectedCode = String(
        focusAdmin.feature?.properties?.KDCPUM ??
        focusAdmin.feature?.properties?.kode_kecamatan ??
        focusAdmin.feature?.properties?.Kecamatan ??
        ""
      ).trim();
      return kecamatanLegend.filter((item) => {
        const label = String(item.name || "").trim();
        return normalizeRegionName(label) === normalizeRegionName(focusAdmin.feature?.properties?.Kecamatan ?? label) || String(item.id).includes(selectedCode);
      }).slice(0, 1);
    }

    if (focusAdmin?.type === "desa") {
      return [];
    }

    if (regionFilter) {
      return kecamatanLegend.filter((item) => normalizeRegionName(item.name) === normalizeRegionName(regionFilter)).slice(0, 1);
    }

    return kecamatanLegend;
  }, [focusAdmin, kecamatanLegend, regionFilter, visible]);

  const printScopeTitle = useMemo(() => {
    if (focusAdmin?.type === "desa") {
      const village = String(focusAdmin.feature?.properties?.Desa ?? focusAdmin.feature?.properties?.WADMKD ?? focusAdmin.feature?.properties?.nama_desa ?? "").trim();
      return village ? `Desa/Kelurahan ${village}` : "Wilayah terpilih";
    }
    if (focusAdmin?.type === "kecamatan") {
      return regionDisplayName(focusAdmin.feature?.properties?.Kecamatan ?? focusAdmin.feature?.properties?.WADMKC ?? "");
    }
    if (regionFilter) return regionDisplayName(regionFilter);
    return "Kabupaten Wajo";
  }, [focusAdmin, regionFilter]);

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

  const updateMapQuery = useCallback((updates = {}) => {
    const url = new URL(window.location.href);
    Object.entries(updates).forEach(([key, value]) => {
      if (value == null || value === "") url.searchParams.delete(key);
      else url.searchParams.set(key, String(value));
    });
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const closeCatalog = useCallback(() => {
    setSidebarOpen(false);
    setCatalogLayerId("");
    updateMapQuery({ catalog: null });
  }, [updateMapQuery]);

  const handleToggleLayer = useCallback((layer) => {
    const nextVisible = !visible[layer.id];
    const nextVisibleIds = layers
      .filter((item) => (item.id === layer.id ? nextVisible : visible[item.id]))
      .map((item) => item.id);
    setHasInteracted(true);
    setStatus(`${layer.title} ${nextVisible ? "ditampilkan" : "disembunyikan"}`);

    if (!nextVisible && selected?.layer?.id === layer.id) {
      mapApi.current?.clearSelection?.();
      setSelected(null);
      setInspectOpen(false);
    }

    setVisible((previous) => ({ ...previous, [layer.id]: nextVisible }));
    updateMapQuery({
      layers: nextVisibleIds.join(","),
      layer: nextVisible ? layer.id : null,
      feature: null
    });
  }, [selected, visible, updateMapQuery]);

  const handleFeatureSelect = useCallback((payload) => {
    setHasInteracted(true);
    setStatus(`${payload.layer.title} · dipilih`);
    if (window.matchMedia("(max-width: 1023px)").matches) setSidebarOpen(false);
    setLayerInfo(null);
    setSelected(payload);
    setInspectOpen(true);

    const properties = payload.feature?.properties ?? {};
    const adminLayerId = payload.layer?.id;
    const selectedKecamatan = String(
      properties.Kecamatan ?? properties.WADMKC ?? properties.nama_kecamatan ?? properties.kecamatan ?? ""
    ).trim();

    const contextRegion = String(payload.contextRegion ?? "").trim();
    const contextAdminFeature = payload.contextAdminFeature;
    const hasContextPromotion = Boolean(contextRegion && contextAdminFeature);

    let shouldSetRegion = false;
    if (hasContextPromotion) {
      setFocusAdmin({ type: "kecamatan", feature: contextAdminFeature });
      setRegionFilter(contextRegion);
      setVisible((previous) => ({ ...previous, "adm-desa": true }));
      shouldSetRegion = true;
    } else if (adminLayerId === "adm-kecamatan" && selectedKecamatan) {
      shouldSetRegion = REGIONS.some((region) => normalizeRegionName(region) === normalizeRegionName(selectedKecamatan));
      setFocusAdmin({ type: "kecamatan", feature: payload.feature });
      setVisible((previous) => ({ ...previous, "adm-desa": true }));
      if (shouldSetRegion) setRegionFilter(selectedKecamatan);
    } else if (adminLayerId === "adm-desa") {
      setFocusAdmin({ type: "desa", feature: payload.feature });
      setVisible((previous) => ({ ...previous, "adm-desa": true }));
      if (selectedKecamatan) {
        shouldSetRegion = REGIONS.some((region) => normalizeRegionName(region) === normalizeRegionName(selectedKecamatan));
        if (shouldSetRegion) setRegionFilter(selectedKecamatan);
      }
    } else if (adminLayerId === "adm-kabupaten") {
      setFocusAdmin({ type: "kabupaten", feature: payload.feature });
      setRegionFilter("");
    }

    const activeIds = layers
      .filter((layer) => visible[layer.id] || (hasContextPromotion && layer.id === "adm-desa"))
      .map((layer) => layer.id);
    const currentRegion = new URL(window.location.href).searchParams.get("region");
    updateMapQuery({
      layers: activeIds.join(","),
      layer: payload.layer.id,
      feature: payload.featureKey || null,
      region: shouldSetRegion
        ? (hasContextPromotion ? contextRegion : selectedKecamatan)
        : currentRegion
    });
  }, [updateMapQuery, visible]);

  const handleLayerInfo = useCallback((layer) => {
    setHasInteracted(true);
    setSelected(null);
    setInspectOpen(false);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setSidebarOpen(false);
    }
    setLayerInfo(layer);
    updateMapQuery({ feature: null, layer: layer.id });
  }, [updateMapQuery]);

  const closeLayerInfo = useCallback(() => {
    setLayerInfo(null);
  }, []);

  const showLayerOnMap = useCallback((layer) => {
    setHasInteracted(true);
    setErrors((previous) => {
      if (!previous[layer.id]) return previous;
      const next = { ...previous };
      delete next[layer.id];
      return next;
    });
    setRetryTokens((previous) => ({ ...previous, [layer.id]: (previous[layer.id] || 0) + 1 }));
    setVisible((previous) => ({ ...previous, [layer.id]: true }));
    const activeIds = layers.filter((item) => visible[item.id] || item.id === layer.id).map((item) => item.id);
    updateMapQuery({ layers: activeIds.join(","), layer: layer.id, feature: null });
    setLayerInfo(null);
  }, [updateMapQuery, visible]);

  const zoomToLayer = useCallback((layer) => {
    setHasInteracted(true);
    setVisible((previous) => ({ ...previous, [layer.id]: true }));
    setStatus(`Menyiapkan ${layer.title}…`);
    const activeIds = layers.filter((item) => visible[item.id] || item.id === layer.id).map((item) => item.id);
    updateMapQuery({ layers: activeIds.join(","), layer: layer.id, feature: null });
    mapApi.current?.zoomToLayer?.(layer.id);
    window.setTimeout(() => setStatus(`${layer.title} tampil di peta`), 450);
  }, [updateMapQuery, visible]);

  const handleRegionFilter = useCallback((region) => {
    setHasInteracted(true);
    setSelected(null);
    if (region) {
      setVisible((previous) => ({ ...previous, "adm-desa": true }));
    }
    setInspectOpen(false);
    setLayerInfo(null);
    mapApi.current?.clearSelection?.();
    setFocusAdmin(null);
    setRegionFilter(region);
    if (region) {
      setStatus(`Menampilkan data di ${regionDisplayName(region)}`);
      updateMapQuery({ region, feature: null });
    } else {
      setStatus("Menampilkan seluruh data Kabupaten Wajo");
      updateMapQuery({ region: null, feature: null });
      window.requestAnimationFrame(() => {
        mapApi.current?.zoomHome?.();
      });
    }
  }, [updateMapQuery]);

  const handleMapViewChange = useCallback((view) => {
    if (!view) return;
    updateMapQuery(view);
  }, [updateMapQuery]);

  const handleShare = useCallback(async (context = "peta ini") => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Geoportal Wajo", text: `Lihat ${context} di Peta Wajo`, url });
        setStatus("Tautan berhasil dibagikan");
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus("Tautan peta disalin");
    } catch {
      setStatus("Berbagi dibatalkan");
    }
  }, []);

  const handleExploreRelated = useCallback((layer, region) => {
    setSelected(null);
    setInspectOpen(false);
    setLayerInfo(null);
    setRegionFilter(region);
    setVisible((previous) => ({
      ...previous,
      [layer.id]: true,
      "adm-desa": true
    }));
    setStatus(`Menampilkan ${layer.title} di ${regionDisplayName(region)}…`);
    const activeIds = layers.filter((item) => visible[item.id] || item.id === layer.id).map((item) => item.id);
    updateMapQuery({ layers: activeIds.join(","), layer: layer.id, region, feature: null });
  }, [updateMapQuery, visible]);

  const handleExploreAdminLayer = useCallback((layerId, selection) => {
    const layer = layers.find((item) => item.id === layerId);
    if (!layer || !selection?.feature) return;

    const properties = selection.feature.properties ?? {};
    const adminLayerId = selection.layer?.id;
    const selectedKecamatan = String(
      properties.Kecamatan ?? properties.WADMKC ?? properties.nama_kecamatan ?? properties.kecamatan ?? ""
    ).trim();

    setHasInteracted(true);
    setLayerInfo(null);
    setSelected(null);
    setInspectOpen(false);
    setFocusAdmin(adminLayerId === "adm-desa" ? { type: "desa", feature: selection.feature } : null);
    setVisible((previous) => ({
      ...previous,
      [layer.id]: true,
      ...(adminLayerId === "adm-kecamatan" || adminLayerId === "adm-desa"
        ? { "adm-desa": true }
        : {})
    }));

    const activeIds = layers
      .filter((item) => visible[item.id] || item.id === layer.id || ((adminLayerId === "adm-kecamatan" || adminLayerId === "adm-desa") && item.id === "adm-desa"))
      .map((item) => item.id);

    if (selectedKecamatan && adminLayerId === "adm-desa") {
      setRegionFilter(selectedKecamatan);
      updateMapQuery({ layers: activeIds.join(","), layer: layer.id, region: selectedKecamatan, feature: null });
      setStatus(`${layer.title} di ${regionDisplayName(selectedKecamatan)} tampil di peta`);
    } else if (selectedKecamatan && adminLayerId === "adm-kecamatan") {
      setRegionFilter(selectedKecamatan);
      updateMapQuery({ layers: activeIds.join(","), layer: layer.id, region: selectedKecamatan, feature: null });
      setStatus(`${layer.title} di ${regionDisplayName(selectedKecamatan)} tampil di peta`);
    } else {
      updateMapQuery({ layers: activeIds.join(","), layer: layer.id, feature: null });
      setStatus(`${layer.title} tampil di peta`);
    }

    mapApi.current?.zoomToFeature?.(selection);
  }, [updateMapQuery, visible]);

  const closeInspector = useCallback(() => {
    mapApi.current?.clearSelection?.();
    setSelected(null);
    setInspectOpen(false);
    updateMapQuery({ feature: null });
  }, [updateMapQuery]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (selected) { closeInspector(); return; }
      if (layerInfo) { closeLayerInfo(); return; }
      if (window.matchMedia("(max-width: 1023px)").matches && sidebarOpen) closeCatalog();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, layerInfo, sidebarOpen, closeInspector, closeLayerInfo, closeCatalog]);

  const handleActiveLayerSelect = useCallback((layer) => {
    setHasInteracted(true);
    setLayerInfo(layer);
    setSelected(null);
    setInspectOpen(false);
  }, []);

  const hideActiveLayer = useCallback((layer) => {
    const nextVisibleIds = layers.filter((item) => item.id !== layer.id && visible[item.id]).map((item) => item.id);
    setHasInteracted(true);
    setVisible((previous) => ({ ...previous, [layer.id]: false }));
    updateMapQuery({ layers: nextVisibleIds.join(","), layer: null, feature: null });
  }, [updateMapQuery, visible]);

  const resetPortal = useCallback(() => {
    setHasInteracted(true);
    setVisible({ ...DEFAULT_VISIBLE });
    setSearch("");
    setGroupFilter("Semua");
    setSelected(null);
    setInspectOpen(false);
    setLayerInfo(null);
    mapApi.current?.clearSelection?.();
    window.requestAnimationFrame(() => {
      mapApi.current?.zoomHome?.();
    });
    setFocusAdmin(null);
    setRegionFilter("");
    updateMapQuery({ layers: null, layer: null, feature: null, region: null, lat: null, lng: null, zoom: null });
  }, [updateMapQuery]);

  const handleLayerLoading = useCallback((layerId, isLoading) => {
    setLoading((previous) => ({ ...previous, [layerId]: isLoading }));
  }, []);

  const handleLayerError = useCallback((layerId, message) => {
    setErrors((previous) => ({ ...previous, [layerId]: message }));
  }, []);

  const handleMapCoords = useCallback((nextCoords) => setCoords(nextCoords), []);
  const handlePrint = useCallback(async () => {
    if (typeof window === "undefined") return;
    setStatus("Menyiapkan peta untuk dicetak…");
    const prepared = await mapApi.current?.preparePrint?.();
    if (prepared === false) {
      setStatus("Peta belum siap dicetak");
      return;
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => window.print());
    });
  }, []);

  const handleMapReadyStatus = useCallback((nextStatus) => {
    setMapReady((current) => current || true);
    setStatus((current) => current === nextStatus ? current : nextStatus);
  }, []);

  const selectedRegion = selected?.regionName || "";
  const relatedItems = useMemo(() => {
    if (!selected?.layer) return [];
    return getRelatedLayerIds(selected.layer.id)
      .map((id) => layers.find((layer) => layer.id === id))
      .filter(Boolean)
      .map((layer) => ({
        layer,
        count: selectedRegion ? getRegionCount(REGION_SUMMARY, layer.file, selectedRegion) : 0
      }))
      .filter(({ count }) => count > 0)
      .slice(0, 5);
  }, [selected, selectedRegion]);

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-white">
      <a
        href="#map"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[3000] focus:bg-white focus:px-3 focus:py-2 map-text-compact focus:font-semibold focus:text-slate-900 focus:shadow-lg"
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
            <Image
              src={withAssetVersion("/brand/logo-kabupaten-wajo.png")}
              alt="Lambang Kabupaten Wajo"
              width={82}
              height={82}
              priority
              className="h-20 w-20 object-contain"
            />
            <p className="mt-4 map-text-micro font-semibold uppercase tracking-[0.16em] text-slate-500">
              Pemerintah Kabupaten Wajo
            </p>
            <p className="mt-1 map-text-compact font-semibold text-slate-900">
              Peta Interaktif Kabupaten Wajo
            </p>
            <div className="mt-5 flex items-center gap-2 map-text-micro text-slate-500">
              <span className="size-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" aria-hidden="true" />
              Menyiapkan peta…
            </div>
          </div>
        </div>
      )}

      <GeoPortalHeader
        search={search}
        onSearch={(value) => {
          setSearch(value);
          if (value.trim()) {
            setHasInteracted(true);
            setSidebarOpen(true);
          }
        }}
      />

      <main id="map" className="relative flex min-h-0 flex-1 overflow-hidden">
        <LayerCatalog
          open={sidebarOpen}
          focusLayerId={catalogLayerId}
          layers={layers}
          groupOrder={groupOrder}
          visible={visible}
          loading={loading}
          errors={errors}
          search={search}
          groupFilter={groupFilter}
          regionFilter={regionFilter}
          regionOptions={REGIONS}
          onSearch={setSearch}
          onGroupFilter={setGroupFilter}
          onRegionFilter={handleRegionFilter}
          onReset={resetPortal}
          onToggle={handleToggleLayer}
          onInfo={handleLayerInfo}
          layerData={layerData}
          dataSummary={DATA_SUMMARY}
          regionSummary={REGION_SUMMARY}
          onClose={closeCatalog}
        />

        {sidebarOpen && (
          <button
            type="button"
            onClick={closeCatalog}
            className="sheet-backdrop absolute inset-0 z-[1300] bg-slate-950/10 lg:hidden"
            aria-label="Tutup daftar data"
          />
        )}

        <div className="print-map-stage relative min-w-0 flex-1">
          <ActiveLayersBar activeLayers={activeLayers} layerData={layerData} dataSummary={DATA_SUMMARY} regionFilter={regionFilter} regionSummary={REGION_SUMMARY} onSelectLayer={handleActiveLayerSelect} onCloseLayer={hideActiveLayer} onClearRegion={() => handleRegionFilter("")} />
          {!hasInteracted && !layerInfo && !selected && (
            <MapHint
              step={activeLayers.length ? "feature" : "layer"}
              regionName={regionFilter}
              onAction={() => {
                setHasInteracted(true);
                setSidebarOpen(true);
              }}
            />
          )}
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
            onViewChange={handleMapViewChange}
            regionFilter={regionFilter}
            focusAdmin={focusAdmin}
            retryTokens={retryTokens}
          />
          <MapControls
            mapReady={mapReady}
            onZoomIn={() => mapApi.current?.zoomIn?.()}
            onZoomOut={() => mapApi.current?.zoomOut?.()}
            onHome={() => {
              setHasInteracted(true);
              mapApi.current?.zoomHome?.();
            }}
            onLocate={() => {
              setHasInteracted(true);
              mapApi.current?.locateMe?.();
            }}
            onPrint={() => {
              setHasInteracted(true);
              handlePrint();
            }}
            sidebarOpen={sidebarOpen}
            onOpenSidebar={() => {
              setHasInteracted(true);
              setSidebarOpen(true);
            }}
          />
          <LegendPanel
            activeLayers={activeLayers}
            kecamatanLegend={kecamatanLegend}
            open={legendOpen}
            onClose={() => setLegendOpen(false)}
          />
          <MapStatus status={status} coords={coords} />
          <LayerInfoPanel
            layer={layerInfo}
            data={layerInfo ? layerData[layerInfo.id] : null}
            summary={layerInfo ? DATA_SUMMARY[layerInfo.file] : null}
            regionSummary={layerInfo ? REGION_SUMMARY[layerInfo.file] : null}
            regionFilter={regionFilter}
            active={layerInfo ? !!visible[layerInfo.id] : false}
            loading={layerInfo ? !!loading[layerInfo.id] : false}
            error={layerInfo ? errors[layerInfo.id] || "" : ""}
            open={Boolean(layerInfo)}
            onClose={closeLayerInfo}
            onShowOnMap={() => layerInfo && showLayerOnMap(layerInfo)}
            onZoomToLayer={zoomToLayer}
            onShare={() => handleShare(`data ${layerInfo?.title || "ini"}`)}
          />
          <FeatureInspector
            selected={selected}
            open={inspectOpen}
            onClose={closeInspector}
            onZoom={() => mapApi.current?.zoomToFeature?.(selected)}
            onShare={() => handleShare(`informasi ${selected?.layer?.title || "ini"}`)}
            regionName={selectedRegion}
            relatedItems={relatedItems}
            onExploreRelated={handleExploreRelated}
            onExploreAdminLayer={handleExploreAdminLayer}
          />
          <MobileActions
            onOpenSidebar={() => {
              setHasInteracted(true);
              setSidebarOpen(true);
            }}
            onToggleLegend={() => {
              setHasInteracted(true);
              setLegendOpen((value) => !value);
            }}
            selected={selected}
            onOpenInspector={() => setInspectOpen(true)}
            sidebarOpen={sidebarOpen}
            legendOpen={legendOpen}
          />
        </div>

        <PrintLegend
          activeLayers={activeLayers}
          kecamatanLegend={printKecamatanLegend}
          scopeTitle={printScopeTitle}
        />
      </main>
    </div>
  );
}
