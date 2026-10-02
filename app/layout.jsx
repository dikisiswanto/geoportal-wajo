import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import PwaRegister from "../components/PwaRegister";
import { absoluteUrl, DEFAULT_DESCRIPTION, PUBLISHER_NAME, SITE_KEYWORDS, SITE_NAME } from "../lib/seo";

const WAJO_ICON = "/icon.png";
const WAJO_OG = "/seo/geoportal-wajo-og.png";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: SITE_NAME,
    template: "%s | Geoportal Wajo"
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  generator: "Next.js",
  creator: PUBLISHER_NAME,
  publisher: PUBLISHER_NAME,
  authors: [{ name: PUBLISHER_NAME }],
  category: "government",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    telephone: false,
    address: false
  },
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
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: absoluteUrl("/"),
    images: [
      {
        url: WAJO_OG,
        width: 1200,
        height: 630,
        alt: "Peta Interaktif Kabupaten Wajo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [WAJO_OG]
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
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
