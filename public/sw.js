const SW_VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const CACHE_NAME = `geoportal-wajo-${SW_VERSION}`;
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icon.png",
  "/apple-icon.png",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",
  "/brand/logo-kabupaten-wajo.png",
  "/offline.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Navigation: network-first so deployments update promptly,
  // with an offline shell fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/", copy));
          return response;
        })
        .catch(() =>
          caches.match(request)
            .then((cached) => cached || caches.match("/offline.html") || caches.match("/"))
        )
    );
    return;
  }

  // GeoJSON: serve the cached version immediately, then refresh it in the background.
  if (url.pathname.startsWith("/geo-data/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch((error) => {
            if (cached) return cached;
            throw error;
          });

        if (cached) {
          network.catch(() => {});
          return cached;
        }

        return network;
      })
    );
    return;
  }

  // Project-owned branding/PWA assets: cache-first.
  if (
    url.pathname.startsWith("/brand/") ||
    url.pathname.startsWith("/pwa/") ||
    url.pathname === "/icon.png" ||
    url.pathname === "/apple-icon.png"
  ) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
      )
    );
    return;
  }

  // Next JavaScript/CSS must always revalidate on deployment.
  // Browser/CDN cache is still used efficiently through conditional requests,
  // while an older cached copy remains an offline fallback only.
  if (url.pathname.startsWith("/_next/static/")) {
    const isCodeAsset = /\.(?:js|css)$/i.test(url.pathname);

    if (isCodeAsset) {
      event.respondWith(
        fetch(request, { cache: "no-cache" })
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => caches.match(request))
      );
      return;
    }

    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
      )
    );
  }
});
