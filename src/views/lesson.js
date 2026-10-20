/* =====================================================================
   Python Quest — lesson view
   Prose, runnable examples, graded exercises and a short quiz.
   ===================================================================== */

import { findLesson, lessonNeighbours, withPackages } from "../curriculum/index.js";
import { lessonMarkdown } from "../content.js";
import { renderMarkdown, inlineMarkdown, escapeHtml, codeBlock, outputBlock } from "../format.js";
import { createEditor, clearDraft } from "../editor.js";
import { gradeExercise, runExercise } from "../grader.js";
import { preloadPackages } from "../runtime.js";
import * as store from "../store.js";
import { attachRunButtons, toast, xpFloat, confetti, levelUpBanner, cardReveal, questToast } from "../ui.js";
import { awardExercise, breakCombo, scheduleReview, awardEvent, completeLesson } from "../game.js";

function exerciseShell(exercise, number) {
  const solved = store.isSolved(exercise.id);
  const stdin = exercise.stdin && exercise.stdin.length
    ? `<div class="stdin-note"><span class="faint">input() will receive, in order:</span> ${exercise.stdin
        .map((v) => `<code>${escapeHtml(v)}</code>`)
        .join(" ")}</div>`
    : "";
  return `
    <section class="exercise ${solved ? "solved" : ""}" id="ex-${exercise.id}">
      <div class="exercise-head">
        <span class="ex-num">${number}</span>
        <h3>Exercise ${number}</h3>
        <span class="spacer"></span>
        <span class="pill ${solved ? "ok" : ""}" data-role="status">${solved ? "✓ solved" : "not solved"}</span>
      </div>
      <div class="exercise-body">
        <div class="task prose">${renderMarkdown(exercise.prompt)}</div>
        ${stdin}
        <div data-role="editor"></div>
        <div data-role="feedback"></div>
        <div class="hint-box" data-role="hints"></div>
        <details class="solution" data-role="solution">
          <summary>Show a reference solution</summary>
          <div data-role="solution-body"></div>
        </details>
      </div>
    </section>`;
}

/** Show everything a solved exercise earned, one beat at a time. */
function celebrate(award, { anchor, root }) {
  if (award.xp > 0) xpFloat(anchor, `+${award.xp} XP`, award.doubled ? "big" : "");
  confetti(root, award.doubled ? 34 : 18);
  if (award.doubled) toast("Lucky roll — double XP on that one", "ok");
  if (award.frozenDay) toast("A streak freeze covered your missed day", "warn");
  for (const quest of award.quests || []) questToast(quest);
  if (award.card && award.levelUp) cardReveal(award.card, () => levelUpBanner(award.levelUp));
  else if (award.card) cardReveal(award.card);
  else if (award.levelUp) levelUpBanner(award.levelUp);
}

/** When the last exercise of a lesson falls, mark the lesson done. */
function maybeFinishLesson(lesson, anchor) {
  const ids = (lesson.exercises || []).map((e) => e.id);
  if (!ids.length || !ids.every((id) => store.isSolved(id))) return;
  const award = completeLesson(lesson.id);
  if (!award) return;
  toast(`Lesson complete — ${lesson.title}. +${award.xp} XP`, "ok");
  confetti(anchor, 26);
  for (const quest of award.quests || []) questToast(quest);
  if (award.levelUp) levelUpBanner(award.levelUp);
}

function mountExercise(root, exercise, lesson, mod) {
  const feedback = root.querySelector('[data-role="feedback"]');
  const hintBox = root.querySelector('[data-role="hints"]');
  const statusPill = root.querySelector('[data-role="status"]');
  const solutionDetails = root.querySelector('[data-role="solution"]');
  const solutionBody = root.querySelector('[data-role="solution-body"]');

  let hintsShown = 0;
  let peeked = Boolean((store.solvedEntry(exercise.id) || {}).peeked);

  solutionDetails.addEventListener("toggle", () => {
    if (solutionDetails.open && !solutionBody.innerHTML) {
      solutionBody.innerHTML =
        codeBlock(exercise.solution, { runnable: false, label: "reference solution" }) +
        (exercise.tests
          ? `<p class="faint">Your answer is checked by running this afterwards:</p>${codeBlock(
              exercise.tests,
              { runnable: false, label: "checks" }
            )}`
          : exercise.expectOutput
            ? '<p class="faint">Your answer is checked by comparing what it prints with what this prints.</p>'
            : "");
      peeked = true;
    }
  });

  const status = (text) => {
    if (text) feedback.innerHTML = `<div class="msg info">${escapeHtml(text)}</div>`;
  };

  async function run(editor) {
    const code = editor.getValue();
    if (!code.trim()) {
      feedback.innerHTML = '<div class="msg info">Write some code first.</div>';
      return;
    }
    editor.setBusy(true);
    feedback.innerHTML = '<div class="msg info">Running…</div>';
    try {
      const result = await runExercise(exercise, code, { onStatus: status });
      feedback.innerHTML = outputBlock(result, {
        label: "your output",
        emptyText: "(nothing was printed)",
      });
      store.recordAttempt(exercise.id);
    } catch (err) {
      feedback.innerHTML = `<div class="msg err">${escapeHtml(err.message)}</div>`;
    } finally {
      editor.setBusy(false);
    }
  }

  async function check(editor) {
    const code = editor.getValue();
    editor.setBusy(true, "Checking…");
    feedback.innerHTML = '<div class="msg info">Checking…</div>';
    try {
      const verdict = await gradeExercise(exercise, code, { onStatus: status });
      if (verdict.status === "pass") {
        const isNew = store.markSolved(exercise.id, { hints: hintsShown, peeked });
        root.classList.add("solved");
        statusPill.className = "pill ok";
        statusPill.textContent = "✓ solved";

        let award = null;
        if (isNew) {
          award = awardExercise({
            moduleNumber: mod.number,
            hints: hintsShown,
            peeked,
            isNew: true,
          });
          scheduleReview(exercise.id, true);   // it joins the recall deck for tomorrow
        }

        const comboChip =
          award && award.combo >= 3
            ? `<span class="combo-chip">${award.combo} in a row · +${Math.round(
                Math.min(50, 10 * (award.combo - 1))
              )}% XP</span>`
            : "";
        const output =
          verdict.run && (verdict.run.stdout || "").trim()
            ? outputBlock(verdict.run, { label: "your output" })
            : "";
        feedback.innerHTML = `<div class="msg ok"><strong>Correct.</strong> ${
          hintsShown || peeked ? "Try the next one without help." : "Nicely done."
        } ${comboChip}</div>${output}`;

        if (award) {
          celebrate(award, { anchor: editor.buttons[0].el, root });
          maybeFinishLesson(lesson, root);
        }
      } else if (verdict.status === "error") {
        feedback.innerHTML = `<div class="msg err"><strong>${escapeHtml(verdict.title)}</strong><div style="margin-top:6px">${
          verdict.detail
        }</div></div>${
          verdict.run && (verdict.run.stdout || "").trim()
            ? outputBlock({ stdout: verdict.run.stdout }, { label: "printed before the error" })
            : ""
        }`;
        store.recordAttempt(exercise.id);
        breakCombo();
      } else {
        feedback.innerHTML = `<div class="msg warn"><strong>${escapeHtml(verdict.title)}</strong>${
          verdict.detail ? `<div style="margin-top:6px">${verdict.detail}</div>` : ""
        }</div>`;
        store.recordAttempt(exercise.id);
        breakCombo();
      }
    } catch (err) {
      feedback.innerHTML = `<div class="msg err">${escapeHtml(err.message)}</div>`;
    } finally {
      editor.setBusy(false);
    }
  }

  function showHint() {
    const hints = exercise.hints || [];
    if (hintsShown >= hints.length) {
      hintBox.insertAdjacentHTML(
        "beforeend",
        '<div class="hint-item">That is every hint — the reference solution is below the editor.</div>'
      );
      return;
    }
    hintBox.insertAdjacentHTML(
      "beforeend",
      `<div class="hint-item">${renderMarkdown(hints[hintsShown])}</div>`
    );
    hintsShown += 1;
  }

  const editor = createEditor({
    value: exercise.starter || "",
    height: Math.min(320, 120 + (exercise.starter || "").split("\n").length * 22),
    storageKey: `ex.${exercise.id}`,
    onRun: run,
    hint: "Ctrl/⌘ + Enter to run",
    buttons: [
      { label: "✓ Check answer", className: "btn small dark", onClick: check },
      { label: "💡 Hint", className: "btn small ghost", onClick: showHint },
      {
        label: "↺ Reset",
        className: "btn small ghost",
        onClick: (api) => {
          api.reset();
          feedback.innerHTML = "";
        },
      },
    ],
  });

  root.querySelector('[data-role="editor"]').append(editor.el);
  return editor;
}

function quizBlock(lesson) {
  if (!lesson.quiz || !lesson.quiz.length) return "";
  return `
    <h2>Check your understanding</h2>
    ${lesson.quiz
      .map(
        (question, qi) => `
      <div class="quiz-q" data-quiz="${qi}">
        <p>${inlineMarkdown(question.q)}</p>
        ${question.options
          .map(
            (option, oi) => `
          <label class="quiz-opt" data-option="${oi}">
            <input type="radio" name="${lesson.id}-q${qi}" value="${oi}" />
            <span>${inlineMarkdown(option)}</span>
          </label>`
          )
          .join("")}
        <div class="quiz-explain" hidden></div>
      </div>`
      )
      .join("")}`;
}

function wireQuiz(root, lesson) {
  for (const block of root.querySelectorAll(".quiz-q")) {
    const qi = Number(block.dataset.quiz);
    const question = lesson.quiz[qi];
    const key = `${lesson.id}-${qi}`;
    const explain = block.querySelector(".quiz-explain");

    const reveal = (choice) => {
      for (const label of block.querySelectorAll(".quiz-opt")) {
        const oi = Number(label.dataset.option);
        label.classList.toggle("right", oi === question.answer);
        label.classList.toggle("wrong", oi === choice && choice !== question.answer);
        const radio = label.querySelector("input");
        radio.checked = oi === choice;
      }
      explain.hidden = false;
      explain.innerHTML =
        (choice === question.answer ? "<strong>Correct.</strong> " : "<strong>Not quite.</strong> ") +
        inlineMarkdown(question.explain || "");
    };

    const stored = store.getQuizAnswer(key);
    if (stored !== null) reveal(stored);

    for (const label of block.querySelectorAll(".quiz-opt")) {
      label.addEventListener("click", (event) => {
        event.preventDefault();
        const choice = Number(label.dataset.option);
        const firstAnswer = store.getQuizAnswer(key) === null;
        store.setQuizAnswer(key, choice);
        reveal(choice);
        if (firstAnswer) {
          const award = awardEvent("quiz");
          if (award.xp) xpFloat(label, `+${award.xp} XP`);
          for (const quest of award.quests || []) questToast(quest);
          if (award.levelUp) levelUpBanner(award.levelUp);
        }
      });
    }
  }
}

/**
 * Ask one quiz question *before* the lesson is read, and withhold the answer
 * until the end. A wrong guess you care about is the cheapest way to make the
 * explanation stick — the curiosity gap does the encoding work for you.
 */
function predictionCard(lesson) {
  if (!lesson.quiz || !lesson.quiz.length) return "";
  if (store.getQuizAnswer(`${lesson.id}-0`) !== null) return "";
  const question = lesson.quiz[0];
  return `
    <div class="predict" id="predict-card">
      <div class="reward-kicker">Guess first</div>
      <p style="font-weight:600;margin-bottom:10px">${inlineMarkdown(question.q)}</p>
      ${question.options
        .map(
          (option, oi) => `
        <label class="quiz-opt" data-predict="${oi}">
          <input type="radio" name="predict-${lesson.id}" value="${oi}" />
          <span>${inlineMarkdown(option)}</span>
        </label>`
        )
        .join("")}
      <p class="faint" style="margin:8px 0 0">No peeking at the answer — you will find out at the end of the lesson.</p>
    </div>`;
}

function wirePrediction(container, lesson) {
  const card = container.querySelector("#predict-card");
  if (!card) return;
  for (const label of card.querySelectorAll("[data-predict]")) {
    label.addEventListener("click", (event) => {
      event.preventDefault();
      const choice = Number(label.dataset.predict);
      store.setQuizAnswer(`${lesson.id}-0`, choice);
      card.innerHTML = `
        <div class="reward-kicker">Locked in</div>
        <p style="margin:0">Your guess is recorded. Read on — the answer is waiting in
        <strong>Check your understanding</strong> at the end of this lesson.</p>`;
      const award = awardEvent("quiz");
      if (award.xp) xpFloat(card, `+${award.xp} XP`);
      for (const quest of award.quests || []) questToast(quest);
      if (award.levelUp) levelUpBanner(award.levelUp);
    });
  }
}

export default async function renderLesson(container, lessonId) {
  const found = findLesson(lessonId);
  if (!found) {
    container.innerHTML = `<div class="card"><h1>Lesson not found</h1><p><a href="#/">Back to the dashboard</a></p></div>`;
    return;
  }
  const { lesson, module: mod } = found;
  const { prev, next, index, total } = lessonNeighbours(lesson.id);
  const markdown = await lessonMarkdown(mod.id, lesson.id);
  const exercises = (lesson.exercises || []).map((e) => withPackages(e, mod));

  container.innerHTML = `
    <div class="breadcrumb">
      <a href="#/">Dashboard</a> · Module ${mod.number} — ${escapeHtml(mod.title)} ·
      lesson ${index + 1} of ${total}
    </div>
    <div class="lesson-title">
      <span class="lesson-index">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h1>${escapeHtml(lesson.title)}</h1>
        ${lesson.goal ? `<p class="muted lesson-goal">${escapeHtml(lesson.goal)}</p>` : ""}
      </div>
    </div>
    ${
      mod.packages && mod.packages.length
        ? `<div class="msg info" id="pkg-status" hidden></div>`
        : ""
    }
    ${predictionCard(lesson)}
    <div class="prose" id="lesson-prose">${renderMarkdown(markdown)}</div>
    ${
      exercises.length
        ? `<h2>Practice</h2><div id="exercises">${exercises
            .map((exercise, i) => exerciseShell(exercise, i + 1))
            .join("")}</div>`
        : ""
    }
    ${quizBlock(lesson)}
    <div class="lesson-nav">
      ${
        prev
          ? `<a href="#/lesson/${prev.id}"><span>← previous</span>${escapeHtml(prev.title)}</a>`
          : `<a href="#/"><span>← back</span>Dashboard</a>`
      }
      ${
        next
          ? `<a class="next" href="#/lesson/${next.id}"><span>next →</span>${escapeHtml(next.title)}</a>`
          : `<a class="next" href="#/progress"><span>finished →</span>Your progress</a>`
      }
    </div>`;

  attachRunButtons(container.querySelector("#lesson-prose"), { packages: mod.packages || [] });

  for (const exercise of exercises) {
    const root = container.querySelector(`#ex-${CSS.escape(exercise.id)}`);
    if (root) mountExercise(root, exercise, lesson, mod);
  }

  wirePrediction(container, lesson);
  wireQuiz(container, lesson);
  store.markVisited(lesson.id);

  // the data module needs numpy/pandas: fetch them while the learner reads
  if (mod.packages && mod.packages.length) {
    const pkg = container.querySelector("#pkg-status");
    preloadPackages(mod.packages, (text) => {
      if (!pkg) return;
      pkg.hidden = !text;
      pkg.textContent = text;
    })
      .then(() => {
        if (pkg) pkg.hidden = true;
      })
      .catch(() => {
        if (pkg) {
          pkg.hidden = false;
          pkg.textContent = "The data packages could not be downloaded. Check your connection and reload.";
        }
      });
  }
}

export { clearDraft };
