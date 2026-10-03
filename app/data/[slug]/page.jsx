import Link from "next/link";
import { notFound } from "next/navigation";
import { layers } from "../../../lib/layers";
import { getLayerStatistics } from "../../../lib/geo/statistics";
import { humanGeometryLabel } from "../../../lib/geo/format";
import fs from "node:fs";
import path from "node:path";

import {
  absoluteUrl,
  buildDatasetDescription,
  datasetSlug,
  getDatasetSeo,
  getSourceMetadata,
  PUBLISHER_NAME,
  SITE_NAME,
  SOCIAL_IMAGE
} from "../../../lib/seo";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";

function getLayer(slug) {
  return layers.find((layer) => datasetSlug(layer) === slug);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return layers.map((layer) => ({
    slug: datasetSlug(layer)
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const layer = getLayer(slug);
  if (!layer) return {};

  const seo = getDatasetSeo(layer);
  const url = absoluteUrl(`/data/${datasetSlug(layer)}`);
  return {
    title: { absolute: `${seo.title} | Geoportal Wajo` },
    description: seo.description,
    alternates: {
      canonical: url
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: SITE_NAME,
      title: `${seo.title} | Geoportal Wajo`,
      description: seo.description,
      url,
      images: [
        {
          url: SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: seo.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${seo.title} | Geoportal Wajo`,
      description: seo.description,
      images: [SOCIAL_IMAGE]
    }
  };
}

export default async function DatasetPage({ params }) {
  const { slug } = await params;
  const layer = getLayer(slug);
  if (!layer) notFound();

  const seo = getDatasetSeo(layer);
  const url = absoluteUrl(`/data/${datasetSlug(layer)}`);
  const sourceText = layer.source || "Data geospasial Kabupaten Wajo";
  const sourceMeta = getSourceMetadata(layer);
  const dataPath = path.join(process.cwd(), "public", "geo-data", layer.file);
  let stats = { total: 0, geometryCounts: [], distribution: [], kecamatanDistribution: [], loaded: false };
  try {
    const raw = fs.readFileSync(dataPath, "utf8");
    stats = getLayerStatistics(layer, JSON.parse(raw));
  } catch {
    // Dataset detail tetap dapat dirender bila file data tidak tersedia saat build.
  }
  const related = layers.filter((item) => item.id !== layer.id && item.group === layer.group).slice(0, 4);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: SITE_NAME,
          item: absoluteUrl("/")
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Katalog Data",
          item: absoluteUrl("/data")
        },
        {
          "@type": "ListItem",
          position: 3,
          name: layer.title,
          item: url
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      "@id": `${url}#dataset`,
      name: layer.title,
      description: seo.description,
      url,
      mainEntityOfPage: url,
      inLanguage: "id-ID",
      alternateName: seo.keywords.slice(0, 3),
        isAccessibleForFree: true,
      creator: sourceMeta.publisher !== "Sesuai keterangan sumber data"
        ? {
            "@type": "Organization",
            name: sourceMeta.publisher
          }
        : undefined,
      publisher: {
        "@type": "GovernmentOrganization",
        name: PUBLISHER_NAME,
        url: absoluteUrl("/")
      },
      includedInDataCatalog: {
        "@type": "DataCatalog",
        name: "Katalog Data Geospasial Kabupaten Wajo",
        url: absoluteUrl("/data")
      },
      spatialCoverage: {
        "@type": "Place",
        name: "Kabupaten Wajo, Sulawesi Selatan, Indonesia"
      },
      temporalCoverage: layer.dataYear ? String(layer.dataYear) : undefined,
      dateModified: layer.dataUpdatedAt || undefined,
      contributor: layer.source || undefined
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader active="data" title="Geoportal Kabupaten Wajo" kicker="Pemerintah Kabupaten Wajo" />
      <main>
      <div className="mx-auto max-w-5xl px-5 pb-10 pt-10 sm:px-6 sm:pt-11 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900">Peta Wajo</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/data" className="hover:text-slate-900">Katalog Data</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-slate-700">{layer.title}</span>
        </nav>

        <article className="mt-7 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <header className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {layer.group}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 lg:text-3xl">
              {seo.title}
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-600 lg:text-base lg:leading-7">{seo.description}</p>
          </header>

          <dl className="mt-8 grid gap-4 border-y border-slate-200 py-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nama data</dt>
              <dd className="mt-1 text-sm text-slate-900">{layer.title}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Jenis data</dt>
              <dd className="mt-1 text-sm text-slate-900">{humanGeometryLabel(layer.geometry)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sumber data</dt>
              <dd className="mt-1 text-sm text-slate-900">{sourceText}</dd>
            </div>
            {layer.dataYear && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tahun data</dt>
                <dd className="mt-1 text-sm text-slate-900">{layer.dataYear}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Wilayah</dt>
              <dd className="mt-1 text-sm text-slate-900">Kabupaten Wajo, Sulawesi Selatan</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Jumlah data</dt>
              <dd className="mt-1 text-sm tabular-nums text-slate-900">{stats.total.toLocaleString("id-ID")}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Penyedia data</dt>
              <dd className="mt-1 text-sm text-slate-900">{sourceMeta.publisher}</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/?layer=${encodeURIComponent(layer.id)}&catalog=1`} className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Buka pada peta interaktif</Link>
            <Link href="/data" className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Katalog data</Link>
          </div>

          <section className="mt-9 border-t border-slate-200 pt-6" aria-labelledby="dataset-statistik">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Ringkasan</p>
                <h2 id="dataset-statistik" className="mt-1 text-base font-semibold text-slate-900 lg:text-lg">Ringkasan data</h2>
              </div>
              <span className="text-xs tabular-nums text-slate-500">{stats.total.toLocaleString("id-ID")} objek</span>
            </div>
            {stats.distribution.length > 0 && (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {stats.distribution.map((item) => (
                  <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-3 text-sm lg:text-base">
                      <span className="truncate text-slate-600">{item.label}</span>
                      <span className="font-semibold tabular-nums text-slate-900">{item.count.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-slate-400" style={{ width: `${Math.max(8, (item.count / Math.max(stats.distribution[0]?.count || 1, 1)) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-9 border-t border-slate-200 pt-6" aria-labelledby="dataset-konteks">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Tentang data</p>
            <h2 id="dataset-konteks" className="mt-1 text-base font-semibold text-slate-900 lg:text-lg">Sumber dan keterangan</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 lg:text-base lg:leading-7">{layer.sourceNote || sourceMeta.description} {layer.description || `Data ${layer.title} Kabupaten Wajo.`}</p>
          </section>

          {related.length > 0 && (
            <section className="mt-9 border-t border-slate-200 pt-6" aria-labelledby="dataset-terkait">
              <h2 id="dataset-terkait" className="text-base font-semibold text-slate-900 lg:text-lg">Data lain yang terkait</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {related.map((item) => (
                  <Link key={item.id} href={`/data/${datasetSlug(item)}`} className="rounded-lg border border-slate-200 px-3 py-3 hover:border-slate-300 hover:bg-slate-50">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.group} · Lihat data</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
      </main>
      <SiteFooter />

      {structuredData.map((item, index) => (
        <script
          key={item["@id"] || `schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </div>
  );
}
