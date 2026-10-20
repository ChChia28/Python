#!/usr/bin/env node
/* =====================================================================
   Python Quest — curriculum verifier

   Boots a real Pyodide (the same build the site loads from the CDN) and
   proves every exercise is sound:

     • the reference solution runs cleanly and passes its own checks
     • the starter code does NOT already pass (the checks mean something)
     • every `requires` pattern is satisfied by the solution
     • expectOutput exercises produce non-empty output
     • every runnable ```python example in the lesson prose runs without
       error, and every ```python-error example fails on purpose
     • ids are unique, quizzes point at a real option, etc.

   Usage:
     node tests/run-exercises.mjs                 # every module
     node tests/run-exercises.mjs 03-collections  # one module (prefix match)
     PYODIDE_DIST=/path/to/pyodide node tests/run-exercises.mjs

   PYODIDE_DIST must point at an unpacked Pyodide distribution directory
   (the one containing pyodide.mjs). Default: ./.pyodide
   ===================================================================== */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";
import { runPython, installRunner } from "../src/runtime-core.js";
import { gradeWith, checkRequires, normalizeOutput } from "../src/grade-core.js";
import { splitLessonContent, extractCodeFences } from "../src/content.js";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const DIST = resolve(process.env.PYODIDE_DIST || join(ROOT, ".pyodide"));
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 8000);
const filterArgs = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const verbose = process.argv.includes("-v") || process.argv.includes("--verbose");

if (!existsSync(join(DIST, "pyodide.mjs"))) {
  console.error(`No Pyodide distribution at ${DIST} (set PYODIDE_DIST).`);
  process.exit(2);
}

const { loadPyodide } = await import(pathToFileURL(join(DIST, "pyodide.mjs")).href);
const pyodide = await loadPyodide({ indexURL: DIST + "/" });
installRunner(pyodide);

// KeyboardInterrupt after TIMEOUT_MS so an infinite loop can't hang the suite.
// runPython blocks this thread, so the watchdog lives in a worker thread and
// flips the shared interrupt flag from there.
const interrupt = new Uint8Array(new SharedArrayBuffer(1));
pyodide.setInterruptBuffer(interrupt);
const watchdog = new Worker(
  `const { parentPort, workerData } = require("node:worker_threads");
   const flag = new Uint8Array(workerData);
   let timer = null;
   parentPort.on("message", (m) => {
     if (timer) clearTimeout(timer);
     timer = m.ms ? setTimeout(() => Atomics.store(flag, 0, 2), m.ms) : null;
   });`,
  { eval: true, workerData: interrupt.buffer }
);
watchdog.unref();

const loaded = new Set();
async function ensurePackages(packages) {
  const missing = (packages || []).filter((p) => !loaded.has(p));
  if (!missing.length) return;
  await pyodide.loadPackage(missing, { messageCallback: () => {} });
  missing.forEach((p) => loaded.add(p));
}

async function runner({ code, setup = "", tests = "", stdin = [], packages = [] }) {
  await ensurePackages(packages);
  Atomics.store(interrupt, 0, 0);
  watchdog.postMessage({ ms: TIMEOUT_MS });
  try {
    const result = await runPython(pyodide, { code, setup, tests, stdin });
    if (result.error && result.error.type === "KeyboardInterrupt") result.timedOut = true;
    if (result.testError && result.testError.type === "KeyboardInterrupt") result.timedOut = true;
    return result;
  } finally {
    watchdog.postMessage({ ms: 0 });
    Atomics.store(interrupt, 0, 0);
  }
}

/* ------------------------------------------------------------ discovery */

const curriculumDir = join(ROOT, "src", "curriculum");
let files = readdirSync(curriculumDir)
  .filter((f) => /^\d\d-.*\.js$/.test(f))
  .sort();
if (filterArgs.length) {
  files = files.filter((f) => filterArgs.some((a) => f.startsWith(basename(a).replace(/\.js$/, ""))));
}
if (!files.length) {
  console.error("No curriculum modules matched.");
  process.exit(2);
}

/* -------------------------------------------------------------- checks */

let failures = 0;
let checks = 0;
const seenIds = new Set();

function fail(where, message) {
  failures += 1;
  console.log(`  ✗ ${where}\n      ${message.split("\n").join("\n      ")}`);
}
function ok(where) {
  checks += 1;
  if (verbose) console.log(`  ✓ ${where}`);
}
function unique(id, where) {
  if (seenIds.has(id)) fail(where, `duplicate id "${id}"`);
  seenIds.add(id);
}

function describeRun(run) {
  if (run.timedOut) return "timed out";
  if (run.error) return `${run.phase}: ${run.error.type}: ${run.error.message} (line ${run.error.line})`;
  if (run.testError) return `tests: ${run.testError.type}: ${run.testError.message} (line ${run.testError.line})`;
  return "ok";
}

for (const file of files) {
  const mod = (await import(pathToFileURL(join(curriculumDir, file)).href)).default;
  console.log(`\n▶ Module ${mod.number} — ${mod.title}  (${file})`);
  const where = (s) => `${mod.id} › ${s}`;

  for (const key of ["id", "number", "title", "level", "summary", "lessons"]) {
    if (mod[key] === undefined) fail(where("module"), `missing field "${key}"`);
  }
  unique(mod.id, where("module"));
  if (mod.packages) await ensurePackages(mod.packages);

  const prosePath = join(ROOT, "content", `${mod.id}.md`);
  let prose = new Map();
  if (!existsSync(prosePath)) fail(where("prose"), `content/${mod.id}.md is missing`);
  else prose = splitLessonContent(readFileSync(prosePath, "utf8"));

  for (const lesson of mod.lessons || []) {
    const lw = (s) => where(`${lesson.id} › ${s}`);
    unique(lesson.id, lw("lesson"));
    if (!lesson.title) fail(lw("lesson"), "missing title");
    if (!lesson.goal) fail(lw("lesson"), "missing goal");
    if (!lesson.exercises || !lesson.exercises.length) fail(lw("lesson"), "no exercises");
    if (!lesson.quiz || !lesson.quiz.length) fail(lw("lesson"), "no quiz");

    // prose + runnable examples
    const md = prose.get(lesson.id);
    if (!md) fail(lw("prose"), `no "::: lesson ${lesson.id}" section in content/${mod.id}.md`);
    else {
      const words = md.split(/\s+/).length;
      if (words < 150) fail(lw("prose"), `prose is very short (${words} words)`);
      let n = 0;
      for (const fence of extractCodeFences(md)) {
        n += 1;
        if (fence.lang === "python" || fence.lang === "python-error") {
          const run = await runner({ code: fence.code, packages: mod.packages || [] });
          const shouldFail = fence.lang === "python-error";
          if (shouldFail && run.ok) fail(lw(`example #${n} (python-error)`), "was expected to raise but ran fine");
          else if (!shouldFail && !run.ok) fail(lw(`example #${n}`), `${describeRun(run)}\n${fence.code}`);
          else if (!shouldFail && run.elapsed > 4000) fail(lw(`example #${n}`), `slow: ${Math.round(run.elapsed)} ms`);
          else ok(lw(`example #${n}`));
        } else if (!["python-static", "text", "", "bash", "python-repl"].includes(fence.lang)) {
          fail(lw(`example #${n}`), `unknown fence language "${fence.lang}"`);
        }
      }
    }

    // quiz
    for (const [qi, q] of (lesson.quiz || []).entries()) {
      if (!q.q || !Array.isArray(q.options) || q.options.length < 2) fail(lw(`quiz ${qi + 1}`), "needs a question and ≥2 options");
      else if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)) fail(lw(`quiz ${qi + 1}`), `answer index ${q.answer} out of range`);
      else if (!q.explain) fail(lw(`quiz ${qi + 1}`), "missing explanation");
      else ok(lw(`quiz ${qi + 1}`));
    }

    // exercises
    for (const ex of lesson.exercises || []) {
      const ew = (s) => lw(`${ex.id} › ${s}`);
      unique(ex.id, ew("exercise"));
      if (!ex.prompt) fail(ew("exercise"), "missing prompt");
      if (typeof ex.starter !== "string") fail(ew("exercise"), "starter must be a string (may be empty)");
      if (!ex.solution) { fail(ew("exercise"), "missing solution"); continue; }
      if (!ex.hints || !ex.hints.length) fail(ew("exercise"), "needs at least one hint");
      if (!ex.expectOutput && !ex.tests) fail(ew("exercise"), "needs expectOutput: true and/or tests");

      const packages = [...(mod.packages || []), ...(ex.packages || [])];
      const exercise = { ...ex, packages };
      const cache = new Map();

      // 1. the solution must pass
      const solved = await gradeWith(runner, exercise, ex.solution, cache);
      if (solved.status !== "pass") {
        fail(ew("solution"), `${solved.title}\n${stripHtml(solved.detail)}${solved.run ? `\n(${describeRun(solved.run)})` : ""}`);
        continue;
      }
      if (solved.run && solved.run.elapsed > 4000) fail(ew("solution"), `slow: ${Math.round(solved.run.elapsed)} ms`);
      if (ex.expectOutput && !normalizeOutput(solved.run.stdout).length) fail(ew("solution"), "expectOutput is set but the solution prints nothing");
      ok(ew("solution passes"));

      // 2. requires patterns must be satisfied by the solution
      const rule = checkRequires(exercise, ex.solution);
      if (rule) fail(ew("requires"), `the solution itself fails the rule: ${rule.title}`);

      // 3. the starter must not already pass
      if (ex.starter.trim()) {
        const starter = await gradeWith(runner, exercise, ex.starter, cache);
        if (starter.status === "pass") fail(ew("starter"), "the starter code already passes — the checks are too weak");
        else ok(ew("starter does not pass"));
      }

      // 4. a wrong-but-plausible answer must not pass (when provided)
      for (const [i, wrong] of (ex.wrong || []).entries()) {
        const verdict = await gradeWith(runner, exercise, wrong, cache);
        if (verdict.status === "pass") fail(ew(`wrong #${i + 1}`), "a deliberately wrong answer passes");
        else ok(ew(`wrong #${i + 1} rejected`));
      }
    }
  }
}

function stripHtml(html) {
  return String(html || "").replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
}

console.log(`\n${checks} checks passed, ${failures} failed.`);
process.exit(failures ? 1 : 0);
