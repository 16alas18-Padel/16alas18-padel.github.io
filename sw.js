/* 16 a las 18 · service worker
   Primero va a internet (así siempre se ve la última versión) y guarda una copia
   para poder abrir la app aunque no haya señal. Los datos de la planilla
   (script.google.com) no pasan por acá: siempre van directo. */
const CACHE = "p1618-v1";

self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if(res.ok){ const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./")))
  );
});
