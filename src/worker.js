/* =====================================================================
   Python Quest — Python worker
   Pyodide runs on a background thread so a slow loop never freezes the
   page. The main thread talks to it with small messages (see runtime.js)
   and simply terminates the worker if a run overstays its welcome.
   ===================================================================== */

import { PYODIDE_CDN, installRunner, runPython, newNamespace, snapshotNamespace } from "./runtime-core.js";

let pyodide = null;
let playground = null;              // persistent namespace for the playground
const loadedPackages = new Set();

function post(message) {
  self.postMessage(message);
}

async function boot(indexURL) {
  const url = `${indexURL}pyodide.mjs`;
  post({ type: "status", text: "Downloading Python…" });
  const { loadPyodide } = await import(/* webpackIgnore: true */ url);
  pyodide = await loadPyodide({
    indexURL,
    stdout: () => {},
    stderr: () => {},
  });
  installRunner(pyodide);
  playground = newNamespace(pyodide);
  const version = pyodide.runPython("import sys; '.'.join(map(str, sys.version_info[:3]))");
  post({ type: "ready", version, pyodide: pyodide.version });
}

async function ensurePackages(packages, id) {
  const missing = (packages || []).filter((p) => !loadedPackages.has(p));
  if (!missing.length) return;
  post({ type: "status", id, text: `Loading ${missing.join(" + ")} (first time only)…` });
  await pyodide.loadPackage(missing, {
    messageCallback: () => {},
    errorCallback: () => {},
  });
  missing.forEach((p) => loadedPackages.add(p));
  post({ type: "status", id, text: "" });
}

self.onmessage = async (event) => {
  const msg = event.data || {};
  try {
    if (msg.type === "init") {
      await boot(msg.indexURL || PYODIDE_CDN);
      return;
    }
    if (!pyodide) {
      post({ type: "result", id: msg.id, error: "Python is still starting." });
      return;
    }
    if (msg.type === "run") {
      await ensurePackages(msg.packages, msg.id);
      const usePlayground = msg.namespace === "playground";
      const result = await runPython(pyodide, {
        code: msg.code,
        setup: msg.setup || "",
        tests: msg.tests || "",
        stdin: msg.stdin || [],
        namespace: usePlayground ? playground : null,
        cwdKind: usePlayground ? "playground" : "fresh",
        resetCwd: usePlayground ? false : true,
      });
      if (usePlayground) result.variables = snapshotNamespace(pyodide, playground);
      post({ type: "result", id: msg.id, result });
      return;
    }
    if (msg.type === "reset-playground") {
      playground.destroy?.();
      playground = newNamespace(pyodide);
      pyodide.runPython(
        "import os, shutil\nshutil.rmtree('/tmp/pyquest-playground', ignore_errors=True)"
      );
      post({ type: "result", id: msg.id, result: { ok: true, stdout: "", stderr: "", variables: [] } });
      return;
    }
    if (msg.type === "preload") {
      await ensurePackages(msg.packages, msg.id);
      post({ type: "result", id: msg.id, result: { ok: true } });
    }
  } catch (err) {
    post({ type: "result", id: msg.id, error: String((err && err.message) || err) });
    if (msg.type === "init") post({ type: "boot-error", error: String((err && err.message) || err) });
  }
};
