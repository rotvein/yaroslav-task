(() => {
  const MIN = 1,
    MAX = 10;

  const view = document.getElementById("view");
  const navList = document.getElementById("navList");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  function getPageFromHash() {
    const m = location.hash.match(/p=(\d+)/);
    if (!m) return MIN;
    const n = parseInt(m[1], 10);
    if (!Number.isFinite(n)) return MIN;
    return Math.min(MAX, Math.max(MIN, n));
  }

  function setHash(n) {
    location.hash = `p=${n}`;
  }

  function renderNav(current) {
    navList.innerHTML = "";

    for (let i = MIN; i <= MAX; i++) {
      const a = document.createElement("a");
      a.className = "nav-btn" + (i === current ? " is-active" : "");
      a.href = `#p=${i}`;
      a.textContent = i;
      navList.appendChild(a);
    }

    const prev = current - 1;
    const next = current + 1;

    if (prev < MIN) {
      prevBtn.classList.add("is-disabled");
      prevBtn.removeAttribute("href");
    } else {
      prevBtn.classList.remove("is-disabled");
      prevBtn.href = `#p=${prev}`;
    }

    if (next > MAX) {
      nextBtn.classList.add("is-disabled");
      nextBtn.removeAttribute("href");
    } else {
      nextBtn.classList.remove("is-disabled");
      nextBtn.href = `#p=${next}`;
    }
  }

  async function loadPage(n) {
    const url = `pages/index-${n}.html`;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      view.innerHTML = html;
    } catch (err) {
      view.innerHTML = `
        <div class="error">
          <b>Не удалось загрузить:</b> ${url}<br/>
          <small>${String(err)}</small>
        </div>`;
    }
  }

  function sync() {
    const current = getPageFromHash();
    renderNav(current);
    loadPage(current);
  }

  if (!location.hash) setHash(MIN);

  window.addEventListener("hashchange", sync);
  sync();

  window.addEventListener("keydown", (e) => {
    const current = getPageFromHash();
    if (e.key === "ArrowLeft" && current > MIN) setHash(current - 1);
    if (e.key === "ArrowRight" && current < MAX) setHash(current + 1);
  });
})();
