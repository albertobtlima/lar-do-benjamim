const CACHE_NAME = "lar-benjamim-v4";

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
  "/partials/voluntario.html",
];

// INSTALAÇÃO
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("Erro ao adicionar arquivos ao cache:", error);
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
  return self.clients.claim();
});

// FETCH COM CACHE FIRST + ATUALIZAÇÃO EM BACKGROUND
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.type === "opaque") {
              return networkResponse;
            }

            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => response);

        return response || fetchPromise;
      })
    );
  }
});

// ESCUTA MENSAGEM DO CLIENTE (para skipWaiting)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
