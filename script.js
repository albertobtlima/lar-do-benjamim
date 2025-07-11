function isHomePage() {
  const pathname = window.location.pathname.toLowerCase();
  return (
    pathname === "/" ||
    pathname.endsWith("index.html") ||
    pathname.includes("/home") ||
    pathname.includes("/inicio")
  );
}

document.querySelectorAll("[data-include]").forEach(async (el) => {
  const file = el.getAttribute("data-include");
  const res = await fetch(file);
  const html = await res.text();
  el.innerHTML = html;

  // Carrossel
  const carousels = el.querySelectorAll(".carousel");
  carousels.forEach((carouselEl) => {
    new bootstrap.Carousel(carouselEl, {
      interval: 3000,
      ride: "carousel",
    });
  });

  // <h1> Na home
  if (isHomePage()) {
    const logo = el.querySelector("#site-logo");
    if (logo && !logo.closest("h1")) {
      const h1 = document.createElement("h1");
      h1.className = "mb-0";
      logo.parentNode.insertBefore(h1, logo);
      h1.appendChild(logo);
    }
  }
});

window.addEventListener("load", () => {
  const hash = window.location.hash;

  if (hash) {
    // Espera o carregamento dos includes
    const scrollToHash = () => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Tenta de novo em 100ms se ainda não existir
        setTimeout(scrollToHash, 100);
      }
    };

    scrollToHash();
  }
});
