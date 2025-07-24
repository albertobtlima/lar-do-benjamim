self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("lar-benjamim-cache-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/style.css",
        "/script.js",

        "/assets/icons/icon-192.png",
        "/assets/icons/icon-512.png",
      ]);
    })
  );
});

// "/assets/imagens/img-lar-benjamim.png",
// "/assets/imagens/logo-uni.png",
