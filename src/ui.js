/* =====================================================================
   Python Quest — small shared UI helpers
   ===================================================================== */

import { run } from "./runtime.js";
import { escapeHtml, outputBlock } from "./format.js";
import { MODULES, moduleExerciseIds, allExercises } from "./curriculum/index.js";
import * as store from "./store.js";

/* --------------------------------------------------------------- toasts */

export function toast(message, kind = "") {
  const stack = document.getElementById("toast-stack");
  if (!stack) return;
  const el = document.createElement("div");
  el.className = `toast ${kind}`;
  el.textContent = message;
  stack.append(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity .25s ease";
    setTimeout(() => el.remove(), 260);
  }, 3200);
}

/* ------------------------------------------------- runnable code blocks */

/**
 * Wire up every "Run" button inside `root`. Each example executes in a
 * fresh namespace, so examples never interfere with one another (or with
 * the playground).
 */
export function attachRunButtons(root, { packages = [] } = {}) {
  for (const button of root.querySelectorAll(".run-py")) {
    button.addEventListener("click", async () => {
      const block = button.closest(".code-block");
      const out = block.querySelector(".code-out");
      const code = button.dataset.code;
      button.disabled = true;
      button.textContent = "Running…";
      out.hidden = false;
      out.innerHTML = '<div class="faint">Running…</div>';
      try {
        const result = await run({
          code,
          packages,
          onStatus: (text) => {
            if (text) out.innerHTML = `<div class="faint">${escapeHtml(text)}</div>`;
          },
        });
        out.innerHTML = outputBlock(result);
        if (block.classList.contains("expect-error") && result.error) {
          out.insertAdjacentHTML(
            "beforeend",
            '<p class="faint" style="margin:6px 0 0">That error is the point of the example — read it from the bottom up.</p>'
          );
        }
        store.recordAttempt(null);
      } catch (err) {
        out.innerHTML = `<div class="msg err">${escapeHtml(err.message)}</div>`;
      } finally {
        button.disabled = false;
        button.textContent = "▸ Run";
      }
    });
  }
}

/* -------------------------------------------------------------- progress */

/** Percentage that never rounds real progress down to a discouraging 0%. */
function percent(done, total) {
  if (!total) return 0;
  if (!done) return 0;
  return Math.max(1, Math.round((done / total) * 100));
}

export function courseStats() {
  const exercises = allExercises();
  const solved = exercises.filter((e) => store.isSolved(e.id)).length;
  return { total: exercises.length, solved, pct: percent(solved, exercises.length) };
}

export function moduleStats(mod) {
  const ids = moduleExerciseIds(mod);
  const solved = ids.filter((id) => store.isSolved(id)).length;
  return {
    total: ids.length,
    solved,
    pct: percent(solved, ids.length),
    done: ids.length > 0 && solved === ids.length,
  };
}

export function lessonSolved(lesson) {
  const ids = (lesson.exercises || []).map((e) => e.id);
  if (!ids.length) return store.isVisited(lesson.id);
  return ids.every((id) => store.isSolved(id));
}

/* ---------------------------------------------------------------- badges */

export const BADGES = [
  { id: "first", icon: "🌱", name: "Hello, World", desc: "Solve your first exercise",
    earned: (s) => s.solved >= 1 },
  { id: "ten", icon: "⚡", name: "Getting Fluent", desc: "Solve 10 exercises",
    earned: (s) => s.solved >= 10 },
  { id: "fifty", icon: "🔥", name: "Half a Century", desc: "Solve 50 exercises",
    earned: (s) => s.solved >= 50 },
  { id: "hundred", icon: "💎", name: "Century", desc: "Solve 100 exercises",
    earned: (s) => s.solved >= 100 },
  { id: "basics", icon: "📘", name: "Grounded", desc: "Finish First Steps",
    earned: (s) => s.modulesDone.includes("first-steps") },
  { id: "functions", icon: "🧩", name: "Function Builder", desc: "Finish the Functions module",
    earned: (s) => s.modulesDone.includes("functions") },
  { id: "classes", icon: "🏛", name: "Object Architect", desc: "Finish Classes and Objects",
    earned: (s) => s.modulesDone.includes("classes") },
  { id: "data", icon: "📊", name: "Data Hero", desc: "Finish the NumPy and pandas module",
    earned: (s) => s.modulesDone.includes("data") },
  { id: "unaided", icon: "🧠", name: "No Peeking", desc: "Solve 15 exercises without hints or solutions",
    earned: (s) => s.unaided >= 15 },
  { id: "streak", icon: "📆", name: "Consistent", desc: "Practise on 3 different days",
    earned: (s) => s.days >= 3 },
  { id: "playground", icon: "🛠", name: "Tinkerer", desc: "Run 25 programs of your own",
    earned: (s) => s.runsCount >= 25 },
  { id: "complete", icon: "👑", name: "Python Quest Complete", desc: "Solve every exercise in the course",
    earned: (s) => s.solved === s.total && s.total > 0 },
];

export function badgeState() {
  const stats = courseStats();
  const state = store.getState();
  const unaided = Object.values(state.solved).filter((s) => !s.peeked && !s.hints).length;
  const modulesDone = MODULES.filter((m) => moduleStats(m).done).map((m) => m.id);
  const context = {
    ...stats,
    unaided,
    modulesDone,
    days: state.stats.days.length,
    runsCount: state.stats.runsCount,
  };
  return BADGES.map((badge) => ({ ...badge, isEarned: badge.earned(context) }));
}

/* ------------------------------------------------------- celebrations --- */

const reducedMotion = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A "+25 XP" that floats up from the element that earned it. */
export function xpFloat(anchor, text, kind = "") {
  if (!anchor) return;
  const rect = anchor.getBoundingClientRect();
  const el = document.createElement("div");
  el.className = `xp-float ${kind}`;
  el.textContent = text;
  el.style.left = `${rect.left + rect.width / 2}px`;
  el.style.top = `${rect.top}px`;
  document.body.append(el);
  setTimeout(() => el.remove(), reducedMotion() ? 900 : 1500);
}

/** A short burst of confetti from an element. Skipped for reduced motion. */
export function confetti(anchor, count = 18) {
  if (!anchor || reducedMotion()) return;
  const rect = anchor.getBoundingClientRect();
  const colours = ["#1F5EFF", "#16A34A", "#F59E0B", "#111318", "#60A5FA"];
  for (let i = 0; i < count; i += 1) {
    const bit = document.createElement("i");
    bit.className = "confetti-bit";
    bit.style.left = `${rect.left + rect.width * Math.random()}px`;
    bit.style.top = `${rect.top + rect.height / 2}px`;
    bit.style.background = colours[i % colours.length];
    bit.style.setProperty("--dx", `${(Math.random() - 0.5) * 240}px`);
    bit.style.setProperty("--dy", `${-120 - Math.random() * 160}px`);
    bit.style.setProperty("--rot", `${(Math.random() - 0.5) * 720}deg`);
    bit.style.animationDelay = `${Math.random() * 0.12}s`;
    document.body.append(bit);
    setTimeout(() => bit.remove(), 1400);
  }
}

function overlay(innerHtml, { onClose = null, autoCloseMs = 0 } = {}) {
  const back = document.createElement("div");
  back.className = "reward-backdrop";
  back.innerHTML = innerHtml;
  document.body.append(back);
  const close = () => {
    back.remove();
    if (onClose) onClose();
  };
  back.addEventListener("click", (event) => {
    if (event.target === back || event.target.closest("[data-close]")) close();
  });
  if (autoCloseMs) setTimeout(close, autoCloseMs);
  return close;
}

/** Level-up moment: the biggest visual payoff in the app. */
export function levelUpBanner(level) {
  overlay(
    `<div class="reward-card level-up">
       <div class="reward-kicker">Level ${level.level}</div>
       <h2>${escapeHtml(level.title)}</h2>
       <p class="muted">${
         level.next
           ? `${level.toNext} XP to ${escapeHtml(level.next.title)}`
           : "You have reached the final rank."
       }</p>
       <button class="btn primary" data-close>Keep going</button>
     </div>`,
    { autoCloseMs: 9000 }
  );
  const card = document.querySelector(".reward-card.level-up");
  confetti(card, 40);
}

/** The variable-ratio surprise: an insight card joins the collection. */
export function cardReveal(card, onClose = null) {
  overlay(
    `<div class="reward-card insight">
       <div class="reward-kicker">Insight card found</div>
       <h2>${escapeHtml(card.title)}</h2>
       <p>${escapeHtml(card.body)}</p>
       <div class="row" style="justify-content:center">
         <a class="btn ghost" href="#/progress" data-close>See collection</a>
         <button class="btn primary" data-close>Nice</button>
       </div>
     </div>`,
    { autoCloseMs: 14000, onClose }
  );
}

export function questToast(quest) {
  toast(
    quest.id === "perfect"
      ? `Perfect day — ${quest.label}. +${quest.bonus} XP and a streak freeze.`
      : `Quest complete: ${quest.label}. +${quest.bonus} XP`,
    "ok"
  );
}
