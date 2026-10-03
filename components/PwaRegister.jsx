"use client";

import { useEffect } from "react";
import { withAssetVersion } from "../lib/assetVersion";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return undefined;
    }

    const register = async () => {
      try {
        const scriptUrl = withAssetVersion("/sw.js");
        const registration = await navigator.serviceWorker.register(scriptUrl, {
          scope: "/"
        });

        // Check the versioned worker on each load so a deployment is picked up
        // immediately instead of waiting for the browser's periodic SW check.
        await registration.update();
      } catch {
        // PWA is progressive enhancement; the portal remains fully usable
        // when service worker registration is unavailable.
      }
    };

    if (document.readyState === "complete") {
      register();
      return undefined;
    }

    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
