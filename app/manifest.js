export default function manifest() {
  return {
    name: "Peta Interaktif Kabupaten Wajo",
    short_name: "Peta Wajo",
    description: "Peta interaktif dan data geospasial Kabupaten Wajo.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f172a",
    lang: "id",
    icons: [
      { src: "/brand/logo-kabupaten-wajo.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
    ]
  };
}
