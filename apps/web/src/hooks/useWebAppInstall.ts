import { useCallback, useEffect, useState } from "react";

import { isElectron } from "../env";
import {
  type BeforeInstallPromptEvent,
  isIosDevice,
  isStandaloneDisplayMode,
  shouldOfferWebAppInstall,
} from "../lib/pwa";

export function useWebAppInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(() => isStandaloneDisplayMode());
  const isIos = isIosDevice();
  const canInstall = deferredPrompt !== null;
  const showIosInstructions = isIos && !canInstall;
  const isAvailable = shouldOfferWebAppInstall({
    isElectron,
    isStandalone,
    canInstall,
    showIosInstructions,
  });

  useEffect(() => {
    const syncStandalone = () => {
      setIsStandalone(isStandaloneDisplayMode());
    };

    syncStandalone();
    window.matchMedia("(display-mode: standalone)").addEventListener("change", syncStandalone);
    window.addEventListener("appinstalled", syncStandalone);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.matchMedia("(display-mode: standalone)").removeEventListener("change", syncStandalone);
      window.removeEventListener("appinstalled", syncStandalone);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) {
      return false;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsStandalone(isStandaloneDisplayMode());
    return choice.outcome === "accepted";
  }, [deferredPrompt]);

  return {
    isAvailable,
    canInstall,
    showIosInstructions,
    install,
  };
}
