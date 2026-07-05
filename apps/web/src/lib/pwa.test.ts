import { describe, expect, it } from "vite-plus/test";

import {
  canRegisterWebAppServiceWorker,
  isIosDevice,
  isStandaloneDisplayMode,
  shouldOfferWebAppInstall,
} from "./pwa";

describe("pwa", () => {
  it("detects standalone display mode from matchMedia", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query === "(display-mode: standalone)",
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    try {
      expect(isStandaloneDisplayMode()).toBe(true);
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it("detects iOS devices from the user agent", () => {
    const originalUserAgent = navigator.userAgent;
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
    });

    try {
      expect(isIosDevice()).toBe(true);
    } finally {
      Object.defineProperty(navigator, "userAgent", {
        configurable: true,
        value: originalUserAgent,
      });
    }
  });

  it("offers install when Android prompt or iOS instructions are available", () => {
    expect(
      shouldOfferWebAppInstall({
        isElectron: false,
        isStandalone: false,
        canInstall: true,
        showIosInstructions: false,
      }),
    ).toBe(true);

    expect(
      shouldOfferWebAppInstall({
        isElectron: false,
        isStandalone: false,
        canInstall: false,
        showIosInstructions: true,
      }),
    ).toBe(true);

    expect(
      shouldOfferWebAppInstall({
        isElectron: true,
        isStandalone: false,
        canInstall: true,
        showIosInstructions: true,
      }),
    ).toBe(false);

    expect(
      shouldOfferWebAppInstall({
        isElectron: false,
        isStandalone: true,
        canInstall: true,
        showIosInstructions: true,
      }),
    ).toBe(false);
  });

  it("only registers the service worker in production", () => {
    expect(canRegisterWebAppServiceWorker(false)).toBe(false);
    expect(canRegisterWebAppServiceWorker(true)).toBe(
      typeof navigator !== "undefined" && "serviceWorker" in navigator,
    );
  });
});
