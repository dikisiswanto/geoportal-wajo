"use client";

import { useEffect } from "react";
import { withAssetVersion } from "../lib/assetVersion";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return undefined;
    }

    const register = () => {
      navigator.serviceWorker.register(withAssetVersion("/sw.js"), {
        scope: "/"
      }).catch(() => {
        // PWA is progressive enhancement; the portal remains fully usable
        // when service worker registration is unavailable.
      });
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
