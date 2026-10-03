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
