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
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Erro ao carregar ${file}`);
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

    // Reiniciar vídeos em todos os modais de vídeo
    const modaisVideo = el.querySelectorAll(".modal[id^='modal-video-']");
    modaisVideo.forEach((modal) => {
      const iframe = modal.querySelector("iframe");
      const dataSrc = iframe?.getAttribute("data-src");

      modal.addEventListener("show.bs.modal", () => {
        if (iframe && dataSrc) {
          iframe.setAttribute("src", dataSrc);
        }
      });

      modal.addEventListener("hidden.bs.modal", () => {
        if (iframe) {
          iframe.setAttribute("src", "");
        }
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
  } catch (err) {
    console.error(err);
    el.innerHTML = `<p class="text-danger">Erro ao carregar "${file}"</p>`;
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

// Cookies
function aceitarCookies() {
  localStorage.setItem("cookies-aceitos", "true");
  const consent = document.getElementById("cookieConsent");
  if (consent) consent.style.display = "none";
}

window.addEventListener("load", () => {
  if (!localStorage.getItem("cookies-aceitos")) {
    const consent = document.getElementById("cookieConsent");
    if (consent) consent.style.display = "block";
  }
});

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then((reg) => console.log("Service Worker registrado!", reg))
    .catch((err) => console.error("Erro ao registrar SW:", err));
}

// Chave pix
function copiarPix() {
  const chavePix = "55.943.412/0001-57"; // sua chave fixa

  navigator.clipboard
    .writeText(chavePix)
    .then(() => {
      alert("Chave PIX copiada para a área de transferência!");
    })
    .catch((err) => {
      console.error("Erro ao copiar PIX: ", err);
    });
}
