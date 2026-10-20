/* =====================================================================
   Python Quest — dashboard
   For a returning learner the page opens on "today": the daily goal, the
   three quests, and anything the recall deck owes them. The course map and
   the module list sit underneath.
   ===================================================================== */

import { MODULES, allLessons } from "../curriculum/index.js";
import { escapeHtml } from "../format.js";
import { courseStats, moduleStats, lessonSolved } from "../ui.js";
import {
  quests,
  sessionStats,
  streakInfo,
  reviewStats,
  levelFor,
  totalXp,
  xpHistory,
} from "../game.js";
import * as store from "../store.js";

/** The first lesson that still has unsolved exercises. */
function nextLesson() {
  const lessons = allLessons();
  return lessons.find((lesson) => !lessonSolved(lesson)) || lessons[0];
}

function goalRing(session) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, session.xp / session.goal));
  return `
    <div class="goal-ring">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="bg" cx="60" cy="60" r="${radius}" />
        <circle class="fg" cx="60" cy="60" r="${radius}"
          style="stroke-dasharray:${circumference};stroke-dashoffset:${offset}" />
      </svg>
      <div class="label">
        <b>${session.xp}</b>
        <span>of ${session.goal} XP</span>
      </div>
    </div>`;
}

function questList(items) {
  return items
    .map(
      (quest) => `
    <div class="quest ${quest.done ? "done" : ""}">
      <span class="tickbox">${quest.done ? "✓" : ""}</span>
      <div class="quest-body">
        <div class="quest-label">${escapeHtml(quest.label)}</div>
        <div class="bar"><i style="width:${Math.min(
          100,
          Math.round((quest.progress / quest.target) * 100)
        )}%"></i></div>
      </div>
      <span class="quest-count">${Math.min(quest.progress, quest.target)}/${quest.target}</span>
    </div>`
    )
    .join("");
}

function questMap() {
  const firstUnfinished = MODULES.findIndex((mod) => !moduleStats(mod).done);
  return `
    <div class="quest-map">
      ${MODULES.map((mod, i) => {
        const stats = moduleStats(mod);
        const reached = stats.solved > 0 || i === 0 || moduleStats(MODULES[i - 1]).done;
        const classes = [
          stats.done ? "done" : "",
          reached ? "reached" : "",
          i === firstUnfinished ? "current" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return `
        <a class="map-node ${classes}" href="#/lesson/${mod.lessons[0].id}"
           title="${escapeHtml(mod.title)} — ${stats.solved}/${stats.total} exercises">
          <span class="map-dot">${stats.done ? "★" : mod.number}</span>
          <small>${escapeHtml(mod.title)}</small>
        </a>`;
      }).join("")}
    </div>`;
}

function sparkline(history) {
  const max = Math.max(10, ...history.map((d) => d.xp));
  return `<div class="spark">${history
    .map(
      (day, i) =>
        `<i class="${i === history.length - 1 ? "today" : ""}" style="height:${Math.max(
          4,
          Math.round((day.xp / max) * 100)
        )}%" title="${day.day}: ${day.xp} XP"></i>`
    )
    .join("")}</div>`;
}

export default async function renderDashboard(container) {
  const stats = courseStats();
  const target = nextLesson();
  const state = store.getState();
  const started = stats.solved > 0 || Object.keys(state.visited).length > 0;
  const session = sessionStats();
  const daily = quests();
  const streak = streakInfo();
  const reviews = reviewStats();
  const level = levelFor(totalXp());
  const lessonCount = allLessons().length;

  const hero = `
    <section class="hero">
      <div class="hero-text">
        <div class="eyebrow">Learn Python from zero to hero</div>
        <h1 class="display">Python<br>Quest</h1>
        <p>
          Ten modules, ${lessonCount} lessons and ${stats.total} graded exercises, all running on a real
          Python interpreter inside this page. Write code, press Check, and your program is executed and
          compared with the reference — no accounts, no installs, nothing leaves your browser.
        </p>
        <div class="row" style="margin-top:22px">
          ${
            started
              ? `<a class="btn primary" href="#/lesson/${target.id}">Continue → ${escapeHtml(target.title)}</a>`
              : `<a class="btn primary" href="#/lesson/${target.id}">Start the course</a>`
          }
          <a class="btn ghost" href="#/playground">Open the playground</a>
          <a class="btn ghost" href="#/science">Why it works</a>
        </div>
      </div>
      <div class="hero-figure" aria-hidden="true">
        <span class="hero-number">${stats.total}</span>
        <span class="hero-caption">exercises<br>to solve</span>
      </div>
    </section>`;

  const today = `
    <section class="today">
      <div class="card">
        <h3>Today</h3>
        ${goalRing(session)}
        <p class="faint" style="text-align:center;margin:12px 0 0">
          ${
            session.goalMet
              ? "Daily goal met — anything more is a bonus."
              : `${session.goal - session.xp} XP to today's goal`
          }
        </p>
      </div>

      <div class="card">
        <h3>Quests <span class="faint">· reset at midnight</span></h3>
        ${questList(daily.items)}
        <p class="faint" style="margin:12px 0 0">
          ${
            daily.items.every((q) => q.done)
              ? "All three done. Freeze earned."
              : "Finish all three for a bonus and a streak freeze."
          }
        </p>
      </div>

      <div class="today-side">
        <a class="due-pill card ${reviews.due ? "hot" : ""}" href="#/review">
          <b>${reviews.due}</b>
          <span>${reviews.due ? "recall cards due" : "recall deck clear"}</span>
        </a>
        <a class="due-pill card" href="#/progress">
          <b>${streak.days}<small>🔥</small></b>
          <span>day streak · ${streak.freezes} freeze${streak.freezes === 1 ? "" : "s"}</span>
        </a>
        <a class="btn primary" href="#/lesson/${target.id}" style="justify-content:center">
          ${started ? "Continue" : "Start"} → ${escapeHtml(target.title)}
        </a>
      </div>
    </section>`;

  container.innerHTML = `
    ${started ? today : hero}

    <h2>Course map</h2>
    ${questMap()}

    ${started ? hero : today}

    <section class="stat-grid">
      <div class="stat"><b>${level.level}</b><span>${escapeHtml(level.title)}</span></div>
      <div class="stat"><b>${stats.solved}<small> / ${stats.total}</small></b><span>Exercises solved</span></div>
      <div class="stat"><b>${stats.pct}<small>%</small></b><span>Course complete</span></div>
      <div class="stat"><b>${MODULES.filter((m) => moduleStats(m).done).length}<small> / ${
        MODULES.length
      }</small></b><span>Modules finished</span></div>
    </section>

    ${
      started
        ? `<div class="card">
             <div class="row" style="margin-bottom:8px">
               <h3 style="margin:0">XP, last 14 days</h3>
               <span class="spacer"></span>
               <span class="faint">${totalXp()} XP total · ${
                 level.next ? `${level.toNext} to ${escapeHtml(level.next.title)}` : "top rank"
               }</span>
             </div>
             ${sparkline(xpHistory(14))}
           </div>`
        : ""
    }

    <h2>The curriculum</h2>
    <div class="grid-cards">
      ${MODULES.map((mod) => {
        const ms = moduleStats(mod);
        return `
        <a class="mod-card card ${ms.done ? "done" : ""}" href="#/lesson/${mod.lessons[0].id}">
          <span class="mod-watermark" aria-hidden="true">${String(mod.number).padStart(2, "0")}</span>
          <div class="row">
            <span class="pill ${ms.done ? "ok" : "accent"}">Module ${mod.number}</span>
            <span class="spacer"></span>
            <span class="pill">${escapeHtml(mod.level || "")}</span>
          </div>
          <h3>${escapeHtml(mod.title)}</h3>
          <p>${escapeHtml(mod.summary)}</p>
          <div class="bar"><i style="width:${ms.pct}%"></i></div>
          <div class="faint">${ms.solved} / ${ms.total} exercises · ${mod.lessons.length} lessons</div>
        </a>`;
      }).join("")}
    </div>

    <h2 style="margin-top:36px">How this works</h2>
    <div class="grid-cards">
      <div class="card">
        <h3>Real Python, in your browser</h3>
        <p class="muted">CPython is compiled to WebAssembly (Pyodide) and runs on a background thread. Every
        line you write is really executed — loops, classes, files, even <code>numpy</code> and
        <code>pandas</code> in the last module.</p>
      </div>
      <div class="card">
        <h3>Answers are executed, not string-matched</h3>
        <p class="muted">Your program runs in a clean namespace. Its output is compared with the reference
        solution's, or a set of checks calls your functions. Any correct approach passes, whatever style you
        write it in.</p>
      </div>
      <div class="card">
        <h3>The rewards are explained</h3>
        <p class="muted">XP, quests, streaks and the recall deck all exist for a documented reason, and none
        of them can take anything away from you. <a href="#/science">See the design</a>.</p>
      </div>
    </div>`;
}
