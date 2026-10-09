const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const intro = fs.readFileSync(path.join(root, "components", "GeoPortalIntro.jsx"), "utf8");
const geoPortal = fs.readFileSync(path.join(root, "components", "GeoPortal.jsx"), "utf8");
const experience = fs.readFileSync(path.join(root, "lib", "geo", "startupExperience.js"), "utf8");

const checks = [
  ["Startup experience helper exists", fs.existsSync(path.join(root, "lib", "geo", "startupExperience.js"))],
  ["Intro preference is versioned", experience.includes("STARTUP_INTRO_VERSION") && experience.includes("2026.10")],
  ["First visit resolves to cinematic", experience.includes('return hasSeenStartupIntro() ? "fast" : "cinematic"')],
  ["Directed/share URL uses fast mode", experience.includes("hasExplicitShareState") && experience.includes('if (hasExplicitShareState) return "fast"')],
  ["Reduced motion uses fast mode", experience.includes('if (reducedMotion) return "fast"')],
  ["Intro mode uses hydration-safe external-store snapshot", intro.includes("useSyncExternalStore(") && intro.includes("getStartupExperienceSnapshot") && intro.includes("getStartupExperienceServerSnapshot")],
  ["Server and hydration snapshot stay in checking mode", intro.includes('function getStartupExperienceServerSnapshot() {\n  return "checking";')],
  ["Startup mode is resolved without setState in an effect", !intro.includes("setExperienceMode(") && intro.includes("startupExperienceSnapshot = getStartupExperienceMode(window.location.search);")],
  ["Startup experience snapshot is cached for component lifetime", intro.includes("let startupExperienceSnapshot;") && intro.includes("if (startupExperienceSnapshot === undefined)")],
  ["Checking mode exits before any startup work begins", intro.includes('if (experienceMode === "checking") return undefined;')],
  ["Map warmup callback has stable identity", intro.includes("const requestMapWarmup = useCallback(") && intro.includes("}, [onMapWarmup]);")],
  ["Startup effect tracks the map warmup callback", intro.includes("[experienceMode, onComplete, requestMapWarmup]")],
  ["Fast mode avoids Three.js load", intro.includes('if (mode === "fast")') && intro.includes("requestMapWarmup();")],
  ["Three.js only loads for cinematic mode", intro.includes("cinematicResources = await Promise.race") && intro.includes('import("./geoportal/GeoPortalCinematicScene")') && intro.includes('import("three")')],
  ["Intro preference persisted after cinematic completion", intro.includes("markStartupIntroSeen()")],
  ["Skip persists completed cinematic", intro.includes('if (experienceMode === "cinematic") {\n      markStartupIntroSeen();')],
  ["Fast loader has short minimum", intro.includes("FAST_LOADER_MIN_MS = 320")],
  ["Fast loader can wait for map/vector readiness", intro.includes("FAST_LOADER_TIMEOUT_MS = 12000") && intro.includes("waitForStartupReady")],
  ["Vector readiness passed into intro", geoPortal.includes("vectorReady={startupVectorReady}")],
  ["External-store snapshot is the only startup mode reader", intro.includes("function getStartupExperienceSnapshot()") && !intro.includes("setExperienceMode(getStartupExperienceMode")],
  ["Checking/fast visual state has CSS support", fs.readFileSync(path.join(root, "app", "globals.css"), "utf8").includes("geoportal-intro--fast") && fs.readFileSync(path.join(root, "app", "globals.css"), "utf8").includes("geoportal-intro--checking")]
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} · ${label}`);
  if (!ok) failed += 1;
}

if (failed) {
  console.error(`\nStartup experience validation failed: ${failed} check(s).`);
  process.exit(1);
}

console.log(`\nStartup experience validation passed: ${checks.length} checks.`);
