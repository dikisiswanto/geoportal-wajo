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
  ["Intro mode starts in hydration-safe checking state", intro.includes('useState("checking")')],
  ["Startup mode resolved after mount", intro.includes("setExperienceMode(getStartupExperienceMode(window.location.search));")],
  ["Fast mode avoids Three.js load", intro.includes('if (mode === "fast")') && intro.includes("requestMapWarmup();")],
  ["Three.js only loads for cinematic mode", intro.includes('THREE = await Promise.race')],
  ["Intro preference persisted after cinematic completion", intro.includes("markStartupIntroSeen()")],
  ["Skip persists completed cinematic", intro.includes('if (experienceMode === "cinematic") {\n      markStartupIntroSeen();')],
  ["Fast loader has short minimum", intro.includes("FAST_LOADER_MIN_MS = 320")],
  ["Fast loader can wait for map/vector readiness", intro.includes("FAST_LOADER_TIMEOUT_MS = 12000") && intro.includes("waitForStartupReady")],
  ["Vector readiness passed into intro", geoPortal.includes("vectorReady={startupVectorReady}")],
  ["No direct localStorage access during initial render", !/getStartupExperienceMode\([^\n]*window\.location\.search/.test(intro.split("export default function")[0])],
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
