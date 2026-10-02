import GeoPortal from "../components/GeoPortal";

export const metadata = {
  title: "Peta Interaktif Kabupaten Wajo",
  description: "Jelajah peta interaktif dan data geospasial Kabupaten Wajo: administrasi, jalan, jaringan, infrastruktur, dan peta tematik."
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Peta Interaktif Kabupaten Wajo",
    applicationCategory: "MappingApplication",
    operatingSystem: "Any",
    inLanguage: "id-ID",
    description: "Portal peta interaktif dan data geospasial Kabupaten Wajo.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  };

  return (
    <>
      <section className="sr-only" aria-labelledby="geoportal-summary">
        <h2 id="geoportal-summary">Peta dan data geospasial Kabupaten Wajo</h2>
        <p>Jelajahi administrasi wilayah, jalan, jaringan, infrastruktur, dan peta tematik Kabupaten Wajo melalui peta interaktif.</p>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeoPortal />
    </>
  );
}
