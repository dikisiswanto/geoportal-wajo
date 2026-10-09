"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { withAssetVersion } from "../lib/assetVersion";
import { preloadCriticalGeoData } from "../lib/geo/startupData";
import { getStartupExperienceMode, markStartupIntroSeen } from "../lib/geo/startupExperience";

const FAST_EARTH_URL = withAssetVersion("/intro/earth/earth-fast-wajo.png");
const COSMIC_TEXTURE_URL = withAssetVersion("/intro/earth/cosmic-bg.jpg");
const SUN_GLOW_URL = withAssetVersion("/intro/earth/sun-glow.png");
const LOGO_SRC = withAssetVersion("/brand/logo-kabupaten-wajo.png");

function subscribeToStartupExperience() {
  // Startup mode is intentionally a one-time snapshot. URL changes later in the
  // session must not restart or switch the intro experience.
  return () => {};
}

let startupExperienceSnapshot;

function getStartupExperienceSnapshot() {
  if (typeof window === "undefined") return "checking";
  if (startupExperienceSnapshot === undefined) {
    startupExperienceSnapshot = getStartupExperienceMode(window.location.search);
  }
  return startupExperienceSnapshot;
}

function getStartupExperienceServerSnapshot() {
  return "checking";
}

const MIN_INTRO_MS = 6500;
const MAX_INTRO_MS = 7800;
const EXIT_FADE_MS = 180;
const THREE_LOAD_TIMEOUT_MS = 5000;
const FAST_LOADER_MIN_MS = 320;
const FAST_LOADER_TIMEOUT_MS = 12000;

export default function GeoPortalIntro({ onComplete, onMapWarmup, mapReady = false, vectorReady = false }) {
  const hostRef = useRef(null);
  const mapReadyRef = useRef(mapReady);
  const vectorReadyRef = useRef(vectorReady);
  const mapWarmupRequestedRef = useRef(false);
  const completedRef = useRef(false);
  const exitTimerRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const [status, setStatus] = useState("Menyiapkan peta Wajo…");
  const experienceMode = useSyncExternalStore(
    subscribeToStartupExperience,
    getStartupExperienceSnapshot,
    getStartupExperienceServerSnapshot
  );

  useEffect(() => {
    mapReadyRef.current = mapReady;
  }, [mapReady]);

  useEffect(() => {
    vectorReadyRef.current = vectorReady;
  }, [vectorReady]);

  const requestMapWarmup = useCallback(() => {
    if (mapWarmupRequestedRef.current) return;
    mapWarmupRequestedRef.current = true;
    onMapWarmup?.();
  }, [onMapWarmup]);

  useEffect(() => {
    if (experienceMode === "checking") return undefined;

    let cancelled = false;
    let sceneHandle = null;
    let finishTimer = null;
    let maxTimer = null;
    let statusTimers = [];

    const clearTimers = () => {
      statusTimers.forEach((timer) => window.clearTimeout(timer));
      statusTimers = [];
      window.clearTimeout(finishTimer);
      window.clearTimeout(maxTimer);
    };

    const waitForStartupReady = (timeoutMs) => new Promise((resolve) => {
      if (mapReadyRef.current && vectorReadyRef.current) {
        resolve(true);
        return;
      }

      const startedAt = performance.now();
      const check = () => {
        const ready = mapReadyRef.current && vectorReadyRef.current;
        if (cancelled || ready || performance.now() - startedAt >= timeoutMs) {
          resolve(ready);
          return;
        }
        window.requestAnimationFrame(check);
      };
      window.requestAnimationFrame(check);
    });

    const finish = () => {
      if (cancelled || completedRef.current) return;
      completedRef.current = true;
      if (experienceMode === "cinematic") {
        markStartupIntroSeen();
      }
      clearTimers();
      setClosing(true);
      exitTimerRef.current = window.setTimeout(() => {
        onComplete?.();
      }, EXIT_FADE_MS);
    };

    const run = async () => {
      const mode = experienceMode;
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      const startedAt = performance.now();
      const criticalReady = preloadCriticalGeoData().catch(() => null);

      if (mode === "fast") {
        setStatus("Menyiapkan peta interaktif…");
        requestMapWarmup();
        await Promise.allSettled([
          criticalReady,
          waitForStartupReady(FAST_LOADER_TIMEOUT_MS)
        ]);
        if (cancelled) return;

        const remaining = Math.max(0, FAST_LOADER_MIN_MS - (performance.now() - startedAt));
        finishTimer = window.setTimeout(() => finish(), remaining);
        return;
      }

      let THREE = null;
      try {
        const cinematicResources = await Promise.race([
          Promise.all([
            import("./geoportal/GeoPortalCinematicScene"),
            import("three")
          ]),
          new Promise((resolve) => window.setTimeout(() => resolve(null), THREE_LOAD_TIMEOUT_MS))
        ]);
        if (cinematicResources && hostRef.current && !cancelled) {
          const [sceneModule, threeModule] = cinematicResources;
          THREE = threeModule?.default ?? threeModule;
          sceneHandle = sceneModule.buildScene(THREE, hostRef.current);
        }
      } catch {
        THREE = null;
      }

      if (cancelled) return;

      statusTimers = [
        window.setTimeout(() => setStatus("Menyusuri Asia Tenggara…"), 950),
        window.setTimeout(() => setStatus("Mendekati Indonesia…"), 2200),
        window.setTimeout(() => setStatus("Sulawesi Selatan"), 3600),
        window.setTimeout(() => setStatus("Kabupaten Wajo"), 5000),
        window.setTimeout(() => {
          setStatus("Menyiapkan tampilan peta…");
          requestMapWarmup();
        }, 5000),
        window.setTimeout(() => setStatus("Membuka peta interaktif…"), 6450)
      ];

      void criticalReady;
      void (sceneHandle?.texturePromise ?? Promise.resolve());

      const cinematicTimeout = reducedMotion ? 4500 : Math.max(0, MAX_INTRO_MS - (performance.now() - startedAt));
      await waitForStartupReady(cinematicTimeout);
      requestMapWarmup();

      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, MIN_INTRO_MS - elapsed);
      finishTimer = window.setTimeout(finish, remaining);
      maxTimer = window.setTimeout(finish, Math.max(0, MAX_INTRO_MS - elapsed));
    };
    run();

    return () => {
      cancelled = true;
      clearTimers();
      window.clearTimeout(exitTimerRef.current);
      sceneHandle?.stop?.();
    };
  }, [experienceMode, onComplete, requestMapWarmup]);

  const skip = () => {
    if (completedRef.current || experienceMode === "checking") return;
    requestMapWarmup();
    if (experienceMode === "cinematic") {
      markStartupIntroSeen();
    }
    completedRef.current = true;
    setClosing(true);
    window.clearTimeout(exitTimerRef.current);
    exitTimerRef.current = window.setTimeout(() => onComplete?.(), EXIT_FADE_MS);
  };

  return (
    <div
      className={`geoportal-intro geoportal-intro--${experienceMode} ${closing ? "geoportal-intro--closing" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div ref={hostRef} className="geoportal-intro__scene" aria-hidden="true" />
      <div
        className="geoportal-intro__fast-cosmos"
        style={{ backgroundImage: `url(${COSMIC_TEXTURE_URL})` }}
        aria-hidden="true"
      >
        <div className="geoportal-intro__fast-nebula" />
        <div className="geoportal-intro__fast-stars" />
        <div
          className="geoportal-intro__fast-earth"
          style={{ backgroundImage: `url(${FAST_EARTH_URL})` }}
        >
          <span className="geoportal-intro__fast-earth-atmosphere" />
          <span className="geoportal-intro__fast-earth-target" aria-hidden="true" />
        </div>
        <span
          className="geoportal-intro__fast-sun"
          style={{ backgroundImage: `url(${SUN_GLOW_URL})` }}
        />
      </div>
      <div className="geoportal-intro__fast-orbit" aria-hidden="true"><span /></div>
      <div className="geoportal-intro__space-glow" aria-hidden="true" />
      <div className="geoportal-intro__vignette" aria-hidden="true" />

      <div className="geoportal-intro__content">
        <div className="geoportal-intro__identity">
          <Image
            src={LOGO_SRC}
            alt="Lambang Kabupaten Wajo"
            width={76}
            height={76}
            priority
            className="geoportal-intro__logo"
          />
          <div>
            <div className="geoportal-intro__eyebrow">Pemerintah Kabupaten Wajo</div>
            <div className="geoportal-intro__title">Peta Interaktif Kabupaten Wajo</div>
          </div>
        </div>

        <div className="geoportal-intro__destination" aria-hidden="true">
          <span className="geoportal-intro__destination-line" />
          <span>Sulawesi Selatan · Indonesia</span>
        </div>

        <div className="geoportal-intro__status">
          <span className="geoportal-intro__status-dot" aria-hidden="true" />
          <span>{status}</span>
        </div>

      </div>

      {experienceMode === "cinematic" && (
        <button type="button" className="geoportal-intro__skip" onClick={skip}>
          Lewati intro
        </button>
      )}

      <div className="geoportal-intro__credit">Globe visualization · GeoPortal Kabupaten Wajo</div>
    </div>
  );
}
