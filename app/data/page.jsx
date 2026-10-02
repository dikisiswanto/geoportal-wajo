import Link from "next/link";
import { layers } from "../../lib/layers";
import { absoluteUrl, datasetSlug, getDatasetSeo, PUBLISHER_NAME, SITE_NAME, SOCIAL_IMAGE } from "../../lib/seo";

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
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {PUBLISHER_NAME}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Katalog Data Geospasial Kabupaten Wajo
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Jelajahi daftar data geospasial yang tersedia pada {SITE_NAME}. Setiap halaman data
            menjelaskan tema, geometri, sumber, dan informasi singkat tentang dataset.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Buka peta interaktif
          </Link>
        </header>

        <section className="mt-10 space-y-10" aria-label="Daftar dataset">
          {groups.map((group) => (
            <section key={group}>
              <h2 className="text-lg font-semibold text-slate-900">{group}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {layers
                  .filter((layer) => layer.group === group)
                  .map((layer) => {
                    const seo = getDatasetSeo(layer);
                    return (
                      <Link
                        key={layer.id}
                        href={`/data/${datasetSlug(layer)}`}
                        className="group rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                      >
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-800">
                          {layer.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{seo.description}</p>
                        <p className="mt-3 text-xs text-slate-500">
                          {layer.geometry}
                          {layer.dataYear ? ` · ${layer.dataYear}` : ""}
                        </p>
                      </Link>
                    );
                  })}
              </div>
            </section>
          ))}
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
