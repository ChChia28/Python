/* =====================================================================
   Python Quest — runtime (main thread)
   Owns the Python worker: boots it, queues runs, enforces a time limit by
   terminating and re-creating the worker, and keeps the UI informed.
   ===================================================================== */

import { PYODIDE_CDN } from "./runtime-core.js";

const RUN_TIMEOUT_MS = 8000;
const PACKAGE_TIMEOUT_MS = 180000;   // numpy + pandas on a slow connection

let worker = null;
let ready = null;                    // Promise resolved when Pyodide is up
let seq = 0;
const pending = new Map();           // id -> { resolve, timer, label }
const listeners = new Set();
let info = { ready: false, version: "", pyodide: "", status: "Starting Python…", booting: true };

export function onStatus(fn) {
  listeners.add(fn);
  fn(info);
  return () => listeners.delete(fn);
}

function emit(patch) {
  info = { ...info, ...patch };
  listeners.forEach((fn) => fn(info));
}

function spawn() {
  worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  ready = new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      const msg = event.data || {};
      if (msg.type === "ready") {
        emit({ ready: true, booting: false, version: msg.version, pyodide: msg.pyodide, status: "" });
        resolve();
      } else if (msg.type === "status") {
        const entry = msg.id ? pending.get(msg.id) : null;
        if (entry) {
          entry.onStatus?.(msg.text);
          // a package download is in progress (or just finished): keep the
          // deadline generous while downloading, then back to the run budget
          if (msg.text) entry.arm(PACKAGE_TIMEOUT_MS);
          else entry.arm(RUN_TIMEOUT_MS);
        }
        emit({ status: msg.text || "" });
      } else if (msg.type === "boot-error") {
        emit({ booting: false, status: "" });
        reject(new Error(msg.error));
      } else if (msg.type === "result") {
        const entry = pending.get(msg.id);
        if (!entry) return;
        pending.delete(msg.id);
        clearTimeout(entry.timer);
        if (msg.error) entry.reject(new Error(msg.error));
        else entry.resolve(msg.result);
      }
    };
    worker.onerror = (event) => {
      emit({ booting: false, status: "" });
      reject(new Error(event.message || "The Python worker failed to start"));
    };
  });
  worker.postMessage({ type: "init", indexURL: pyodideIndexURL() });
}

/** The CDN by default; `?pyodide=/path/` serves a local copy (used by the tests). */
function pyodideIndexURL() {
  try {
    const override = new URLSearchParams(location.search).get("pyodide");
    if (override) return new URL(override.endsWith("/") ? override : `${override}/`, location.href).href;
  } catch {
    /* ignore */
  }
  return PYODIDE_CDN;
}

/** Start Pyodide. Resolves when Python can run code. */
export function initRuntime() {
  if (!worker) spawn();
  return ready;
}

/** Kill a runaway worker and start a fresh one; pending runs fail with a timeout result. */
function restart(reason) {
  const stale = [...pending.values()];
  pending.clear();
  try {
    worker.terminate();
  } catch {
    /* already dead */
  }
  worker = null;
  knownLoaded.clear();
  emit({ ready: false, booting: true, status: "Restarting Python…" });
  spawn();
  for (const entry of stale) {
    clearTimeout(entry.timer);
    entry.resolve({
      ok: false,
      timedOut: true,
      stdout: "",
      stderr: "",
      elapsed: entry.timeoutMs,
      error: { type: "Timeout", message: reason, line: null, text: "" },
      phase: "code",
      tests: "skipped",
      testError: null,
    });
  }
}

function send(message, { timeoutMs = RUN_TIMEOUT_MS, onStatus = null } = {}) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    const entry = { resolve, reject, timer: null, timeoutMs, onStatus };
    entry.arm = (ms) => {
      clearTimeout(entry.timer);
      entry.timeoutMs = ms;
      entry.timer = setTimeout(() => {
        if (!pending.has(id)) return;
        restart(`Stopped after ${Math.round(ms / 1000)} seconds.`);
      }, ms);
    };
    entry.arm(timeoutMs);
    pending.set(id, entry);
    worker.postMessage({ ...message, id });
  });
}

const knownLoaded = new Set();

/**
 * Run Python in a fresh namespace (default) or the playground namespace.
 * Resolves to a RunResult (see runtime-core.js), never rejects on Python
 * errors — only on transport failures.
 */
export async function run(options) {
  await initRuntime();
  const packages = options.packages || [];
  const needsDownload = packages.some((p) => !knownLoaded.has(p));
  const budget = needsDownload ? PACKAGE_TIMEOUT_MS : RUN_TIMEOUT_MS;
  const result = await send(
    {
      type: "run",
      code: options.code || "",
      setup: options.setup || "",
      tests: options.tests || "",
      stdin: options.stdin || [],
      packages,
      namespace: options.namespace || "fresh",
    },
    { timeoutMs: budget, onStatus: options.onStatus || null }
  );
  if (!result.timedOut) packages.forEach((p) => knownLoaded.add(p));
  return result;
}

export async function resetPlayground() {
  await initRuntime();
  return send({ type: "reset-playground" });
}

/** Download packages ahead of time (the data module calls this on open). */
export async function preloadPackages(packages, onStatus) {
  if (!packages || !packages.length) return;
  await initRuntime();
  const result = await send({ type: "preload", packages }, { timeoutMs: PACKAGE_TIMEOUT_MS, onStatus });
  packages.forEach((p) => knownLoaded.add(p));
  return result;
}

export function runtimeInfo() {
  return info;
}
