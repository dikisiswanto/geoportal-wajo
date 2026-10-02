import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import PwaRegister from "../components/PwaRegister";

const WAJO_LOGO = "/brand/logo-kabupaten-wajo.png";
const WAJO_ICON = "/icon.png";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Peta Interaktif Kabupaten Wajo",
    template: "%s"
  },
  description: "Geoportal resmi untuk menjelajah peta, data geospasial, administrasi, jaringan, infrastruktur, dan informasi tematik Kabupaten Wajo.",
  keywords: ["Geoportal Wajo", "Kabupaten Wajo", "peta Wajo", "data geospasial Wajo", "GIS Wajo", "peta interaktif Wajo"],
  applicationName: "Peta Interaktif Kabupaten Wajo",
  appleWebApp: {
    capable: true,
    title: "Peta Wajo",
    statusBarStyle: "default"
  },
  icons: {
    icon: WAJO_ICON,
    shortcut: WAJO_ICON,
    apple: "/apple-icon.png"
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Peta Interaktif Kabupaten Wajo",
    title: "Peta Interaktif Kabupaten Wajo",
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
      <body>{children}<PwaRegister /></body>
    </html>
  );
}
