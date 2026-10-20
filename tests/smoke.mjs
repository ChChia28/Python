#!/usr/bin/env node
/* =====================================================================
   Python Quest — headless browser smoke test

   Serves the repo, opens it in Chromium with a local Pyodide, and walks
   the main flows: boot, dashboard, a lesson (run an example, solve an
   exercise, earn XP), the playground (persistent namespace, variables
   panel), an infinite loop (timeout + restart), the recall deck, the
   progress backup, the cheat sheet, and mobile layout. Screenshots land
   in tests/screenshots/.

   Usage: PYODIDE_DIST=... PLAYWRIGHT_MODULE=... node tests/smoke.mjs
   ===================================================================== */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, symlinkSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const DIST = resolve(process.env.PYODIDE_DIST || join(ROOT, ".pyodide"));
const PW = process.env.PLAYWRIGHT_MODULE || "playwright";
const PORT = Number(process.env.PORT || 8765);
const SHOTS = join(ROOT, "tests", "screenshots");
mkdirSync(SHOTS, { recursive: true });

const { chromium } = await import(PW);

// expose the local Pyodide dist inside the served tree
const link = join(ROOT, ".pyodide");
if (!existsSync(link)) symlinkSync(DIST, link);

const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], {
  cwd: ROOT,
  stdio: "ignore",
});
await new Promise((r) => setTimeout(r, 800));

const base = `http://127.0.0.1:${PORT}/`;
const url = (hash = "") => `${base}?pyodide=/.pyodide/${hash}`;

let failures = 0;
const check = (cond, label) => {
  console.log(`  ${cond ? "✓" : "✗"} ${label}`);
  if (!cond) failures += 1;
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

try {
  console.log("\n▶ boot + dashboard");
  await page.goto(url(), { waitUntil: "load" });
  await page.waitForSelector("#runtime-status.ready", { timeout: 120000 });
  check(true, "Python runtime reported ready");
  check((await page.locator(".mod-card").count()) >= 6, "dashboard lists modules");
  check((await page.locator(".map-node").count()) >= 6, "course map has nodes");
  const heroText = await page.locator(".hero p").first().textContent();
  check(/\d+ lessons and \d+ graded exercises/.test(heroText), `hero copy: ${heroText.trim().slice(0, 60)}…`);
  await page.screenshot({ path: join(SHOTS, "01-dashboard.png"), fullPage: true });

  console.log("\n▶ lesson");
  await page.locator(".mod-card").first().click();
  await page.waitForSelector("#lesson-prose");
  const title = await page.locator("h1").first().textContent();
  check(Boolean(title.trim()), `opened lesson: ${title.trim()}`);
  check((await page.locator("#predict-card").count()) === 1, "prediction card shown");
  await page.locator("#predict-card .quiz-opt").first().click();
  await page.waitForTimeout(300);
  check((await page.locator("#predict-card").textContent()).includes("Locked in"), "prediction locked in");

  const runButtons = page.locator("#lesson-prose .run-py");
  check((await runButtons.count()) > 0, "lesson has runnable examples");
  await runButtons.first().click();
  await page.waitForSelector("#lesson-prose .code-out .output", { timeout: 30000 });
  const exampleOut = await page.locator("#lesson-prose .code-out .output pre").first().textContent();
  check(exampleOut.trim().length > 0, `example ran, printed: ${exampleOut.trim().split("\n")[0]}`);

  // solve exercise 1 with its own reference solution, fetched from the module
  const firstExercise = await page.evaluate(async () => {
    const { MODULES } = await import("/src/curriculum/index.js");
    const ex = MODULES[0].lessons[0].exercises[0];
    return { id: ex.id, solution: ex.solution, starter: ex.starter };
  });
  const editor = page.locator(`#ex-${firstExercise.id} .editor-input`);
  await editor.fill(firstExercise.solution);
  await page.locator(`#ex-${firstExercise.id} .editor-bar button`, { hasText: "Check answer" }).click();
  await page.waitForSelector(`#ex-${firstExercise.id} .msg.ok`, { timeout: 30000 });
  check(true, "exercise 1 graded as correct");
  await page.waitForTimeout(500);
  const xp = await page.locator("#hud-xp").textContent();
  check(/^[1-9]\d* XP/.test(xp), `XP awarded: ${xp}`);
  check((await page.locator(`#ex-${firstExercise.id} .pill.ok`).count()) === 1, "status pill shows solved");

  // a wrong answer gives a fail/err verdict, not a pass
  const second = await page.evaluate(async () => {
    const { MODULES } = await import("/src/curriculum/index.js");
    const ex = MODULES[0].lessons[0].exercises[1];
    return { id: ex.id, wrong: (ex.wrong && ex.wrong[0]) || "print(12345)" };
  });
  await page.locator(`#ex-${second.id} .editor-input`).fill(second.wrong);
  await page.locator(`#ex-${second.id} .editor-bar button`, { hasText: "Check answer" }).click();
  await page.waitForSelector(`#ex-${second.id} .msg.warn, #ex-${second.id} .msg.err`, { timeout: 30000 });
  check(true, "wrong answer rejected with feedback");
  await page.locator(`#ex-${second.id} .editor-bar button`, { hasText: "Hint" }).click();
  check((await page.locator(`#ex-${second.id} .hint-item`).count()) === 1, "hint revealed");
  await page.screenshot({ path: join(SHOTS, "02-lesson.png"), fullPage: true });

  // quiz
  const quizOpt = page.locator(".quiz-q .quiz-opt").first();
  await quizOpt.click();
  await page.waitForTimeout(200);
  check((await page.locator(".quiz-q .quiz-explain:not([hidden])").count()) >= 1, "quiz explanation shown");

  // syntax error feedback
  await page.locator(`#ex-${second.id} .editor-input`).fill("print('oops'\n");
  await page.locator(`#ex-${second.id} .editor-bar button`, { hasText: "Run" }).first().click();
  await page.waitForSelector(`#ex-${second.id} .output .msg.err`, { timeout: 30000 });
  const errText = await page.locator(`#ex-${second.id} .output .msg.err`).textContent();
  check(/SyntaxError/.test(errText), `syntax error surfaced: ${errText.trim().slice(0, 50)}`);

  console.log("\n▶ playground");
  await page.goto(url("#/playground"));
  await page.waitForSelector("#pg-editor .editor-input");
  await page.locator("#pg-editor .editor-input").fill("x = 21\nprint(x * 2)");
  await page.locator("#pg-editor .editor-bar button", { hasText: "Run" }).first().click();
  await page.waitForSelector("#pg-output .output", { timeout: 30000 });
  check((await page.locator("#pg-output pre").textContent()).includes("42"), "playground printed 42");
  check((await page.locator("#pg-vars").textContent()).includes("x"), "variables panel shows x");
  await page.locator("#pg-editor .editor-input").fill("print(x + 1)");
  await page.locator("#pg-editor .editor-bar button", { hasText: "Run" }).first().click();
  await page.waitForFunction(() => document.querySelector("#pg-output pre")?.textContent.includes("22"), null, { timeout: 30000 });
  check(true, "namespace persisted between runs (x + 1 = 22)");

  console.log("\n▶ infinite loop → timeout → restart");
  await page.locator("#pg-editor .editor-input").fill("while True:\n    pass");
  await page.locator("#pg-editor .editor-bar button", { hasText: "Run" }).first().click();
  await page.waitForSelector("#pg-output .msg.err", { timeout: 30000 });
  const loopText = await page.locator("#pg-output .msg.err").textContent();
  check(/Timeout|Stopped after/.test(loopText), `runaway loop stopped: ${loopText.trim().slice(0, 60)}`);
  await page.waitForSelector("#runtime-status.ready", { timeout: 120000 });
  await page.locator("#pg-editor .editor-input").fill("print('alive')");
  await page.locator("#pg-editor .editor-bar button", { hasText: "Run" }).first().click();
  await page.waitForFunction(() => document.querySelector("#pg-output pre")?.textContent.includes("alive"), null, { timeout: 60000 });
  check(true, "runtime restarted and runs again");

  console.log("\n▶ other pages");
  await page.goto(url("#/review"));
  await page.waitForSelector("#deck .card, #deck .recall-card");
  check(true, "recall deck renders");
  await page.goto(url("#/reference"));
  await page.waitForSelector("#ref-body .code-block");
  check((await page.locator("#ref-body .run-py").count()) > 5, "cheat sheet has runnable examples");
  await page.goto(url("#/progress"));
  await page.waitForSelector("#copy-btn");
  await page.locator("#show-btn").click();
  const backup = await page.locator("#backup-box").inputValue();
  check(backup.includes('"app": "python-quest"'), "backup code produced");
  check(backup.includes(firstExercise.id), "backup includes the solved exercise");
  await page.goto(url("#/science"));
  await page.waitForSelector("#daily-goal");
  check(true, "why-it-works renders");

  console.log("\n▶ search palette");
  await page.goto(url());
  await page.waitForSelector(".mod-card");
  await page.keyboard.press("/");
  await page.waitForSelector("#palette-backdrop:not([hidden])");
  await page.locator("#palette-input").fill("dictionary");
  await page.waitForTimeout(400);
  check((await page.locator("#palette-results li[data-id]").count()) > 0, "search finds lessons about dictionaries");
  await page.keyboard.press("Escape");

  console.log("\n▶ mobile layout");
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobile.goto(url());
  await mobile.waitForSelector(".mod-card");
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(overflow <= 1, `no horizontal scroll on phone (overflow ${overflow}px)`);
  check(await mobile.locator(".tabbar").isVisible(), "bottom tab bar visible on phone");
  await mobile.screenshot({ path: join(SHOTS, "03-mobile-dashboard.png"), fullPage: true });
  await mobile.locator(".tabbar a[data-nav='learn']").click();
  await mobile.waitForTimeout(400);
  check(await mobile.locator("#sidebar.open").isVisible(), "curriculum drawer opens from tab bar");
  await mobile.locator("#sidebar .mod-lessons a").first().click();
  await mobile.waitForSelector("#lesson-prose");
  await mobile.screenshot({ path: join(SHOTS, "04-mobile-lesson.png"), fullPage: true });
  const lessonOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(lessonOverflow <= 1, `lesson has no horizontal scroll on phone (overflow ${lessonOverflow}px)`);
  await mobile.close();

  console.log("\n▶ dark theme");
  await page.goto(url());
  await page.waitForSelector(".mod-card");
  await page.locator("#theme-btn").click();
  check((await page.evaluate(() => document.documentElement.dataset.theme)) === "dark", "theme toggles to dark");
  await page.screenshot({ path: join(SHOTS, "05-dark.png"), fullPage: false });
  await page.locator("#theme-btn").click();
} catch (err) {
  failures += 1;
  console.log(`  ✗ ${err.message}`);
  await page.screenshot({ path: join(SHOTS, "99-failure.png"), fullPage: true }).catch(() => {});
} finally {
  const realErrors = consoleErrors.filter((e) => !/favicon|net::ERR_|fonts.googleapis|Failed to load resource/.test(e));
  check(realErrors.length === 0, realErrors.length ? `console errors:\n      ${realErrors.join("\n      ")}` : "no console errors");
  await browser.close();
  server.kill();
  rmSync(link, { force: true });
  console.log(`\n${failures ? `${failures} problem(s)` : "all smoke checks passed"}.`);
  process.exit(failures ? 1 : 0);
}
