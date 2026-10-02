import GeoPortal from "../components/GeoPortal";
import { absoluteUrl, DEFAULT_DESCRIPTION, PUBLISHER_NAME, SITE_NAME, SOCIAL_IMAGE } from "../lib/seo";

export const metadata = {
  title: { absolute: SITE_NAME },
  description:
    "Peta digital Kabupaten Wajo untuk melihat batas administrasi, jaringan jalan, fasilitas publik, pendidikan, kesehatan, dan potensi wilayah.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Peta digital Kabupaten Wajo untuk melihat batas administrasi, jaringan jalan, fasilitas publik, pendidikan, kesehatan, dan potensi wilayah.",
    url: absoluteUrl("/"),
    images: [
      {
        url: SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: "Peta Interaktif Kabupaten Wajo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Peta digital Kabupaten Wajo untuk melihat batas administrasi, jaringan jalan, fasilitas publik, pendidikan, kesehatan, dan potensi wilayah.",
    images: [SOCIAL_IMAGE]
  }
};

export default function Home() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "GovernmentOrganization",
      "@id": `${absoluteUrl("/")}#organization`,
      name: "Pemerintah Kabupaten Wajo",
      alternateName: "Pemkab Wajo",
      logo: absoluteUrl("/brand/logo-kabupaten-wajo.png"),
      url: absoluteUrl("/")
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${absoluteUrl("/")}#website`,
      name: SITE_NAME,
      url: absoluteUrl("/"),
      inLanguage: "id-ID",
      publisher: {
        "@id": `${absoluteUrl("/")}#organization`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${absoluteUrl("/")}#application`,
      name: SITE_NAME,
      alternateName: ["Geoportal Wajo", "Peta Kabupaten Wajo"],
      applicationCategory: "MappingApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript and a modern web browser",
      inLanguage: "id-ID",
      isAccessibleForFree: true,
      description: DEFAULT_DESCRIPTION,
      url: absoluteUrl("/"),
      provider: {
        "@id": `${absoluteUrl("/")}#organization`
      },
      featureList: [
        "Peta administrasi Kabupaten Wajo",
        "Peta kecamatan Kabupaten Wajo",
        "Jaringan jalan dan jaringan infrastruktur",
        "Lokasi OPD dan Puskesmas",
        "Data satuan pendidikan",
        "Peta potensi pertanian dan peternakan"
      ]
    }
  ];

  return (
    <>
      <section className="sr-only" aria-labelledby="geoportal-summary">
        <h2 id="geoportal-summary">Peta dan data geospasial Kabupaten Wajo</h2>
        <p>
          {DEFAULT_DESCRIPTION} Portal ini dibuat dan dikelola oleh {PUBLISHER_NAME}. Sebagian data
          bersumber dari ArcGIS dan sumber data terbuka.
        </p>
      </section>
      {structuredData.map((item) => (
        <script
          key={item["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <GeoPortal />
    </>
  );
}
