const CACHE_NAME = 'for-my-love-v2';
const ASSETS = ['./', './index.html', './styles.css', './script.js', './manifest.webmanifest', './assets/heart.svg', './assets/apple-touch-icon.svg', './assets/memory-couple.svg', './assets/memory-cafe.svg', './assets/memory-first-date.svg', './assets/cat-salute.svg', './assets/cat-sunglasses.svg', './assets/cat-heart.svg', './assets/cat-pinkhat.svg', './assets/cat-love.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); return response;
  }).catch(() => caches.match('./index.html'))));
});
