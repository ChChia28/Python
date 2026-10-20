/* =====================================================================
   Python Quest — application shell
   Routing, sidebar, search palette, theme, runtime status. Everything runs
   client-side: the course, the interpreter and your progress never leave
   the browser.
   ===================================================================== */

import { initRuntime, onStatus } from "./runtime.js";
import { MODULES, findLesson, searchIndex } from "./curriculum/index.js";
import { loadModuleContent } from "./content.js";
import * as store from "./store.js";
import { courseStats, moduleStats, lessonSolved, toast } from "./ui.js";
import { levelFor, totalXp, streakInfo, dueReviewIds } from "./game.js";
import { initPersistence, onStatusChange, status as storageStatus } from "./persist.js";
import { escapeHtml } from "./format.js";

import renderDashboard from "./views/dashboard.js";
import renderLesson from "./views/lesson.js";
import renderPlayground from "./views/playground.js";
import renderReference from "./views/reference.js";
import renderProgress from "./views/progress.js";
import renderReview from "./views/review.js";
import renderScience from "./views/science.js";

const view = document.getElementById("view");
const sidebarInner = document.getElementById("sidebar-inner");
const sidebar = document.getElementById("sidebar");

/* ----------------------------------------------------------------- theme */

/** An explicit choice wins; otherwise light — the design is light-first. */
function preferredTheme() {
  const saved = store.theme();
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme, { remember = true } = {}) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0F1115" : "#F5F6F8");
  if (remember) store.setTheme(theme);
}

document.getElementById("theme-btn").addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

applyTheme(preferredTheme(), { remember: false });

/* --------------------------------------------------------------- sidebar */

function buildSidebar() {
  const current = currentRoute();
  const activeLessonId = current.name === "lesson" ? current.param : null;
  const activeModuleId = activeLessonId ? (findLesson(activeLessonId) || {}).module?.id : null;

  sidebarInner.innerHTML = MODULES.map((mod) => {
    const stats = moduleStats(mod);
    const open = mod.id === activeModuleId || (!activeModuleId && mod.number === 1);
    return `
      <div class="mod ${open ? "open" : ""} ${stats.done ? "done" : ""}" data-module="${mod.id}">
        <button class="mod-head" type="button">
          <span class="mod-num">${stats.done ? "✓" : mod.number}</span>
          <span class="mod-title">${escapeHtml(mod.title)}</span>
          <span class="mod-pct">${stats.pct}%</span>
          <span class="chev">▾</span>
        </button>
        <ul class="mod-lessons">
          ${mod.lessons
            .map(
              (lesson) => `
            <li>
              <a href="#/lesson/${lesson.id}" class="${lesson.id === activeLessonId ? "active" : ""}">
                <span class="tick ${lessonSolved(lesson) ? "on" : ""}">${lessonSolved(lesson) ? "✓" : ""}</span>
                <span>${escapeHtml(lesson.title)}</span>
              </a>
            </li>`
            )
            .join("")}
        </ul>
      </div>`;
  }).join("");

  for (const head of sidebarInner.querySelectorAll(".mod-head")) {
    head.addEventListener("click", () => head.closest(".mod").classList.toggle("open"));
  }
}

function updateRing() {
  const { pct } = courseStats();
  const circumference = 2 * Math.PI * 15.5;
  const ring = document.getElementById("ring-fg");
  ring.style.strokeDasharray = String(circumference);
  ring.style.strokeDashoffset = String(circumference * (1 - pct / 100));
  document.getElementById("ring-label").textContent = `${pct}%`;
}

/** Level, XP, streak and the recall badge in the top bar. */
function updateHud() {
  const xp = totalXp();
  const level = levelFor(xp);
  document.getElementById("hud-lvl").textContent = `Lv ${level.level}`;
  document.getElementById("hud-xpbar-fill").style.width = `${level.pct}%`;
  document.getElementById("hud-xp").textContent = `${xp} XP`;
  document.getElementById("hud-level").title = level.next
    ? `${level.title} — ${level.toNext} XP to ${level.next.title}`
    : `${level.title} — top rank`;

  const streak = streakInfo();
  const streakEl = document.getElementById("hud-streak");
  streakEl.querySelector("b").textContent = String(streak.days);
  streakEl.classList.toggle("lit", streak.practisedToday && streak.days > 0);
  streakEl.classList.toggle("cold", !streak.practisedToday);
  streakEl.title = `${streak.days}-day streak · ${streak.freezes} freeze${
    streak.freezes === 1 ? "" : "s"
  } in hand`;

  const due = dueReviewIds().length;
  for (const badge of document.querySelectorAll("[data-review-badge]")) {
    badge.hidden = due === 0;
    badge.textContent = String(due);
  }
}

store.subscribe(() => {
  buildSidebar();
  updateRing();
  updateHud();
});

/* --------------------------------------------------------------- storage */

function renderStorageBanner(state = storageStatus()) {
  const existing = document.getElementById("storage-banner");
  if (state.mode !== "none") {
    if (existing) existing.remove();
    return;
  }
  if (existing) return;
  const banner = document.createElement("div");
  banner.id = "storage-banner";
  banner.className = "storage-warning";
  banner.innerHTML = `
    <strong>This view cannot save your progress.</strong>
    Storage is blocked here, so anything you solve will be lost when you close the page.
    <a href="#/progress">Copy a backup</a> before you go, or open the app in a normal browser tab.`;
  document.querySelector(".layout").before(banner);
}

/* --------------------------------------------------------------- runtime */

const runtimeEl = document.getElementById("runtime-status");
onStatus((info) => {
  if (!runtimeEl) return;
  if (info.booting) {
    runtimeEl.className = "runtime booting";
    runtimeEl.innerHTML = `<span class="dot"></span>${escapeHtml(info.status || "Starting Python…")}`;
  } else if (info.ready) {
    runtimeEl.className = "runtime ready";
    runtimeEl.innerHTML = `<span class="dot"></span>Python ${escapeHtml(info.version)}${
      info.status ? ` · ${escapeHtml(info.status)}` : ""
    }`;
  } else {
    runtimeEl.className = "runtime off";
    runtimeEl.innerHTML = `<span class="dot"></span>Python offline`;
  }
});

/* ---------------------------------------------------------------- router */

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [name, param] = hash.split("/");
  if (!name) return { name: "home" };
  return { name, param };
}

const ROUTES = {
  home: renderDashboard,
  lesson: renderLesson,
  review: renderReview,
  playground: renderPlayground,
  reference: renderReference,
  progress: renderProgress,
  science: renderScience,
};

async function route() {
  const { name, param } = currentRoute();
  const render = ROUTES[name] || renderDashboard;
  const navName = ROUTES[name] ? name : "home";

  for (const link of document.querySelectorAll("[data-nav]")) {
    link.classList.toggle("active", link.dataset.nav === navName || (link.dataset.nav === "learn" && navName === "lesson"));
  }
  document.body.dataset.route = navName;

  sidebar.classList.remove("open");
  document.body.classList.remove("sidebar-open");
  buildSidebar();
  updateRing();
  updateHud();

  view.innerHTML = '<div class="boot"><div class="spinner"></div></div>';
  try {
    await render(view, param);
  } catch (err) {
    view.innerHTML = `<div class="card"><h1>Something went wrong</h1><p class="muted">${escapeHtml(
      err.message
    )}</p><p><a href="#/">Back to the dashboard</a></p></div>`;
    console.error(err);
  }
  window.scrollTo({ top: 0 });
}

window.addEventListener("hashchange", route);

/* --------------------------------------------------------- search palette */

let index = null;
const backdrop = document.getElementById("palette-backdrop");
const input = document.getElementById("palette-input");
const results = document.getElementById("palette-results");
let selected = 0;

async function ensureIndex() {
  if (index) return index;
  const prose = new Map();
  await Promise.all(
    MODULES.map(async (mod) => {
      try {
        prose.set(mod.id, await loadModuleContent(mod.id));
      } catch {
        /* a module's prose failing to load should not break search */
      }
    })
  );
  index = searchIndex(prose);
  return index;
}

function renderResults(query) {
  const q = query.trim().toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = (index || [])
    .map((entry) => {
      if (!terms.length) return { entry, score: 1 };
      let score = 0;
      for (const term of terms) {
        if (entry.title.toLowerCase().includes(term)) score += 10;
        if (entry.goal.toLowerCase().includes(term)) score += 4;
        if (entry.haystack.includes(term)) score += 1;
        else if (!entry.title.toLowerCase().includes(term)) return { entry, score: -1 };
      }
      return { entry, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  selected = 0;
  results.innerHTML = scored.length
    ? scored
        .map(
          ({ entry }, i) => `
      <li data-id="${entry.id}" class="${i === 0 ? "sel" : ""}">
        ${escapeHtml(entry.title)}
        <small>Module ${entry.moduleNumber} · ${escapeHtml(entry.module)}${
            entry.goal ? ` — ${escapeHtml(entry.goal)}` : ""
          }</small>
      </li>`
        )
        .join("")
    : '<li class="faint" style="cursor:default">No lessons match that.</li>';

  for (const li of results.querySelectorAll("li[data-id]")) {
    li.addEventListener("click", () => {
      location.hash = `#/lesson/${li.dataset.id}`;
      closePalette();
    });
  }
}

async function openPalette() {
  backdrop.hidden = false;
  input.value = "";
  results.innerHTML = '<li class="faint" style="cursor:default">Loading lessons…</li>';
  input.focus();
  await ensureIndex();
  renderResults("");
}

function closePalette() {
  backdrop.hidden = true;
}

for (const btn of document.querySelectorAll("[data-open-search]")) btn.addEventListener("click", openPalette);
backdrop.addEventListener("click", (event) => {
  if (event.target === backdrop) closePalette();
});
input.addEventListener("input", () => renderResults(input.value));
input.addEventListener("keydown", (event) => {
  const items = [...results.querySelectorAll("li[data-id]")];
  if (event.key === "Escape") return closePalette();
  if (!items.length) return;
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    items[selected]?.classList.remove("sel");
    selected = (selected + (event.key === "ArrowDown" ? 1 : items.length - 1)) % items.length;
    items[selected].classList.add("sel");
    items[selected].scrollIntoView({ block: "nearest" });
  }
  if (event.key === "Enter") {
    event.preventDefault();
    const item = items[selected];
    if (item) {
      location.hash = `#/lesson/${item.dataset.id}`;
      closePalette();
    }
  }
});

document.addEventListener("keydown", (event) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName);
  if (event.key === "/" && !typing) {
    event.preventDefault();
    openPalette();
  }
  if (event.key === "Escape" && !backdrop.hidden) closePalette();
});

/* --------------------------------------------------------- mobile drawer */

function toggleSidebar(force) {
  const open = typeof force === "boolean" ? force : !sidebar.classList.contains("open");
  sidebar.classList.toggle("open", open);
  document.body.classList.toggle("sidebar-open", open);
}
for (const btn of document.querySelectorAll("[data-toggle-sidebar]")) {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    toggleSidebar();
  });
}
document.getElementById("sidebar-backdrop").addEventListener("click", () => toggleSidebar(false));
sidebarInner.addEventListener("click", (event) => {
  if (event.target.closest("a")) toggleSidebar(false);
});

/* ------------------------------------------------------------------ boot */

(async function start() {
  buildSidebar();
  updateRing();
  updateHud();

  const persistence = initPersistence().catch(() => storageStatus());
  onStatusChange(renderStorageBanner);
  await persistence;
  renderStorageBanner();

  // the interpreter boots in the background; pages render straight away
  initRuntime().catch((err) => {
    toast("Python could not start — check your connection and reload.", "warn");
    console.error(err);
  });

  await route();
  ensureIndex().catch(() => {});
  if (!store.getState().stats.firstSeen) {
    toast("Welcome! Everything runs locally in your browser.", "ok");
  }
})();
