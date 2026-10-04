"use client";

import { useEffect, useMemo, useState } from "react";
import { IconLoader2, IconMapPin, IconSearch, IconDatabase } from "@tabler/icons-react";
import { layers } from "../../../lib/layers";
import { REGIONS } from "../../../lib/geo/regionSummary";
import { regionDisplayName } from "../../../lib/geo/region";

const MIN_QUERY_LENGTH = 2;
const MAX_RESULTS = 9;

function normalizeQuery(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function scoreItem(item, query) {
  const normalizedLabel = normalizeQuery(item.label);
  const normalizedText = normalizeQuery(item.text);
  if (!normalizedLabel && !normalizedText) return -1;
  if (normalizedLabel === query) return 100;
  if (normalizedLabel.startsWith(query)) return 80;
  if (normalizedLabel.includes(query)) return 65;
  if (normalizedText.includes(query)) return 40;
  return -1;
}

export default function MapSearchResults({ query = "", onSelect }) {
  const [index, setIndex] = useState(null);
  const [loadError, setLoadError] = useState(false);

  const normalized = normalizeQuery(query);
  const loading = normalized.length >= MIN_QUERY_LENGTH && !index && !loadError;

  useEffect(() => {
    if (normalized.length < MIN_QUERY_LENGTH || index || loadError) return undefined;

    let disposed = false;

    fetch("/search-index.json", { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!disposed) setIndex(Array.isArray(data?.items) ? data.items : []);
      })
      .catch(() => {
        if (!disposed) setLoadError(true);
      });

    return () => {
      disposed = true;
    };
  }, [index, loadError, normalized]);

  const results = useMemo(() => {
    if (normalized.length < MIN_QUERY_LENGTH) return [];

    const regionResults = REGIONS
      .filter((region) => normalizeQuery(region).includes(normalized))
      .map((region) => ({
        id: `region:${region}`,
        kind: "region",
        layerId: "adm-kecamatan",
        label: regionDisplayName(region),
        subtitle: "Kecamatan · Kabupaten Wajo",
        text: region,
        key: region
      }));

    const layerResults = layers
      .filter((layer) => {
        const text = normalizeQuery(`${layer.title} ${layer.group} ${layer.description} ${layer.source ?? ""}`);
        return text.includes(normalized);
      })
      .slice(0, 4)
      .map((layer) => ({
        id: `layer:${layer.id}`,
        kind: "layer",
        layerId: layer.id,
        label: layer.title,
        subtitle: layer.group,
        text: `${layer.title} ${layer.group} ${layer.description ?? ""}`
      }));

    const featureResults = (index || [])
      .map((item) => ({ item, score: scoreItem(item, normalized) }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score || String(a.item.label).localeCompare(String(b.item.label), "id"))
      .map(({ item }) => ({
        ...item,
        kind: item.layerId === "adm-kecamatan" ? "region" : item.layerId === "adm-desa" ? "village" : "feature",
        label: item.layerId === "adm-kecamatan" ? regionDisplayName(item.label) : item.label
      }));

    const merged = [...regionResults, ...featureResults, ...layerResults];
    const seen = new Set();
    return merged
      .filter((item) => {
        const key = `${item.kind}:${item.layerId}:${item.key ?? item.label}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, MAX_RESULTS);
  }, [index, normalized]);

  if (normalized.length < MIN_QUERY_LENGTH) return null;

  return (
    <div className="map-search-popover absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg" role="listbox" aria-label="Hasil pencarian peta">
      {loading && !index && (
        <div className="flex items-center gap-2 px-3 py-3 map-text-compact text-slate-500">
          <IconLoader2 size={15} className="animate-spin" aria-hidden="true" />
          Mencari lokasi dan data…
        </div>
      )}

      {!loading && loadError && (
        <div className="px-3 py-3 map-text-compact text-slate-500">Pencarian belum tersedia. Coba lagi beberapa saat.</div>
      )}

      {!loading && !loadError && !results.length && (
        <div className="flex items-start gap-2 px-3 py-3">
          <IconSearch size={15} className="mt-0.5 text-slate-400" aria-hidden="true" />
          <div>
            <p className="map-text-compact font-medium text-slate-800">Belum ditemukan</p>
            <p className="mt-0.5 map-text-micro text-slate-500">Coba nama kecamatan, desa, jalan, fasilitas, atau data.</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="max-h-[min(60dvh,420px)] overflow-y-auto py-1">
          {results.map((result) => {
            const isArea = result.kind === "region" || result.kind === "village";
            return (
              <button
                key={result.id}
                type="button"
                role="option"
                onClick={() => onSelect?.(result)}
                className="ui-micro-interaction flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-700"
              >
                <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-md ${isArea ? "bg-slate-100 text-slate-600" : result.kind === "layer" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-700"}`}>
                  {isArea ? <IconMapPin size={14} aria-hidden="true" /> : result.kind === "layer" ? <IconDatabase size={14} aria-hidden="true" /> : <IconSearch size={14} aria-hidden="true" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate map-text-compact font-semibold text-slate-800">{result.label}</span>
                  <span className="mt-0.5 block truncate map-text-micro text-slate-500">{result.subtitle || result.layerTitle || "Data peta"}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
