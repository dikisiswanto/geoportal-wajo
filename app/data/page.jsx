import Link from "next/link";
import { layers } from "../../lib/layers";
import { absoluteUrl, datasetSlug, getDatasetSeo, PUBLISHER_NAME, SITE_NAME, SOCIAL_IMAGE } from "../../lib/seo";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import CatalogDatasetList from "../../components/CatalogDatasetList";

export const metadata = {
  title: { absolute: "Katalog Data Geospasial Kabupaten Wajo | Geoportal Wajo" },
  description:
    "Katalog data geospasial Kabupaten Wajo yang memuat peta administrasi, jaringan, fasilitas publik, pendidikan, kesehatan, dan data potensi wilayah.",
  alternates: {
    canonical: "/data"
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    title: "Katalog Data Geospasial Kabupaten Wajo",
    description:
      "Katalog data geospasial Kabupaten Wajo yang memuat peta administrasi, jaringan, fasilitas publik, pendidikan, kesehatan, dan data potensi wilayah.",
    url: absoluteUrl("/data"),
    images: [
      {
        url: SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: "Katalog Data Geospasial Kabupaten Wajo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Katalog Data Geospasial Kabupaten Wajo",
    description:
      "Katalog data geospasial Kabupaten Wajo yang memuat peta administrasi, jaringan, fasilitas publik, pendidikan, kesehatan, dan data potensi wilayah.",
    images: [SOCIAL_IMAGE]
  }
};

export default function DataCatalogPage() {
  const groups = [...new Set(layers.map((layer) => layer.group))];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    "@id": `${absoluteUrl("/data")}#catalog`,
    name: "Katalog Data Geospasial Kabupaten Wajo",
    description:
      "Katalog data geospasial yang tersedia pada Peta Interaktif Kabupaten Wajo.",
    url: absoluteUrl("/data"),
    mainEntityOfPage: absoluteUrl("/data"),
    provider: {
      "@type": "GovernmentOrganization",
      name: "Pemerintah Kabupaten Wajo",
      url: absoluteUrl("/")
    },
    dataset: layers.map((layer) => ({
      "@type": "Dataset",
      name: layer.title,
      description: getDatasetSeo(layer).description,
      url: absoluteUrl(`/data/${datasetSlug(layer)}`)
    }))
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader active="data" title="Geoportal Kabupaten Wajo" kicker="Pemerintah Kabupaten Wajo" />
      <main>
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-10 sm:px-6 sm:pt-11 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {PUBLISHER_NAME}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 lg:text-3xl">
            Katalog Data Geospasial Kabupaten Wajo
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 lg:text-base lg:leading-7">
            Jelajahi dataset geospasial Kabupaten Wajo melalui halaman ringkas yang memuat konteks data, sumber, statistik, dan tautan ke peta interaktif.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Buka peta interaktif
          </Link>
        </header>

        <section className="mt-10" aria-label="Daftar dataset">
          <CatalogDatasetList layers={layers} groups={groups} />
        </section>

      </div>
      </main>
      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
