import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Geoportal Kabupaten Wajo",
    template: "%s | Geoportal Kabupaten Wajo"
  },
  description: "Geoportal resmi untuk menjelajah peta, data geospasial, administrasi, jaringan, infrastruktur, dan informasi tematik Kabupaten Wajo.",
  keywords: ["Geoportal Wajo", "Kabupaten Wajo", "peta Wajo", "data geospasial Wajo", "GIS Wajo", "peta interaktif Wajo"],
  applicationName: "Geoportal Kabupaten Wajo",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Geoportal Kabupaten Wajo",
    title: "Geoportal Kabupaten Wajo",
    description: "Portal peta dan data geospasial Kabupaten Wajo."
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
