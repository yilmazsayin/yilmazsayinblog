const POSTS = [
  {
    id: "docker-local-dev",
    title: "Docker ile yerel geliştirme ortamını standardize etmek",
    excerpt:
      "Tek komutla ayağa kalkan servisler, healthcheck’ler ve tekrar edilebilir kurulum: “bende çalışıyor” problemini bitirelim.",
    tag: "devops",
    tagLabel: "DevOps",
    date: "27 Mar 2026",
    readingTime: "8 dk",
    featured: true,
    href: "./post.html",
  },
  {
    id: "sql-reporting-basics",
    title: "SQL raporlama: 7 pratik pattern (join, group, window)",
    excerpt:
      "Rapor ihtiyacı arttıkça aynı hatalar tekrar eder. Bu yazı, en çok iş gören 7 deseni derliyor.",
    tag: "sql",
    tagLabel: "SQL",
    date: "15 Mar 2026",
    readingTime: "6 dk",
    featured: false,
    href: "./post.html",
  },
  {
    id: "python-data-pipeline",
    title: "Python ile küçük bir veri hattı: temizle → doğrula → raporla",
    excerpt:
      "Pandas ile gerçek hayattaki kirli veriyi yönetmek: tip dönüşümü, eksik veri, basit validasyon ve çıktı.",
    tag: "python",
    tagLabel: "Python",
    date: "02 Mar 2026",
    readingTime: "7 dk",
    featured: false,
    href: "./post.html",
  },
  {
    id: "web-perf-checklist",
    title: "Web performansı için kısa checklist (LCP/CLS odaklı)",
    excerpt:
      "Küçük dokunuşlarla büyük etki: font, image, critical CSS ve ölçüm akışı.",
    tag: "web",
    tagLabel: "Web",
    date: "20 Feb 2026",
    readingTime: "5 dk",
    featured: false,
    href: "./post.html",
  },
  {
    id: "career-notes",
    title: "Bir mühendis olarak portföyü “çıktı odaklı” anlatmak",
    excerpt:
      "Projeleri sadece teknoloji listesiyle değil; problem, karar ve sonuç metrikleriyle anlatmanın çerçevesi.",
    tag: "career",
    tagLabel: "Kariyer",
    date: "01 Feb 2026",
    readingTime: "4 dk",
    featured: false,
    href: "./post.html",
  },
];

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderPosts({ q = "", tag = "all" } = {}) {
  const grid = document.getElementById("postGrid");
  if (!grid) return;

  const query = q.trim().toLowerCase();
  const filtered = POSTS.filter((p) => {
    const matchesTag = tag === "all" ? true : p.tag === tag;
    const matchesQuery = query
      ? (p.title + " " + p.excerpt + " " + p.tagLabel).toLowerCase().includes(query)
      : true;
    return matchesTag && matchesQuery;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="card" style="grid-column: span 12;">
        <h3 style="margin:0 0 6px 0;">Sonuç bulunamadı</h3>
        <div class="muted">Farklı bir arama terimi veya etiket deneyebilirsin.</div>
      </div>
    `;
    return;
  }

  filtered.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));

  grid.innerHTML = filtered
    .map((p) => {
      const badge = p.featured ? `<span class="badge badge--accent">Öne çıkan</span>` : "";
      return `
        <a class="post-card" href="${p.href}" aria-label="${escapeHtml(p.title)}">
          <div class="post-card__kicker">${escapeHtml(p.tagLabel)} · ${escapeHtml(p.readingTime)}</div>
          <div class="post-card__title">${escapeHtml(p.title)}</div>
          <p class="post-card__excerpt">${escapeHtml(p.excerpt)}</p>
          <div class="post-card__meta">
            <span>${escapeHtml(p.date)}</span>
            ${badge}
          </div>
        </a>
      `;
    })
    .join("");
}

function setupFilterUI() {
  const q = document.getElementById("q");
  const chips = Array.from(document.querySelectorAll(".chip"));

  let activeTag = "all";

  function setActiveTag(nextTag) {
    activeTag = nextTag;
    chips.forEach((c) => c.classList.toggle("is-active", c.dataset.tag === nextTag));
    renderPosts({ q: q?.value ?? "", tag: activeTag });
  }

  if (q) {
    q.addEventListener("input", () => {
      renderPosts({ q: q.value, tag: activeTag });
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => setActiveTag(chip.dataset.tag || "all"));
  });

  renderPosts({ q: "", tag: "all" });
}

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

  if (
    !items.length ||
    !lightbox ||
    !backdrop ||
    !closeBtn ||
    !imageEl ||
    !prevBtn ||
    !nextBtn ||
    !counterEl
  ) {
    return;
  }

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

setupFilterUI();
setupYear();
setupProjectLightbox();

