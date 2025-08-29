const CACHE_NAME = 'pdc-pompier-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
];

// Installe le service worker et met en cache les fichiers de l'application
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Intercepte les requêtes réseau et sert les fichiers depuis le cache si disponible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Le cache a une correspondance, retourne la réponse depuis le cache
        if (response) {
          return response;
        }
        // Sinon, effectue la requête réseau
        return fetch(event.request);
      }
    )
  );
});

// Supprime les anciens caches lors de l'activation d'un nouveau service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
