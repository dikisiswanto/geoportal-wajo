"use client";

import { useEffect, useState } from "react";
import { IconDownload } from "@tabler/icons-react";
import IconButton from "./IconButton";

export default function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const standalone = mediaQuery.matches || window.navigator.standalone === true;
    setInstalled(standalone);

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setBusy(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (installed || !installPrompt) return null;

  const install = async () => {
    if (!installPrompt || busy) return;

    setBusy(true);
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
    } catch {
      // Prompt dibatalkan atau tidak tersedia; portal tetap dapat digunakan.
    } finally {
      setInstallPrompt(null);
      setBusy(false);
    }
  };

  return (
    <IconButton
      label="Instal aplikasi"
      placement="bottom"
      tone="emerald"
      onClick={install}
      disabled={busy}
      className="size-9"
    >
      <IconDownload size={18} stroke={1.8} />
    </IconButton>
  );
}
