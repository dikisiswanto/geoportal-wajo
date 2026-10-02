import { getSiteUrl } from "../lib/seo";

export default function robots() {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/data", "/data/", "/tentang" , "/tentang/"],
        disallow: ["/api/"]
      }
    ],
    sitemap: `${base}/sitemap.xml`
  };
}
