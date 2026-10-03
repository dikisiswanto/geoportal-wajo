const ASSET_VERSION =
  process.env.BUILD_VERSION?.trim() ||
  process.env.VERCEL_GIT_COMMIT_SHA?.trim() ||
  new Date().toISOString().replace(/[-:.TZ]/g, "");

const nextConfig = {
  env: {
    NEXT_PUBLIC_ASSET_VERSION: ASSET_VERSION
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    localPatterns: [
      {
        pathname: "/brand/logo-kabupaten-wajo.png"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, must-revalidate"
          }
        ]
      },
      {
        source: "/tentang",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, must-revalidate"
          }
        ]
      },
      {
        source: "/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, must-revalidate"
          }
        ]
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate"
          }
        ]
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate"
          },
          {
            key: "Pragma",
            value: "no-cache"
          },
          {
            key: "Expires",
            value: "0"
          }
        ]
      },
      {
        source: "/geo-data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow"
          }
        ]
      },
      {
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        source: "/icon.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
