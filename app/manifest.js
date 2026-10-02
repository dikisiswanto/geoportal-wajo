export default function manifest() {
  return {
    name: "Peta Interaktif Kabupaten Wajo",
    short_name: "Peta Wajo",
    description:
      "Geoportal resmi Kabupaten Wajo untuk menjelajahi peta administrasi, jaringan, fasilitas publik, pendidikan, kesehatan, dan data potensi wilayah.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "id",
    categories: ["government", "utilities", "navigation"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/pwa/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
