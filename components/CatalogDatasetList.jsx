"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconSearch, IconX } from "@tabler/icons-react";
import { datasetSlug, getDatasetSeo } from "../lib/seo";
import SourceBadge from "./geoportal/SourceBadge";
import { humanGeometryLabel } from "../lib/geo/format";

export default function CatalogDatasetList({ layers, groups }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalized) return layers;
    return layers.filter((layer) =>
      `${layer.title} ${layer.group} ${layer.description ?? ""} ${layer.source ?? ""} ${layer.sourceType ?? ""} ${layer.publisher ?? ""}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [layers, normalized]);

  return (
    <>
      <div className="mb-8 max-w-xl">
        <label className="relative block">
          <span className="sr-only">Cari data</span>
          <IconSearch size={17} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari data, wilayah, atau sumber…"
            className="h-10 w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Hapus pencarian"
            >
              <IconX size={14} aria-hidden />
            </button>
          )}
        </label>
        <p className="mt-2 text-xs text-slate-500">
          {normalized ? `${filtered.length.toLocaleString("id-ID")} data ditemukan` : `${layers.length.toLocaleString("id-ID")} data tersedia`}
        </p>
      </div>

      {groups.map((group) => {
        const groupLayers = filtered.filter((layer) => layer.group === group);
        if (!groupLayers.length) return null;
        return (
          <section key={group} className="mb-10" aria-label={group}>
            <h2 className="text-base font-semibold text-slate-900">{group}</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {groupLayers.map((layer) => {
                const seo = getDatasetSeo(layer);
                return (
                  <Link
                    key={layer.id}
                    href={`/data/${datasetSlug(layer)}`}
                    className="group rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <h3 className="text-sm font-semibold leading-5 text-slate-900 group-hover:text-blue-800">
                      {layer.title}
                    </h3>
                    <p className="mt-1 catalog-card-body leading-5 text-slate-500">{seo.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1">{humanGeometryLabel(layer.geometry)}</span>
                      {layer.dataYear && <span>{layer.dataYear}</span>}
                      <SourceBadge sourceType={layer.sourceType} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {!filtered.length && (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white px-5 py-10 text-center">
          <p className="text-sm font-medium text-slate-800">Data tidak ditemukan</p>
          <p className="mt-1 text-xs text-slate-500">Coba nama data, wilayah, kategori, atau sumber.</p>
        </div>
      )}
    </>
  );
}
