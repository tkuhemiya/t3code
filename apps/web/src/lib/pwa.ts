export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function isStandaloneDisplayMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  return (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
}

export function shouldOfferWebAppInstall(input: {
  readonly isElectron: boolean;
  readonly isStandalone: boolean;
  readonly canInstall: boolean;
  readonly showIosInstructions: boolean;
}): boolean {
  return (
    !input.isElectron &&
    !input.isStandalone &&
    (input.canInstall || input.showIosInstructions)
  );
}

export function canRegisterWebAppServiceWorker(isProduction: boolean): boolean {
  return typeof navigator !== "undefined" && "serviceWorker" in navigator && isProduction;
}

export function registerWebAppServiceWorker(): void {
  if (!canRegisterWebAppServiceWorker(import.meta.env.PROD)) {
    return;
  }

  void navigator.serviceWorker.register("/sw.js", { scope: "/" });
}
