const mods = window.VALHEIM_MODS || [];
const visuals = window.VALHEIM_VISUALS || [];
const modGrid = document.querySelector("#modGrid");
const visualGrid = document.querySelector("#visualGrid");
const searchInput = document.querySelector("#modSearch");
const tabs = document.querySelector("#categoryTabs");
const emptyState = document.querySelector("#emptyState");
const copyBtn = document.querySelector("#copyProfileCode");
const profileCode = document.querySelector("#profileCode");
let activeCategory = "전체";

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));
}
function initials(name) {
  return String(name || "?").split(/[_\s-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}
function iconHtml(mod) {
  const label = initials(mod.display);
  if (mod.iconPath) {
    return `<div class="mod-icon"><img src="${esc(mod.iconPath)}" alt="${esc(mod.display)} 아이콘" loading="lazy" onerror="this.parentElement.textContent='${esc(label)}';this.remove();"></div>`;
  }
  return `<div class="mod-icon">${esc(label)}</div>`;
}
function uniqueCategories() {
  return ["전체", ...Array.from(new Set(mods.map((mod) => mod.category)))];
}
function renderVisuals() {
  if (!visualGrid) return;
  visualGrid.innerHTML = visuals.map((item) => `
    <a class="visual-card" href="${esc(item.link)}" target="_blank" rel="noreferrer">
      <div class="badge-row"><span class="badge badge--violet">${esc(item.tag)}</span></div>
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.desc)}</p>
      <p><strong>설치 요약:</strong> ${esc(item.install)}</p>
      <span class="mod-card__link">다운로드 페이지 열기 ↗</span>
    </a>
  `).join("");
}
function renderTabs() {
  if (!tabs) return;
  tabs.innerHTML = uniqueCategories().map((category) => `
    <button class="tab" type="button" data-category="${esc(category)}" aria-pressed="${category === activeCategory}">
      ${esc(category)}
    </button>
  `).join("");
  tabs.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderTabs();
      renderMods();
    });
  });
}
function filterMods() {
  const q = (searchInput?.value || "").trim().toLowerCase();
  return mods.filter((mod) => {
    const categoryMatch = activeCategory === "전체" || mod.category === activeCategory;
    const text = `${mod.id} ${mod.display} ${mod.category} ${mod.tags.join(" ")} ${mod.desc} ${mod.effect} ${(mod.settingSummary || []).join(" ")}`.toLowerCase();
    return categoryMatch && (!q || text.includes(q));
  });
}
function summaryHtml(mod) {
  const items = (mod.settingSummary || []).slice(0, 3);
  if (!items.length) return "";
  return `<div class="server-summary"><strong>서버 설정 요약</strong><ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>`;
}
function renderMods() {
  if (!modGrid) return;
  const list = filterMods();
  emptyState.hidden = list.length !== 0;
  modGrid.innerHTML = list.map((mod) => `
    <article class="mod-card">
      <div class="mod-card__top">
        ${iconHtml(mod)}
        <div class="mod-card__name">
          <h3>${esc(mod.display)}</h3>
          <small>${esc(mod.id)}</small>
        </div>
      </div>
      <div class="badge-row">
        <span class="badge">${esc(mod.category)}</span>
        ${mod.tags.map((tag) => `<span class="badge">${esc(tag)}</span>`).join("")}
      </div>
      <p>${esc(mod.desc)}</p>
      <p class="mod-card__effect"><strong>유저 체감:</strong> ${esc(mod.effect)}</p>
      ${summaryHtml(mod)}
      <a class="mod-card__link" href="${esc(mod.link)}" target="_blank" rel="noreferrer">모드 페이지 열기 ↗</a>
    </article>
  `).join("");
}
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  return Promise.resolve();
}
copyBtn?.addEventListener("click", async () => {
  const text = profileCode?.textContent?.trim() || "";
  if (!text || text.includes("여기에")) {
    copyBtn.textContent = "코드 입력 필요";
    setTimeout(() => (copyBtn.textContent = "코드 복사"), 1500);
    return;
  }
  try {
    await copyText(text);
    copyBtn.textContent = "복사 완료!";
  } catch {
    copyBtn.textContent = "복사 실패";
  } finally {
    setTimeout(() => (copyBtn.textContent = "코드 복사"), 1600);
  }
});
searchInput?.addEventListener("input", renderMods);
renderVisuals();
renderTabs();
renderMods();
