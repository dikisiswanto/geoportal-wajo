import { getStartupNavigationState } from "./startupNavigation";

export const STARTUP_INTRO_VERSION = "2026.10";
export const STARTUP_INTRO_STORAGE_KEY = "geoportal:intro-version";
export const STARTUP_INTRO_SESSION_KEY = "geoportal:intro-session";

function readStorage(storage, key) {
  try {
    return storage?.getItem(key) || "";
  } catch {
    return "";
  }
}

export function hasSeenStartupIntro() {
  if (typeof window === "undefined") return false;

  const localVersion = readStorage(window.localStorage, STARTUP_INTRO_STORAGE_KEY);
  const sessionVersion = readStorage(window.sessionStorage, STARTUP_INTRO_SESSION_KEY);
  return localVersion === STARTUP_INTRO_VERSION || sessionVersion === STARTUP_INTRO_VERSION;
}

export function markStartupIntroSeen() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STARTUP_INTRO_STORAGE_KEY, STARTUP_INTRO_VERSION);
  } catch {
    // Privacy mode/storage restrictions must never block startup.
  }

  try {
    window.sessionStorage.setItem(STARTUP_INTRO_SESSION_KEY, STARTUP_INTRO_VERSION);
  } catch {
    // Privacy mode/storage restrictions must never block startup.
  }
}

export function getStartupExperienceMode(search = "") {
  const navigation = getStartupNavigationState(search);
  const params = new URLSearchParams(search || "");
  const hasExplicitShareState =
    navigation.hasDirectedNavigation ||
    params.has("layer") ||
    params.has("layers") ||
    params.get("catalog") === "1";

  if (hasExplicitShareState) return "fast";
  if (typeof window !== "undefined") {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reducedMotion) return "fast";
  }
  return hasSeenStartupIntro() ? "fast" : "cinematic";
}
