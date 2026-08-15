// Stock Analyzer Pro — Service Worker
// Purpose: PWA installability (required by GitHub Pages + TWA/Play Store) and
// fast repeat loads of the app shell. Deliberately does NOT cache API calls —
// financial data must always come from the network, never from a stale cache.
//
// IMPORTANT: bump CACHE_NAME on every deploy (e.g. v39 -> v40) or returning
// users will keep loading the old cached index.html indefinitely.

const CACHE_NAME = 'stock-analyzer-pro-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin GET requests for the app shell itself.
  // Everything else (all API calls: FMP, Finnhub, Yahoo, Stooq, AlphaVantage,
  // TwelveData, Polygon, premium sources, etc.) passes straight to the
  // network untouched — the app's own in-memory RESPONSE_CACHE already
  // handles short-TTL caching for those with correct freshness rules.
  const isAppShell = url.origin === self.location.origin &&
    APP_SHELL.some((path) => url.pathname.endsWith(path.replace('./', '/')) || url.pathname === '/' || path === './');

  if (event.request.method !== 'GET' || !isAppShell) {
    return; // let the browser handle it normally (network)
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached); // offline fallback to cache
      return cached || networkFetch;
    })
  );
});

