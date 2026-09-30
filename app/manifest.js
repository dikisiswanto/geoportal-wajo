export default function manifest() {
  return {
    name: "Geoportal Kabupaten Wajo",
    short_name: "Geoportal Wajo",
    description: "Portal data geospasial Kabupaten Wajo.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    lang: "id",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }
    ]
  };
}
