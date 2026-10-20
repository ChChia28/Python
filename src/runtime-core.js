/* =====================================================================
   Python Quest — runtime core
   Platform-neutral code shared by the browser worker and the Node test
   harness. Given a loaded Pyodide instance it knows how to run a snippet
   in a fresh namespace, capture stdout/stderr, feed input() and turn an
   exception into something a learner can read.
   ===================================================================== */

export const PYODIDE_VERSION = "314.0.7";
export const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

/** Everything the runner needs on the Python side, installed once. */
export const RUNNER_PY = String.raw`
import builtins, importlib, json, os, shutil, sys, traceback

_PYQUEST_DIRS = {"fresh": "/tmp/pyquest-run", "playground": "/tmp/pyquest-playground"}

def __pyquest_ns():
    return {"__name__": "__main__", "__builtins__": builtins}

def __pyquest_cwd(kind, reset):
    path = _PYQUEST_DIRS.get(kind, _PYQUEST_DIRS["fresh"])
    if reset and os.path.isdir(path):
        shutil.rmtree(path, ignore_errors=True)
    os.makedirs(path, exist_ok=True)
    os.chdir(path)
    # the working directory is importable, so learners can write helpers.py
    # and import it; previous runs' modules must not linger in the
    # import cache or a rewritten file would be ignored
    for d in _PYQUEST_DIRS.values():
        if d in sys.path:
            sys.path.remove(d)
    sys.path.insert(0, path)
    if reset:
        for name, mod in list(sys.modules.items()):
            f = getattr(mod, "__file__", None) or ""
            if isinstance(f, str) and f.startswith("/tmp/pyquest"):
                del sys.modules[name]
        importlib.invalidate_caches()

def __pyquest_error(e, filename):
    if isinstance(e, SyntaxError) and (e.filename == filename or e.filename is None):
        return {
            "type": type(e).__name__,
            "message": e.msg or str(e),
            "line": e.lineno,
            "text": (e.text or "").rstrip("\n"),
            "offset": e.offset,
        }
    tb = traceback.extract_tb(e.__traceback__)
    frames = [f for f in tb if f.filename == filename]
    last = frames[-1] if frames else None
    return {
        "type": type(e).__name__,
        "message": str(e),
        "line": last.lineno if last else None,
        "text": (last.line or "") if last else "",
        "trace": [[f.lineno, f.name] for f in frames],
    }

def __pyquest_run(code, ns, filename="main.py"):
    """Compile + exec code inside ns. Returns a JSON string."""
    try:
        compiled = compile(code, filename, "exec")
    except SyntaxError as e:
        return json.dumps({"ok": False, "error": __pyquest_error(e, filename)})
    try:
        exec(compiled, ns)
    except SystemExit:
        pass
    except BaseException as e:
        return json.dumps({"ok": False, "error": __pyquest_error(e, filename)})
    return json.dumps({"ok": True})

def __pyquest_snapshot(ns, limit=40):
    """Names the learner defined, for the playground's variable panel."""
    out = []
    for k, v in list(ns.items()):
        if k.startswith("__") or k in ("builtins",):
            continue
        if type(v).__name__ in ("module", "function", "type", "builtin_function_or_method"):
            kind = type(v).__name__
            if kind == "type": kind = "class"
            out.append([k, kind, ""])
            continue
        try:
            r = repr(v)
        except Exception:
            r = "<unrepresentable>"
        if len(r) > 60: r = r[:57] + "..."
        out.append([k, type(v).__name__, r])
        if len(out) >= limit: break
    return json.dumps(out)
`;

/** Install the runner helpers into a Pyodide instance (idempotent). */
export function installRunner(pyodide) {
  if (pyodide.__pyquestInstalled) return;
  pyodide.runPython(RUNNER_PY);
  pyodide.__pyquestInstalled = true;
}

/**
 * Run a piece of Python.
 *
 * @param pyodide     a loaded Pyodide instance with the runner installed
 * @param options
 *   code       {string}   the learner's (or an example's) code
 *   setup      {string}   optional code run first in the same namespace (creates files, fixtures…)
 *   tests      {string}   optional code run after `code` in the same namespace; should assert
 *   stdin      {string[]} lines input() will return, in order
 *   namespace  {object}   a persistent namespace proxy to reuse (playground); otherwise fresh
 *   cwdKind    {"fresh"|"playground"}
 *   resetCwd   {boolean}  wipe the working directory first (default true for fresh)
 *
 * @returns {Promise<RunResult>}
 *   { ok, stdout, stderr, elapsed, error, phase, testError, tests }
 *   - error     set when setup/code raised: {type, message, line, text, offset?, trace?}
 *   - phase     "setup" | "code" | "tests" — which part raised
 *   - tests     "pass" | "fail" | "skipped"; testError holds the failure
 */
export async function runPython(pyodide, options = {}) {
  const {
    code = "",
    setup = "",
    tests = "",
    stdin = [],
    namespace = null,
    cwdKind = "fresh",
    resetCwd = cwdKind === "fresh",
  } = options;

  installRunner(pyodide);

  const g = pyodide.globals;
  const ns = namespace || g.get("__pyquest_ns")();
  const ownNs = !namespace;

  // stdout / stderr capture — raw bytes so partial lines survive
  let stdout = "";
  let stderr = "";
  const dec = new TextDecoder();
  const errDec = new TextDecoder();
  pyodide.setStdout({
    write: (buf) => {
      stdout += dec.decode(buf, { stream: true });
      return buf.length;
    },
    isatty: false,
  });
  pyodide.setStderr({
    write: (buf) => {
      stderr += errDec.decode(buf, { stream: true });
      return buf.length;
    },
    isatty: false,
  });

  const lines = [...stdin];
  pyodide.setStdin({
    stdin: () => (lines.length ? `${lines.shift()}\n` : null),
    isatty: false,
    autoEOF: false,
  });

  const run = g.get("__pyquest_run");
  const result = {
    ok: true,
    stdout: "",
    stderr: "",
    elapsed: 0,
    error: null,
    phase: null,
    tests: tests ? "fail" : "skipped",
    testError: null,
  };

  const started = now();
  try {
    g.get("__pyquest_cwd")(cwdKind, resetCwd);

    if (setup) {
      const r = JSON.parse(run(setup, ns, "setup.py"));
      if (!r.ok) {
        result.ok = false;
        result.error = r.error;
        result.phase = "setup";
      }
    }

    if (result.ok) {
      const r = JSON.parse(run(code, ns, "main.py"));
      if (!r.ok) {
        result.ok = false;
        result.error = r.error;
        result.phase = "code";
      }
    }

    // the learner's output is what we report; anything the tests print is noise
    const userStdout = stdout;
    const userStderr = stderr;

    if (result.ok && tests) {
      const r = JSON.parse(run(tests, ns, "tests.py"));
      if (r.ok) result.tests = "pass";
      else {
        result.tests = "fail";
        result.testError = r.error;
        result.phase = "tests";
      }
    }
    result.stdout = userStdout + dec.decode();
    result.stderr = userStderr + errDec.decode();
  } finally {
    result.elapsed = now() - started;
    pyodide.setStdout();
    pyodide.setStderr();
    pyodide.setStdin();
    run.destroy?.();
    if (ownNs) ns.destroy?.();
  }
  return result;
}

/** Variables defined in a persistent namespace (playground panel). */
export function snapshotNamespace(pyodide, namespace) {
  installRunner(pyodide);
  const fn = pyodide.globals.get("__pyquest_snapshot");
  try {
    return JSON.parse(fn(namespace));
  } finally {
    fn.destroy?.();
  }
}

export function newNamespace(pyodide) {
  installRunner(pyodide);
  const fn = pyodide.globals.get("__pyquest_ns");
  try {
    return fn();
  } finally {
    fn.destroy?.();
  }
}

function now() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}
