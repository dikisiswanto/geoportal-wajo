import Link from "next/link";
import { absoluteUrl, PUBLISHER_NAME, SITE_NAME, SOCIAL_IMAGE } from "../../lib/seo";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export const metadata = {
  title: { absolute: "Tentang Geoportal Kabupaten Wajo | Geoportal Wajo" },
  description:
    "Kenali Peta Interaktif Kabupaten Wajo, cara data disajikan, sumber data yang digunakan, dan pengelola portal.",
  alternates: { canonical: "/tentang" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    title: "Tentang Geoportal Kabupaten Wajo",
    description:
      "Kenali Peta Interaktif Kabupaten Wajo, cara data disajikan, sumber data yang digunakan, dan pengelola portal.",
    url: absoluteUrl("/tentang"),
    images: [{ url: SOCIAL_IMAGE, width: 1200, height: 630, alt: "Tentang Geoportal Kabupaten Wajo" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang Geoportal Kabupaten Wajo",
    description:
      "Kenali Peta Interaktif Kabupaten Wajo, cara data disajikan, sumber data yang digunakan, dan pengelola portal.",
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
      "Pemerintah Kabupaten Wajo sebagai penyelenggara pemerintahan daerah dan layanan informasi publik."
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader active="about" title="Geoportal Kabupaten Wajo" kicker="Pemerintah Kabupaten Wajo" />

      <main>
        <div className="mx-auto max-w-5xl px-5 pb-12 pt-9 sm:px-6 sm:pt-10 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900">Peta Wajo</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-slate-700">Tentang</span>
          </nav>

          <article className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <header className="border-b border-slate-200 px-6 py-7 sm:px-8 sm:py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {PUBLISHER_NAME}
              </p>
              <h1 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight text-slate-950 sm:text-[28px]">
                Peta Wajo, untuk memahami wilayah dari satu tempat.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                {SITE_NAME} adalah portal geospasial Kabupaten Wajo yang membantu masyarakat dan
                perangkat pemerintah menjelajahi wilayah melalui peta, dataset, dan informasi
                geografis yang disajikan dalam satu antarmuka.
              </p>
            </header>

            <div className="grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="px-6 py-7 sm:px-8">
                <section aria-labelledby="fungsi-portal">
                  <h2 id="fungsi-portal" className="text-base font-semibold text-slate-900">
                    Apa yang bisa dilakukan?
                  </h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Menjelajahi wilayah</h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600">
                        Lihat batas administrasi, jaringan, fasilitas, dan data tematik langsung pada peta.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Mencari data</h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600">
                        Temukan dataset berdasarkan kelompok, wilayah, atau kata kunci lalu buka konteksnya di peta.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Memahami konteks</h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600">
                        Setiap dataset dilengkapi informasi sumber, cakupan, geometri, tahun data, dan ringkasan statistik bila tersedia.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Membagikan temuan</h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600">
                        Posisi peta, layer, dan konteks tertentu dapat dibagikan melalui tautan yang dapat dibuka kembali.
                      </p>
                    </div>
                  </div>
                </section>

                <section aria-labelledby="sumber-data" className="mt-9 border-t border-slate-200 pt-7">
                  <h2 id="sumber-data" className="text-base font-semibold text-slate-900">
                    Tentang sumber data
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                    <p>
                      Data dasar wilayah administrasi pada portal ini bersumber dari Ina-Geoportal
                      Badan Informasi Geospasial (BIG). Data pendidikan bersumber dari Kementerian
                      Pendidikan Dasar dan Menengah.
                    </p>
                    <p>
                      Dataset sektoral lainnya dihimpun dari sumber data terbuka dan layanan ArcGIS.
                      Sumber dan publisher dicantumkan pada halaman dataset agar asal data dapat
                      dibaca sesuai konteksnya, bukan dianggap berasal dari satu sumber yang sama.
                    </p>
                    <p>
                      Portal ini menyajikan data untuk membantu eksplorasi dan pemahaman wilayah.
                      Tahun, cakupan, dan keterangan pada masing-masing dataset perlu diperhatikan
                      ketika data digunakan untuk analisis atau kebutuhan resmi.
                    </p>
                  </div>
                </section>
              </div>

              <aside className="border-t border-slate-200 bg-slate-50 px-6 py-7 lg:border-l lg:border-t-0 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Pengelola
                </p>
                <h2 className="mt-2 text-base font-semibold text-slate-900">
                  Diskominfotik Kabupaten Wajo
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Aplikasi ini dikembangkan dan dikelola sebagai bagian dari penyediaan informasi
                  geospasial yang mudah diakses melalui kanal digital Pemerintah Kabupaten Wajo.
                </p>

                <div className="mt-7 border-t border-slate-200 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Mulai menjelajah
                  </p>
                  <div className="mt-3 flex flex-col items-start gap-2">
                    <Link href="/" className="text-sm font-semibold text-slate-900 hover:text-blue-800">
                      Buka peta interaktif →
                    </Link>
                    <Link href="/data" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                      Lihat katalog data →
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </article>
        </div>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
    </div>
  );
}
