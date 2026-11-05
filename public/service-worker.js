const CACHE_NAME = 'glow-glamour-v1';
const urlsToCache = [
  './',
  './index.html',
  './cart.html',
  './checkout.html',
  './orders.html',
  './invoice.html',
  './css/style.css',
  './css/cart.css',
  './css/checkout.css',
  './js/products.js',
  './js/cart.js',
  './js/shop.js',
  './js/cart-page.js',
  './js/checkout.js',
  './js/menu.js'
];

// Install event: Cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event: Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Activate event: Clean up old caches
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