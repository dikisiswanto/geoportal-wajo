import Link from "next/link";
import { notFound } from "next/navigation";
import { layers } from "../../../lib/layers";
import {
  absoluteUrl,
  buildDatasetDescription,
  datasetSlug,
  getDatasetSeo,
  PUBLISHER_NAME,
  SITE_NAME,
  SOCIAL_IMAGE
} from "../../../lib/seo";

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
    keywords: seo.keywords,
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
  const dataDownload = layer.file ? absoluteUrl(`/data/${layer.file}`) : null;

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
      inLanguage: "id-ID",
      alternateName: seo.keywords.slice(0, 3),
      keywords: seo.keywords,
      isAccessibleForFree: true,
      creator: {
        "@type": "GovernmentOrganization",
        name: "Pemerintah Kabupaten Wajo",
        url: absoluteUrl("/")
      },
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
      distribution: dataDownload
        ? [
            {
              "@type": "DataDownload",
              encodingFormat: "application/geo+json",
              contentUrl: dataDownload
            }
          ]
        : undefined
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
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
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {seo.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">{seo.description}</p>
          </header>

          <dl className="mt-8 grid gap-4 border-y border-slate-200 py-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nama layer</dt>
              <dd className="mt-1 text-sm text-slate-900">{layer.title}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Geometri</dt>
              <dd className="mt-1 text-sm text-slate-900">{layer.geometry}</dd>
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
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Format</dt>
              <dd className="mt-1 text-sm text-slate-900">GeoJSON</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Buka pada peta interaktif
            </Link>
            <Link
              href="/data"
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Kembali ke katalog data
            </Link>
          </div>

          <section className="mt-9 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900">Tentang data ini</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{buildDatasetDescription(layer)}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Sebagian data pada portal ini bersumber dari ArcGIS dan sumber data terbuka. Aplikasi
              dibuat dan dikelola oleh Diskominfotik Kabupaten Wajo.
            </p>
          </section>
        </article>
      </div>

      {structuredData.map((item, index) => (
        <script
          key={item["@id"] || `schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </main>
  );
}
