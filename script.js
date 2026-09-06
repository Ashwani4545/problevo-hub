(function () {
  "use strict";

  const TRACKS = [
    { key: "all", label: "All Tracks" },
    { key: "AI-ML", label: "AI / ML" },
    { key: "Full-Stack & Web Development", label: "Full-Stack & Web Dev" },
    { key: "Data Science and Big Data", label: "Data Science & Big Data" },
    { key: "IoT-Embedded Systems", label: "IoT / Embedded Systems" },
    { key: "Cloud Computing", label: "Cloud Computing" },
    { key: "UI/UX Design", label: "UI/UX Design" },
    { key: "Software Testing & QA", label: "Software Testing & QA" },
    { key: "Product & Industrial Design", label: "Product & Industrial Design" },
    { key: "Programming", label: "Programming" },
    { key: "DevOps", label: "DevOps" },
  ];

  const state = {
    track: "all",
    query: "",
  };

  const grid = document.getElementById("cardGrid");
  const emptyState = document.getElementById("emptyState");
  const trackNav = document.getElementById("trackNav");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  const resultCount = document.getElementById("resultCount");
  const headerStats = document.getElementById("headerStats");

  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalCard = document.getElementById("modalCard");
  const modalClose = document.getElementById("modalClose");
  const modalId = document.getElementById("modalId");
  const modalTrack = document.getElementById("modalTrack");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalArea = document.getElementById("modalArea");
  const modalNature = document.getElementById("modalNature");
  const modalSource = document.getElementById("modalSource");
  const modalSupervisor = document.getElementById("modalSupervisor");
  const modalSitting = document.getElementById("modalSitting");
  const modalIdField = document.getElementById("modalIdField");

  // ---------- Counts ----------
  const countsByTrack = { all: PROJECTS.length };
  PROJECTS.forEach(p => {
    countsByTrack[p.category] = (countsByTrack[p.category] || 0) + 1;
  });

  // ---------- Header stats ----------
  headerStats.innerHTML = `
    <span><b>${PROJECTS.length}</b> statements</span>
    <span><b>10</b> tracks</span>
    <span><b>15</b> source sheets</span>
  `;

  // ---------- Track nav ----------
  function renderTrackNav() {
    trackNav.innerHTML = TRACKS.map(t => `
      <button class="chip ${state.track === t.key ? 'active' : ''}" data-cat="${t.key}" data-key="${t.key}">
        <span class="dot"></span>
        ${t.label}
        <span class="count">${countsByTrack[t.key] || 0}</span>
      </button>
    `).join("");
  }
  renderTrackNav();

  trackNav.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    state.track = btn.dataset.key;
    renderTrackNav();
    renderGrid();
  });

  // ---------- Search ----------
  let searchDebounce;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchDebounce);
    clearSearchBtn.hidden = searchInput.value.length === 0;
    searchDebounce = setTimeout(() => {
      state.query = searchInput.value.trim().toLowerCase();
      renderGrid();
    }, 120);
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.hidden = true;
    state.query = "";
    renderGrid();
    searchInput.focus();
  });

  // ---------- Helpers ----------
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function matchesQuery(p, q) {
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.supervisor.toLowerCase().includes(q) ||
      p.area.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  }

  function getFiltered() {
    return PROJECTS.filter(p => {
      const trackOk = state.track === "all" || p.category === state.track;
      return trackOk && matchesQuery(p, state.query);
    });
  }

  // ---------- Render grid ----------
  let cardHtmlCache = null;

  function cardTemplate(p, idx) {
    return `
      <button class="card" data-cat="${p.category}" data-idx="${idx}" aria-haspopup="dialog">
        <div class="card-top">
          <span class="card-id">${p.id}</span>
          <span class="card-nature">${escapeHtml(p.nature)}</span>
        </div>
        <h3 class="card-title">${escapeHtml(p.title)}</h3>
        <p class="card-desc">${escapeHtml(p.description)}</p>
        <div class="card-footer">
          <span class="card-supervisor">${escapeHtml(p.supervisor)}</span>
          <span class="card-arrow">View →</span>
        </div>
      </button>
    `;
  }

  function renderGrid() {
    const filtered = getFiltered();
    resultCount.textContent = state.query || state.track !== "all"
      ? `${filtered.length} of ${PROJECTS.length} shown`
      : `${PROJECTS.length} problem statements`;

    if (filtered.length === 0) {
      grid.innerHTML = "";
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    // map filtered items back to their index in PROJECTS for lookup
    grid.innerHTML = filtered.map(p => cardTemplate(p, PROJECTS.indexOf(p))).join("");
  }

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const idx = Number(card.dataset.idx);
    openModal(PROJECTS[idx]);
  });

  // ---------- Modal ----------
  let lastFocused = null;

  function trackLabel(cat) {
    const t = TRACKS.find(t => t.key === cat);
    return t ? t.label : cat;
  }

  function openModal(p) {
    lastFocused = document.activeElement;
    modalCard.style.setProperty("--accent", accentFor(p.category));
    modalCard.setAttribute("data-cat", p.category);
    modalId.textContent = p.id;
    modalTrack.textContent = trackLabel(p.category);
    modalTitle.textContent = p.title;
    modalDescription.textContent = p.description;
    modalArea.textContent = p.area || "Not specified";
    modalNature.textContent = p.nature || "Not specified";
    modalSource.textContent = p.source || "Not specified";
    modalSupervisor.textContent = p.supervisor || "Not specified";
    modalSitting.textContent = p.sitting_place || "Not specified";
    modalIdField.textContent = p.id;

    modalBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeModal() {
    modalBackdrop.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function accentFor(cat) {
    const map = {
      "AI-ML": "#8b5cf6",
      "Data Science and Big Data": "#22d3ee",
      "IoT-Embedded Systems": "#f5a623",
      "Cloud Computing": "#34d399",
      "DevOps": "#fb7185",
      "Full-Stack & Web Development": "#3b82f6",
      "UI/UX Design": "#ec4899",
      "Software Testing & QA": "#a3e635",
      "Product & Industrial Design": "#fb923c",
      "Programming": "#2dd4bf",
    };
    return map[cat] || "#8b5cf6";
  }

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop.classList.contains("open")) closeModal();
  });

  // ---------- Init ----------
  renderGrid();
})();
