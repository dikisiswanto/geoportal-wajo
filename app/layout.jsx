import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import PwaRegister from "../components/PwaRegister";
import { absoluteUrl, DEFAULT_DESCRIPTION, PUBLISHER_NAME, SITE_NAME, getSiteUrl } from "../lib/seo";
import { withAssetVersion } from "../lib/assetVersion";

const SITE_ICON = withAssetVersion("/icon.png");
const SITE_OG_IMAGE = withAssetVersion("/seo/geoportal-wajo-og.png");
const BUILD_VERSION = process.env.NEXT_PUBLIC_ASSET_VERSION?.trim() || "dev";
void BUILD_VERSION;

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: "%s | Geoportal Wajo"
  },
  description: DEFAULT_DESCRIPTION,
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
    icon: SITE_ICON,
    shortcut: SITE_ICON,
    apple: withAssetVersion("/apple-icon.png")
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
        url: SITE_OG_IMAGE,
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
    images: [SITE_OG_IMAGE]
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(async()=>{try{const expected=new URL(${JSON.stringify(withAssetVersion("/sw.js"))},location.origin).href;const regs=await navigator.serviceWorker?.getRegistrations?.()||[];const stale=regs.some(r=>r.active&&r.active.scriptURL!==expected);if(stale){await Promise.all(regs.map(r=>r.unregister()));location.reload();}}catch{}})();`
          }}
        />
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
