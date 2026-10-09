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
const sceneRuntimePath = path.join(root, "components", "geoportal", "GeoPortalCinematicScene.js");
const sceneRuntime = fs.readFileSync(sceneRuntimePath, "utf8");
const introFull = `${intro}\n${sceneRuntime}`;
const mapCanvasPath = path.join(root, "components", "geoportal", "MapCanvas.jsx");
const mapCanvas = fs.readFileSync(mapCanvasPath, "utf8");
const geoPortalPath = path.join(root, "components", "GeoPortal.jsx");
const geoPortal = fs.readFileSync(geoPortalPath, "utf8");
const startupDataPath = path.join(root, "lib", "geo", "startupData.js");
const startupData = fs.readFileSync(startupDataPath, "utf8");
const startupNavigationPath = path.join(root, "lib", "geo", "startupNavigation.js");
const startupNavigation = fs.readFileSync(startupNavigationPath, "utf8");
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
  ["Hybrid startup helper is versioned", fs.existsSync(path.join(root, "lib", "geo", "startupExperience.js")) && fs.readFileSync(path.join(root, "lib", "geo", "startupExperience.js"), "utf8").includes("STARTUP_INTRO_VERSION")],
  ["Share/deep-link uses fast startup", fs.readFileSync(path.join(root, "lib", "geo", "startupExperience.js"), "utf8").includes("navigation.hasDirectedNavigation")],
  ["First visit has cinematic mode", fs.readFileSync(path.join(root, "lib", "geo", "startupExperience.js"), "utf8").includes("hasSeenStartupIntro() ? \"fast\" : \"cinematic\"")],
  ["Returning startup skips Three.js load", intro.includes("if (mode === \"fast\")") && !/if \(typeof window !== \"undefined\"\)\s*\{\s*loadThree\(\)/.test(intro)],
  ["Three.js dibundle lewat npm", pkg.dependencies?.three === "0.186.1"],
  ["Lockfile mengunci Three.js 0.186.1", lock.packages?.["node_modules/three"]?.version === "0.186.1"],
  ["Tidak ada Three.js CDN runtime", !/cdnjs\.cloudflare|cdn\.jsdelivr|unpkg\.com|three\.module\.min\.js|three\.min\.js/i.test(intro)],
  ["Import Three.js lokal", intro.includes('import("three")') && intro.includes('import("./geoportal/GeoPortalCinematicScene")') && intro.includes("if (mode === \"fast\")")],
  ["Cinematic scene runtime is dynamically imported only in cinematic path", intro.includes('import("./geoportal/GeoPortalCinematicScene")') && sceneRuntime.includes("export { buildScene }")],
  ["Fast loader component excludes the heavy shader builder", !intro.includes("function buildScene(") && !intro.includes("function createEarthSurfaceMaterial")],
  ["Tidak ada NASA image URL runtime", !/svs\.gsfc\.nasa\.gov|bluemarble-1024/i.test(intro)],
  ["Texture surface lokal", sceneRuntime.includes('withAssetVersion("/intro/earth/earth-surface.jpg")')],
  ["Texture cosmic lokal", intro.includes('withAssetVersion("/intro/earth/cosmic-bg.jpg")') || sceneRuntime.includes('withAssetVersion("/intro/earth/cosmic-bg.jpg")')],
  ["Texture sun glow lokal", intro.includes('withAssetVersion("/intro/earth/sun-glow.png")') || sceneRuntime.includes('withAssetVersion("/intro/earth/sun-glow.png")')],
  ["Kamera dikunci ke Wajo", introFull.includes("wajoQuaternion")],
  ["Jalur orientasi bertahap Indonesia-Sulawesi-Wajo", introFull.includes("indonesiaQuaternion") && introFull.includes("sulawesiQuaternion")],
  ["Animasi memakai quaternion slerp", introFull.includes("slerpQuaternions")],
  ["Animasi memakai delta time", introFull.includes("deltaSeconds")],
  ["Permukaan Earth memiliki day/night shader", introFull.includes("uNightMap") && introFull.includes("smoothstep(-0.24, 0.18, lightDot)")],
  ["Night-side city glow tersedia", introFull.includes("pow(max(nightTexture, 0.0), 1.65)")],
  ["Atmosphere Fresnel tersedia", introFull.includes("fresnel")],
  ["Cloud layer tersedia", introFull.includes("createCloudMaterial")],
  ["Cosmic backdrop is screen-stable", introFull.includes("scene.background = cosmicTexture") && !introFull.includes("cosmicBackdrop")],
  ["Star field uses round shader particles", introFull.includes("gl_PointCoord") && introFull.includes("softEdge") && introFull.includes("aSize")],
  ["Flat-map bridge tersedia", introFull.includes("createFlatBridgeMaterial")],
  ["Critical preload tetap aktif", intro.includes("preloadCriticalGeoData")],
  ["Map warmup terjadwal", intro.includes("onMapWarmup") && intro.includes("5000")],
  ["Three.js handoff throttled", introFull.includes("handoffThrottle") && introFull.includes("48")],
  ["Map vector render dapat ditunda", mapCanvas.includes("deferInitialVectorRender") && mapCanvas.includes("if (!map || !L || deferInitialVectorRender) return")],
  ["Initial layer data load dapat ditunda", mapCanvas.includes("deferInitialLayerDataLoad") && mapCanvas.includes("!deferInitialLayerDataLoad")],
  ["Initial basemap load dapat ditunda", mapCanvas.includes("deferInitialBasemap") && mapCanvas.includes("osm.addTo(map)")],
  ["Initial vector ready callback tersedia", mapCanvas.includes("onInitialVectorReady") && mapCanvas.includes("initialVectorReadyRef")],
  ["Share URL priority helper tersedia", startupNavigation.includes("priority: hasFeature ? \"feature\" : hasRegion ? \"region\" : hasView ? \"view\" : \"default\"")],
  ["Home fit terlindung oleh directed navigation", mapCanvas.includes("navigation.priority === \"default\"")],
  ["Share view hanya dijalankan untuk priority view", geoPortal.includes("navigation.priority !== \"view\"")],
  ["Share region menunggu vector ready", geoPortal.includes("[mapReady, regionFilter, startupVectorReady]")],
  ["Feature deep-link retry setelah vector ready", geoPortal.includes("startupVectorReady,\n    regionFilter")],
  ["Critical preload hanya mengambil response text", startupData.includes("return response.text()")],
  ["Critical JSON parse ditunda sampai data diminta", startupData.includes("JSON.parse(text)")],
  ["Warmup langsung saat reduced motion", intro.includes("requestMapWarmup();\n        await Promise.allSettled")],
  ["Warmup langsung saat skip", intro.includes("const skip = () =>") && intro.includes("requestMapWarmup();")],
  ["Intro menunggu map + vector ready", intro.includes("mapReadyRef.current") && intro.includes("vectorReadyRef.current") && intro.includes("waitForStartupReady")],
  ["Intro tidak menunggu texture optional", intro.includes("void (sceneHandle?.texturePromise ?? Promise.resolve())") && !intro.includes("await Promise.allSettled([criticalReady, textureReady])")],
  ["Intro timeout/fallback aktif", intro.includes("THREE_LOAD_TIMEOUT_MS")],
  ["Exit fade singkat", intro.includes("EXIT_FADE_MS = 180")],
  ["Timeline cinematic diperpanjang", sceneRuntime.includes("INTRO_TIMELINE_MS = 7200")],
  ["Intro assets mendapat cache header", nextConfig.includes('source: "/intro/:path*"')],
  ["Intro textures are cached on demand, not during SW install", !sw.includes('"/intro/earth/cosmic-bg.jpg",') && !sw.includes('"/intro/earth/sun-glow.png",') && sw.includes('url.pathname.startsWith("/intro/earth/")')],
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
