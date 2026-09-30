import GeoPortal from "../components/GeoPortal";

export const metadata = {
  title: "Peta Interaktif",
  description: "Jelajah peta dan data geospasial Kabupaten Wajo."
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Geoportal Kabupaten Wajo",
    description: "Portal peta dan data geospasial Kabupaten Wajo.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeoPortal />
    </>
  );
}
