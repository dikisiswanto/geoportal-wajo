const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const introPath = path.join(root, "components", "GeoPortalIntro.jsx");
const configPath = path.join(root, "next.config.js");
const swPath = path.join(root, "public", "sw.js");
const packagePath = path.join(root, "package.json");
const lockPath = path.join(root, "package-lock.json");
const assetDir = path.join(root, "public", "intro", "earth");
const intro = fs.readFileSync(introPath, "utf8");
const mapCanvasPath = path.join(root, "components", "geoportal", "MapCanvas.jsx");
const mapCanvas = fs.readFileSync(mapCanvasPath, "utf8");
const nextConfig = fs.readFileSync(configPath, "utf8");
const sw = fs.readFileSync(swPath, "utf8");
const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));

const requiredAssets = [
  "earth-surface.jpg",
  "earth-height.jpg",
  "earth-clouds.png",
  "earth-night.jpg",
  "cosmic-bg.jpg",
  "sun-glow.png"
];

const checks = [
  ["Three.js dibundle lewat npm", pkg.dependencies?.three === "0.186.1"],
  ["Lockfile mengunci Three.js 0.186.1", lock.packages?.["node_modules/three"]?.version === "0.186.1"],
  ["Tidak ada Three.js CDN runtime", !/cdnjs\.cloudflare|cdn\.jsdelivr|unpkg\.com|three\.module\.min\.js|three\.min\.js/i.test(intro)],
  ["Import Three.js lokal", intro.includes('import("three")')],
  ["Tidak ada NASA image URL runtime", !/svs\.gsfc\.nasa\.gov|bluemarble-1024/i.test(intro)],
  ["Texture surface lokal", intro.includes('withAssetVersion("/intro/earth/earth-surface.jpg")')],
  ["Texture cosmic lokal", intro.includes('withAssetVersion("/intro/earth/cosmic-bg.jpg")')],
  ["Texture sun glow lokal", intro.includes('withAssetVersion("/intro/earth/sun-glow.png")')],
  ["Kamera dikunci ke Wajo", intro.includes("wajoQuaternion")],
  ["Jalur orientasi bertahap Indonesia-Sulawesi-Wajo", intro.includes("indonesiaQuaternion") && intro.includes("sulawesiQuaternion")],
  ["Animasi memakai quaternion slerp", intro.includes("slerpQuaternions")],
  ["Animasi memakai delta time", intro.includes("deltaSeconds")],
  ["Permukaan Earth memiliki day/night shader", intro.includes("uNightMap") && intro.includes("smoothstep(-0.24, 0.18, lightDot)")],
  ["Night-side city glow tersedia", intro.includes("pow(max(nightTexture, 0.0), 1.65)")],
  ["Atmosphere Fresnel tersedia", intro.includes("fresnel")],
  ["Cloud layer tersedia", intro.includes("createCloudMaterial")],
  ["Cosmic backdrop tersedia", intro.includes("cosmicBackdrop")],
  ["Star field tersedia", intro.includes("createStarField")],
  ["Flat-map bridge tersedia", intro.includes("createFlatBridgeMaterial")],
  ["Critical preload tetap aktif", intro.includes("preloadCriticalGeoData")],
  ["Map warmup terjadwal", intro.includes("onMapWarmup") && intro.includes("5650")],
  ["Three.js handoff throttled", intro.includes("handoffThrottle") && intro.includes("48")],
  ["Map vector render dapat ditunda", mapCanvas.includes("deferInitialVectorRender") && mapCanvas.includes("if (!map || !L || deferInitialVectorRender) return")],
  ["Intro menunggu map ready", intro.includes("mapReadyRef.current") && intro.includes("waitForMapReady")],
  ["Intro timeout/fallback aktif", intro.includes("THREE_LOAD_TIMEOUT_MS")],
  ["Exit fade singkat", intro.includes("EXIT_FADE_MS = 180")],
  ["Timeline cinematic diperpanjang", intro.includes("INTRO_TIMELINE_MS = 7200")],
  ["Intro assets mendapat cache header", nextConfig.includes('source: "/intro/:path*"')],
  ["Intro assets masuk PWA shell", sw.includes("/intro/earth/cosmic-bg.jpg") && sw.includes("/intro/earth/sun-glow.png")],
  ["Loader CDN lama sudah dihapus", !fs.existsSync(path.join(root, "public", "vendor", "geoportal-three-loader.js"))]
];

for (const asset of requiredAssets) {
  checks.push([`Asset ada: ${asset}`, fs.existsSync(path.join(assetDir, asset))]);
}

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} · ${label}`);
  if (!ok) failed += 1;
}

if (failed) {
  console.error(`\nIntro validation failed: ${failed} check(s).`);
  process.exit(1);
}

console.log(`\nIntro validation passed: ${checks.length} checks.`);
