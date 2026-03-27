function setupYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function setupProjectLightbox() {
  const items = Array.from(document.querySelectorAll(".project-gallery__item"));
  const lightbox = document.getElementById("lightbox");
  const backdrop = document.getElementById("lightboxBackdrop");
  const closeBtn = document.getElementById("lightboxClose");
  const imageEl = document.getElementById("lightboxImage");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  const counterEl = document.getElementById("lightboxCounter");

  if (!items.length || !lightbox || !backdrop || !closeBtn || !imageEl || !prevBtn || !nextBtn || !counterEl) return;

  const sources = items.map((item) => {
    const img = item.querySelector("img");
    return {
      src: item.getAttribute("href") || "",
      alt: img?.getAttribute("alt") || "Proje görseli",
    };
  });

  let current = 0;
  let lastFocused = null;

  function renderCurrent() {
    const total = sources.length;
    const slide = sources[current];
    imageEl.src = slide.src;
    imageEl.alt = slide.alt;
    counterEl.textContent = `${current + 1} / ${total}`;
  }

  function openAt(index) {
    current = index;
    lastFocused = document.activeElement;
    renderCurrent();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function next() {
    current = (current + 1) % sources.length;
    renderCurrent();
  }

  function prev() {
    current = (current - 1 + sources.length) % sources.length;
    renderCurrent();
  }

  items.forEach((item, index) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      openAt(index);
    });
  });

  backdrop.addEventListener("click", close);
  closeBtn.addEventListener("click", close);
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") prev();
  });
}

setupYear();
setupProjectLightbox();