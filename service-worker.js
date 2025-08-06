const CACHE_NAME = "lar-benjamim-v2";

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

  // Partials HTML
  "/partials/cards-contatos.html",
  "/partials/cards-depoimentos.html",
  "/partials/cards-doador.html",
  "/partials/cards-equipe.html",
  "/partials/cards-redes.html",
  "/partials/cards-servicos.html",
  "/partials/carrossel.html",
  "/partials/doacao.html",
  "/partials/footer.html",
  "/partials/header.html",
  "/partials/modal-doador.html",
  "/partials/modal-servicos.html",
  "/partials/modal-videos.html",
  "/partials/voluntario.html",

  // Externos
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.12.1/font/bootstrap-icons.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js",
  "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap",
];

// INSTALAÇÃO
self.addEventListener("install", (event) => {
  self.skipWaiting(); // força o SW a ativar imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ATIVAÇÃO
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
  return self.clients.claim(); // Assume controle das abas abertas
});

// FETCH COM CACHE FIRST + ATUALIZAÇÃO EM BACKGROUND
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => response); // fallback se offline

      return response || fetchPromise;
    })
  );
});

// ESCUTA MENSAGEM DO CLIENTE (para skipWaiting)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
