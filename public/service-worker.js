const CACHE_NAME = 'glow-glamour-v3'; // Bumped to v3 to force a fresh cache

const urlsToCache = [
  '/',
  '/index.html',
  '/cart.html',
  '/checkout.html',
  '/orders.html',
  '/invoice.html',
  '/css/style.css',
  '/css/cart.css',
  '/css/checkout.css',
  '/js/products.js',
  '/js/cart.js',
  '/js/shop.js',
  '/js/cart-page.js',
  '/js/checkout.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});