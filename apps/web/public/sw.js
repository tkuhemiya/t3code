// Minimal install-only service worker. We intentionally avoid caching the app
// shell so tailnet and self-hosted deployments always pick up fresh builds.
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
