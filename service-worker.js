const CACHE_NAME = "lar-benjamim-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",

  // Ícones PWA e imagens
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
  "/assets/imagens/img-lar-benjamim.png",
  "/assets/imagens/logo-uni.png",
  "/assets/imagens/favicon.png",

  // Partials HTML
  "/partials/header.html",
  "/partials/banners.html",
  "/partials/doacao.html",
  "/partials/cards-servicos.html",
  "/partials/cards-depoimentos.html",
  "/partials/voluntario.html",
  "/partials/footer.html",
  "/partials/modal-servicos.html",
  "/partials/modal-videos.html",

  // Externos
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.12.1/font/bootstrap-icons.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js",
  "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheAllowlist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheAllowlist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
