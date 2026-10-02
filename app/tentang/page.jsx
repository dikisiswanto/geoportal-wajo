import Link from "next/link";
import { absoluteUrl, DEFAULT_DESCRIPTION, PUBLISHER_NAME, SITE_NAME, SOCIAL_IMAGE } from "../../lib/seo";

export const metadata = {
  title: { absolute: "Tentang Geoportal Kabupaten Wajo | Geoportal Wajo" },
  description:
    "Informasi mengenai Peta Interaktif Kabupaten Wajo, sumber data, dan pengelolaan aplikasi oleh Diskominfotik Kabupaten Wajo.",
  alternates: {
    canonical: "/tentang"
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    title: "Tentang Geoportal Kabupaten Wajo",
    description:
      "Informasi mengenai Peta Interaktif Kabupaten Wajo, sumber data, dan pengelolaan aplikasi oleh Diskominfotik Kabupaten Wajo.",
    url: absoluteUrl("/tentang"),
    images: [
      {
        url: SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: "Tentang Geoportal Kabupaten Wajo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang Geoportal Kabupaten Wajo",
    description:
      "Informasi mengenai Peta Interaktif Kabupaten Wajo, sumber data, dan pengelolaan aplikasi oleh Diskominfotik Kabupaten Wajo.",
    images: [SOCIAL_IMAGE]
  }
};

export default function AboutPage() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "@id": `${absoluteUrl("/tentang")}#organization`,
    name: "Pemerintah Kabupaten Wajo",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/logo-kabupaten-wajo.png"),
    description:
      "Pemerintah Kabupaten Wajo sebagai penyelenggara layanan pemerintahan daerah dan informasi publik."
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900">Peta Wajo</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-slate-700">Tentang</span>
        </nav>

        <article className="mt-7 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {PUBLISHER_NAME}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Tentang {SITE_NAME}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{DEFAULT_DESCRIPTION}</p>

          <section className="mt-8 space-y-4 text-sm leading-7 text-slate-700">
            <p>
              Portal ini menyajikan data geospasial Kabupaten Wajo melalui peta interaktif yang
              mencakup administrasi wilayah, jaringan, fasilitas publik, pendidikan, kesehatan,
              serta beberapa data tematik dan potensi wilayah.
            </p>
            <p>
              Sebagian data pada portal ini diambil dari ArcGIS dan sumber data terbuka. Data
              disiapkan untuk ditampilkan dalam format geospasial pada portal dan dapat memiliki
              tahun sumber yang berbeda sesuai metadata masing-masing layer.
            </p>
            <p>
              Aplikasi ini dibuat dan dikelola oleh <strong>Diskominfotik Kabupaten Wajo</strong>.
            </p>
          </section>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Buka peta interaktif
            </Link>
          </div>
        </article>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
    </main>
  );
}
