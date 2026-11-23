// Service Worker Teleprompter RM: dziala offline, najpierw siec (nowa wersja wchodzi od razu)
const CACHE = 'teleprompter-rm-v3';
const FILES = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES).catch(() => {}))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith('teleprompter-rm-') && x !== CACHE).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const c = r.clone(); caches.open(CACHE).then(x => { try { x.put(e.request, c); } catch (_) {} }); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(c => c || caches.match('./index.html'))));
});
